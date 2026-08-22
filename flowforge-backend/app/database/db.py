import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, String, Float, Integer, Boolean, DateTime, Text, text
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime, timezone

# Load environment variables from .env
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/flowforge"

# Fallback to local SQLite if PostgreSQL connection fails
db_file_path = Path(__file__).resolve().parent / "flowforge_memory.db"
SQLITE_FALLBACK_URL = f"sqlite:///{db_file_path}"

def get_engine():
    try:
        eng = create_engine(DATABASE_URL, pool_pre_ping=True)
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        return eng
    except Exception as e:
        print(f"[Database] PostgreSQL connection failed ({e}). Falling back to SQLite memory store.")
        return create_engine(SQLITE_FALLBACK_URL, pool_pre_ping=True, connect_args={"check_same_thread": False})

engine = get_engine()

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── FlowForge Persistent Memory & Audit Layer Schema (8 Core Tables + Audit) ────

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=True)
    email = Column(String, nullable=False, unique=True)
    role = Column(String, default="LOGISTICS_OPERATOR")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class ShipmentModel(Base):
    __tablename__ = "shipments"

    id = Column(String, primary_key=True)
    origin_port = Column(String, nullable=False)
    destination_port = Column(String, nullable=False)
    carrier = Column(String, default="MAERSK")
    shipment_mode = Column(String, default="OCEAN")
    baseline_eta_hours = Column(Float, default=168.0)
    cargo_weight_mt = Column(Float, default=15.0)
    cargo_quantity = Column(Integer, default=250)
    cargo_value_usd = Column(Float, default=120000.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class DisruptionModel(Base):
    __tablename__ = "disruptions"

    id = Column(String, primary_key=True)
    shipment_id = Column(String, nullable=False)
    disruption_type = Column(String, default="PORT_CONGESTION")
    location = Column(String, default="Rotterdam")
    severity = Column(String, default="CRITICAL")
    description = Column(Text, nullable=True)
    detected_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String, default="ACTIVE")


class AnalysisModel(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True)
    shipment_id = Column(String, nullable=False)
    disruption_id = Column(String, nullable=True)

    # ML Feature & Probability Snapshots
    operational_stress = Column(Float, default=0.23)
    geo_port_risk = Column(Float, default=0.85)
    port_congestion = Column(Float, default=0.45)
    disruption_probability = Column(Float, default=0.2295)

    # ETA & Delay Snapshots
    predicted_eta_hours = Column(Float, default=147.5)
    delay_probability = Column(Float, default=0.06)

    # Telemetry Hazards
    weather_hazard = Column(String, default="LOW")
    geopolitical_risk = Column(Float, default=1.00)
    carrier_risk = Column(Float, default=0.12)
    fuel_price_index = Column(Float, default=1.00)

    status = Column(String, default="COMPLETED")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class RouteOptionModel(Base):
    __tablename__ = "route_options"

    id = Column(String, primary_key=True)
    analysis_id = Column(String, nullable=False)
    route_code = Column(String, nullable=False)
    route_name = Column(String, nullable=False)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    via_port = Column(String, nullable=True)

    distance_nm = Column(Float, default=2385.6)
    additional_distance_nm = Column(Float, default=180.0)

    estimated_delay_hours = Column(Float, default=5.2)
    delay_avoided_hours = Column(Float, default=13.2)

    route_risk = Column(Float, default=0.28)
    feasible = Column(Boolean, default=True)
    route_score = Column(Float, default=0.91)
    is_recommended = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class SimulationResultModel(Base):
    __tablename__ = "simulation_results"

    id = Column(String, primary_key=True)
    analysis_id = Column(String, nullable=False)

    num_scenarios = Column(Integer, default=10000)
    time_horizon_hours = Column(Float, default=168.0)
    confidence_level = Column(Float, default=0.95)

    p50_delay_hours = Column(Float, default=4.8)
    p90_delay_hours = Column(Float, default=13.7)
    p95_delay_hours = Column(Float, default=18.2)

    expected_cost = Column(Float, default=89000.0)
    p95_cost = Column(Float, default=118000.0)
    cvar95 = Column(Float, default=125000.0)

    simulation_status = Column(String, default="COMPLETED")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class DecisionModel(Base):
    __tablename__ = "decisions"

    id = Column(String, primary_key=True)
    analysis_id = Column(String, nullable=False)
    simulation_id = Column(String, nullable=True)

    recommended_route_id = Column(String, default="Antwerp")

    risk_score = Column(Float, default=0.28)
    eta_score = Column(Float, default=0.88)
    cost_score = Column(Float, default=0.91)

    risk_weight = Column(Float, default=0.35)
    eta_weight = Column(Float, default=0.35)
    cost_weight = Column(Float, default=0.30)

    recommendation_score = Column(Float, default=0.91)
    recommended_action = Column(String, default="REROUTE 142 SHIPMENTS VIA ANTWERP")

    expected_loss = Column(Float, default=19000.0)
    reroute_cost = Column(Float, default=89000.0)
    gross_savings = Column(Float, default=67700.0)
    net_savings = Column(Float, default=63000.0)

    status = Column(String, default="PROPOSED")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class DecisionOutcomeModel(Base):
    __tablename__ = "decision_outcomes"

    id = Column(String, primary_key=True)
    decision_id = Column(String, nullable=False)

    action = Column(String, nullable=False) # APPROVE, REJECT, PAUSE, SKIP, OVERRIDE
    status = Column(String, nullable=False) # APPROVED, REJECTED, PAUSED, SKIPPED, OVERRIDDEN

    reason_category = Column(String, nullable=True)
    reason_subcategory = Column(String, nullable=True)
    reason_text = Column(Text, nullable=True)

    recommended_route_id = Column(String, default="Antwerp")
    selected_route_id = Column(String, default="Colombo")

    decision_maker = Column(String, default="LOGISTICS_OPERATOR")
    resume_condition = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class AuditEventModel(Base):
    __tablename__ = "audit_events"

    id = Column(String, primary_key=True)
    decision_id = Column(String, nullable=True)
    analysis_id = Column(String, nullable=True)

    event_type = Column(String, nullable=False)
    event_description = Column(Text, nullable=False)

    previous_status = Column(String, nullable=True)
    new_status = Column(String, nullable=True)

    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class DataSourceSnapshotModel(Base):
    __tablename__ = "data_source_snapshots"

    id = Column(String, primary_key=True)
    analysis_id = Column(String, nullable=False)

    source_name = Column(String, nullable=False) # Open-Meteo, GDACS, AIS, Port Registry
    source_type = Column(String, nullable=False)

    status = Column(String, default="LIVE")
    data_timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    retrieved_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    weather_hazard = Column(String, default="LOW")
    geopolitical_risk = Column(Float, default=1.0)
    carrier_risk = Column(Float, default=0.12)
    fuel_index = Column(Float, default=1.0)
    port_congestion = Column(Float, default=0.87)

    metadata_json = Column(Text, nullable=True)


class PortSpatialModel(Base):
    __tablename__ = "ports"

    port_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    country = Column(String, nullable=True)
    unlocode = Column(String, unique=True, nullable=False)
    port_type = Column(String, default="CONTAINER_PORT")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    capacity = Column(Float, default=500000.0)
    current_congestion = Column(Float, default=0.25)
    geo_port_risk = Column(Float, default=0.15)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class MaritimeNodeModel(Base):
    __tablename__ = "maritime_nodes"

    node_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    node_type = Column(String, default="WAYPOINT") # WAYPOINT, CHOKE_POINT, PORT_APPROACH
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)


class MaritimeEdgeModel(Base):
    __tablename__ = "maritime_edges"

    edge_id = Column(Integer, primary_key=True, autoincrement=True)
    source = Column(Integer, nullable=False)
    target = Column(Integer, nullable=False)
    name = Column(String, nullable=True)
    distance_m = Column(Float, nullable=False)
    base_speed_knots = Column(Float, default=18.0)
    operational_stress = Column(Float, default=0.1)
    geo_risk = Column(Float, default=0.1)
    congestion = Column(Float, default=0.1)
    navigable = Column(Boolean, default=True)


# Create all tables if they do not exist
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"[Database] Schema create_all error: {e}")

