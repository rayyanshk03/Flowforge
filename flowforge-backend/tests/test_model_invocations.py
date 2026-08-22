import pytest
import asyncio
import numpy as np
import pandas as pd
from pathlib import Path
from app.models.model_loader import model_registry
from app.agents.disruption_agent import disruption_agent
from app.agents.eta_agent import eta_agent
from app.agents.route_agent import route_agent
from app.agents.cost_agent import cost_agent

def test_model_registry_loads_all_models():
    """Verify that ModelRegistry loads all 4 trained model files at startup."""
    status = model_registry.get_status()
    assert status["registry_status"] == "ACTIVE"
    assert status["loaded_models_count"] >= 4
    
    assert model_registry.disruption_model is not None
    assert model_registry.eta_regressor is not None
    assert model_registry.delay_classifier is not None
    assert model_registry.cost_optimizer_model is not None

def test_disruption_agent_invokes_model():
    """Verify DisruptionAgent actually invokes disruption_model.pkl."""
    res = asyncio.run(disruption_agent.evaluate_disruption("YOKOHAMA"))
    assert res["ml_model_active"] is True
    assert res["prediction_source"] == "TRAINED_MODEL"
    assert res["model_file"] == "disruption_model.pkl"
    assert isinstance(res["disruption_probability"], float)
    assert 0.0 <= res["disruption_probability"] <= 1.0

def test_eta_agent_invokes_models():
    """Verify ETAAgent actually invokes ETA_Agent.pkl and Calibrated_Delay_Agent.pkl."""
    res = eta_agent.predict_eta(33.85, 137.20, "YOKOHAMA")
    assert res["ml_models_active"] is True
    assert res["confidence"] == "HIGH"
    assert "predicted_total_hours" in res
    assert "delay_probability_percent" in res

def test_route_agent_invokes_projection_engine():
    """Verify RouteAgent projects waypoints and samples weather hazards along bearing."""
    res = route_agent.analyze_route(31.2304, 121.4737, 85.0, 14.2, origin="CNSHA", destination="JPYOK")
    assert res["agent"] == "ROUTE_AGENT"
    assert len(res["sampled_waypoints"]) == 3
    assert "worst_hazard_ahead" in res

def test_cost_agent_invokes_model():
    """Verify CostAgent actually invokes flowforge_cost_optimizer_xgb.pkl."""
    res = cost_agent.calculate_cost_impact("MV ORION", baseline_route_nm=1200.0, alternative_route_nm=1380.0)
    assert res["agent"] == "COST_AGENT"
    assert res["ml_predicted_shipment_cost"]["source"] == "TRAINED_MODEL"
    assert res["ml_predicted_shipment_cost"]["model_file"] == "flowforge_cost_optimizer_xgb.pkl"
    assert isinstance(res["ml_predicted_shipment_cost"]["value"], float)

def test_model_diagnostics_endpoint_all_pass():
    """Verify model_registry.run_diagnostics() executes sample predictions for all models."""
    diag = model_registry.run_diagnostics()
    assert diag["diagnostic_status"] == "ALL_PASSED"
    assert diag["diagnostics"]["disruption_model.pkl"]["status"] == "PASS"
    assert diag["diagnostics"]["eta_model.pkl"]["status"] == "PASS"
    assert diag["diagnostics"]["delay_model.pkl"]["status"] == "PASS"
    assert diag["diagnostics"]["cost_model.pkl"]["status"] == "PASS"
