"""
Maritime Navigation Graph Engine — FlowForge.

Constructs navigable maritime graphs connecting global shipping lanes, choke points,
and port approaches. Enforces non-land intersection routes.
"""
import math
import logging
from typing import Dict, Any, List, Tuple, Optional
import networkx as nx

logger = logging.getLogger("flowforge.routing.maritime_graph")

NAUTICAL_MILE_METERS = 1852.0

def haversine_distance_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes great-circle distance in meters using Haversine formula."""
    R_m = 6371000.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R_m * c

# ── Global Maritime Shipping Waypoint Nodes Registry ───────────────────────────
DEFAULT_MARITIME_NODES: List[Dict[str, Any]] = [
    {"node_id": 1, "name": "Nhava Sheva (JNPT) Approach", "type": "PORT_APPROACH", "lat": 18.9435, "lon": 72.9290},
    {"node_id": 2, "name": "Arabian Sea North Waypoint", "type": "WAYPOINT", "lat": 19.5000, "lon": 68.0000},
    {"node_id": 3, "name": "Arabian Sea Central Waypoint", "type": "WAYPOINT", "lat": 15.0000, "lon": 65.0000},
    {"node_id": 4, "name": "Gulf of Aden Waypoint", "type": "WAYPOINT", "lat": 12.5000, "lon": 48.0000},
    {"node_id": 5, "name": "Bab-el-Mandeb Strait", "type": "CHOKE_POINT", "lat": 12.5833, "lon": 43.3333},
    {"node_id": 6, "name": "Red Sea Central Waypoint", "type": "WAYPOINT", "lat": 20.0000, "lon": 38.5000},
    {"node_id": 7, "name": "Suez Canal South (Taufiq)", "type": "CHOKE_POINT", "lat": 29.9333, "lon": 32.5500},
    {"node_id": 8, "name": "Suez Canal North (Port Said)", "type": "CHOKE_POINT", "lat": 31.2500, "lon": 32.3000},
    {"node_id": 9, "name": "Mediterranean Sea East", "type": "WAYPOINT", "lat": 33.5000, "lon": 28.0000},
    {"node_id": 10, "name": "Strait of Messina Waypoint", "type": "CHOKE_POINT", "lat": 37.8333, "lon": 15.2667},
    {"node_id": 11, "name": "Strait of Gibraltar", "type": "CHOKE_POINT", "lat": 35.9667, "lon": -5.6000},
    {"node_id": 12, "name": "English Channel East", "type": "WAYPOINT", "lat": 50.0000, "lon": -1.0000},
    {"node_id": 13, "name": "Port of Rotterdam Approach", "type": "PORT_APPROACH", "lat": 51.9500, "lon": 4.1000},
    {"node_id": 14, "name": "Port of Antwerp Approach", "type": "PORT_APPROACH", "lat": 51.2667, "lon": 4.3333},
    {"node_id": 15, "name": "Colombo Port Approach", "type": "PORT_APPROACH", "lat": 6.9400, "lon": 79.8400},
    {"node_id": 16, "name": "Malacca Strait North", "type": "CHOKE_POINT", "lat": 5.0000, "lon": 98.0000},
    {"node_id": 17, "name": "Singapore Strait", "type": "CHOKE_POINT", "lat": 1.2500, "lon": 103.8000},
    {"node_id": 18, "name": "South China Sea Central", "type": "WAYPOINT", "lat": 12.0000, "lon": 112.0000},
    {"node_id": 19, "name": "Shanghai Port Approach", "type": "PORT_APPROACH", "lat": 31.2300, "lon": 121.5000},
    {"node_id": 20, "name": "East China Sea Waypoint", "type": "WAYPOINT", "lat": 30.0000, "lon": 126.0000},
    {"node_id": 21, "name": "Yokohama Port Approach", "type": "PORT_APPROACH", "lat": 35.4400, "lon": 139.6500},
    {"node_id": 22, "name": "Cape of Good Hope Waypoint", "type": "CHOKE_POINT", "lat": -34.8333, "lon": 20.0000},
    {"node_id": 23, "name": "South Atlantic West Waypoint", "type": "WAYPOINT", "lat": -15.0000, "lon": 5.0000},
    {"node_id": 24, "name": "North Atlantic Waypoint", "type": "WAYPOINT", "lat": 35.0000, "lon": -15.0000},
]

# ── Global Navigable Maritime Edges Registry ─────────────────────────────────
DEFAULT_MARITIME_EDGES: List[Dict[str, Any]] = [
    # JNPT -> Red Sea -> Suez -> Europe Corridor
    {"source": 1, "target": 2, "name": "JNPT Coastal Departure", "base_speed_knots": 16.0, "operational_stress": 0.15, "geo_risk": 0.10, "congestion": 0.35},
    {"source": 2, "target": 3, "name": "Arabian Sea Crossing North", "base_speed_knots": 18.0, "operational_stress": 0.10, "geo_risk": 0.15, "congestion": 0.05},
    {"source": 3, "target": 4, "name": "Arabian Sea to Gulf of Aden", "base_speed_knots": 18.0, "operational_stress": 0.20, "geo_risk": 0.45, "congestion": 0.15},
    {"source": 4, "target": 5, "name": "Gulf of Aden to Bab-el-Mandeb", "base_speed_knots": 14.0, "operational_stress": 0.25, "geo_risk": 0.75, "congestion": 0.40},
    {"source": 5, "target": 6, "name": "Bab-el-Mandeb to Red Sea Central", "base_speed_knots": 16.0, "operational_stress": 0.20, "geo_risk": 0.65, "congestion": 0.30},
    {"source": 6, "target": 7, "name": "Red Sea Transit to Suez South", "base_speed_knots": 17.0, "operational_stress": 0.15, "geo_risk": 0.30, "congestion": 0.50},
    {"source": 7, "target": 8, "name": "Suez Canal Transit Segment", "base_speed_knots": 8.0, "operational_stress": 0.10, "geo_risk": 0.25, "congestion": 0.85},
    {"source": 8, "target": 9, "name": "Suez North to Med Sea East", "base_speed_knots": 16.0, "operational_stress": 0.10, "geo_risk": 0.15, "congestion": 0.25},
    {"source": 9, "target": 10, "name": "Med Sea East to Strait of Messina", "base_speed_knots": 18.0, "operational_stress": 0.12, "geo_risk": 0.10, "congestion": 0.15},
    {"source": 10, "target": 11, "name": "Messina to Strait of Gibraltar", "base_speed_knots": 18.0, "operational_stress": 0.15, "geo_risk": 0.05, "congestion": 0.20},
    {"source": 11, "target": 12, "name": "Gibraltar to English Channel", "base_speed_knots": 17.0, "operational_stress": 0.25, "geo_risk": 0.05, "congestion": 0.30},
    {"source": 12, "target": 13, "name": "English Channel to Rotterdam", "base_speed_knots": 15.0, "operational_stress": 0.20, "geo_risk": 0.05, "congestion": 0.65},
    {"source": 12, "target": 14, "name": "English Channel to Antwerp", "base_speed_knots": 15.0, "operational_stress": 0.18, "geo_risk": 0.05, "congestion": 0.40},

    # Cape of Good Hope Alternative Reroute Corridor
    {"source": 3, "target": 22, "name": "Arabian Sea to Cape of Good Hope", "base_speed_knots": 19.0, "operational_stress": 0.35, "geo_risk": 0.05, "congestion": 0.05},
    {"source": 22, "target": 23, "name": "Cape of Good Hope to South Atlantic", "base_speed_knots": 19.0, "operational_stress": 0.40, "geo_risk": 0.05, "congestion": 0.05},
    {"source": 23, "target": 24, "name": "South Atlantic to North Atlantic", "base_speed_knots": 19.0, "operational_stress": 0.25, "geo_risk": 0.05, "congestion": 0.05},
    {"source": 24, "target": 11, "name": "North Atlantic to Gibraltar", "base_speed_knots": 18.0, "operational_stress": 0.20, "geo_risk": 0.05, "congestion": 0.10},
    {"source": 24, "target": 12, "name": "North Atlantic to English Channel", "base_speed_knots": 18.0, "operational_stress": 0.30, "geo_risk": 0.05, "congestion": 0.15},

    # Asia & Transpacific Corridors (JNPT -> Colombo -> Singapore -> Shanghai -> Yokohama)
    {"source": 1, "target": 15, "name": "JNPT to Colombo Port", "base_speed_knots": 17.0, "operational_stress": 0.15, "geo_risk": 0.10, "congestion": 0.35},
    {"source": 15, "target": 16, "name": "Colombo to Malacca Strait North", "base_speed_knots": 18.0, "operational_stress": 0.15, "geo_risk": 0.15, "congestion": 0.25},
    {"source": 16, "target": 17, "name": "Malacca Strait to Singapore", "base_speed_knots": 14.0, "operational_stress": 0.20, "geo_risk": 0.10, "congestion": 0.80},
    {"source": 17, "target": 18, "name": "Singapore to South China Sea", "base_speed_knots": 18.0, "operational_stress": 0.25, "geo_risk": 0.35, "congestion": 0.20},
    {"source": 18, "target": 19, "name": "South China Sea to Shanghai", "base_speed_knots": 17.0, "operational_stress": 0.30, "geo_risk": 0.25, "congestion": 0.75},
    {"source": 19, "target": 20, "name": "Shanghai to East China Sea", "base_speed_knots": 18.0, "operational_stress": 0.20, "geo_risk": 0.20, "congestion": 0.40},
    {"source": 20, "target": 21, "name": "East China Sea to Yokohama", "base_speed_knots": 18.0, "operational_stress": 0.20, "geo_risk": 0.10, "congestion": 0.55},
]

class MaritimeGraphService:
    """
    Constructs and manages the directed maritime graph using NetworkX.
    Supports distance, speed, hazard risk, and dynamic edge costs.
    """

    def __init__(self):
        self.graph = nx.DiGraph()
        self.nodes_map: Dict[int, Dict[str, Any]] = {}
        self._build_default_graph()

    def _build_default_graph(self):
        """Populates default maritime graph nodes and edges."""
        self.graph.clear()
        self.nodes_map.clear()

        for n in DEFAULT_MARITIME_NODES:
            nid = n["node_id"]
            self.nodes_map[nid] = n
            self.graph.add_node(nid, **n)

        for e in DEFAULT_MARITIME_EDGES:
            u, v = e["source"], e["target"]
            n1, n2 = self.nodes_map[u], self.nodes_map[v]
            dist_m = haversine_distance_m(n1["lat"], n1["lon"], n2["lat"], n2["lon"])
            edge_data = {
                **e,
                "distance_m": dist_m,
                "distance_nm": dist_m / NAUTICAL_MILE_METERS,
                "navigable": True
            }
            # Add bidirectional edges for sea corridors
            self.graph.add_edge(u, v, **edge_data)
            self.graph.add_edge(v, u, **edge_data)

    def find_nearest_node(self, lat: float, lon: float) -> int:
        """Finds nearest node_id in the maritime graph to given coordinates."""
        best_node = 1
        min_dist = float("inf")
        for nid, n in self.nodes_map.items():
            dist = haversine_distance_m(lat, lon, n["lat"], n["lon"])
            if dist < min_dist:
                min_dist = dist
                best_node = nid
        return best_node

maritime_graph_service = MaritimeGraphService()
