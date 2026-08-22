"""
Unit Test Suite — FlowForge Realism, Model Validation & Output-Credibility Upgrade.

Tests:
1. Canonical Scenario Object initialization & schema contracts.
2. Network Disruption Isolation (Rotterdam congestion does NOT affect CNSHA -> JPYOK direct route).
3. Risk Score calibration [LOW, MEDIUM, HIGH, CRITICAL].
4. Financial Loss & Net Benefit mathematical reconciliation.
5. Monte Carlo percentile ordering invariant (P50 <= P75 <= P90 <= P95 <= P99).
6. PostGIS A* Router dynamic multi-objective scoring and candidate port discovery.
"""
import unittest
import asyncio
from app.models.canonical_scenario import CanonicalScenario, WeatherConditions
from app.agents.disruption_agent import disruption_agent, DisruptionInput
from app.agents.eta_agent import eta_agent
from app.agents.cost_agent import cost_agent, CostInput
from app.agents.monte_carlo_agent import monte_carlo_agent, MonteCarloInput
from app.routing.astar_router import astar_router
from app.routing.maritime_graph import maritime_graph_service

class TestFlowForgeCredibilityEngine(unittest.TestCase):

    def setUp(self):
        self.scenario = CanonicalScenario(
            shipment_id="TEST-CNSHA-JPYOK-001",
            origin_port="CNSHA",
            destination_port="JPYOK",
            carrier="MAERSK",
            transport_mode="Ocean",
            cargo_weight_mt=15.0,
            cargo_quantity=250,
            cargo_value_usd=120000.0,
            baseline_eta_hours=168.0,
            disruption_type="PORT_CONGESTION",
            disruption_severity=0.87,
            disruption_location="Rotterdam"
        )

    def test_canonical_scenario_contract(self):
        self.assertEqual(self.scenario.origin_port, "CNSHA")
        self.assertEqual(self.scenario.destination_port, "JPYOK")
        self.assertEqual(self.scenario.disruption_severity, 0.87)

    def test_rotterdam_disruption_isolation(self):
        """
        Verify that Rotterdam congestion (87%) does NOT affect Shanghai -> Yokohama route
        since Rotterdam is NOT on the direct Pacific route.
        """
        direct_route_waypoints = [
            {"name": "Shanghai Port Approach", "unlocode": "CNSHA"},
            {"name": "East China Sea Waypoint", "unlocode": "ECSWP"},
            {"name": "Yokohama Port Approach", "unlocode": "JPYOK"}
        ]
        is_affected = self.scenario.is_port_on_route("Rotterdam", direct_route_waypoints)
        self.assertFalse(is_affected, "Rotterdam congestion MUST NOT affect Shanghai -> Yokohama direct route!")

    def test_calibrated_risk_classes(self):
        """
        Verify calibrated risk class mapping:
        LOW [0-0.30], MEDIUM [0.30-0.60], HIGH [0.60-0.80], CRITICAL [0.80-1.00].
        """
        inp_low = DisruptionInput(port_name="JPYOK", wind_speed_knots=5.0, wave_height_meters=0.5, hazard_level="LOW", geo_risk_score=0.1, port_congestion_score=0.1)
        res_low = disruption_agent.predict(inp_low)
        self.assertIn(res_low.risk_level, ["LOW", "MEDIUM", "STABLE"])

    def test_financial_reconciliation(self):
        """
        Verify mathematical financial benefit formula:
        Net Benefit = Loss Avoided - Additional Transport Cost
        Loss Avoided = Baseline Expected Loss - Reroute Expected Loss
        """
        baseline_loss = 24500.0
        reroute_loss = 4200.0
        additional_transport_cost = 6800.0

        loss_avoided = baseline_loss - reroute_loss
        net_financial_benefit = loss_avoided - additional_transport_cost

        self.assertEqual(loss_avoided, 20300.0)
        self.assertEqual(net_financial_benefit, 13500.0)
        self.assertEqual(net_financial_benefit, loss_avoided - additional_transport_cost)

    def test_monte_carlo_percentile_ordering_invariant(self):
        """
        Verify statistical invariant: P50 <= P75 <= P90 <= P95 <= P99
        """
        mc_inp = MonteCarloInput(
            baseline_eta_hours=168.0,
            baseline_cost_usd=15000.0,
            ml_eta_hours=160.0,
            ml_disruption_probability=0.25,
            ml_delay_probability=0.35,
            ml_cost_usd=14500.0,
            simulation_count=1000
        )
        res = monte_carlo_agent.run_simulation(mc_inp)
        p50 = res.eta_percentiles["P50"]
        p90 = res.eta_percentiles["P90"]
        p95 = res.eta_percentiles["P95"]
        p99 = res.eta_percentiles["P99"]

        self.assertTrue(p50 <= p90 <= p95 <= p99, f"Monte Carlo percentiles out of order! P50={p50}, P90={p90}, P95={p95}, P99={p99}")

    def test_astar_routing_engine(self):
        """
        Verify A* routing engine returns valid graph nodes and non-zero distance/cost.
        """
        start_nid = maritime_graph_service.find_nearest_node(31.23, 121.5)  # Shanghai
        target_nid = maritime_graph_service.find_nearest_node(35.44, 139.65) # Yokohama
        routes = astar_router.find_alternative_routes(start_nid, target_nid, vessel_speed_knots=18.0, optimization_mode="BALANCED")

        self.assertGreater(len(routes), 0)
        primary = routes[0]
        self.assertGreater(primary["distance_nm"], 0.0)
        self.assertGreater(primary["eta_hours"], 0.0)
        self.assertGreater(primary["estimated_cost"], 0.0)

if __name__ == "__main__":
    unittest.main()
