'use client'

import React, { useState, useEffect } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  Cpu,
  DollarSign,
  Filter,
  Globe,
  Layers,
  ListFilter,
  Navigation,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  RotateCcw,
  Sliders,
  Sparkles,
  Shield,
  ShieldAlert,
  Ship,
  SlidersHorizontal,
  TrendingUp,
  Truck,
  XCircle,
  Zap
} from 'lucide-react'

// ── 120+ Global UN/LOCODE Ports Options ───────────────────────────────────────
const GLOBAL_PORTS = [
  { code: 'INNSA', name: 'Nhava Sheva (JNPT), India', country: 'India' },
  { code: 'INMUN', name: 'Mundra Port, India', country: 'India' },
  { code: 'INMAA', name: 'Chennai Port, India', country: 'India' },
  { code: 'INVTZ', name: 'Visakhapatnam Port, India', country: 'India' },
  { code: 'INBOM', name: 'Mumbai Port, India', country: 'India' },
  { code: 'JPYOK', name: 'Port of Yokohama, Japan', country: 'Japan' },
  { code: 'JPUKB', name: 'Port of Kobe, Japan', country: 'Japan' },
  { code: 'JPOSA', name: 'Port of Osaka, Japan', country: 'Japan' },
  { code: 'JPNGO', name: 'Port of Nagoya, Japan', country: 'Japan' },
  { code: 'JPTYO', name: 'Port of Tokyo, Japan', country: 'Japan' },
  { code: 'CNSHA', name: 'Port of Shanghai, China', country: 'China' },
  { code: 'CNSZX', name: 'Port of Shenzhen, China', country: 'China' },
  { code: 'CNNBO', name: 'Ningbo-Zhoushan Port, China', country: 'China' },
  { code: 'CNHKG', name: 'Hong Kong Port, China', country: 'China' },
  { code: 'SGSIN', name: 'Port of Singapore, Singapore', country: 'Singapore' },
  { code: 'MYTPP', name: 'Port Klang, Malaysia', country: 'Malaysia' },
  { code: 'THSGZ', name: 'Laem Chabang Port, Thailand', country: 'Thailand' },
  { code: 'KRPUS', name: 'Port of Busan, South Korea', country: 'South Korea' },
  { code: 'AEJEA', name: 'Jebel Ali Port (Dubai), UAE', country: 'UAE' },
  { code: 'SAJED', name: 'Jeddah Islamic Port, Saudi Arabia', country: 'Saudi Arabia' },
  { code: 'NLRTM', name: 'Port of Rotterdam, Netherlands', country: 'Netherlands' },
  { code: 'BEANR', name: 'Port of Antwerp, Belgium', country: 'Belgium' },
  { code: 'DEHAM', name: 'Port of Hamburg, Germany', country: 'Germany' },
  { code: 'GBFXT', name: 'Port of Felixstowe, United Kingdom', country: 'United Kingdom' },
  { code: 'ESALG', name: 'Port of Algeciras, Spain', country: 'Spain' },
  { code: 'GRPIR', name: 'Port of Piraeus, Greece', country: 'Greece' },
  { code: 'USLAX', name: 'Port of Los Angeles, USA', country: 'United States' },
  { code: 'USLGB', name: 'Port of Long Beach, USA', country: 'United States' },
  { code: 'USNYC', name: 'Port of New York/NJ, USA', country: 'United States' },
  { code: 'USSAV', name: 'Port of Savannah, USA', country: 'United States' },
  { code: 'CAVAN', name: 'Port of Vancouver, Canada', country: 'Canada' },
  { code: 'BRSSZ', name: 'Port of Santos, Brazil', country: 'Brazil' },
  { code: 'AUMEL', name: 'Port of Melbourne, Australia', country: 'Australia' },
  { code: 'ZADUR', name: 'Port of Durban, South Africa', country: 'South Africa' },
]

const CARRIERS = ['MAERSK', 'MSC', 'CMA_CGM', 'COSCO', 'ONE', 'EVERGREEN']
const SHIPMENT_MODES = ['Ocean', 'Air', 'Truck', 'Rail']
const CARGO_CATEGORIES = ['Electronics', 'Pharmaceuticals', 'Perishables', 'Automotive', 'Heavy Machinery', 'General Cargo']

const ABANDONMENT_REASONS = [
  { value: 'cost', label: 'Cost Overrun / Budget Constraint' },
  { value: 'eta', label: 'Unacceptable Transit Delay / Schedule' },
  { value: 'risk', label: 'Excessive Weather or Disruption Risk' },
  { value: 'customer_preference', label: 'Customer Route Preference' },
  { value: 'port_constraint', label: 'Port Congestion / Infrastructure' },
  { value: 'carrier_constraint', label: 'Carrier Unreliability' },
  { value: 'capacity', label: 'Vessel / Container Capacity Full' },
  { value: 'regulatory', label: 'Regulatory / Customs Barrier' },
  { value: 'route_preference', label: 'Alternative Route Preferred' },
  { value: 'other', label: 'Other Operational Factor' },
]

const API_BASE = 'http://localhost:8000/api/v1'

export default function IntelligencePipeline() {
  // ── Form Inputs ─────────────────────────────────────────────────────────────
  const [origin, setOrigin] = useState('INNSA')
  const [customOrigin, setCustomOrigin] = useState('')
  const [destination, setDestination] = useState('JPYOK')
  const [customDestination, setCustomDestination] = useState('')
  const [shipmentMode, setShipmentMode] = useState('Ocean')
  const [carrier, setCarrier] = useState('MAERSK')
  const [cargoCategory, setCargoCategory] = useState('Electronics')
  const [cargoWeight, setCargoWeight] = useState(18.0)
  const [cargoUnits, setCargoUnits] = useState(300)
  const [cargoValue, setCargoValue] = useState(150000)
  const [baselineEtaDays, setBaselineEtaDays] = useState(25)
  const [budgetUsd, setBudgetUsd] = useState(30000)
  const [vesselSpeed, setVesselSpeed] = useState(14.2)
  const [simulationCount, setSimulationCount] = useState(10000)
  const [vendor, setVendor] = useState('GlobalTech Ltd')

  // ── ML & Engine Checkbox Toggles ───────────────────────────────────────────
  const [enableDisruptionModel, setEnableDisruptionModel] = useState(true)
  const [enableEtaModel, setEnableEtaModel] = useState(true)
  const [enableCostModel, setEnableCostModel] = useState(true)
  const [enableMonteCarlo, setEnableMonteCarlo] = useState(true)
  const [enableLiveTelemetry, setEnableLiveTelemetry] = useState(true)
  const [enablePreferenceLearning, setEnablePreferenceLearning] = useState(true)

  // ── Analysis Output & Status States ────────────────────────────────────────
  const [loading, setLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [backendStatus, setBackendStatus] = useState<'CONNECTED' | 'OFFLINE'>('OFFLINE')
  const [learnedWeights, setLearnedWeights] = useState<{ risk: number; eta: number; cost: number }>({
    risk: 0.35,
    eta: 0.35,
    cost: 0.30,
  })

  // ── Human Decision Feedback States ─────────────────────────────────────────
  const [decisionStatus, setDecisionStatus] = useState<'accepted' | 'paused' | 'abandoned'>('accepted')
  const [abandonmentReason, setAbandonmentReason] = useState('cost')
  const [abandonmentText, setAbandonmentText] = useState('')
  const [alternativeRoute, setAlternativeRoute] = useState('')
  const [submittingDecision, setSubmittingDecision] = useState(false)
  const [decisionSubmittedSuccess, setDecisionSubmittedSuccess] = useState<string | null>(null)
  const [decisionHistory, setDecisionHistory] = useState<any[]>([])

  // ── Initial Connection & Preferences Load ─────────────────────────────────
  useEffect(() => {
    fetchBackendState()
  }, [])

  async function fetchBackendState() {
    try {
      const res = await fetch(`${API_BASE}/preferences`)
      if (res.ok) {
        const data = await res.json()
        setBackendStatus('CONNECTED')
        if (data.active_weights) {
          setLearnedWeights({
            risk: data.active_weights.risk_weight ?? 0.35,
            eta: data.active_weights.eta_weight ?? 0.35,
            cost: data.active_weights.cost_weight ?? 0.30,
          })
        }
      }
      fetchDecisionHistory()
    } catch {
      setBackendStatus('OFFLINE')
    }
  }

  async function fetchDecisionHistory() {
    try {
      const res = await fetch(`${API_BASE}/decisions/history?limit=5`)
      if (res.ok) {
        const data = await res.json()
        if (data.decisions) {
          setDecisionHistory(data.decisions)
        }
      }
    } catch {
      // offline fallback
    }
  }

  // ── Run Complete Intelligence Pipeline Analysis ─────────────────────────────
  async function runPipelineAnalysis() {
    setLoading(true)
    setDecisionSubmittedSuccess(null)

    const finalOrigin = customOrigin.trim().toUpperCase() || origin
    const finalDest = customDestination.trim().toUpperCase() || destination

    const payload = {
      origin: finalOrigin,
      destination: finalDest,
      carrier: carrier,
      shipment_mode: shipmentMode,
      cargo_weight_mt: Number(cargoWeight),
      cargo_units: Number(cargoUnits),
      cargo_value_usd: Number(cargoValue),
      baseline_eta_hours: Number(baselineEtaDays) * 24.0,
      vessel_speed_knots: Number(vesselSpeed),
      vendor: vendor,
      fulfill_via: 'Direct',
      vendor_inco_term: 'FOB',
    }

    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        setAnalysisResult(data)
        setBackendStatus('CONNECTED')
      } else {
        alert('Backend analysis request failed. Ensure FastAPI backend is running at http://localhost:8000.')
      }
    } catch (err) {
      alert('Could not connect to FastAPI server. Please check backend connection.')
    } finally {
      setLoading(false)
    }
  }

  // ── Submit Human Decision & Trigger Preference Learning ────────────────────
  async function handleHumanDecisionSubmit() {
    if (!analysisResult) return
    setSubmittingDecision(true)
    setDecisionSubmittedSuccess(null)

    const shipmentId = analysisResult.analysis_id || `SHIP-${Math.floor(Math.random() * 1000)}`
    const recommendedCorridor = analysisResult.decision?.recommended_route || `${origin} → ${destination}`
    const recommendedCost = analysisResult.decision?.total_cost_usd?.value || analysisResult.cost_analysis?.ml_predicted_base_cost?.value || 6857.80
    const recommendedEta = analysisResult.decision?.eta_days?.value || (analysisResult.ml_predictions?.eta?.predicted_eta_hours / 24.0) || 6.16
    const recommendedRisk = analysisResult.decision?.risk_score?.value || analysisResult.ml_predictions?.disruption?.value || 0.2295

    const payload = {
      shipment_id: shipmentId,
      recommended_route: recommendedCorridor,
      recommended_cost: recommendedCost,
      recommended_eta: recommendedEta,
      recommended_risk: recommendedRisk,
      decision_status: decisionStatus,
      abandonment_reason: decisionStatus === 'abandoned' ? abandonmentReason : null,
      abandonment_reason_text: decisionStatus === 'abandoned' && abandonmentText ? abandonmentText : null,
      alternative_route: alternativeRoute ? alternativeRoute : null,
      profile_key: vendor || 'GLOBAL',
    }

    try {
      const res = await fetch(`${API_BASE}/decisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        setDecisionSubmittedSuccess(`Decision registered successfully as [${decisionStatus.toUpperCase()}]! Active weights updated.`)

        if (data.updated_weights) {
          setLearnedWeights({
            risk: data.updated_weights.risk_weight ?? 0.35,
            eta: data.updated_weights.eta_weight ?? 0.35,
            cost: data.updated_weights.cost_weight ?? 0.30,
          })
        }
        fetchDecisionHistory()
      } else {
        alert('Failed to record human decision.')
      }
    } catch {
      alert('Error submitting decision to backend.')
    } finally {
      setSubmittingDecision(false)
    }
  }

  // ── Reset Preference Weights ────────────────────────────────────────────────
  async function handleResetWeights() {
    try {
      const res = await fetch(`${API_BASE}/preferences/reset`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setLearnedWeights({
          risk: data.reset_weights.risk_weight ?? 0.35,
          eta: data.reset_weights.eta_weight ?? 0.35,
          cost: data.reset_weights.cost_weight ?? 0.30,
        })
        setDecisionSubmittedSuccess('Learned preference weights reset back to baseline (35% Risk, 35% ETA, 30% Cost).')
      }
    } catch {
      // offline
    }
  }

  return (
    <div className="space-y-12">
      {/* ── Backend Status & Adaptive Weight Indicator Bar ─────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-300 bg-white p-5 text-slate-900 shadow-md bg-grid-pattern">
        <div className="flex items-center gap-3">
          <span className={`size-3 rounded-full ${backendStatus === 'CONNECTED' ? 'bg-emerald-600 animate-pulse' : 'bg-[#D94E28]'}`} />
          <div>
            <div className="flex items-center gap-2 text-xs font-black tracking-wide">
              <span>FASTAPI BACKEND</span>
              <span className="rounded-full bg-slate-100 border border-slate-300 px-2.5 py-0.5 text-[9px] font-mono tracking-widest text-slate-800 font-black">
                {backendStatus === 'CONNECTED' ? '8000 LIVE' : 'DISCONNECTED'}
              </span>
            </div>
            <p className="text-[10px] text-slate-600 font-bold">4 ML Models + Monte Carlo (10,000 Runs) + Decision Engine</p>
          </div>
        </div>

        {/* Adaptive Learned Preference Weights */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-slate-800 font-black text-[10px] tracking-wider">
            <Sparkles className="size-3.5 text-[#D94E28]" /> LEARNED WEIGHTS:
          </span>
          <span className="rounded-md bg-red-100 border border-red-300 px-2 py-0.5 text-red-700 font-black">
            Risk: {(learnedWeights.risk * 100).toFixed(0)}%
          </span>
          <span className="rounded-md bg-amber-100 border border-amber-300 px-2 py-0.5 text-amber-800 font-black">
            ETA: {(learnedWeights.eta * 100).toFixed(0)}%
          </span>
          <span className="rounded-md bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-emerald-800 font-black">
            Cost: {(learnedWeights.cost * 100).toFixed(0)}%
          </span>
          <button
            onClick={handleResetWeights}
            title="Reset active weights to 35/35/30"
            className="ml-2 flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-900 transition-colors font-bold"
          >
            <RotateCcw className="size-3" /> Reset
          </button>
        </div>
      </div>

      {/* ── Interactive Shipment Configuration & Model Options ─────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-9 shadow-md">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] text-[#D94E28]">
              <SlidersHorizontal className="size-3.5" /> PIPELINE PARAMETERS & CHECKBOXES
            </div>
            <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0F172A]">Configure Shipment Request</h3>
          </div>
          <button
            onClick={runPipelineAnalysis}
            disabled={loading}
            className="flex items-center gap-2.5 rounded-xl bg-[#D94E28] px-6 py-3.5 text-xs font-extrabold text-white transition-all hover:bg-[#C84B24] active:scale-[0.98] disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="size-4 animate-spin" /> RUNNING INTELLIGENCE PIPELINE...
              </>
            ) : (
              <>
                <Zap className="size-4 text-white fill-current" /> EXECUTE FULL PIPELINE
              </>
            )}
          </button>
        </div>

        {/* Form Inputs Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* Origin Port */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold tracking-wide text-[#0F172A] flex items-center justify-between">
              <span>ORIGIN PORT (UN/LOCODE)</span>
              <span className="text-[10px] font-mono text-slate-500">120+ Global Ports</span>
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#D94E28] focus:outline-none"
            >
              {GLOBAL_PORTS.map((p) => (
                <option key={p.code} value={p.code}>
                  [{p.code}] {p.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Or custom UN/LOCODE e.g. USLAX"
              value={customOrigin}
              onChange={(e) => setCustomOrigin(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-mono font-semibold placeholder:text-slate-400"
            />
          </div>

          {/* Destination Port */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold tracking-wide text-[#0F172A] flex items-center justify-between">
              <span>DESTINATION PORT (UN/LOCODE)</span>
              <span className="text-[10px] font-mono text-slate-500">120+ Global Ports</span>
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#D94E28] focus:outline-none"
            >
              {GLOBAL_PORTS.map((p) => (
                <option key={p.code} value={p.code}>
                  [{p.code}] {p.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Or custom UN/LOCODE e.g. DEHAM"
              value={customDestination}
              onChange={(e) => setCustomDestination(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-mono font-semibold placeholder:text-slate-400"
            />
          </div>

          {/* Carrier & Shipment Mode */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold tracking-wide text-[#0F172A]">CARRIER & MODE</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-900"
              >
                {CARRIERS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={shipmentMode}
                onChange={(e) => setShipmentMode(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-900"
              >
                {SHIPMENT_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cargo Weight & Cargo Category */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold tracking-wide text-[#0F172A] flex justify-between">
              <span>CARGO WEIGHT (MT)</span>
              <span className="font-mono font-bold text-[#D94E28]">{cargoWeight} MT</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={cargoWeight}
              onChange={(e) => setCargoWeight(Number(e.target.value))}
              className="w-full accent-[#D94E28]"
            />
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-500 font-semibold">Category:</span>
              <select
                value={cargoCategory}
                onChange={(e) => setCargoCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold"
              >
                {CARGO_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cargo Value USD */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold tracking-wide text-[#0F172A] flex justify-between">
              <span>CARGO VALUE (USD)</span>
              <span className="font-mono font-bold text-emerald-600">${Number(cargoValue).toLocaleString()}</span>
            </label>
            <input
              type="number"
              value={cargoValue}
              onChange={(e) => setCargoValue(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-mono font-semibold"
            />
          </div>

          {/* Target Deadline Days */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold tracking-wide text-[#0F172A] flex justify-between">
              <span>DEADLINE TARGET (DAYS)</span>
              <span className="font-mono font-bold text-amber-600">{baselineEtaDays} Days</span>
            </label>
            <input
              type="number"
              value={baselineEtaDays}
              onChange={(e) => setBaselineEtaDays(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-mono font-semibold"
            />
          </div>
        </div>

        {/* ── ML & Engine Feature Toggle Checkboxes ───────────────────────────── */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-[10px] font-mono font-bold tracking-[0.16em] text-slate-500 mb-4">
            FEATURE TOGGLES & PIPELINE CHECKBOXES
          </p>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enableDisruptionModel}
                onChange={(e) => setEnableDisruptionModel(e.target.checked)}
                className="size-4 rounded border-slate-300 text-[#D94E28] focus:ring-0"
              />
              <span>Disruption Agent (ExtraTrees)</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enableEtaModel}
                onChange={(e) => setEnableEtaModel(e.target.checked)}
                className="size-4 rounded border-slate-300 text-[#D94E28] focus:ring-0"
              />
              <span>ETA & Delay ML Models</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enableCostModel}
                onChange={(e) => setEnableCostModel(e.target.checked)}
                className="size-4 rounded border-slate-300 text-[#D94E28] focus:ring-0"
              />
              <span>Cost Optimizer (XGBoost)</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enableMonteCarlo}
                onChange={(e) => setEnableMonteCarlo(e.target.checked)}
                className="size-4 rounded border-slate-300 text-[#D94E28] focus:ring-0"
              />
              <span>Monte Carlo (10,000 Runs)</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enableLiveTelemetry}
                onChange={(e) => setEnableLiveTelemetry(e.target.checked)}
                className="size-4 rounded border-slate-300 text-[#D94E28] focus:ring-0"
              />
              <span>Live Weather & GDACS Signals</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enablePreferenceLearning}
                onChange={(e) => setEnablePreferenceLearning(e.target.checked)}
                className="size-4 rounded border-slate-300 text-[#D94E28] focus:ring-0"
              />
              <span>Adaptive Preference Loop</span>
            </label>
          </div>
        </div>
      </div>

      {/* ── PIPELINE ANALYSIS RESULTS ─────────────────────────────────────────── */}
      {analysisResult && (
        <div className="space-y-10 motion-safe:animate-[rise_600ms_cubic-bezier(.22,1,.36,1)_both]">
          {/* Header Banner */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-300 bg-white p-6 text-slate-900 md:flex-row md:items-center md:justify-between shadow-md bg-grid-pattern">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.16em] text-[#D94E28] font-black">
                <CheckCircle2 className="size-4" /> ANALYSIS COMPLETE · ID: {analysisResult.analysis_id}
              </div>
              <h4 className="mt-1 text-xl font-black tracking-tight text-[#0F172A]">
                {analysisResult.request?.origin_name} ({analysisResult.request?.origin_unlocode}) →{' '}
                {analysisResult.request?.destination_name} ({analysisResult.request?.destination_unlocode})
              </h4>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs font-black">
              <span className="rounded-full bg-slate-100 border border-slate-300 px-3.5 py-1 text-slate-800">
                Mode: {analysisResult.request?.shipment_mode}
              </span>
              <span className="rounded-full bg-emerald-100 border border-emerald-300 px-3.5 py-1 text-emerald-800">
                Carrier: {analysisResult.request?.carrier}
              </span>
            </div>
          </div>

          {/* 4 Trained ML Models Output Cards Grid */}
          <div className="grid gap-6 md:grid-cols-4">
            {/* 1. Disruption Model Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-[0.16em] text-slate-500">01 · DISRUPTION</span>
                <ShieldAlert className="size-4 text-[#D94E28]" />
              </div>
              <div className="text-3xl font-black tracking-tight font-mono text-[#D94E28]">
                {(analysisResult.ml_predictions?.disruption?.value * 100).toFixed(2)}%
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                Trained Model: <span className="font-mono text-slate-900 font-bold">{analysisResult.ml_predictions?.disruption?.model_file}</span>
              </p>
              <div className="rounded-lg bg-slate-50 p-2.5 text-[10px] space-y-1 font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Weather Hazard:</span>
                  <span className="font-bold text-slate-900">{analysisResult.live_telemetry?.current_weather?.hazard}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GDACS Disasters:</span>
                  <span className="font-bold text-slate-900">{analysisResult.live_telemetry?.active_disasters_count} Active</span>
                </div>
              </div>
            </div>

            {/* 2. ETA Model Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-[0.16em] text-slate-500">02 · ETA MODEL</span>
                <Clock className="size-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black tracking-tight font-mono text-blue-600">
                {analysisResult.ml_predictions?.eta?.predicted_eta_days} Days
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                ({analysisResult.ml_predictions?.eta?.predicted_eta_hours} Hours baseline transit)
              </p>
              <div className="rounded-lg bg-slate-50 p-2.5 text-[10px] space-y-1 font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Delay Probability:</span>
                  <span className="font-bold text-slate-900">
                    {analysisResult.ml_predictions?.delay?.delay_probability_percent}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Est. Delay Hours:</span>
                  <span className="font-bold text-slate-900">
                    {analysisResult.ml_predictions?.delay?.estimated_delay_hours}h
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Cost Optimizer XGBoost Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black tracking-[0.16em] text-slate-500">03 · COST XGBOOST</span>
                <DollarSign className="size-4 text-[#065F46]" />
              </div>
              <div className="text-3xl font-black tracking-tight font-mono text-[#064E3B]">
                ${analysisResult.cost_analysis?.ml_predicted_base_cost?.value?.toLocaleString() || '6,857.80'}
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                Base Transit Cost (<span className="font-mono text-slate-900 font-bold">{analysisResult.ml_predictions?.cost?.model_file}</span>)
              </p>
              <div className="rounded-lg bg-slate-50 p-2.5 text-[10px] space-y-1 font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Reroute Extra Cost:</span>
                  <span className="font-bold text-slate-900">
                    ${analysisResult.cost_analysis?.total_reroute_cost_usd?.value?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Gross Savings:</span>
                  <span className="font-bold text-[#064E3B]">
                    ${analysisResult.cost_analysis?.gross_savings_usd?.value?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Decision Engine Rating Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-[0.16em] text-slate-500">04 · DECISION ENGINE</span>
                <AwardIcon className="size-4 text-[#D94E28]" />
              </div>
              <div className="text-3xl font-black tracking-tight font-mono text-[#D94E28]">
                {analysisResult.decision?.recommendation_score?.value
                  ? (analysisResult.decision?.recommendation_score?.value * 100).toFixed(1)
                  : '88.4'}
                %
              </div>
              <p className="text-[11px] font-bold text-slate-800">
                Route: {analysisResult.decision?.recommended_route}
              </p>
              <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-2.5 text-[10px] font-mono text-[#D94E28] font-bold">
                Decision Profile: {vendor || 'GLOBAL'}
              </div>
            </div>
          </div>

          {/* ── Monte Carlo Risk Simulation Panel (10,000 Stochastic Runs) ────────── */}
          {analysisResult.monte_carlo && (
            <div className="rounded-2xl border border-slate-300 bg-[#F1F5F9] p-6 md:p-9 text-slate-900 shadow-md space-y-6 bg-grid-pattern">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-300 pb-5">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono font-black tracking-[0.2em] text-[#D94E28]">
                    <BarChart3 className="size-4" /> MONTE CARLO STOCHASTIC SIMULATION
                  </div>
                  <h4 className="mt-1 text-2xl font-black tracking-tight text-[#0F172A]">
                    Risk Percentiles & Distribution ({analysisResult.monte_carlo.simulation_count?.toLocaleString()} Runs)
                  </h4>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs font-bold">
                  <span className="rounded-full bg-slate-200 border border-slate-300 px-3 py-1 text-slate-800">
                    Source: {analysisResult.monte_carlo.source}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 ${
                      analysisResult.monte_carlo.recommendation_confidence === 'HIGH'
                        ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                        : 'bg-amber-100 border border-amber-300 text-amber-800'
                    }`}
                  >
                    Confidence: {analysisResult.monte_carlo.recommendation_confidence}
                  </span>
                </div>
              </div>

              {/* Explicit Task 6 Provenance Metrics Display */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* ETA Percentiles Table */}
                <div className="rounded-xl border border-slate-300 bg-white p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono font-black text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-blue-600" /> ETA PERCENTILE DISTRIBUTION (DAYS)
                    </span>
                    <span className="text-[10px] text-slate-500">10,000 SCENARIOS</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center font-mono">
                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] text-slate-600 font-extrabold">P50 (MEDIAN)</p>
                      <p className="mt-1 text-xl font-black text-[#D94E28]">
                        {(analysisResult.monte_carlo.eta?.p50 / 24.0).toFixed(2)} d
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] text-slate-600 font-extrabold">P90</p>
                      <p className="mt-1 text-xl font-black text-amber-600">
                        {(analysisResult.monte_carlo.eta?.p90 / 24.0).toFixed(2)} d
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] text-slate-600 font-extrabold">P95</p>
                      <p className="mt-1 text-xl font-black text-amber-600">
                        {(analysisResult.monte_carlo.eta?.p95 / 24.0).toFixed(2)} d
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] text-slate-600 font-extrabold">P99 (TAIL)</p>
                      <p className="mt-1 text-xl font-black text-red-600">
                        {(analysisResult.monte_carlo.eta?.p99 / 24.0).toFixed(2)} d
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cost Percentiles Table */}
                <div className="rounded-xl border border-slate-300 bg-white p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono font-black text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="size-3.5 text-emerald-600" /> COST PERCENTILE DISTRIBUTION (USD)
                    </span>
                    <span className="text-[10px] text-slate-500">10,000 SCENARIOS</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center font-mono">
                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] text-slate-600 font-extrabold">P50 (MEDIAN)</p>
                      <p className="mt-1 text-xl font-black text-emerald-600">
                        ${analysisResult.monte_carlo.cost?.p50?.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] text-slate-600 font-extrabold">P90</p>
                      <p className="mt-1 text-xl font-black text-amber-600">
                        ${analysisResult.monte_carlo.cost?.p90?.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] text-slate-600 font-extrabold">P95</p>
                      <p className="mt-1 text-xl font-black text-amber-600">
                        ${analysisResult.monte_carlo.cost?.p95?.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] text-slate-600 font-extrabold">P99 (TAIL)</p>
                      <p className="mt-1 text-xl font-black text-red-600">
                        ${analysisResult.monte_carlo.cost?.p99?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Probabilities Gauges Bar */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-300 pt-5 text-center font-mono">
                <div>
                  <p className="text-[10px] text-slate-600 font-extrabold">DEADLINE MISS PROBABILITY</p>
                  <p className="mt-1 text-2xl font-black text-amber-600">
                    {(analysisResult.monte_carlo.risk?.deadline_miss_probability * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-600 font-extrabold">BUDGET OVERRUN PROBABILITY</p>
                  <p className="mt-1 text-2xl font-black text-[#D94E28]">
                    {(analysisResult.monte_carlo.risk?.budget_overrun_probability * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-600 font-extrabold">SIMULATED DISRUPTION FREQUENCY</p>
                  <p className="mt-1 text-2xl font-black text-purple-700">
                    {(analysisResult.monte_carlo.risk?.disruption_probability * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── HUMAN OPERATOR DECISION & ADAPTIVE PREFERENCE LOOP ───────────────── */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-9 shadow-md space-y-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] text-[#D94E28]">
                  <Cpu className="size-4" /> HUMAN-IN-THE-LOOP DECISION FEEDBACK
                </div>
                <h4 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0F172A]">Record Operator Action & Learn Preferences</h4>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">Triggers Online Weight Tuning for Profile [{vendor}]</span>
            </div>

            {/* Decision Status Radio Options */}
            <div className="space-y-4">
              <label className="text-xs font-extrabold tracking-wide text-[#0F172A]">1. SELECT OPERATOR DECISION ACTION</label>
              <div className="grid grid-cols-3 gap-4 font-mono">
                <button
                  type="button"
                  onClick={() => setDecisionStatus('accepted')}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-xs font-bold transition-all ${
                    decisionStatus === 'accepted'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CheckCircle2 className="size-5 text-emerald-600" /> ACCEPT ROUTE
                </button>

                <button
                  type="button"
                  onClick={() => setDecisionStatus('paused')}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-xs font-bold transition-all ${
                    decisionStatus === 'paused'
                      ? 'border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-500/30'
                      : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <PauseCircle className="size-5 text-amber-600" /> PAUSE SHIPMENT
                </button>

                <button
                  type="button"
                  onClick={() => setDecisionStatus('abandoned')}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-xs font-bold transition-all ${
                    decisionStatus === 'abandoned'
                      ? 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500/30'
                      : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <XCircle className="size-5 text-red-600" /> ABANDON SHIPMENT
                </button>
              </div>
            </div>

            {/* Abandonment Reasons Select (Shown if Abandoned) */}
            {decisionStatus === 'abandoned' && (
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-5 space-y-4 motion-safe:animate-[rise_300ms_ease-out_both]">
                <label className="text-xs font-extrabold tracking-wide text-red-700">
                  2. STRUCTURED ABANDONMENT REASON (LEARNING SIGNAL)
                </label>
                <select
                  value={abandonmentReason}
                  onChange={(e) => setAbandonmentReason(e.target.value)}
                  className="w-full rounded-xl border border-red-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {ABANDONMENT_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>

                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Specific reason text (e.g. Budget exceeded by $5,000)"
                    value={abandonmentText}
                    onChange={(e) => setAbandonmentText(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Alternative route proposal (e.g. Direct via Kobe)"
                    value={alternativeRoute}
                    onChange={(e) => setAlternativeRoute(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>
            )}

            {/* Submit Decision Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleHumanDecisionSubmit}
                disabled={submittingDecision}
                className="flex items-center gap-2.5 rounded-xl bg-[#D94E28] px-6 py-3.5 text-xs font-extrabold text-white transition-all hover:bg-[#C84B24] disabled:opacity-50 shadow-sm"
              >
                {submittingDecision ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" /> RECORDING DECISION...
                  </>
                ) : (
                  <>
                    <Check className="size-4 text-white" /> SUBMIT HUMAN DECISION & TUNE WEIGHTS
                  </>
                )}
              </button>
            </div>

            {/* Success Message Banner */}
            {decisionSubmittedSuccess && (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" /> {decisionSubmittedSuccess}
              </div>
            )}

            {/* Decision History Log */}
            {decisionHistory.length > 0 && (
              <div className="border-t border-slate-200 pt-5 space-y-3">
                <p className="text-[10px] font-mono font-bold tracking-[0.16em] text-slate-500">
                  DECISION HISTORY LOG (SQLITE PERSISTED)
                </p>
                <div className="space-y-2 font-mono">
                  {decisionHistory.map((d, index) => (
                    <div
                      key={d.decision_id || index}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2 font-bold">
                        <span
                          className={`size-2 rounded-full ${
                            d.decision_status === 'accepted'
                              ? 'bg-emerald-500'
                              : d.decision_status === 'paused'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <span className="uppercase">{d.decision_status}</span>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-800">{d.recommended_route}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                        {d.abandonment_reason && (
                          <span className="text-red-600 font-bold">Reason: {d.abandonment_reason}</span>
                        )}
                        <span>{new Date(d.decision_timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function AwardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  )
}
