import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_health():
    """Phase 6: GET /health check."""
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert data["service"] == "flowforge-backend"

def test_get_system_status():
    """Phase 5: GET /api/v1/system/status check."""
    resp = client.get("/api/v1/system/status")
    assert resp.status_code == 200
    data = resp.json()
    assert data["system"] == "FlowForge Intelligence Layer"
    assert data["status"] in ["OPERATIONAL", "DEGRADED"]
    assert "models" in data
    assert "live_services" in data

def test_get_models_status():
    """GET /api/v1/models/status check."""
    resp = client.get("/api/v1/models/status")
    assert resp.status_code == 200
    data = resp.json()
    assert data["registry_status"] == "ACTIVE"
    assert data["loaded_models_count"] >= 4

def test_get_models_diagnostics():
    """GET /api/v1/models/diagnostics check."""
    resp = client.get("/api/v1/models/diagnostics")
    assert resp.status_code == 200
    data = resp.json()
    assert data["diagnostic_status"] == "ALL_PASSED"

def test_post_analyze_frontend_shorthand():
    """Phase 1: POST /api/v1/analyze using frontend-style shorthand request keys."""
    frontend_req = {
        "origin": "CNSHA",
        "destination": "JPYOK",
        "carrier": "MAERSK",
        "shipment_mode": "Ocean",
        "cargo_weight_mt": 15.0,
        "cargo_units": 250,
        "cargo_value_usd": 120000.0,
        "baseline_eta_hours": 168.0,
        "vessel_speed_knots": 14.2
    }
    resp = client.post("/api/v1/analyze", json=frontend_req)
    assert resp.status_code == 200
    data = resp.json()

    # Phase 2: Response structure checks
    assert "analysis_id" in data
    assert "request" in data
    assert "live_telemetry" in data
    assert "ml_predictions" in data
    assert "route_analysis" in data
    assert "cost_analysis" in data
    assert "decision" in data
    assert "recovery_playbook" in data
    assert "provenance" in data
    assert "system_status" in data

    # Phase 3: Separation of current weather from route hazard
    current_wx = data["live_telemetry"]["current_weather"]
    route_hz = data["route_analysis"]["route_hazard"]
    assert "hazard" in current_wx
    assert "worst_hazard" in route_hz
    assert current_wx["source"] in ["LIVE_OPEN_METEO", "FALLBACK"]
    assert route_hz["source"] == "LIVE_OPEN_METEO"

    # Phase 4: Provenance labels
    assert data["ml_predictions"]["disruption"]["source"] == "TRAINED_MODEL"
    assert data["ml_predictions"]["eta"]["source"] == "TRAINED_MODEL"
    assert data["ml_predictions"]["cost"]["source"] == "TRAINED_MODEL"
    assert data["cost_analysis"]["total_reroute_cost_usd"]["source"] == "DERIVED_CALCULATION"

def test_validation_error_format():
    """Phase 8: Validation error returns clean structured JSON."""
    invalid_req = {
        "origin": "CNSHA",
        "destination": "JPYOK",
        "cargo_weight_mt": -10.0  # Invalid negative weight
    }
    resp = client.post("/api/v1/analyze", json=invalid_req)
    assert resp.status_code == 422
    data = resp.json()
    assert data["error"] == "VALIDATION_ERROR"
    assert "message" in data
    assert "details" in data

def test_analyze_demo_endpoint():
    """POST /api/v1/analyze/demo check."""
    resp = client.post("/api/v1/analyze/demo")
    assert resp.status_code == 200
    data = resp.json()
    assert data["request"]["origin"] == "CNSHA"
    assert data["decision"]["recommendation_score"]["value"] > 0
