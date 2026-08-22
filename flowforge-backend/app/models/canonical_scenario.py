"""
Canonical Scenario Object — FlowForge.

Single source of truth scenario container for all backend ML agents, routing engines,
and Monte Carlo simulation models. Guarantees mathematical traceability and consistency.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field

class WeatherConditions(BaseModel):
    hazard_level: str = Field("LOW", description="LOW/MODERATE/HIGH/CRITICAL")
    wind_speed_knots: float = Field(10.0, ge=0.0)
    wave_height_m: float = Field(1.0, ge=0.0)
    sea_temperature_c: Optional[float] = None
    source: str = Field("Open-Meteo", description="Data provider")
    freshness_minutes: int = Field(12, description="Data age in minutes")

class DataFreshness(BaseModel):
    status: str = Field("LIVE", description="LIVE / CACHED / SIMULATED / FALLBACK / DEGRADED")
    last_updated: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    weather_source: str = "Open-Meteo"
    geopolitical_source: str = "GDACS / GDELT"
    carrier_risk_source: str = "Configured Registry"
    fuel_index_source: str = "Bunker Index"

class CanonicalScenario(BaseModel):
    """
    Canonical Scenario Object — consumed by all downstream models and API routers.
    """
    shipment_id: str = Field(..., description="Unique shipment identifier")
    origin_port: str = Field(..., description="UN/LOCODE origin port code")
    destination_port: str = Field(..., description="UN/LOCODE destination port code")
    carrier: str = Field("MAERSK", description="Ocean carrier name")
    transport_mode: str = Field("Ocean", description="Ocean / Air / Truck")
    
    cargo_weight_mt: float = Field(15.0, ge=0.1, description="Cargo weight in metric tons")
    cargo_quantity: int = Field(250, ge=1, description="Number of units/containers")
    cargo_value_usd: float = Field(120000.0, ge=0.0, description="Declared cargo value in USD")
    
    baseline_eta_hours: float = Field(168.0, ge=1.0, description="Baseline transit hours")
    calculated_eta_hours: Optional[float] = None
    operator_override_eta_hours: Optional[float] = None
    
    weather: WeatherConditions = Field(default_factory=WeatherConditions)
    port_congestion: float = Field(0.45, ge=0.0, le=1.0, description="Destination port congestion")
    geopolitical_risk: float = Field(0.20, ge=0.0, le=1.0, description="Geopolitical conflict index")
    fuel_price_usd_per_ton: float = Field(650.0, ge=100.0, description="Marine fuel oil price")
    vessel_availability_score: float = Field(0.85, ge=0.0, le=1.0)
    
    disruption_type: str = Field("PORT_CONGESTION", description="Active disruption classification")
    disruption_severity: float = Field(0.87, ge=0.0, le=1.0, description="Disruption severity index")
    disruption_location: str = Field("Rotterdam", description="Affected port or corridor location")
    
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    data_freshness: DataFreshness = Field(default_factory=DataFreshness)

    def is_port_on_route(self, port_code_or_name: str, route_waypoints: List[Dict[str, Any]]) -> bool:
        """
        Network Propagation Safety Check:
        Verifies whether a disrupted port/corridor actually intersects the route.
        """
        target = port_code_or_name.upper().strip()
        for wp in route_waypoints:
            wp_name = wp.get("name", "").upper()
            wp_unlocode = wp.get("unlocode", "").upper()
            if target in wp_name or target == wp_unlocode:
                return True
        return False
