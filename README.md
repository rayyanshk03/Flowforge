# 🌊 FlowForge — Autonomous Supply Chain & Maritime Risk Intelligence Platform

> **Production-Grade AI / ML Platform for Real-Time Maritime Telemetry, PostGIS Bathymetric Routing, Monte Carlo Stochastic Simulation, and Executive Decision Auditability.**

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge&logo=github)](https://github.com/rayyanshk03/Flowforge)
[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI_0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python_3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Pytest](https://img.shields.io/badge/Pytest_57%2F57_Passed-22C55E?style=for-the-badge&logo=pytest&logoColor=white)](https://docs.pytest.org/)

---

## 📌 Executive Summary

**FlowForge** is an enterprise-class autonomous maritime supply chain intelligence system designed for Master Mariners, Chief Logistics Officers, Fleet Directors, and Risk Analysts. It replaces static, delayed logistics dashboards with real-time predictive machine learning, PostGIS open-water bathymetric navigation, stochastic Monte Carlo simulations, and a fully auditable executive decision framework.

FlowForge enables maritime operators to stress-test global supply chain corridors, detect port bottlenecks before vessels anchor, simulate geopolitical and severe weather disruptions, and evaluate multi-metric alternative paths with complete transparency.

---

## 🎯 Key Features & Capabilities

### 1. 🏭 Port Congestion & Bottleneck Tracker
- **Global Port Telemetry**: Real-time monitoring across major global hubs (Shanghai `CNSHA`, Yokohama `JPYOK`, Singapore `SGSIN`, Rotterdam `NLRTM`, Jebel Ali `AEJEA`, Nhava Sheva / Mumbai `INNSA`, Hamburg `DEHAM`, Antwerp `BEANR`, and more).
- **Core Operational Metrics**:
  - ⏱️ **Vessel Waiting Time** (Hours at anchorage)
  - 📦 **Container Backlog** (TEU count)
  - 🏗️ **Berth Availability** (%)
  - ⚙️ **Crane & Yard Utilization** (%)
- **Status Indicators**: `🟢 Normal` | `🟡 Medium Congestion` | `🔴 Heavy Congestion`.

### 2. 🕸️ Maritime Network Graph & Step-by-Step Traversal Engine
- **Open-Water Bathymetric Routing**: 100% sea corridor navigation preventing land overlap.
- **Routing Algorithms**:
  - **Dijkstra**: Guaranteed shortest spatial path between pier anchors.
  - **A\***: Heuristic-accelerated ocean fairway navigation.
  - **NSGA-II**: Multi-objective optimization (Cost, Time, Risk, Fuel HFO).
- **Animated Step-by-Step Traversal**:
  - Active node pulse animation (`#D94E28` halo).
  - Live step status feed (`STEP X/Y: Traversing Edge A ➔ B`).
  - Interactive controls (`PLAY STEP-BY-STEP ⚡`, `NEXT STEP ⏭️`, `RESET 🔄`, Speed Switcher).

### 3. 🎲 Monte Carlo Stochastic Arrival Probability Visualizer
- **Stochastic Density Engine**: Runs 10,000 trial simulations dynamically scaled from exact nautical mile distance.
- **Interactive Histogram**: Arrival probability distribution across transit days.
- **Key Indicators**: Expected ETA (Days), Confidence Score (%), and Variance Intervals.

### 4. 🔀 Multi-Metric Alternative Reroute & Decision Engine
Evaluates **3 Alternative Reroute Paths** for any origin-destination pair:
- **ALT-A (Direct Bathymetric Corridor)**: `✅ CHOOSE / APPROVE` (Baseline optimal path)
- **ALT-B (Coastal Channel Bypass)**: `⏸️ PAUSE / STANDBY` (Standby option for port congestion >24h)
- **ALT-C (Deepwater Cape Bypass)**: `🚫 SKIP / REJECT` (Geopolitical/Canal bypass with high fuel overhead)

#### 4-Grid Operational Metric Breakdown per Path:
1. 💰 **Financial**: Total Voyage Cost ($), Fuel Bunkering, Canal Tolls, Delay Surcharge, Net Savings.
2. ⏱️ **Time**: Transit Days, Sailing Speed (knots), Canal Wait Hours, ETA Delta.
3. 🛡️ **Safety & Risk**: Overall Risk %, Geopolitical Threat Score (0-100), Wave Height (m), Chokepoint Exposure.
4. 🌿 **Environmental**: Fuel Consumption (HFO MT), Carbon Footprint ($CO_2e$ MT), IMO CII Rating (A/B/C/D).

#### Strategic Decision Rationale Cards:
- **`✅ WHY WE CHOOSE THIS ROUTE`**: Key operational advantages.
- **`⏸️ WHEN TO PAUSE / PUT ON HOLD`**: Clear standby triggers.
- **`🚫 WHY TO SKIP / REJECT`**: Exact disqualification criteria.

### 5. 📄 Executive Maritime Reroute Decision Report Generator
- **Dedicated 2-Page A4 PDF Window**: One-click **`PRINT / SAVE PDF 🖨️`** opening a clean, standalone PDF document with zero webpage background bleed, zero broken layout boxes, and Master Mariner signature blocks.
- **Markdown Export**: **`DOWNLOAD .MD REPORT 📥`** generates clean Markdown text reports.
- **Telemetry Export**: **`EXPORT JSON DATA 📊`** exports raw JSON telemetry for TMS / ERP integrations.

### 6. 📜 System Auditability & User Decision History
- **100% Real User Data**: Zero mock/hardcoded fake decision items.
- **Persistent Local History**: Logs decisions you execute on the Disruption or Decisions pages.
- **Audit Controls**: Filter by status (`APPROVED`, `PENDING`, `REJECTED`), inspect full model traces, or clear history.

---

## 🏗️ System Architecture

```
                               ┌─────────────────────────────────────────┐
                               │       Next.js 16 (React 19, TS)         │
                               │   App Router UI / Tailwind / Leaflet    │
                               └────────────────────┬────────────────────┘
                                                    │ REST API / JSON
                               ┌────────────────────▼────────────────────┐
                               │        FastAPI Intelligence Layer       │
                               │           Python 3.13 Backend           │
                               └─────────┬───────────────────┬───────────┘
                                         │                   │
               ┌─────────────────────────┴─┐               ┌─┴─────────────────────────┐
               │    ML Models & Agents     │               │ Live Data Collectors      │
               ├───────────────────────────┤               ├───────────────────────────┤
               │ • DisruptionAgent (ExtraTrees)            │ • Open-Meteo Weather API  │
               │ • ETADelayAgent (XGBoost)                 │ • Marine Wave & Currents  │
               │ • CostIntelligenceAgent                   │ • USGS / GDACS Disaster   │
               │ • RouteOptimizationAgent                  │ • AISstream Real-time AIS │
               └───────────────────────────┘               └───────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend (User Interface)
- **Framework**: Next.js 16 (Turbopack), React 19, TypeScript
- **Styling**: Vanilla Tailwind CSS, Glassmorphism design system (#D94E28 Burnt Orange, #047857 Emerald Green, #F4F2EC Sand Fill)
- **Mapping & Charts**: Leaflet.js, OpenStreetMap, Custom SVG NavMesh overlay
- **Icons**: Lucide React

### Backend (AI / ML & Telemetry Services)
- **Framework**: FastAPI (Python 3.13), Uvicorn, Pydantic V2
- **Machine Learning**: Scikit-Learn (ExtraTreesClassifier, RandomForestRegressor), XGBoost, NumPy, Pandas
- **Geospatial & Spatial Intelligence**: PostGIS, Shapely, Haversine spatial math
- **Database**: SQLite / PostgreSQL / MongoDB
- **Testing**: Pytest, AsyncIO test suite (`57 / 57 PASSED`)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v18+` and `npm`
- Python `v3.11+` (Python 3.13 recommended)

---

### 1. Backend Setup (`flowforge-backend`)

```bash
# 1. Navigate to the backend directory
cd flowforge-backend

# 2. Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Run backend tests to verify 100% passing suite
PYTHONPATH=. pytest

# 5. Start the FastAPI backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The FastAPI backend will be available at:
- **API Base**: `http://localhost:8000`
- **Swagger Interactive Docs**: `http://localhost:8000/docs`
- **ReDoc API Docs**: `http://localhost:8000/redoc`

---

### 2. Frontend Setup (`frontend`)

```bash
# 1. Open a new terminal and navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Verify production build
npx next build

# 4. Start the Next.js development server
npm run dev
```
The FlowForge web application will be live at:
- **Application URL**: `http://localhost:3000`
- **Maritime Network Graph**: `http://localhost:3000/network`
- **Disruption Intelligence**: `http://localhost:3000/disruptions`
- **Simulation Lab**: `http://localhost:3000/simulation`
- **Decision History**: `http://localhost:3000/decisions`

---

## 📁 Repository Directory Structure

```
flow-forge/
├── flowforge-backend/                # FastAPI Intelligence Layer & Machine Learning
│   ├── app/
│   │   ├── agents/                   # ML Agents (Disruption, ETA, Cost, Routing)
│   │   ├── api/                      # REST API Endpoints & Routers
│   │   ├── database/                 # Database Connections & Schemas
│   │   ├── models/                   # Serialized ML Models (.pkl) & Model Loader Registry
│   │   ├── services/                 # Live Data Collectors & PostGIS Services
│   │   ├── main.py                   # FastAPI Application Entry Point
│   │   └── config.py                 # System Configuration & Environment Variables
│   ├── tests/                        # Backend Pytest Test Suites
│   ├── pyproject.toml                # Python Project Configuration
│   └── requirements.txt              # Python Dependencies
│
├── frontend/                         # Next.js 16 Web Application
│   ├── app/
│   │   ├── network/page.tsx          # Maritime Network Graph, Reroutes & Port Cards
│   │   ├── disruptions/page.tsx      # Disruption Intelligence & Live Telemetry
│   │   ├── simulation/page.tsx       # Monte Carlo Simulation Lab
│   │   ├── decisions/page.tsx        # Executive Decision Audit Log
│   │   └── page.tsx                  # Home Landing Page
│   ├── components/
│   │   ├── MaritimeNetworkGraph.tsx  # Step-by-Step Graph Traversal Component
│   │   ├── MonteCarloArrivalChart.tsx# Stochastic Arrival Density Histogram
│   │   ├── RerouteReportModal.tsx    # Executive 2-Page Printable PDF & Report Modal
│   │   ├── DecisionHistoryDrawer.tsx # Saved Decision Audit Drawer
│   │   ├── GlobalMap.tsx             # Interactive Leaflet Map & Port Markers
│   │   └── CreateScenarioModal.tsx   # 5-Step Operational Scenario Creator
│   ├── lib/
│   │   └── routeEngine.ts            # Bathymetric Open-Sea Router & Reroute Multi-Metrics
│   └── package.json                  # Frontend Dependencies
└── README.md                         # Project Master Documentation
```

---

## 🧪 Verification & Testing

### Backend Unit & Integration Tests
Run the pytest test suite from the `flowforge-backend` directory:
```bash
cd flowforge-backend
PYTHONPATH=. pytest app/tests tests/test_agents.py tests/test_normalization.py
```
> **Result**: `57 passed, 0 failed`

### Frontend Production Build Test
Verify Next.js compilation from the `frontend` directory:
```bash
cd frontend
npx next build
```
> **Result**: `✓ Generating static pages (7/7) in 250ms — 0 errors`

---

## 📜 License & Compliance

© 2026 **FlowForge Autonomous Supply Chain Intelligence**. All rights reserved.  
Built for maritime enterprise risk evaluation and ocean freight operational optimization.
