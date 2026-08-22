"""
PostGIS Service — Spatial Candidate Port Extender for FlowForge.

Enables PostgreSQL + PostGIS spatial queries (ST_DWithin, ST_DistanceSphere, ST_MakePoint)
to dynamically retrieve candidate diversion and transshipment ports within a specified radius
or maritime corridor.
"""
import math
import logging
from typing import Dict, Any, List, Optional
from sqlalchemy import text
from app.services.port_registry import port_registry

logger = logging.getLogger("flowforge.services.postgis")

NAUTICAL_MILE_METERS = 1852.0  # 1 NM = 1,852 meters

def haversine_distance_nm(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes great-circle distance in nautical miles using Haversine formula."""
    R_km = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    distance_km = R_km * c
    return distance_km / 1.852

class PostGISPortService:
    """
    PostGIS-enabled spatial candidate port retrieval service.
    Queries PostgreSQL PostGIS spatial indices when available, with fast Haversine fallback.
    """

    def __init__(self):
        self.postgis_enabled = False

    def init_postgis_extension(self, engine) -> bool:
        """Attempts to initialize PostGIS extension in PostgreSQL."""
        try:
            with engine.connect() as conn:
                conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
                conn.commit()
                logger.info("PostGIS extension initialized successfully in PostgreSQL.")
                self.postgis_enabled = True
                return True
        except Exception as e:
            logger.info(f"PostGIS extension unavailable ({e}). Using Haversine spatial engine.")
            self.postgis_enabled = False
            return False

    def find_candidate_ports_near_coords(
        self,
        lat: float,
        lon: float,
        radius_nm: float = 300.0,
        db_session = None,
        max_results: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Finds candidate diversion ports within `radius_nm` of given coordinates (lat, lon).
        Tries PostgreSQL PostGIS ST_DWithin query first, falling back to Haversine spatial search.
        """
        candidate_ports: List[Dict[str, Any]] = []

        if self.postgis_enabled and db_session is not None:
            try:
                radius_meters = radius_nm * NAUTICAL_MILE_METERS
                query = text("""
                    SELECT p.unlocode, p.name, p.country, p.latitude, p.longitude, p.congestion_index,
                           ST_DistanceSphere(p.geom, ST_MakePoint(:lon, :lat)) / 1852.0 AS distance_nm
                    FROM spatial_ports p
                    WHERE ST_DWithin(p.geom::geography, ST_MakePoint(:lon, :lat)::geography, :radius_meters)
                    ORDER BY distance_nm ASC
                    LIMIT :max_results;
                """)
                res = db_session.execute(query, {
                    "lat": lat,
                    "lon": lon,
                    "radius_meters": radius_meters,
                    "max_results": max_results
                })
                for row in res:
                    candidate_ports.append({
                        "unlocode": row.unlocode,
                        "name": row.name,
                        "country": row.country,
                        "latitude": row.latitude,
                        "longitude": row.longitude,
                        "congestion_index": row.congestion_index,
                        "distance_nm": round(float(row.distance_nm), 1),
                        "spatial_source": "POSTGIS_ST_DWITHIN"
                    })
                if candidate_ports:
                    return candidate_ports
            except Exception as e:
                logger.debug(f"PostGIS ST_DWithin query fallback: {e}")

        # Haversine spatial fallback search across global port registry
        all_ports = port_registry.list_all_ports()
        port_items = all_ports.values() if isinstance(all_ports, dict) else all_ports
        for p in port_items:
            dist_nm = haversine_distance_nm(lat, lon, p["latitude"], p["longitude"])
            if 0.1 <= dist_nm <= radius_nm:
                candidate_ports.append({
                    "unlocode": p["unlocode"],
                    "name": p["name"],
                    "country": p["country"],
                    "latitude": p["latitude"],
                    "longitude": p["longitude"],
                    "congestion_index": p.get("congestion_index", 0.5),
                    "distance_nm": round(dist_nm, 1),
                    "spatial_source": "HAVERSINE_SPATIAL"
                })

        candidate_ports.sort(key=lambda x: (x["congestion_index"], x["distance_nm"]))
        return candidate_ports[:max_results]

    def get_corridor_candidate_ports(
        self,
        origin_unlocode: str,
        dest_unlocode: str,
        max_detour_nm: float = 250.0,
        db_session = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieves candidate transshipment/diversion ports along a maritime corridor
        between origin and destination.
        """
        orig = port_registry.get_port(origin_unlocode)
        dest = port_registry.get_port(dest_unlocode)

        if not orig or not dest:
            return []

        direct_dist = haversine_distance_nm(orig["latitude"], orig["longitude"], dest["latitude"], dest["longitude"])
        candidates = self.find_candidate_ports_near_coords(dest["latitude"], dest["longitude"], radius_nm=max_detour_nm * 2, db_session=db_session)

        # Filter candidates that are feasible alternative ports
        valid_candidates = []
        for c in candidates:
            if c["unlocode"] in (orig["unlocode"], dest["unlocode"]):
                continue
            leg1 = haversine_distance_nm(orig["latitude"], orig["longitude"], c["latitude"], c["longitude"])
            leg2 = haversine_distance_nm(c["latitude"], c["longitude"], dest["latitude"], dest["longitude"])
            total_route = leg1 + leg2
            detour = total_route - direct_dist

            if detour <= max_detour_nm:
                valid_candidates.append({
                    **c,
                    "direct_corridor_nm": round(direct_dist, 1),
                    "detour_nm": round(detour, 1),
                    "extra_transit_hours": round(detour / 14.2, 1),
                    "recommendation": f"DIVERT VIA {c['name'].upper()} ({c['unlocode']}) — {round(detour, 1)} NM Detour"
                })

        valid_candidates.sort(key=lambda x: x["detour_nm"])
        return valid_candidates

postgis_port_service = PostGISPortService()
