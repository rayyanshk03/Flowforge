"""
Candidate Port Discovery & Multi-Factor Scoring Engine.

Uses PostGIS geography points & ST_DWithin (or spatial Haversine fallback)
to query candidate ports, then scores them across 5 dimensions:
1. Distance
2. Congestion
3. Geo-Port Risk
4. Capacity
5. Connectivity
"""
import math
import logging
from typing import Dict, Any, List, Optional
from sqlalchemy import text
from app.services.port_registry import port_registry

logger = logging.getLogger("flowforge.routing.candidate_discovery")

NAUTICAL_MILE_METERS = 1852.0

DEFAULT_SCORING_WEIGHTS = {
    "distance": 0.25,
    "congestion": 0.20,
    "geo_risk": 0.20,
    "capacity": 0.15,
    "connectivity": 0.20
}

def haversine_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes great-circle distance in meters using Haversine formula."""
    R_m = 6371000.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R_m * c

class CandidatePortDiscoveryService:
    """
    Discovers and multi-factor scores candidate origin, transshipment, and destination ports.
    """

    def discover_candidate_ports(
        self,
        lat: float,
        lon: float,
        radius_meters: float = 800000.0,
        weights: Optional[Dict[str, float]] = None,
        db_session = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Queries candidate ports within radius_meters of lat/lon and scores them.
        Lower score = higher rank / better candidate.
        """
        w = {**DEFAULT_SCORING_WEIGHTS, **(weights or {})}

        raw_ports = []
        # Attempt PostGIS spatial query first if database session available
        if db_session is not None:
            try:
                query = text("""
                    SELECT p.port_id, p.name, p.country, p.unlocode, p.port_type,
                           p.latitude, p.longitude, p.capacity, p.current_congestion, p.geo_port_risk,
                           ST_Distance(
                               geom,
                               ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
                           ) AS distance_meters
                    FROM ports p
                    WHERE ST_DWithin(
                        geom,
                        ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
                        :radius_meters
                    )
                    ORDER BY distance_meters ASC
                    LIMIT 20;
                """)
                res = db_session.execute(query, {"lat": lat, "lon": lon, "radius_meters": radius_meters})
                for row in res:
                    raw_ports.append({
                        "port_id": row.port_id,
                        "name": row.name,
                        "country": row.country,
                        "unlocode": row.unlocode,
                        "port_type": row.port_type,
                        "latitude": row.latitude,
                        "longitude": row.longitude,
                        "capacity": float(row.capacity or 500000),
                        "current_congestion": float(row.current_congestion or 0.25),
                        "geo_port_risk": float(row.geo_port_risk or 0.15),
                        "distance_meters": float(row.distance_meters),
                        "spatial_source": "POSTGIS_ST_DWITHIN"
                    })
            except Exception as e:
                logger.debug(f"PostGIS ST_DWithin query fallback: {e}")

        # Fallback to in-memory port registry if DB returned no results
        if not raw_ports:
            all_ports = port_registry.list_all_ports()
            port_items = all_ports.values() if isinstance(all_ports, dict) else all_ports
            for p in port_items:
                dist_m = haversine_meters(lat, lon, p["latitude"], p["longitude"])
                if dist_m <= radius_meters:
                    raw_ports.append({
                        "port_id": p.get("unlocode", "PORT"),
                        "name": p["name"],
                        "country": p["country"],
                        "unlocode": p["unlocode"],
                        "port_type": "CONTAINER_PORT",
                        "latitude": p["latitude"],
                        "longitude": p["longitude"],
                        "capacity": float(p.get("capacity", 500000)),
                        "current_congestion": float(p.get("congestion_index", 0.35)),
                        "geo_port_risk": float(p.get("geo_port_risk", 0.20)),
                        "distance_meters": dist_m,
                        "spatial_source": "HAVERSINE_SPATIAL"
                    })

        if not raw_ports:
            return []

        # Find min/max values for min-max normalization
        max_dist = max(p["distance_meters"] for p in raw_ports) or 1.0
        max_cap = max(p["capacity"] for p in raw_ports) or 1.0

        scored_ports = []
        for p in raw_ports:
            # Distance Score [0, 1]: 0 = closest, 1 = farthest
            dist_score = p["distance_meters"] / max_dist

            # Congestion Score [0, 1]: 0 = free, 1 = congested
            congestion_score = max(0.0, min(1.0, p["current_congestion"]))

            # Geo Risk Score [0, 1]: 0 = safe, 1 = severe
            geo_risk_score = max(0.0, min(1.0, p["geo_port_risk"]))

            # Capacity Score [0, 1]: 0 = highest capacity, 1 = low capacity (inverted)
            capacity_score = 1.0 - (p["capacity"] / max_cap)

            # Connectivity Score [0, 1]: estimated berth count connectivity
            berths = float(p.get("berths", 12))
            connectivity_score = 1.0 - max(0.0, min(1.0, berths / 60.0))

            composite_candidate_score = (
                w["distance"] * dist_score
              + w["congestion"] * congestion_score
              + w["geo_risk"] * geo_risk_score
              + w["capacity"] * capacity_score
              + w["connectivity"] * connectivity_score
            )

            scored_ports.append({
                **p,
                "distance_nm": round(p["distance_meters"] / NAUTICAL_MILE_METERS, 1),
                "distance_score": round(dist_score, 4),
                "congestion_score": round(congestion_score, 4),
                "geo_risk_score": round(geo_risk_score, 4),
                "capacity_score": round(capacity_score, 4),
                "connectivity_score": round(connectivity_score, 4),
                "candidate_score": round(composite_candidate_score, 4)
            })

        # Sort by candidate_score ascending (lower is better)
        scored_ports.sort(key=lambda x: x["candidate_score"])
        return scored_ports[:limit]

candidate_discovery_service = CandidatePortDiscoveryService()
