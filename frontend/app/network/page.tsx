'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  Play,
  RefreshCw,
  Sparkles,
  History,
  BarChart3,
  Ship,
  MapPin,
  Compass,
  Activity,
  TrendingUp,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import { computeDynamicReroutes } from '@/lib/routeEngine'
import DecisionHistoryDrawer from '@/components/DecisionHistoryDrawer'
import SystemSettingsModal from '@/components/SystemSettingsModal'
import CreateScenarioModal from '@/components/CreateScenarioModal'

const GlobalMap = dynamic(() => import('@/components/GlobalMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] w-full rounded-lg bg-[#F4F2EC] border border-stone-300 flex items-center justify-center text-stone-500 text-xs font-mono font-bold">
      LOADING MARITIME NAVMESH…
    </div>
  )
})

export default function NetworkPage() {
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [backendStatus, setBackendStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED')
  const [activeReroute, setActiveReroute] = useState('A')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)

  // Dynamic Scenario State — originPort & destPort are the EXACT names from user input
  const [scenarioState, setScenarioState] = useState({
    originPort: 'Shanghai',
    destPort: 'Yokohama',
    vessel: 'FF Horizon (984210)',
    baselineEta: 'Aug 22 · 08:14 UTC',
    riskPct: '31.4%',
    savings: '+$4,688',
    recommendedPort: 'Via Coastal Bypass (ALT-A)'
  })

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString())

    const syncScenario = () => {
      if (typeof window === 'undefined') return
      const inputStr = sessionStorage.getItem('flowforge_scenario_input')
      const resStr = sessionStorage.getItem('flowforge_analysis_result')

      if (inputStr) {
        try {
          const inp = JSON.parse(inputStr)
          const orig = inp.origin_unlocode || 'Shanghai'
          const dest = inp.destination_unlocode || 'Yokohama'

          let riskVal = '31.4%'
          let savingsVal = '+$4,688'

          if (resStr) {
            try {
              const res = JSON.parse(resStr)
              const p = res?.predictions?.disruption?.disruption_probability
              if (p) riskVal = `${(p * 100).toFixed(1)}%`
              const sav = res?.predictions?.cost?.net_financial_savings_usd?.value
              if (sav) savingsVal = `+$${Math.round(sav).toLocaleString()}`
            } catch {}
          }

          setScenarioState({
            originPort: orig,
            destPort: dest,
            vessel: inp.vessel_name || 'FF Horizon (984210)',
            baselineEta: inp.baseline_eta || 'Aug 22 · 08:14 UTC',
            riskPct: riskVal,
            savings: savingsVal,
            recommendedPort: `Via Sea Route (${dest})`
          })
        } catch {}
      }
    }

    syncScenario()
    window.addEventListener('flowforge_analysis_updated', syncScenario)
    window.addEventListener('storage', syncScenario)

    async function fetchBackend() {
      try {
        const res = await fetch('http://localhost:8000/health')
        if (res.ok) setBackendStatus('CONNECTED')
      } catch { setBackendStatus('DISCONNECTED') }
    }
    fetchBackend()
    const timer = setInterval(() => setLastUpdated(new Date().toLocaleTimeString()), 30000)
    return () => {
      window.removeEventListener('flowforge_analysis_updated', syncScenario)
      window.removeEventListener('storage', syncScenario)
      clearInterval(timer)
    }
  }, [])

  // Dynamically compute shortest bathymetric waypoints & reroute options for user's input ports
  const { primaryNm, reroutes } = useMemo(() => {
    return computeDynamicReroutes(scenarioState.originPort, scenarioState.destPort)
  }, [scenarioState.originPort, scenarioState.destPort])

  const selectedReroute = reroutes.find(r => r.id === activeReroute) || reroutes[0]

  return (
    <main className="min-h-screen bg-[#F6F6F3] text-[#151719] font-sans selection:bg-[#D94E28] selection:text-white">

      {/* ── HEADER — mirrors simulation page exactly ─────────────────── */}
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
                MARITIME DECISION INTELLIGENCE
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden items-center gap-4 xl:gap-6 text-[11px] font-extrabold tracking-wider text-stone-600 xl:flex">
            <Link href="/" className="hover:text-[#D94E28] transition-colors whitespace-nowrap">Mission Control</Link>
            <Link href="/disruptions" className="hover:text-[#D94E28] transition-colors whitespace-nowrap">Operational Intelligence</Link>
            <Link href="/network" className="text-[#D94E28] font-black underline underline-offset-4 decoration-[#D94E28] whitespace-nowrap">
              Network &amp; Routes
            </Link>
            <Link href="/simulation" className="hover:text-[#D94E28] transition-colors whitespace-nowrap">Simulation</Link>
            <Link href="/decisions" className="hover:text-[#D94E28] transition-colors whitespace-nowrap">Decisions</Link>
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
            <span className="hidden md:flex items-center gap-1.5 rounded border border-stone-300 bg-white px-2.5 py-1.5 text-[10px] font-mono font-bold text-stone-700">
              <Sparkles className="size-3.5 text-[#D94E28]" />
              <span>ENGINE: <strong className="text-[#047857] font-black">READY</strong></span>
            </span>
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
                    onClick={() => { setStatusMenuOpen(false); setSettingsOpen(true) }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-stone-100 text-stone-800"
                  >VIEW SYSTEM HEALTH</button>
                  <button
                    onClick={() => { setStatusMenuOpen(false); setSettingsOpen(true) }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-stone-100 text-[#D94E28] font-black"
                  >OPEN SETTINGS &amp; DATA →</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <DecisionHistoryDrawer isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
        <SystemSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <CreateScenarioModal isOpen={createScenarioOpen} onClose={() => setCreateScenarioOpen(false)} />
      </header>

      {/* ── PAGE TITLE BAR — white bar, mirrors simulation page ─────── */}
      <div className="border-b border-stone-300 bg-white py-5">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-black tracking-widest text-[#D94E28]">
              <Globe2 className="size-3.5" /> PAGE 03 · POSTGIS A* ROUTE INTELLIGENCE &amp; NAVMESH CORRIDOR
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#151719] md:text-3xl mt-0.5 uppercase">
              {scenarioState.originPort} → {scenarioState.destPort} Corridor
            </h1>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">
              Active operational analysis. PostGIS A* model computed {reroutes.length} open-water reroute options. Best route recommended below.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/simulation"
              className="flex items-center gap-2 rounded bg-[#D94E28] px-5 py-2.5 text-xs font-black text-white transition-all hover:bg-[#C84B24] active:scale-[0.98] shadow-2xs"
            >
              <Play className="size-4 fill-current" /> RUN MONTE CARLO →
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-12 space-y-8">

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-lg border border-stone-300 bg-white p-4 shadow-2xs space-y-1">
            <span className="text-[10px] font-mono font-black text-stone-500 block uppercase tracking-wider">Tracked Vessel</span>
            <strong className="text-[#D94E28] font-black text-sm font-mono block">{scenarioState.vessel}</strong>
          </div>
          <div className="rounded-lg border border-stone-300 bg-white p-4 shadow-2xs space-y-1">
            <span className="text-[10px] font-mono font-black text-stone-500 block uppercase tracking-wider">Baseline Distance</span>
            <strong className="text-[#151719] font-black text-sm font-mono block">{primaryNm.toLocaleString()} nm</strong>
          </div>
          <div className="rounded-lg border-2 border-amber-400 bg-amber-50 p-4 shadow-2xs space-y-1">
            <span className="text-[10px] font-mono font-black text-amber-700 block uppercase tracking-wider">Disruption Risk</span>
            <strong className="text-amber-800 font-black text-sm font-mono block">{scenarioState.riskPct} Exposure</strong>
          </div>
          <div className="rounded-lg border-2 border-[#047857] bg-emerald-50 p-4 shadow-2xs space-y-1">
            <span className="text-[10px] font-mono font-black text-[#047857] block uppercase tracking-wider">Recommended Reroute</span>
            <strong className="text-[#047857] font-black text-sm font-mono block">{reroutes[0]?.label || scenarioState.recommendedPort}</strong>
          </div>
        </div>

        {/* Main Workspace: Map (left 2/3) + Reroute Panel (right 1/3) */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* LEFT: Live Map Panel */}
          <div className="w-full lg:w-2/3 flex-1 space-y-0">
            <div className="rounded-lg border-2 border-stone-300 bg-white shadow-md overflow-hidden">
              {/* Map Header */}
              <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white">
                <div>
                  <span className="text-[10px] font-mono font-black text-[#D94E28]">SECTION 1 · LIVE POSTGIS NAVMESH MAP</span>
                  <h3 className="text-base font-black text-[#151719] mt-0.5 flex items-center gap-2">
                    <Globe2 className="size-4 text-[#D94E28]" />
                    LIVE ROUTE MAP
                    <span className="text-[11px] font-mono font-bold text-stone-500 ml-1">{scenarioState.originPort} → {scenarioState.destPort}</span>
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-stone-500">UPDATED {lastUpdated}</span>
              </div>

              {/* Map */}
              <div className="p-4">
                <GlobalMap
                  originPort={scenarioState.originPort}
                  destinationPort={scenarioState.destPort}
                  activeReroute={activeReroute}
                  onRerouteChange={setActiveReroute}
                />
              </div>
            </div>

            {/* Active Route Detail Strip */}
            {selectedReroute && (
              <div className="mt-4 rounded-lg border border-stone-300 bg-white p-5 shadow-2xs font-mono">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                  <span className="text-[10px] font-black text-[#D94E28]">SECTION 2 · SELECTED REROUTE ANALYSIS</span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border ${
                    selectedReroute.recommended
                      ? 'bg-emerald-50 border-[#047857] text-[#047857]'
                      : 'bg-stone-100 border-stone-300 text-stone-700'
                  }`}>
                    {selectedReroute.recommended ? 'RECOMMENDED — BEST ROI' : `ALT-${selectedReroute.id}`}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  {[
                    { l: 'ETA IMPACT', v: selectedReroute.eta, highlight: true },
                    { l: 'ROUTE DISTANCE', v: selectedReroute.distance },
                    { l: 'ROUTE COST', v: selectedReroute.cost },
                    { l: 'NET SAVINGS', v: selectedReroute.savings, green: selectedReroute.savings?.startsWith('+') },
                  ].map(({ l, v, highlight, green }) => (
                    <div key={l} className="rounded bg-[#F4F2EC] border border-stone-300 p-3 space-y-0.5">
                      <span className="text-[10px] font-black text-stone-500 block">{l}</span>
                      <strong className={`font-black text-base block ${
                        highlight ? 'text-[#D94E28]' : green ? 'text-[#047857]' : 'text-[#151719]'
                      }`}>{v || '—'}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Reroute Options Panel */}
          <div className="w-full lg:w-1/3 shrink-0 rounded-lg border-2 border-stone-300 bg-white p-6 shadow-md space-y-5">
            <div className="border-b border-stone-200 pb-3">
              <span className="text-[10px] font-mono font-black text-[#D94E28]">SECTION 3 · AVAILABLE REROUTES</span>
              <h3 className="text-lg font-black text-[#151719] mt-0.5">{reroutes.length} ALTERNATIVES EVALUATED</h3>
            </div>

            {reroutes.map((r) => {
              const isActive = activeReroute === r.id
              const borderColor = isActive
                ? r.recommended ? 'border-[#047857]' : r.id === 'B' ? 'border-amber-500' : 'border-blue-500'
                : 'border-stone-300'
              const bgColor = isActive
                ? r.recommended ? 'bg-emerald-50' : r.id === 'B' ? 'bg-amber-50' : 'bg-blue-50'
                : 'bg-white hover:bg-[#F4F2EC]'

              return (
                <div
                  key={r.id}
                  onClick={() => setActiveReroute(r.id)}
                  className={`rounded-lg border-2 p-4 cursor-pointer transition-all space-y-3 ${borderColor} ${bgColor}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        {r.recommended && <CheckCircle2 className="size-3.5 text-[#047857] shrink-0" />}
                        <span className={`text-xs font-black font-mono ${r.recommended ? 'text-[#047857]' : 'text-[#151719]'}`}>
                          {r.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-snug font-semibold">{r.detail}</p>
                    </div>
                    {r.recommended && (
                      <span className="shrink-0 text-[9px] font-mono font-black text-[#047857] bg-emerald-100 border border-[#047857] px-2 py-0.5 rounded">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-white rounded border border-stone-200 p-2 space-y-0.5">
                      <span className="text-stone-400 font-bold block">ETA IMPACT</span>
                      <strong className="text-[#151719] font-black">{r.eta}</strong>
                    </div>
                    <div className="bg-white rounded border border-stone-200 p-2 space-y-0.5">
                      <span className="text-stone-400 font-bold block">DISTANCE</span>
                      <strong className="text-[#151719] font-black">{r.distance}</strong>
                    </div>
                    <div className="bg-white rounded border border-stone-200 p-2 space-y-0.5">
                      <span className="text-stone-400 font-bold block">ROUTE COST</span>
                      <strong className="text-[#151719] font-black">{r.cost}</strong>
                    </div>
                    <div className="bg-white rounded border border-stone-200 p-2 space-y-0.5">
                      <span className="text-stone-400 font-bold block">NET SAVINGS</span>
                      <strong className={`font-black ${r.savings?.startsWith('+') ? 'text-[#047857]' : 'text-[#991B1B]'}`}>{r.savings}</strong>
                    </div>
                  </div>

                  {/* Vertical Route Stepper Structure requested by User */}
                  <div className="rounded border border-stone-300 bg-white p-3 font-mono text-xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <span className="font-black text-[#D94E28] uppercase text-[10px] flex items-center gap-1">
                        {r.recommended ? 'Recommended Route ⭐' : `Route Option (ALT-${r.id})`}
                      </span>
                      {r.recommended && (
                        <span className="text-[9px] font-black text-[#047857] bg-emerald-100 border border-[#047857] px-1.5 py-0.5 rounded">
                          OPTIMAL
                        </span>
                      )}
                    </div>

                    {/* Stepper Tree */}
                    <div className="py-1 space-y-0.5">
                      {r.corridorSteps?.map((step, idx) => (
                        <React.Fragment key={idx}>
                          <div className="flex items-center gap-2 font-black text-stone-900 text-[11px]">
                            <span className={`size-2.5 rounded-full shrink-0 ${
                              idx === 0
                                ? 'bg-stone-900 ring-2 ring-stone-300'
                                : idx === r.corridorSteps.length - 1
                                ? 'bg-[#047857] ring-2 ring-emerald-200'
                                : 'bg-[#D94E28] ring-2 ring-orange-200'
                            }`} />
                            <span className="truncate">{step}</span>
                          </div>
                          {idx < r.corridorSteps.length - 1 && (
                            <div className="ml-1 pl-3 border-l-2 border-dashed border-stone-300 py-1 text-[10px] text-stone-400 font-mono">
                              │
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Metrics Footer Grid */}
                    <div className="grid grid-cols-3 gap-1.5 border-t border-stone-200 pt-2 text-[10px] text-center font-mono font-bold">
                      <div className="bg-[#F4F2EC] rounded p-1.5 border border-stone-300">
                        <span className="text-stone-500 block text-[9px]">ETA:</span>
                        <strong className="text-stone-900 block text-[11px]">{r.etaDays}</strong>
                      </div>
                      <div className="bg-[#F4F2EC] rounded p-1.5 border border-stone-300">
                        <span className="text-stone-500 block text-[9px]">Fuel:</span>
                        <strong className={r.fuelImpact.startsWith('-') ? 'text-[#047857] block text-[11px]' : 'text-amber-800 block text-[11px]'}>
                          {r.fuelImpact}
                        </strong>
                      </div>
                      <div className="bg-[#F4F2EC] rounded p-1.5 border border-stone-300">
                        <span className="text-stone-500 block text-[9px]">Risk:</span>
                        <strong className="text-stone-900 block text-[11px]">{r.riskLevel}</strong>
                      </div>
                    </div>
                  </div>

                  {r.recommended && (
                    <div className="text-[11px] text-[#047857] font-black flex items-center gap-1.5 border-t border-emerald-200 pt-2 font-mono">
                      <CheckCircle2 className="size-3.5" />
                      Best ETA/cost balance · Lowest viable risk
                    </div>
                  )}
                </div>
              )
            })}

            {/* Voyage Summary */}
            <div className="rounded-lg border border-stone-300 bg-[#F4F2EC] p-4 space-y-2 text-xs font-mono">
              <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block border-b border-stone-300 pb-2">VOYAGE SUMMARY</span>
              {[
                { l: 'ORIGIN PORT', v: scenarioState.originPort },
                { l: 'DESTINATION PORT', v: scenarioState.destPort },
                { l: 'BASELINE DISTANCE', v: `${primaryNm.toLocaleString()} nm` },
                { l: 'AVG SPEED', v: '13.8 kn' },
                { l: 'TRACKED VESSEL', v: scenarioState.vessel },
                { l: 'BASELINE ETA', v: scenarioState.baselineEta },
              ].map(({ l, v }) => (
                <div key={l} className="flex justify-between">
                  <span className="text-stone-500 font-bold">{l}</span>
                  <span className="text-[#151719] font-black text-right max-w-[140px] truncate">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 4: DATA SOURCES & BOTTOM CTA ────────────────────── */}
        <div className="rounded-lg border border-stone-300 bg-white p-5 md:p-6 flex flex-wrap items-center justify-between gap-5 shadow-2xs font-mono">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-stone-700">
            <span className="font-black text-[#151719] uppercase tracking-wider text-[10px]">DATA SOURCES:</span>
            {['AIS Telemetry', 'OpenMeteo Weather', 'Port Status API', 'Geopolitical Alerts', 'PostGIS NavMesh'].map(src => (
              <span key={src} className="inline-flex items-center gap-1 bg-emerald-50 text-[#047857] border border-[#047857] px-2.5 py-1 rounded font-black text-[10px]">
                <CheckCircle2 className="size-3 text-[#047857]" /> {src}
              </span>
            ))}
          </div>
          <Link
            href="/simulation"
            className="rounded bg-[#D94E28] hover:bg-[#C84B24] transition-all px-7 py-3 text-xs font-black text-white flex items-center gap-2 active:scale-[0.98] shadow-2xs"
          >
            Run Monte Carlo Simulation <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-300 bg-white py-5 mt-6">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] font-bold text-stone-500">
          <div>FLOWFORGE MARITIME DECISION INTELLIGENCE</div>
          <div>© {new Date().getFullYear()} FLOWFORGE. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>
    </main>
  )
}
