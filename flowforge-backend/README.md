# FlowForge Backend Intelligence Engine

FlowForge Backend is a high-performance Python FastAPI service delivering real-time marine telemetry, AI multi-agent disruption risk modeling, ETA predictions, route optimization, and cost impact calculations.

## 🏗 Project Architecture

```
flowforge-backend/
│
├── app/
│   ├── main.py                    # FastAPI application entrypoint & middleware setup
│   ├── config.py                  # Environment variable configuration & settings
│   │
│   ├── api/
│   │   └── routes.py              # Central REST API routes & endpoints
│   │
│   ├── agents/
│   │   ├── disruption_agent.py    # Evaluates weather hazards, typhoons, and port closures
│   │   ├── eta_agent.py           # Calculates sailing time, delays & confidence scores
│   │   ├── route_agent.py         # Performs vessel lookahead projection & corridor checks
│   │   ├── cost_agent.py          # Quantifies rerouting expenses, fuel consumption & demurrage
│   │   └── orchestrator.py        # Multi-agent master orchestrator & composite risk evaluation
│   │
│   ├── models/
│   │   ├── disruption_model.pkl   # Serialized ML model for disruption prediction
│   │   ├── eta_model.pkl          # Serialized ML model for ETA delay prediction
│   │   ├── route_model.pkl        # Serialized ML model for route optimization
│   │   └── cost_model.pkl         # Serialized ML model for logistics cost estimation
│   │
│   ├── services/
│   │   ├── weather_service.py     # Atmospheric, marine weather & tropical cyclone telemetry
│   │   ├── port_service.py        # Indian & Japanese port metrics and congestion monitoring
│   │   ├── ais_service.py         # Vessel positioning & AIS telemetry integration
│   │   └── live_data_service.py   # Telemetry aggregation & live feed ingestion
│   │
│   ├── schemas/
│   │   └── requests.py            # Pydantic data schemas for requests and responses
│   │
│   └── utils/
│       ├── __init__.py
│       └── helpers.py             # Math helper utilities (Haversine distance, bearings)
│
├── requirements.txt
├── .env
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment
Create or edit `.env` in the project root:
```env
PORT=8000
HOST=0.0.0.0
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=flowforge
```

### 3. Run Development Server
```bash
uvicorn app.main:app --reload --port 8000
```

Access the interactive API documentation at `http://localhost:8000/docs`.

## 🛰 Main API Endpoints

- `GET /` — API Status & Overview
- `GET /api/v1/health` — Health Check
- `POST /api/v1/disruption/assess` — Disruption Risk Assessment
- `POST /api/v1/eta/predict` — Vessel ETA Calculation & Delay Forecast
- `POST /api/v1/route/optimize` — Sea Lane Route Optimization & Lookahead
- `POST /api/v1/cost/calculate` — Rerouting Cost & Demurrage Analysis
- `POST /api/v1/orchestrate` — Multi-Agent Risk Orchestration
- `GET /api/v1/live-feed` — Real-Time Telemetry Data Ingestion
- `POST /api/v1/simulate` — Disruptive Logistics Simulation
