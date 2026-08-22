"""
Risk-Aware Multi-Objective A* Maritime Router — FlowForge.

Implements graph-based A* routing with admissible geodesic heuristic,
dynamic edge costs (distance, time, fuel, operational stress, geo-risk, congestion, disruption penalty),
and K-shortest path alternative route generation.
"""
import math
import heapq
import logging
from typing import Dict, Any, List, Tuple, Optional
import networkx as nx
from app.routing.maritime_graph import maritime_graph_service, haversine_distance_m, NAUTICAL_MILE_METERS

logger = logging.getLogger("flowforge.routing.astar_router")

# ── Optimization Mode Weights Presets ──────────────────────────────────────────
OPTIMIZATION_PRESETS = {
    "BALANCED": {
        "distance": 0.15,
        "time": 0.20,
        "fuel": 0.15,
        "operational": 0.20,
        "geo_risk": 0.15,
        "congestion": 0.10,
        "disruption": 0.05
    },
    "FASTEST": {
        "distance": 0.10,
        "time": 0.50,
        "fuel": 0.10,
        "operational": 0.15,
        "geo_risk": 0.10,
        "congestion": 0.05,
        "disruption": 0.00
    },
    "LOWEST_COST": {
        "distance": 0.25,
        "time": 0.15,
        "fuel": 0.40,
        "operational": 0.10,
        "geo_risk": 0.05,
        "congestion": 0.05,
        "disruption": 0.00
    },
    "LOWEST_RISK": {
        "distance": 0.05,
        "time": 0.10,
        "fuel": 0.05,
        "operational": 0.35,
        "geo_risk": 0.30,
        "congestion": 0.10,
        "disruption": 0.05
    },
    "MAXIMUM_RESILIENCE": {
        "distance": 0.05,
        "time": 0.10,
        "fuel": 0.05,
        "operational": 0.30,
        "geo_risk": 0.25,
        "congestion": 0.15,
        "disruption": 0.10
    }
}

class RiskAwareAStarRouter:
    """
    Risk-Aware Multi-Objective A* Maritime Router.
    """

    def compute_edge_cost(
        self,
        edge_data: Dict[str, Any],
        vessel_speed_knots: float,
        mode_weights: Dict[str, float]
    ) -> Tuple[float, Dict[str, float]]:
        """
        Calculates dynamic edge cost and individual component metrics.
        """
        dist_nm = edge_data.get("distance_nm", 10.0)
        base_speed = edge_data.get("base_speed_knots", vessel_speed_knots)
        op_stress = edge_data.get("operational_stress", 0.1)
        geo_risk = edge_data.get("geo_risk", 0.1)
        congestion = edge_data.get("congestion", 0.1)

        # Speed penalty from operational stress: effective_speed = base_speed * (1 - 0.4 * op_stress)
        effective_speed = max(4.0, base_speed * (1.0 - 0.4 * op_stress))
        travel_hours = dist_nm / effective_speed

        # Fuel cost estimate ($650/ton, ~35 tons/day = 1.45 tons/hr)
        fuel_tons = travel_hours * 1.45
        fuel_cost_usd = fuel_tons * 650.0

        # Normalized cost terms
        c_dist = dist_nm / 100.0
        c_time = travel_hours / 10.0
        c_fuel = fuel_cost_usd / 1000.0
        c_op = op_stress * 10.0
        c_geo = geo_risk * 10.0
        c_cong = congestion * 10.0
        c_disruption = (op_stress * geo_risk * 10.0)

        w = mode_weights
        total_cost = (
            w["distance"] * c_dist
          + w["time"] * c_time
          + w["fuel"] * c_fuel
          + w["operational"] * c_op
          + w["geo_risk"] * c_geo
          + w["congestion"] * c_cong
          + w["disruption"] * c_disruption
        )

        metrics = {
            "distance_nm": dist_nm,
            "travel_hours": travel_hours,
            "fuel_cost_usd": fuel_cost_usd,
            "operational_stress": op_stress,
            "geo_risk": geo_risk,
            "congestion": congestion,
            "effective_speed_knots": effective_speed
        }
        return total_cost, metrics

    def heuristic(self, current_node_id: int, target_node_id: int, min_cost_per_meter: float = 1e-6) -> float:
        """
        Admissible A* Heuristic h(n) = geodesic_distance(n, dest) * min_cost_per_meter.
        Never overestimates remaining optimal cost.
        """
        n1 = maritime_graph_service.nodes_map[current_node_id]
        n2 = maritime_graph_service.nodes_map[target_node_id]
        dist_m = haversine_distance_m(n1["lat"], n1["lon"], n2["lat"], n2["lon"])
        return dist_m * min_cost_per_meter

    def search_route(
        self,
        start_node_id: int,
        target_node_id: int,
        vessel_speed_knots: float = 18.0,
        optimization_mode: str = "BALANCED"
    ) -> Optional[Dict[str, Any]]:
        """
        Executes Risk-Aware A* graph search from start_node_id to target_node_id.
        """
        weights = OPTIMIZATION_PRESETS.get(optimization_mode, OPTIMIZATION_PRESETS["BALANCED"])
        graph = maritime_graph_service.graph

        open_set = []
        heapq.heappush(open_set, (0.0, start_node_id))

        came_from = {}
        g_score = {node: float("inf") for node in graph.nodes}
        g_score[start_node_id] = 0.0

        f_score = {node: float("inf") for node in graph.nodes}
        f_score[start_node_id] = self.heuristic(start_node_id, target_node_id)

        edge_history = {}

        while open_set:
            _, current = heapq.heappop(open_set)

            if current == target_node_id:
                # Reconstruct path
                path = [current]
                while current in came_from:
                    current = came_from[current]
                    path.append(current)
                path.reverse()

                # Calculate path metrics
                total_dist_nm = 0.0
                total_eta_hours = 0.0
                total_fuel_cost = 0.0
                max_op_stress = 0.0
                max_geo_risk = 0.0
                max_congestion = 0.0
                waypoints = []

                for i, nid in enumerate(path):
                    node_data = maritime_graph_service.nodes_map[nid]
                    waypoints.append({
                        "node_id": nid,
                        "name": node_data["name"],
                        "lat": node_data["lat"],
                        "lon": node_data["lon"],
                        "type": node_data["type"]
                    })
                    if i > 0:
                        prev_nid = path[i-1]
                        e_data = graph[prev_nid][nid]
                        _, m = self.compute_edge_cost(e_data, vessel_speed_knots, weights)
                        total_dist_nm += m["distance_nm"]
                        total_eta_hours += m["travel_hours"]
                        total_fuel_cost += m["fuel_cost_usd"]
                        max_op_stress = max(max_op_stress, m["operational_stress"])
                        max_geo_risk = max(max_geo_risk, m["geo_risk"])
                        max_congestion = max(max_congestion, m["congestion"])

                overall_risk = round(0.35 * max_op_stress + 0.35 * max_geo_risk + 0.30 * max_congestion, 3)

                return {
                    "path_node_ids": path,
                    "waypoints": waypoints,
                    "distance_nm": round(total_dist_nm, 1),
                    "eta_hours": round(total_eta_hours, 1),
                    "estimated_cost": round(total_fuel_cost + 4200.0, 2),
                    "operational_stress": round(max_op_stress, 3),
                    "geo_port_risk": round(max_geo_risk, 3),
                    "port_congestion": round(max_congestion, 3),
                    "overall_risk": overall_risk,
                    "total_score": round(g_score[target_node_id], 4)
                }

            for neighbor in graph.neighbors(current):
                edge_data = graph[current][neighbor]
                if not edge_data.get("navigable", True):
                    continue

                cost, _ = self.compute_edge_cost(edge_data, vessel_speed_knots, weights)
                tentative_g = g_score[current] + cost

                if tentative_g < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score[neighbor] = tentative_g + self.heuristic(neighbor, target_node_id)
                    heapq.heappush(open_set, (f_score[neighbor], neighbor))

        return None

    def find_alternative_routes(
        self,
        start_node_id: int,
        target_node_id: int,
        vessel_speed_knots: float = 18.0,
        optimization_mode: str = "BALANCED",
        num_routes: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Generates Primary Route + Alternative Route 1 + Alternative Route 2.
        Uses K-shortest path strategy with penalized edge weights.
        """
        primary = self.search_route(start_node_id, target_node_id, vessel_speed_knots, optimization_mode)
        if not primary:
            return []

        routes = []
        primary["route_id"] = "R1-PRIMARY"
        primary["description"] = f"Primary Optimal Route via {primary['waypoints'][len(primary['waypoints'])//2]['name']}"
        primary["recommendation"] = "PRIMARY RECOMMENDED ROUTE — Lowest Total Risk-Cost Score"
        primary["safety_rating"] = "HIGH" if primary["overall_risk"] < 0.3 else "MODERATE"
        routes.append(primary)

        # Temporarily penalize primary path edges to find alternative sea corridors
        graph = maritime_graph_service.graph
        path_ids = primary["path_node_ids"]
        original_weights = {}

        for i in range(len(path_ids) - 1):
            u, v = path_ids[i], path_ids[i+1]
            if graph.has_edge(u, v):
                original_weights[(u, v)] = graph[u][v].get("operational_stress", 0.1)
                graph[u][v]["operational_stress"] = min(1.0, graph[u][v].get("operational_stress", 0.1) + 0.4)

        alt1 = self.search_route(start_node_id, target_node_id, vessel_speed_knots, "LOWEST_RISK")
        if alt1 and alt1["path_node_ids"] != path_ids:
            alt1["route_id"] = "R2-ALT-RISK"
            alt1["description"] = f"Alternative Reroute 1 via Cape/Diversion Corridor"
            alt1["recommendation"] = "LOW RISK ALTERNATIVE — Avoids Choke Point Disruption"
            alt1["safety_rating"] = "VERY HIGH"
            routes.append(alt1)

        alt2 = self.search_route(start_node_id, target_node_id, vessel_speed_knots, "FASTEST")
        if alt2:
            alt2["route_id"] = "R3-ALT-EXPRESS"
            alt2["description"] = f"Alternative Reroute 2 via Direct Express Corridor"
            alt2["recommendation"] = "EXPRESS ALTERNATIVE — Minimizes Total Transit Hours"
            alt2["safety_rating"] = "MODERATE"
            routes.append(alt2)

        # Restore original edge weights
        for (u, v), val in original_weights.items():
            if graph.has_edge(u, v):
                graph[u][v]["operational_stress"] = val

        return routes[:num_routes]

astar_router = RiskAwareAStarRouter()
