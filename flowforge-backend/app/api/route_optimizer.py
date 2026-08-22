"""
Route Optimizer API Router — FlowForge.

Provides POST /api/v1/routes/optimize endpoint:
Integrates PostGIS candidate port discovery, risk-aware multi-objective A* routing,
10,000 Monte Carlo simulation validation, and explainability reasoning.
"""
import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.routing.candidate_discovery import candidate_discovery_service
from app.routing.maritime_graph import maritime_graph_service
from app.routing.astar_router import astar_router
from app.routing.explainability_engine import explainability_engine
from app.agents.monte_carlo_agent import monte_carlo_agent

logger = logging.getLogger("flowforge.api.route_optimizer")

router = APIRouter(prefix="/api/v1/routes", tags=["Routing Engine"])

# ── Pydantic Request Models ──────────────────────────────────────────────────
class LocationCoords(BaseModel):
    latitude: float = Field(..., description="Latitude coordinate", example=18.9435)
    longitude: float = Field(..., description="Longitude coordinate", example=72.9290)
    unlocode: Optional[str] = Field(None, description="Optional UN/LOCODE identifier", example="INNSA")

class RouteOptimizationRequest(BaseModel):
    origin: LocationCoords
    destination: LocationCoords
    vessel_speed_knots: float = Field(18.0, ge=5.0, le=40.0, description="Cruising speed in knots", example=18.0)
    cargo_type: str = Field("container", description="Cargo classification", example="container")
    cargo_value_usd: float = Field(120000.0, description="Declared cargo value", example=120000.0)
    cargo_weight_mt: float = Field(15.0, description="Cargo weight in metric tons", example=15.0)
    deadline_hours: float = Field(432.0, description="SLA delivery deadline hours", example=432.0)
    optimization_mode: str = Field("BALANCED", description="Optimization mode: BALANCED, FASTEST, LOWEST_COST, LOWEST_RISK, MAXIMUM_RESILIENCE", example="BALANCED")

# ── Pydantic Response Models ─────────────────────────────────────────────────
class RiskBreakdownModel(BaseModel):
    operational_stress: float
    geo_port_risk: float
    port_congestion: float

class OptimizationScoresModel(BaseModel):
    cost_score: float
    eta_score: float
    risk_score: float
    total_score: float

class RouteOptimizationResponse(BaseModel):
    recommended_route: Dict[str, Any]
    alternative_routes: List[Dict[str, Any]]
    candidate_origin_ports: List[Dict[str, Any]]
    candidate_destination_ports: List[Dict[str, Any]]
    monte_carlo_resilience: Dict[str, Any]
    risk_breakdown: RiskBreakdownModel
    optimization: OptimizationScoresModel
    explanation: List[str]

@router.post("/optimize", response_model=RouteOptimizationResponse, status_code=status.HTTP_200_OK)
def optimize_maritime_route(
    req: RouteOptimizationRequest,
    db: Session = Depends(get_db)
):
    """
    Executes PostGIS candidate port discovery, risk-aware multi-objective A* routing,
    10,000 Monte Carlo simulation runs, and explainability reasoning.
    """
    try:
        opt_mode = req.optimization_mode.upper()

        # 1. Candidate Port Discovery (PostGIS ST_DWithin / Haversine)
        orig_candidates = candidate_discovery_service.discover_candidate_ports(
            lat=req.origin.latitude,
            lon=req.origin.longitude,
            radius_meters=800000.0,
            db_session=db,
            limit=5
        )
        dest_candidates = candidate_discovery_service.discover_candidate_ports(
            lat=req.destination.latitude,
            lon=req.destination.longitude,
            radius_meters=800000.0,
            db_session=db,
            limit=5
        )

        # 2. Map coordinates to nearest nodes in maritime navigation graph
        start_node_id = maritime_graph_service.find_nearest_node(req.origin.latitude, req.origin.longitude)
        target_node_id = maritime_graph_service.find_nearest_node(req.destination.latitude, req.destination.longitude)

        # 3. Execute Risk-Aware Multi-Objective A* Algorithm & K-Shortest Alternatives
        all_routes = astar_router.find_alternative_routes(
            start_node_id=start_node_id,
            target_node_id=target_node_id,
            vessel_speed_knots=req.vessel_speed_knots,
            optimization_mode=opt_mode,
            num_routes=3
        )

        if not all_routes:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No navigable maritime route found between specified coordinates."
            )

        recommended_route = all_routes[0]
        alternative_routes = all_routes[1:] if len(all_routes) > 1 else []

        # 4. Monte Carlo Validation Layer (10,000 simulation runs)
        from app.agents.monte_carlo_agent import MonteCarloInput
        mc_input = MonteCarloInput(
            baseline_eta_hours=req.deadline_hours,
            baseline_cost_usd=recommended_route["estimated_cost"],
            ml_eta_hours=recommended_route["eta_hours"],
            ml_disruption_probability=recommended_route["overall_risk"],
            ml_delay_probability=min(0.95, recommended_route["overall_risk"] * 1.5),
            ml_cost_usd=recommended_route["estimated_cost"],
            weather_hazard_level="LOW" if recommended_route["operational_stress"] < 0.25 else "MODERATE",
            port_congestion_score=recommended_route["port_congestion"],
            geo_risk_score=recommended_route["geo_port_risk"],
            simulation_count=10000
        )
        mc_output = monte_carlo_agent.run_simulation(mc_input)
        mc_results = mc_output.model_dump()

        # 5. Risk Breakdown & Optimization Scores
        risk_breakdown = RiskBreakdownModel(
            operational_stress=recommended_route["operational_stress"],
            geo_port_risk=recommended_route["geo_port_risk"],
            port_congestion=recommended_route["port_congestion"]
        )

        eta_sc = round(min(1.0, recommended_route["eta_hours"] / req.deadline_hours), 3)
        cost_sc = round(min(1.0, recommended_route["estimated_cost"] / 50000.0), 3)
        risk_sc = round(recommended_route["overall_risk"], 3)
        total_sc = round(recommended_route["total_score"], 3)

        optimization_scores = OptimizationScoresModel(
            cost_score=cost_sc,
            eta_score=eta_sc,
            risk_score=risk_sc,
            total_score=total_sc
        )

        # 6. Generate Explainability Reason Bullet Points
        explanation_bullets = explainability_engine.generate_explanation(
            recommended_route=recommended_route,
            alternatives=alternative_routes,
            monte_carlo_resilience=mc_results
        )

        return RouteOptimizationResponse(
            recommended_route=recommended_route,
            alternative_routes=alternative_routes,
            candidate_origin_ports=orig_candidates,
            candidate_destination_ports=dest_candidates,
            monte_carlo_resilience=mc_results,
            risk_breakdown=risk_breakdown,
            optimization=optimization_scores,
            explanation=explanation_bullets
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during route optimization execution: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Route optimization algorithm failed: {str(e)}"
        )
