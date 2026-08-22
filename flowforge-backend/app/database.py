import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, String, Float, Integer, Boolean, DateTime, Text, text
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime, timezone

# Load environment variables from .env
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/flowforge"

# Fallback to local SQLite if PostgreSQL connection fails
SQLITE_FALLBACK_URL = "sqlite:///./app/database/flowforge_memory.db"

def get_engine():
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        # Quick ping test
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return engine
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


# ── FlowForge Core Business Object ORM Models ──────────────────────────────────

class ShipmentModel(Base):
    __tablename__ = "shipments"

    id = Column(String, primary_key=True)
    origin_unlocode = Column(String, nullable=False)
    destination_unlocode = Column(String, nullable=False)
    cargo_weight_mt = Column(Float, default=0.0)
    cargo_value_usd = Column(Float, default=0.0)
    carrier_code = Column(String, default="MAERSK")
    shipment_mode = Column(String, default="Ocean")
    status = Column(String, default="IN_TRANSIT")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class RouteModel(Base):
    __tablename__ = "routes"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    distance_nm = Column(Float, default=0.0)
    transit_hours = Column(Float, default=0.0)
    risk_score = Column(Float, default=0.0)
    status = Column(String, default="ACTIVE")


class VehicleModel(Base):
    __tablename__ = "vehicles"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String, default="CONTAINER_VESSEL")
    capacity_teu = Column(Integer, default=18000)
    speed_knots = Column(Float, default=18.5)
    lat = Column(Float, default=0.0)
    lon = Column(Float, default=0.0)
    status = Column(String, default="UNDERWAY")


class DisruptionModel(Base):
    __tablename__ = "disruptions"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    severity = Column(String, default="HIGH")
    probability = Column(Float, default=0.73)
    expected_duration_hours = Column(Float, default=48.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class PredictionModel(Base):
    __tablename__ = "predictions"

    id = Column(String, primary_key=True)
    shipment_id = Column(String, nullable=False)
    predicted_eta_hours = Column(Float, default=0.0)
    predicted_cost_usd = Column(Float, default=0.0)
    delay_probability = Column(Float, default=0.0)
    model_version = Column(String, default="XGBoost 2.1.0")


class OptimizationRunModel(Base):
    __tablename__ = "optimization_runs"

    id = Column(String, primary_key=True)
    scenario_name = Column(String, nullable=False)
    recommended_route = Column(String, nullable=False)
    loss_avoided_usd = Column(Float, default=0.0)
    confidence = Column(Float, default=0.91)
    run_timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class DecisionModel(Base):
    __tablename__ = "decisions"

    id = Column(String, primary_key=True)
    decision_id = Column(String, nullable=False)
    simulation_id = Column(String, default="SIM-9281")
    disruption_id = Column(String, default="ROTTERDAM")
    action = Column(String, nullable=False) # APPROVE, REJECT, PAUSE, SKIP, OVERRIDE
    reason_category = Column(String, nullable=True)
    reason_subcategory = Column(String, nullable=True)
    reason_text = Column(Text, nullable=True)
    recommended_strategy_id = Column(String, default="Antwerp")
    selected_strategy_id = Column(String, default="Antwerp")
    resume_condition = Column(String, nullable=True)
    status = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class SimulationModel(Base):
    __tablename__ = "simulations"

    id = Column(String, primary_key=True)
    runs_count = Column(Integer, default=10000)
    p50_eta_hours = Column(Float, default=0.0)
    p90_eta_hours = Column(Float, default=0.0)
    p95_eta_hours = Column(Float, default=0.0)
    p50_cost_usd = Column(Float, default=0.0)
    p90_cost_usd = Column(Float, default=0.0)
    seed = Column(Integer, default=42)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class TelemetryModel(Base):
    __tablename__ = "telemetry"

    id = Column(String, primary_key=True)
    source = Column(String, nullable=False) # AIS, OPEN_METEO, GDACS, MSIL
    data_type = Column(String, nullable=False)
    payload_json = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, nullable=False, unique=True)
    role = Column(String, default="LOGISTICS_OPERATOR")
    team = Column(String, default="GLOBAL_OPERATIONS")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


# Create all tables if they do not exist
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"[Database] Schema create_all error: {e}")
