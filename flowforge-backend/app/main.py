import os
import logging
from typing import Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

try:
    from app.api.routes import router as api_router
    from app.api.health import router as health_router
    from app.api.decisions import router as decisions_router
    from app.config import PORT, HOST
    from app.utils.logger import logger
    from app.models.model_loader import model_registry
except ImportError:
    from api.routes import router as api_router
    from api.health import router as health_router
    from api.decisions import router as decisions_router
    from config import PORT, HOST
    from utils.logger import logger
    from models.model_loader import model_registry

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing FlowForge Backend Intelligence Services & Model Registry...")
    yield
    logger.info("FlowForge Backend Intelligence Services shutting down gracefully.")

app = FastAPI(
    title="FlowForge Intelligence Layer API",
    description=(
        "Production-grade FastAPI backend for FlowForge AI Supply Chain Intelligence.\n\n"
        "Exposes ML prediction endpoints (Disruption, ETA, Cost), real-time telemetry ingestion "
        "(Open-Meteo, GDACS), route optimization, and deterministic decision engine."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,http://localhost:8000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Error Handling — Request Validation Errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    error_msg = f"Request validation failed for {request.method} {request.url.path}"
    if errors:
        first_err = errors[0]
        field_loc = " -> ".join([str(loc) for loc in first_err.get("loc", [])])
        error_msg = f"Validation error at '{field_loc}': {first_err.get('msg')}"

    # Sanitize errors: Pydantic v2 may embed non-serializable Exception objects in ctx["error"]
    safe_errors = []
    for err in errors:
        safe_err = {k: v for k, v in err.items() if k != "ctx"}
        if "ctx" in err:
            safe_err["ctx"] = {
                ck: str(cv) if isinstance(cv, Exception) else cv
                for ck, cv in err["ctx"].items()
            }
        safe_errors.append(safe_err)

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "VALIDATION_ERROR",
            "message": error_msg,
            "details": safe_errors,
            "path": str(request.url.path)
        }
    )

# Error Handling — HTTP Exceptions
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP_ERROR",
            "message": exc.detail,
            "path": str(request.url.path)
        }
    )

# Global Unhandled Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred during prediction or telemetry processing.",
            "path": str(request.url.path)
        }
    )

# Include Routers
from app.api.route_optimizer import router as routes_router
app.include_router(health_router)
app.include_router(api_router)
app.include_router(decisions_router)
app.include_router(routes_router)

# Database Health Check Endpoint
from app.database import get_db
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import Depends

@app.get("/health/database", tags=["Overview"])
def database_health(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1")).scalar()
    db_type = "postgresql" if "postgresql" in str(db.bind.url) else "sqlite"
    return {
        "database": "connected",
        "engine": db_type,
        "result": result
    }

@app.get("/api/v1/spatial/candidate-ports", tags=["Spatial Intelligence"])
def get_spatial_candidate_ports(
    origin: str = "INNSA",
    destination: str = "NLRTM",
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    radius_nm: float = 300.0,
    db: Session = Depends(get_db)
):
    from app.services.postgis_service import postgis_port_service
    if lat is not None and lon is not None:
        ports = postgis_port_service.find_candidate_ports_near_coords(lat, lon, radius_nm=radius_nm, db_session=db)
    else:
        ports = postgis_port_service.get_corridor_candidate_ports(origin, destination, max_detour_nm=radius_nm, db_session=db)
    return {
        "spatial_engine": "POSTGIS_ST_DWITHIN" if postgis_port_service.postgis_enabled else "HAVERSINE_SPATIAL",
        "postgis_enabled": postgis_port_service.postgis_enabled,
        "query_parameters": {"origin": origin, "destination": destination, "lat": lat, "lon": lon, "radius_nm": radius_nm},
        "candidate_ports_count": len(ports),
        "candidate_ports": ports
    }

@app.get("/", tags=["Overview"])
async def root():
    return {
        "system": "FlowForge Backend Intelligence API",
        "status": "OPERATIONAL",
        "version": "1.0.0",
        "swagger_docs": "/docs",
        "redoc_docs": "/redoc",
        "health_check": "/health",
        "database_health": "/health/database",
        "spatial_candidate_ports": "/api/v1/spatial/candidate-ports",
        "system_status": "/api/v1/system/status",
        "model_status": "/api/v1/models/status"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)
