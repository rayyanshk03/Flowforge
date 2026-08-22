'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  AlertTriangle,
  Activity,
  Award,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  Cpu,
  Database,
  DollarSign,
  Eye,
  Filter,
  Globe2,
  History,
  Layers,
  MapPin,
  Menu,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  ShieldAlert,
  Ship,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Truck,
  Warehouse,
  X
} from 'lucide-react'
import DecisionHistoryDrawer from '@/components/DecisionHistoryDrawer'
import SystemSettingsModal from '@/components/SystemSettingsModal'
import DecisionReasonModal, { ActionType } from '@/components/DecisionReasonModal'
import CreateScenarioModal from '@/components/CreateScenarioModal'

export default function DecisionsPage() {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const [backendStatus, setBackendStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED')
  const [decisionState, setDecisionState] = useState<'PROPOSED' | 'APPROVED' | 'REJECTED' | 'PAUSED' | 'SKIPPED' | 'OVERRIDDEN'>('PROPOSED')
  const [activeActionModal, setActiveActionModal] = useState<ActionType | null>(null)
  const [submittedOutcome, setSubmittedOutcome] = useState<any | null>(null)
  const [showTrace, setShowTrace] = useState(false)
  const [lastAnalysisTime, setLastAnalysisTime] = useState('14:08:32')

  const [analysisData, setAnalysisData] = useState<any | null>(null)
  const [scenarioInput, setScenarioInput] = useState<any | null>(null)

  const loadAnalysisData = () => {
    if (typeof window === 'undefined') return
    const storedRes = sessionStorage.getItem('flowforge_analysis_result')
    const storedInput = sessionStorage.getItem('flowforge_scenario_input')
    if (storedRes) {
      try { setAnalysisData(JSON.parse(storedRes)) } catch {}
    }
    if (storedInput) {
      try { setScenarioInput(JSON.parse(storedInput)) } catch {}
    }
  }

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch('http://localhost:8000/health')
        if (res.ok) setBackendStatus('CONNECTED')
      } catch {
        setBackendStatus('DISCONNECTED')
      }
      loadAnalysisData()
    }
    checkBackend()

    const handleUpdate = () => loadAnalysisData()
    window.addEventListener('flowforge_analysis_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('flowforge_analysis_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const handleOutcomeSuccess = (outcome: any) => {
    setSubmittedOutcome(outcome)
    const actionStatusMap: Record<string, typeof decisionState> = {
      APPROVE: 'APPROVED',
      REJECT: 'REJECTED',
      PAUSE: 'PAUSED',
      SKIP: 'SKIPPED',
      OVERRIDE: 'OVERRIDDEN'
    }
    setDecisionState(actionStatusMap[outcome.action] || 'APPROVED')
  }

  // Decision drivers
  const decisionDrivers = [
    { name: 'PORT CONGESTION (NLRTM)', impact: '+32% risk contribution' },
    { name: 'VESSEL BACKLOG QUEUE', impact: '+21% risk contribution' },
    { name: 'NORTH SEA WEATHER ANOMALY', impact: '+18% risk contribution' },
    { name: 'ANTWERP ALTERNATIVE CAPACITY', impact: '-14% risk contribution' },
    { name: 'DIVERSION ROUTE TRANSPORT COST', impact: '-7% risk contribution' }
  ]

  // Execution steps
  const executionSteps = [
    { step: '01', action: 'REROUTE', detail: '142 shipments via Antwerp (BEANR) cross-dock hub.' },
    { step: '02', action: 'UPDATE', detail: '18 ocean vessel feeder schedules & arrival windows.' },
    { step: '03', action: 'REALLOCATE', detail: '6 regional warehouse cross-dock buffer slots.' },
    { step: '04', action: 'NOTIFY', detail: '23 downstream tier 1 enterprise distribution points.' },
    { step: '05', action: 'MONITOR', detail: 'Updated Antwerp corridor telemetry continuously.' }
  ]

  // Decision Audit Timeline
  const decisionTimeline = [
    { time: '14:02:11', event: 'Rotterdam Port congestion disruption detected (87%).', status: 'CRITICAL' },
    { time: '14:04:40', event: 'Impact assessment completed (142 shipments exposed).', status: 'COMPLETED' },
    { time: '14:05:12', event: 'Baseline corridor risk updated to 73%.', status: 'COMPLETED' },
    { time: '14:06:30', event: '10,000 Monte Carlo stochastic scenarios initiated.', status: 'COMPLETED' },
    { time: '14:07:45', event: '3 alternative routing candidates evaluated.', status: 'COMPLETED' },
    { time: '14:08:10', event: 'XGBoost cost & delay objective function optimized.', status: 'COMPLETED' },
    { time: '14:08:32', event: 'Route B via Antwerp selected as most robust strategy.', status: 'SELECTED' },
    ...(submittedOutcome ? [{
      time: new Date().toTimeString().slice(0, 8),
      event: `Human ${submittedOutcome.action} recorded — Reason: ${submittedOutcome.reason_category || 'OPERATIONAL'} (${submittedOutcome.reason_text || 'Completed by operator'}).`,
      status: submittedOutcome.status
    }] : [])
  ]

  // Historical Decisions Log
  const decisionHistory = [
    ...(submittedOutcome ? [{
      id: 0,
      time: new Date().toTimeString().slice(0, 5),
      title: 'Rotterdam Congestion',
      action: `${submittedOutcome.action} (${submittedOutcome.selected_strategy_id || 'Antwerp'})`,
      saved: submittedOutcome.action === 'OVERRIDE' ? '$41,000 USD' : '$63,000 USD',
      status: submittedOutcome.status
    }] : []),
    { id: 1, time: '14:08:32', title: 'Rotterdam Congestion', action: 'Reroute via Antwerp', saved: '$63,000 USD', status: 'APPROVED' },
    { id: 2, time: '13:42:15', title: 'Singapore Feeder Gap', action: 'Reroute via Colombo', saved: '$27,000 USD', status: 'EXECUTED' },
    { id: 3, time: '12:18:04', title: 'Arabian Sea Weather', action: 'Delay Shipment Release +4H', saved: '$11,400 USD', status: 'EXECUTED' }
  ]

  return (
    <main className="min-h-screen bg-[#F6F6F3] text-[#151719] font-sans selection:bg-[#D94E28] selection:text-white">
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-stone-300 bg-[#F6F6F3]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded bg-[#D94E28] text-white font-mono text-xs font-black shadow-xs">
              F
            </span>
            <div>
              <span className="text-base font-black tracking-tight text-[#151719] block leading-tight">FLOWFORGE</span>
              <span className="text-[9px] font-mono tracking-widest text-stone-500 font-bold block">
                SUPPLY CHAIN DECISION INTELLIGENCE
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden items-center gap-4 xl:gap-6 text-[11px] font-extrabold tracking-wider text-stone-600 xl:flex">
            <Link href="/" className="hover:text-[#D94E28] transition-colors whitespace-nowrap">Mission Control</Link>
            <Link href="/network" className="hover:text-[#D94E28] transition-colors whitespace-nowrap">Network</Link>
            <Link href="/disruptions" className="hover:text-[#D94E28] transition-colors whitespace-nowrap">Disruptions</Link>
            <Link href="/simulation" className="hover:text-[#D94E28] transition-colors whitespace-nowrap">Simulation</Link>
            <Link href="/decisions" className="text-[#D94E28] font-black underline underline-offset-4 decoration-[#D94E28] whitespace-nowrap">
              Decisions
            </Link>
          </nav>

          {/* Right Status */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setCreateScenarioOpen(true)}
              className="rounded bg-[#D94E28] px-3 py-1.5 text-[10px] font-mono font-black text-white hover:bg-[#C84B24] transition-all shadow-2xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="size-3" /> + NEW ANALYSIS
            </button>
            <button
              onClick={() => setHistoryOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded border border-stone-300 bg-white px-2.5 py-1.5 text-[10px] font-mono font-bold text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs whitespace-nowrap"
            >
              <History className="size-3.5 text-[#D94E28]" /> DECISION HISTORY
            </button>
            <div className="relative hidden md:block">
              <button
                onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-stone-700 hover:text-stone-950 transition-colors whitespace-nowrap"
              >
                <span className={`size-2 rounded-full ${backendStatus === 'CONNECTED' ? 'bg-[#047857] animate-pulse' : 'bg-[#D94E28]'}`} />
                {backendStatus === 'CONNECTED' ? 'LIVE ▾' : 'STANDBY ▾'}
              </button>

              {statusMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded border border-stone-300 bg-white p-2 shadow-lg font-mono text-[11px] font-bold z-50 space-y-1">
                  <button
                    onClick={() => { setStatusMenuOpen(false); setSettingsOpen(true); }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-stone-100 text-stone-800"
                  >
                    VIEW SYSTEM HEALTH
                  </button>
                  <button
                    onClick={() => { setStatusMenuOpen(false); setSettingsOpen(true); }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-stone-100 text-[#D94E28] font-black"
                  >
                    OPEN SETTINGS & DATA →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <DecisionHistoryDrawer isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
        <SystemSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <CreateScenarioModal isOpen={createScenarioOpen} onClose={() => setCreateScenarioOpen(false)} />
      </header>

      {/* ── PAGE TITLE BAR & CONTEXT INDICATOR ────────────────────────────── */}
      <div className="border-b border-stone-300 bg-white py-5">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-black tracking-widest text-[#D94E28]">
              <Award className="size-3.5" /> PAGE 05 · EXPLAINABLE OPERATIONAL DECISION ENGINE
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#151719] md:text-3xl mt-0.5 font-sans">
              DECISION CENTER <span className="font-cursive text-2xl text-[#D94E28] font-bold normal-case ml-2">— what should we do now?</span>
            </h1>
            <p className="text-xs text-stone-600 font-semibold mt-0.5 font-sans">
              Turn simulation results into an actionable, explainable operational decision.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs font-bold">
            <div className="rounded border border-stone-300 bg-[#F4F2EC] px-3 py-1.5 text-stone-900">
              ACTIVE SCENARIO: <strong className="text-stone-950 font-black">Rotterdam Port Congestion</strong>
            </div>
            <div className="rounded border border-stone-200 bg-stone-50 px-3 py-1.5 text-stone-600">
              Last Analysis: {lastAnalysisTime}
            </div>
          </div>
        </div>
      </div>

      {/* PREVIOUS DECISION CONTEXT INFORMATIONAL BANNER */}
      <div className="bg-amber-50 border-b border-amber-300 py-2.5 px-5 md:px-12 text-xs font-mono font-bold text-amber-900 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-amber-700" />
          <span>
            <strong>PREVIOUS DECISION CONTEXT:</strong> A similar recommendation was previously overridden.
            Reason: <strong className="text-stone-950 font-black">EXISTING CARRIER AGREEMENT</strong> · Previous preference: <strong className="text-[#D94E28] font-black">COLOMBO</strong>
          </span>
        </div>
        <button onClick={() => setHistoryOpen(true)} className="text-[10px] text-amber-900 underline font-black">
          VIEW PREVIOUS DECISION LOG →
        </button>
      </div>

      {/* Confirmation Banner if Action Completed */}
      {submittedOutcome && (
        <div className="bg-[#ECFDF5] border-b border-[#A7F3D0] py-3 text-center text-xs font-mono font-black text-[#047857] flex items-center justify-center gap-2">
          <CheckCircle2 className="size-4 text-[#047857]" />
          <span>
            DECISION RECORDED: {submittedOutcome.action} ({submittedOutcome.status}) · REASON: {submittedOutcome.reason_category || 'OPERATIONAL'} · CONTEXT SAVED TO PERSISTENT DB AUDIT TRAIL
          </span>
        </div>
      )}

      <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-12 space-y-8">
        {/* ── SECTION 1 & 2: THE RECOMMENDATION & KEY BUSINESS RESULT ────────── */}
        <div className="rounded-lg border-2 border-stone-300 bg-white p-6 md:p-9 shadow-md space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-200 pb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-black text-[#D94E28] tracking-widest block">
                SECTION 1 · RECOMMENDED OPERATIONAL ACTION
              </span>
              <h2 className="text-3xl font-black tracking-tight text-[#151719] md:text-4xl font-sans">
                {scenarioInput
                  ? `REROUTE SHIPMENT (${scenarioInput.origin_unlocode} → ${scenarioInput.destination_unlocode}) VIA DIVERSION HUB`
                  : 'REROUTE 142 SHIPMENTS VIA ANTWERP'}
              </h2>
              <p className="text-xs text-stone-600 font-semibold font-sans">
                {scenarioInput
                  ? `Custom Scenario: ${scenarioInput.origin_unlocode} → ${scenarioInput.destination_unlocode} · Carrier: ${scenarioInput.carrier_code} · Cargo Weight: ${scenarioInput.cargo_weight_mt} MT · Declared Value: $${scenarioInput.cargo_value_usd?.toLocaleString()} USD`
                  : 'Corridor: Mumbai (INNSA) → Colombo (LKCMB) → Antwerp (BEANR) → Rotterdam (NLRTM)'}
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <span className="rounded bg-[#ECFDF5] border border-[#A7F3D0] px-4 py-2 text-xs font-black text-[#047857]">
                Recommendation Confidence: 91%
              </span>
              <span className={`rounded px-4 py-2 text-xs font-black ${
                decisionState === 'APPROVED' ? 'bg-emerald-100 text-[#047857]' :
                decisionState === 'OVERRIDE' || decisionState === 'OVERRIDDEN' ? 'bg-orange-100 text-[#D94E28]' :
                decisionState === 'REJECTED' ? 'bg-red-100 text-[#991B1B]' :
                decisionState === 'PAUSED' ? 'bg-amber-100 text-amber-800' :
                'bg-stone-100 text-stone-800'
              }`}>
                STATUS: {decisionState}
              </span>
            </div>
          </div>

          {/* ROUND 2 REQUIRED 5 ACTION BUTTONS ROW */}
          <div className="space-y-2 pt-2 border-b border-stone-200 pb-6">
            <span className="text-[10px] font-mono font-black text-stone-500 block">YOUR DECISION (OPERATOR ACTION)</span>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs font-black">
              {/* APPROVE BUTTON (PRIMARY) */}
              <button
                onClick={() => setActiveActionModal('APPROVE')}
                className="rounded bg-[#D94E28] px-6 py-3 text-white transition-all hover:bg-[#C84B24] active:scale-[0.98] shadow-sm flex items-center gap-2"
              >
                <span>[ APPROVE DECISION ]</span>
              </button>

              {/* REJECT BUTTON */}
              <button
                onClick={() => setActiveActionModal('REJECT')}
                className="rounded border border-red-300 bg-red-50 px-5 py-3 text-[#991B1B] hover:bg-red-100 transition-colors shadow-2xs"
              >
                [ REJECT ]
              </button>

              {/* PAUSE BUTTON */}
              <button
                onClick={() => setActiveActionModal('PAUSE')}
                className="rounded border border-amber-300 bg-amber-50 px-5 py-3 text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs"
              >
                [ PAUSE ]
              </button>

              {/* SKIP BUTTON */}
              <button
                onClick={() => setActiveActionModal('SKIP')}
                className="rounded border border-stone-300 bg-stone-100 px-5 py-3 text-stone-700 hover:bg-stone-200 transition-colors shadow-2xs"
              >
                [ SKIP ]
              </button>

              {/* OVERRIDE BUTTON */}
              <button
                onClick={() => setActiveActionModal('OVERRIDE')}
                className="rounded border-2 border-[#D94E28] bg-orange-50 px-5 py-3 text-[#D94E28] hover:bg-orange-100 transition-colors shadow-2xs font-black"
              >
                [ OVERRIDE ]
              </button>
            </div>
          </div>
        </div>

        {/* ROUND 2 INSIGHT PANEL: DECISION CONTEXT (IF DECISION TAKEN) */}
          {submittedOutcome && (
            <div className="rounded-lg border-2 border-stone-400 bg-[#F4F2EC] p-6 font-mono text-xs space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                <span className="font-black text-stone-900 text-sm">ROUND 2 DECISION CONTEXT & SHARED REASONING</span>
                <span className="rounded bg-stone-900 text-white px-2.5 py-0.5 text-[10px] font-black">
                  ACTION: {submittedOutcome.action}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-bold text-stone-800">
                <div>FlowForge Recommended: <strong className="text-[#D94E28] font-black">Antwerp</strong></div>
                <div>Human Decision / Choice: <strong className="text-stone-950 font-black">{submittedOutcome.selected_strategy_id || 'Colombo'}</strong></div>
                <div>Reason Category: <strong className="text-stone-950 font-black">{submittedOutcome.reason_category || 'PREFERENCE'}</strong></div>
                <div>Recorded Time: <strong className="text-stone-950 font-black">{new Date().toTimeString().slice(0, 5)}</strong></div>
              </div>
              {submittedOutcome.reason_text && (
                <div className="rounded bg-white p-3 border border-stone-300 text-stone-900 font-semibold text-[11px]">
                  <strong>OPERATIONAL CONTEXT EXPLANATION:</strong> "{submittedOutcome.reason_text}"
                </div>
              )}
            </div>
          )}

          {/* 4 Outcomes Grid & Business Result */}
          {(() => {
            const mc = analysisData?.monte_carlo || analysisData?.predictions?.monte_carlo
            const cost = analysisData?.cost || analysisData?.predictions?.cost
            const eta = analysisData?.eta || analysisData?.predictions?.eta
            const disruption = analysisData?.disruption || analysisData?.predictions?.disruption
            const decision = analysisData?.decision || analysisData?.predictions?.decision
            const route = analysisData?.route || analysisData?.predictions?.route
            const shipment = analysisData?.shipment || analysisData?.predictions?.shipment

            const originPort = shipment?.origin_port || scenarioInput?.origin_unlocode || 'Shanghai'
            const destPort = shipment?.destination_port || scenarioInput?.destination_unlocode || 'Yokohama'
            const cargoVal = shipment?.cargo_value_usd || scenarioInput?.cargo_value_usd || 120000

            const savedLossVal = Math.round(cost?.net_financial_savings_usd?.value || decision?.net_savings || (cargoVal * 0.12))
            const expectedLossVal = Math.round(decision?.expected_loss || (cargoVal * 0.04))
            const baselineLossVal = savedLossVal + expectedLossVal
            const rerouteCostVal = Math.round(cost?.cost_breakdown?.total_reroute_cost_usd || 4700)
            const netBenefitVal = Math.max(0, savedLossVal - rerouteCostVal)

            const baselineDelayVal = (eta?.estimated_delay_hours || 18.4).toFixed(1)
            const optimizedDelayVal = Math.max(0.5, (eta?.predicted_total_hours ? eta.predicted_total_hours * 0.05 : 5.2)).toFixed(1)
            const delaySavedVal = (parseFloat(baselineDelayVal) - parseFloat(optimizedDelayVal)).toFixed(1)

            const disruptionProb = Math.round((disruption?.disruption_probability || mc?.risk?.disruption_probability || 0.28) * 100)
            const baselineRiskPct = Math.min(98, Math.max(45, disruptionProb + 35))
            const optimizedRiskPct = Math.max(8, Math.round(disruptionProb * 0.75))
            const riskDelta = baselineRiskPct - optimizedRiskPct

            const p50Cost = Math.round(mc?.cost?.p50 || cost?.ml_predicted_shipment_cost?.value || (cargoVal * 0.08))
            const baselineCost = Math.round(p50Cost * 1.1)
            const optimizedCost = p50Cost + rerouteCostVal

            const selectedRouteName = route?.selected_route?.description || decision?.recommended_action || `${destPort} Reroute`

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 font-mono text-center">
                  <div className="rounded bg-stone-50 p-4 border border-stone-200 space-y-1">
                    <span className="text-[10px] text-stone-500 font-extrabold block">RISK REDUCTION</span>
                    <span className="text-xl font-black text-[#047857] block">{baselineRiskPct}% → {optimizedRiskPct}%</span>
                    <span className="text-[9px] text-[#047857] font-bold block">-{riskDelta} percentage points</span>
                  </div>

                  <div className="rounded bg-stone-50 p-4 border border-stone-200 space-y-1">
                    <span className="text-[10px] text-stone-500 font-extrabold block">DELAY REDUCTION</span>
                    <span className="text-xl font-black text-[#047857] block">+{baselineDelayVal}H → +{optimizedDelayVal}H</span>
                    <span className="text-[9px] text-[#047857] font-bold block">{delaySavedVal} Hours Saved</span>
                  </div>

                  <div className="rounded bg-stone-50 p-4 border border-stone-200 space-y-1">
                    <span className="text-[10px] text-stone-500 font-extrabold block">EXPECTED LOSS</span>
                    <span className="text-xl font-black text-[#047857] block">${Math.round(baselineLossVal/1000)}K → ${Math.round(expectedLossVal/1000)}K</span>
                    <span className="text-[9px] text-[#047857] font-bold block">-${savedLossVal.toLocaleString()} USD Loss</span>
                  </div>

                  <div className="rounded bg-stone-50 p-4 border border-stone-200 space-y-1">
                    <span className="text-[10px] text-stone-500 font-extrabold block">TRANSPORT COST</span>
                    <span className="text-xl font-black text-stone-900 block">${Math.round(baselineCost/1000)}K → ${Math.round(optimizedCost/1000)}K</span>
                    <span className="text-[9px] text-stone-600 font-bold block">+${(rerouteCostVal/1000).toFixed(1)}K Extra Transport</span>
                  </div>
                </div>

                {/* SECTION 2: Key Business Highlight Card */}
                <div className="rounded-lg bg-[#047857] text-white p-6 font-mono flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                  <div>
                    <span className="text-xs font-black tracking-widest text-emerald-100 block">KEY BUSINESS RESULT ({originPort.toUpperCase()} → {destPort.toUpperCase()})</span>
                    <span className="text-3xl md:text-5xl font-black block mt-1">${savedLossVal.toLocaleString()} USD</span>
                    <span className="text-xs text-emerald-100 font-bold block mt-1">EXPECTED FINANCIAL LOSS AVOIDED</span>
                  </div>
                  <div className="text-right text-xs text-emerald-100 font-bold space-y-1">
                    <div>Additional Transport Cost: <span className="font-black text-white">${rerouteCostVal.toLocaleString()} USD</span></div>
                    <div>Net Financial Benefit: <span className="font-black text-white">+${netBenefitVal.toLocaleString()} USD</span></div>
                  </div>
                </div>

                {/* ── SECTION 3: BEFORE VS FLOWFORGE TABLE ───────────────────────────── */}
                <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4 font-mono text-xs">
                  <span className="text-xs font-black text-stone-900 block">SECTION 3 · WHAT CHANGES? (CURRENT PLAN VS FLOWFORGE PLAN)</span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-stone-300 text-[10px] text-stone-500 font-black">
                          <th className="py-2">OPERATIONAL METRIC</th>
                          <th className="py-2">CURRENT PLAN ({destPort.toUpperCase()})</th>
                          <th className="py-2 text-[#047857]">FLOWFORGE PLAN ({selectedRouteName.toUpperCase()}) ★</th>
                          <th className="py-2 text-stone-600">DELTA / IMPROVEMENT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 font-bold text-stone-800">
                        <tr>
                          <td className="py-2.5">Disruption Risk</td>
                          <td className="py-2.5 text-[#991B1B]">{baselineRiskPct}%</td>
                          <td className="py-2.5 text-[#047857] font-black">{optimizedRiskPct}%</td>
                          <td className="py-2.5 text-[#047857] font-black">-{riskDelta} pts</td>
                        </tr>
                        <tr>
                          <td className="py-2.5">Expected Delay</td>
                          <td className="py-2.5 text-[#991B1B]">+{baselineDelayVal} Hours</td>
                          <td className="py-2.5 text-[#047857] font-black">+{optimizedDelayVal} Hours</td>
                          <td className="py-2.5 text-[#047857] font-black">-{delaySavedVal} Hours</td>
                        </tr>
                        <tr>
                          <td className="py-2.5">Expected Loss</td>
                          <td className="py-2.5 text-[#991B1B]">${baselineLossVal.toLocaleString()} USD</td>
                          <td className="py-2.5 text-[#047857] font-black">${expectedLossVal.toLocaleString()} USD</td>
                          <td className="py-2.5 text-[#047857] font-black">-${savedLossVal.toLocaleString()} USD</td>
                        </tr>
                        <tr>
                          <td className="py-2.5">Transport Cost</td>
                          <td className="py-2.5">${baselineCost.toLocaleString()} USD</td>
                          <td className="py-2.5 text-stone-950 font-black">${optimizedCost.toLocaleString()} USD</td>
                          <td className="py-2.5 text-stone-600 font-black">+${rerouteCostVal.toLocaleString()} USD</td>
                        </tr>
                        <tr>
                          <td className="py-2.5">Service Level</td>
                          <td className="py-2.5 text-stone-500">71%</td>
                          <td className="py-2.5 text-[#047857] font-black">94%</td>
                          <td className="py-2.5 text-[#047857] font-black">+23 pts</td>
                        </tr>
                        <tr>
                          <td className="py-2.5">Shipments at Risk</td>
                          <td className="py-2.5 text-[#991B1B]">142 SKU Lines</td>
                          <td className="py-2.5 text-[#047857] font-black">31 SKU Lines</td>
                          <td className="py-2.5 text-[#047857] font-black">-111 SKU Lines</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          })()}

        {/* ── SECTION 4 & 5: WHY FLOWFORGE CHOSE THIS & ALTERNATIVES EVALUATED ─ */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* SECTION 4: Why FlowForge Chose This */}
          <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4 font-mono text-xs">
            <span className="font-black text-stone-900 block">SECTION 4 · WHY FLOWFORGE CHOSE THIS</span>
            <div className="space-y-3">
              {decisionDrivers.map((drv, i) => (
                <div key={i} className="flex justify-between items-center rounded bg-stone-50 p-2.5 border border-stone-200 font-bold">
                  <span className="text-stone-800">{drv.name}</span>
                  <span className="text-[#D94E28] font-black">{drv.impact}</span>
                </div>
              ))}
            </div>
            <div className="rounded bg-orange-50/70 p-4 border-l-4 border-[#D94E28] text-stone-900 font-bold leading-relaxed text-[11px]">
              "FlowForge selected the Antwerp route because it materially reduces disruption exposure while maintaining acceptable transport cost and service reliability."
            </div>
          </div>

          {/* SECTION 5: Alternatives Evaluated */}
          <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4 font-mono text-xs">
            <span className="font-black text-stone-900 block">SECTION 5 · ALTERNATIVES EVALUATED</span>
            <div className="space-y-3">
              <div className="rounded border border-red-300 bg-red-50 p-3 space-y-1">
                <div className="flex justify-between text-stone-900 font-black">
                  <span>CURRENT ROUTE (ROTTERDAM)</span>
                  <span className="text-[#991B1B]">STATUS: REJECTED</span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-700 font-bold">
                  <span>Risk: 73%</span><span>Delay: +18.4H</span><span>Loss: $82K</span>
                </div>
              </div>

              <div className={`rounded p-3 space-y-1 border ${
                submittedOutcome?.selected_strategy_id === 'Colombo'
                  ? 'border-2 border-[#D94E28] bg-orange-50 text-stone-950 font-black'
                  : 'border-amber-300 bg-amber-50 text-stone-900'
              }`}>
                <div className="flex justify-between font-black">
                  <span>ROUTE VIA COLOMBO</span>
                  <span className={submittedOutcome?.selected_strategy_id === 'Colombo' ? 'text-[#D94E28]' : 'text-amber-800'}>
                    STATUS: {submittedOutcome?.selected_strategy_id === 'Colombo' ? 'HUMAN OVERRIDE' : 'REJECTED'}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Risk: 42%</span><span>Delay: +9.1H</span><span>Loss: $41K</span>
                </div>
              </div>

              <div className="rounded border-2 border-[#047857] bg-[#ECFDF5] p-3 space-y-1">
                <div className="flex justify-between text-[#064E3B] font-black">
                  <span>ROUTE VIA ANTWERP ★</span>
                  <span className="text-[#047857]">STATUS: AI RECOMMENDED</span>
                </div>
                <div className="flex justify-between text-[10px] text-[#065F46] font-black">
                  <span>Risk: 28%</span><span>Delay: +5.2H</span><span>Loss: $19K</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 8 & 9: EXECUTION PLAN & TIMELINE AUDIT TRAIL ───────────── */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* SECTION 8: Operational Execution Plan */}
          <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4 font-mono text-xs">
            <span className="font-black text-stone-900 block">SECTION 8 · PROPOSING OPERATIONAL EXECUTION PLAN</span>
            <div className="space-y-2.5">
              {executionSteps.map((s) => (
                <div key={s.step} className="flex items-start gap-3 rounded bg-stone-50 p-2.5 border border-stone-200">
                  <span className="font-black text-[#D94E28] w-6">{s.step}</span>
                  <div>
                    <span className="font-black text-stone-900">{s.action}</span>
                    <p className="text-[11px] text-stone-600 font-bold">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 9: Decision Timeline Audit Trail */}
          <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4 font-mono text-xs">
            <span className="font-black text-stone-900 block">SECTION 9 · DECISION AUDIT TRAIL & TIMELINE</span>
            <div className="space-y-2.5">
              {decisionTimeline.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-400 font-bold">{item.time}</span>
                    <span className="text-stone-800 font-bold text-[11px]">{item.event}</span>
                  </div>
                  <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[9px] font-black text-stone-700">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 14: HISTORICAL DECISIONS LOG ────────────────────────────── */}
        <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4 font-mono text-xs">
          <span className="font-black text-stone-900 block border-b border-stone-200 pb-2">
            SECTION 14 · HISTORICAL DECISIONS & ABANDONMENT AUDIT LOG
          </span>
          <div className="space-y-2">
            {decisionHistory.map((h, i) => (
              <div key={i} className="rounded bg-stone-50 p-3 border border-stone-200 flex justify-between items-center text-[11px] font-bold">
                <div>
                  <span className="text-stone-400">{h.time}</span> - <span className="text-stone-950 font-black">{h.title}</span> ({h.action})
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#047857] font-black">{h.saved} Saved</span>
                  <span className={`rounded px-2 py-0.5 text-[9px] font-black ${
                    h.status === 'APPROVED' ? 'bg-emerald-100 text-[#047857]' :
                    h.status === 'OVERRIDDEN' ? 'bg-orange-100 text-[#D94E28]' :
                    'bg-stone-200 text-stone-700'
                  }`}>{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REASON CAPTURE MODAL */}
      {activeActionModal && (
        <DecisionReasonModal
          isOpen={true}
          action={activeActionModal}
          onClose={() => setActiveActionModal(null)}
          onSubmitSuccess={handleOutcomeSuccess}
        />
      )}

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-stone-300 bg-stone-900 text-white py-8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-12 text-xs text-stone-400">
          <div className="flex items-center gap-3">
            <span className="flex size-5 items-center justify-center rounded bg-[#D94E28] text-white font-mono text-[10px] font-black">
              F
            </span>
            <span className="font-black text-white">FLOWFORGE</span>
            <span>· PAGE 05: DECISION CENTER</span>
          </div>
          <Link href="/simulation" className="hover:text-white transition-colors font-mono text-[10px] font-bold">
            ← RETURN TO PAGE 04 SIMULATION
          </Link>
        </div>
      </footer>
    </main>
  )
}
