'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Activity,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Cpu,
  Database,
  DollarSign,
  Eye,
  Filter,
  Globe2,
  Layers,
  MapPin,
  Menu,
  RefreshCw,
  Search,
  ShieldAlert,
  Ship,
  Sparkles,
  History,
  Truck,
  Warehouse,
  Wifi,
  X
} from 'lucide-react'
import DecisionHistoryDrawer from '@/components/DecisionHistoryDrawer'
import SystemSettingsModal from '@/components/SystemSettingsModal'
import CreateScenarioModal from '@/components/CreateScenarioModal'

// Asset types definition
type AssetKey = 'ROTTERDAM' | 'MUMBAI' | 'SINGAPORE' | 'ANTWERP' | 'COLOMBO' | 'DUBAI' | 'SHANGHAI' | 'ROUTE_PRIMARY'

export default function NetworkPage() {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'MAP' | 'NETWORK'>('MAP')
  const [selectedAsset, setSelectedAsset] = useState<AssetKey>('ROTTERDAM')
  const [backendStatus, setBackendStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED')
  const [lastUpdated, setLastUpdated] = useState<string>('14:09:32')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Map layer controls state
  const [layers, setLayers] = useState({
    routes: true,
    ports: true,
    warehouses: true,
    vessels: true,
    weather: true,
    congestion: true,
    risk: true,
    disruptions: true
  })

  // Check live backend connection & fetch live AIS vessel telemetry on mount
  const [liveVesselCount, setLiveVesselCount] = useState(18)

  useEffect(() => {
    async function fetchLiveBackend() {
      try {
        const res = await fetch('http://localhost:8000/health')
        if (res.ok) {
          setBackendStatus('CONNECTED')
          setErrorMsg(null)
        }
        const vesselsRes = await fetch('http://localhost:8000/api/v1/vessels')
        if (vesselsRes.ok) {
          const vData = await vesselsRes.json()
          if (vData?.count) setLiveVesselCount(vData.count)
        }
      } catch {
        setBackendStatus('DISCONNECTED')
      }
    }
    fetchLiveBackend()
    const timer = setInterval(() => {
      const d = new Date()
      setLastUpdated(d.toTimeString().split(' ')[0])
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Asset detail configurations
  const assetDetails: Record<AssetKey, {
    title: string
    code: string
    type: string
    status: 'CRITICAL' | 'WARNING' | 'OPERATIONAL'
    congestion: string
    utilization: string
    expectedDelay: string
    affectedShipments: number
    affectedVessels: number
    financialImpact: string
    riskDrivers: { name: string; impact: string }[]
  }> = {
    ROTTERDAM: {
      title: 'Rotterdam Port',
      code: 'NLRTM',
      type: 'Container Terminal',
      status: 'CRITICAL',
      congestion: '87%',
      utilization: '94%',
      expectedDelay: '18.4 Hours',
      affectedShipments: 142,
      affectedVessels: 18,
      financialImpact: '$82,400 USD',
      riskDrivers: [
        { name: 'Berth Congestion Anomaly', impact: '+32% risk' },
        { name: 'North Sea Severe Weather', impact: '+18% risk' },
        { name: 'Feeder Vessel Backlog', impact: '+11% risk' },
        { name: 'Cross-Dock Buffer Limit', impact: '+14% risk' }
      ]
    },
    MUMBAI: {
      title: 'Jawaharlal Nehru Port (JNPT)',
      code: 'INNSA',
      type: 'Origin Gateway Port',
      status: 'OPERATIONAL',
      congestion: '34%',
      utilization: '68%',
      expectedDelay: '0.0 Hours',
      affectedShipments: 0,
      affectedVessels: 4,
      financialImpact: '$0 USD',
      riskDrivers: [
        { name: 'Monsoon Rain Clearance', impact: '+4% risk' },
        { name: 'Gate Processing Rate', impact: 'Normal' }
      ]
    },
    SINGAPORE: {
      title: 'Singapore Port',
      code: 'SGSIN',
      type: 'Transshipment Hub',
      status: 'WARNING',
      congestion: '62%',
      utilization: '81%',
      expectedDelay: '3.2 Hours',
      affectedShipments: 28,
      affectedVessels: 9,
      financialImpact: '$14,200 USD',
      riskDrivers: [
        { name: 'Feeder Feeder Scheduling Gap', impact: '+12% risk' },
        { name: 'Yard Crane Allocation', impact: '+6% risk' }
      ]
    },
    ANTWERP: {
      title: 'Antwerp Port',
      code: 'BEANR',
      type: 'Alternative Gateway',
      status: 'OPERATIONAL',
      congestion: '28%',
      utilization: '59%',
      expectedDelay: '1.2 Hours',
      affectedShipments: 0,
      affectedVessels: 3,
      financialImpact: '$0 USD',
      riskDrivers: [
        { name: 'Barge Transit Availability', impact: 'High (+14% capacity)' },
        { name: 'Rail Feeder Connectivity', impact: 'Optimal' }
      ]
    },
    COLOMBO: {
      title: 'Colombo Port',
      code: 'LKCMB',
      type: 'Alternative Waypoint',
      status: 'OPERATIONAL',
      congestion: '22%',
      utilization: '51%',
      expectedDelay: '0.5 Hours',
      affectedShipments: 0,
      affectedVessels: 2,
      financialImpact: '$0 USD',
      riskDrivers: [{ name: 'Feeder Slot Readiness', impact: 'Optimal' }]
    },
    DUBAI: {
      title: 'Jebel Ali Port',
      code: 'AEJEA',
      type: 'Middle East Hub',
      status: 'OPERATIONAL',
      congestion: '41%',
      utilization: '72%',
      expectedDelay: '1.0 Hours',
      affectedShipments: 6,
      affectedVessels: 5,
      financialImpact: '$3,400 USD',
      riskDrivers: [{ name: 'Customs Clearance Queue', impact: '+5% risk' }]
    },
    SHANGHAI: {
      title: 'Shanghai Port',
      code: 'CNSHA',
      type: 'Pacific Hub',
      status: 'OPERATIONAL',
      congestion: '38%',
      utilization: '75%',
      expectedDelay: '0.8 Hours',
      affectedShipments: 0,
      affectedVessels: 12,
      financialImpact: '$0 USD',
      riskDrivers: [{ name: 'Container Yard Flow', impact: 'Normal' }]
    },
    ROUTE_PRIMARY: {
      title: 'Primary Corridor (Mumbai → Rotterdam)',
      code: 'CORRIDOR_01',
      type: 'Maritime Ocean Route',
      status: 'CRITICAL',
      congestion: '87%',
      utilization: '94%',
      expectedDelay: '18.4 Hours',
      affectedShipments: 142,
      affectedVessels: 18,
      financialImpact: '$82,400 USD',
      riskDrivers: [
        { name: 'Destination Congestion (NLRTM)', impact: '73% Route Risk' },
        { name: 'Arabian Sea Weather Wave', impact: '+18.4H Transit Delay' }
      ]
    }
  }

  const activeAsset = assetDetails[selectedAsset]

  // Event feed log
  const networkEvents = [
    { time: '14:09:32', type: 'CRITICAL', text: 'Rotterdam (NLRTM) berth congestion increased to 87%.' },
    { time: '14:07:15', type: 'WARNING', text: 'Vessel MSC-Orion delayed by 6.2 hours off English Channel.' },
    { time: '14:05:01', type: 'WARNING', text: 'Weather wave height severity increased in Arabian Sea corridor.' },
    { time: '14:02:44', type: 'INFO', text: 'FlowForge Decision Engine generated diversion recommendation via Antwerp.' },
    { time: '13:58:10', type: 'RESOLVED', text: 'Colombo (LKCMB) feeder gate queue cleared.' }
  ]

  return (
    <main className="min-h-screen bg-[#F6F6F3] text-[#151719] font-sans selection:bg-[#D94E28] selection:text-white">
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-stone-300 bg-[#F6F6F3]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-12">
          {/* Logo & Subtitle */}
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

          {/* Nav Links */}
          <nav className="flex items-center gap-6 text-xs font-semibold text-[#667085]">
            <Link href="/" className="hover:text-[#111827] transition-colors pb-1">
              Overview
            </Link>
            <Link href="/disruptions" className="hover:text-[#111827] transition-colors pb-1">
              Intelligence
            </Link>
            <Link href="/network" className="text-[#D94E28] font-bold border-b-2 border-[#D94E28] pb-1">
              Routes
            </Link>
            <Link href="/simulation" className="hover:text-[#111827] transition-colors pb-1">
              Simulation
            </Link>
            <Link href="/decisions" className="hover:text-[#111827] transition-colors pb-1">
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
            <div className="hidden md:flex items-center gap-2 rounded border border-stone-300 bg-white px-2.5 py-1.5 text-[10px] font-mono font-bold text-stone-700">
              <Activity className="size-3.5 text-[#047857]" />
              <span>HEALTH: <strong className="text-stone-950 font-black">82/100</strong></span>
            </div>
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

      {/* ── PAGE TITLE BAR & LIVE TIME INDICATOR ──────────────────────────── */}
      <div className="border-b border-stone-300 bg-white py-5">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-black tracking-widest text-[#D94E28]">
              <Globe2 className="size-3.5" /> PAGE 02 · DIGITAL TWIN OPERATIONAL PICTURE
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#151719] md:text-3xl mt-0.5">
              NETWORK INTELLIGENCE
            </h1>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">
              Live operational view of routes, assets, disruptions and network risk.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Toggle: MAP VIEW vs NETWORK VIEW */}
            <div className="flex items-center rounded border border-stone-300 bg-[#F4F2EC] p-1 text-[10px] font-mono font-black">
              <button
                onClick={() => setViewMode('MAP')}
                className={`rounded px-3 py-1.5 transition-all ${
                  viewMode === 'MAP' ? 'bg-white text-stone-950 shadow-2xs font-black' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                MAP VIEW
              </button>
              <button
                onClick={() => setViewMode('NETWORK')}
                className={`rounded px-3 py-1.5 transition-all ${
                  viewMode === 'NETWORK' ? 'bg-white text-stone-950 shadow-2xs font-black' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                NETWORK VIEW
              </button>
            </div>

            <div className="flex items-center gap-2 rounded border border-stone-200 bg-stone-50 px-3 py-1.5 text-[10px] font-mono font-bold text-stone-600">
              <span>LAST UPDATED {lastUpdated}</span>
              <span className="flex size-2 rounded-full bg-[#047857] animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-12 space-y-8">
        {/* ── SECTION 3: NETWORK KPI STRIP ───────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6 font-mono">
          <div className="rounded border border-stone-300 bg-white p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] font-extrabold text-stone-500 block">NETWORK HEALTH</span>
            <span className="text-2xl font-black text-[#047857] block">82/100</span>
            <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden mt-1">
              <div className="bg-[#047857] h-full w-[82%]" />
            </div>
          </div>

          <div className="rounded border border-stone-300 bg-white p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] font-extrabold text-stone-500 block">SHIPMENTS AT RISK</span>
            <span className="text-2xl font-black text-[#991B1B] block">142</span>
            <span className="text-[9px] text-stone-500 font-bold block">Across 18 vessels</span>
          </div>

          <div className="rounded border border-stone-300 bg-white p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] font-extrabold text-stone-500 block">COST AT RISK</span>
            <span className="text-2xl font-black text-[#D94E28] block">$142K</span>
            <span className="text-[9px] text-stone-500 font-bold block">Demurrage & delay</span>
          </div>

          <div className="rounded border border-stone-300 bg-white p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] font-extrabold text-stone-500 block">ETA EXPOSURE</span>
            <span className="text-2xl font-black text-amber-700 block">18.4H</span>
            <span className="text-[9px] text-stone-500 font-bold block">Rotterdam corridor</span>
          </div>

          <div className="rounded border border-stone-300 bg-white p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] font-extrabold text-stone-500 block">ACTIVE DISRUPTIONS</span>
            <span className="text-2xl font-black text-[#991B1B] block">3</span>
            <span className="text-[9px] text-stone-500 font-bold block">1 Critical · 2 Warning</span>
          </div>

          <div className="rounded border border-stone-300 bg-white p-4 space-y-1 shadow-2xs">
            <span className="text-[10px] font-extrabold text-stone-500 block">AFFECTED ASSETS</span>
            <span className="text-2xl font-black text-stone-900 block">27</span>
            <span className="text-[9px] text-stone-500 font-bold block">Ports & vessels</span>
          </div>
        </div>

        {/* ── SECTION 4: LAYER CONTROLS BAR ─────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-stone-300 bg-white px-4 py-3 shadow-2xs font-mono text-[10px] font-extrabold text-stone-700">
          <div className="flex items-center gap-2">
            <Filter className="size-3.5 text-[#D94E28]" />
            <span>MAP RISK LAYERS:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(layers) as (keyof typeof layers)[]).map((k) => (
              <button
                key={k}
                onClick={() => toggleLayer(k)}
                className={`rounded border px-2.5 py-1 transition-all capitalize ${
                  layers[k]
                    ? 'bg-[#151719] text-white border-[#151719]'
                    : 'bg-stone-100 text-stone-500 border-stone-300 hover:text-stone-900'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* ── SECTION 1 & 2: MAIN WORKSPACE (MAP / NETWORK + DETAIL PANEL) ─────── */}
        <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr] items-start">
          {/* Main Visual workspace (Map or Network View) */}
          <div className="rounded-lg border-2 border-stone-300 bg-[#F4F2EC] p-6 shadow-md space-y-4 relative min-h-[560px] flex flex-col justify-between">
            {viewMode === 'MAP' ? (
              /* MAP VIEW: SVG Global Corridor Canvas */
              <div className="relative size-full min-h-[480px] space-y-4">
                <div className="flex items-center justify-between border-b border-stone-300 pb-3 text-xs font-mono font-black text-stone-900">
                  <span className="flex items-center gap-2">
                    <Globe2 className="size-4 text-[#D94E28]" /> GLOBAL MARITIME DIGITAL TWIN
                  </span>
                  <span className="text-[10px] text-stone-500">CLICK ANY PORT OR ROUTE TO INSPECT</span>
                </div>

                {/* SVG Visual Canvas */}
                <div className="relative h-[400px] w-full rounded border border-stone-300 bg-white p-4 overflow-hidden">
                  <svg className="size-full" viewBox="0 0 900 400" aria-label="Global Logistics Map">
                    {/* Subtle latitude lines */}
                    <line x1="0" y1="100" x2="900" y2="100" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="200" x2="900" y2="200" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="300" x2="900" y2="300" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />

                    {/* Primary Route: Mumbai (280,240) -> Singapore (540,260) -> Rotterdam (420,110) */}
                    {layers.routes && (
                      <>
                        {/* Primary Route (Red Alert Segment to Rotterdam) */}
                        <path
                          d="M 280 240 Q 400 270 540 260 T 420 110"
                          fill="none"
                          stroke="#B91C1C"
                          strokeWidth="3"
                          strokeDasharray="6 4"
                          className="animate-pulse cursor-pointer"
                          onClick={() => setSelectedAsset('ROUTE_PRIMARY')}
                        />
                        {/* Alternative Route: Mumbai (280,240) -> Colombo (340,270) -> Antwerp (390,115) */}
                        <path
                          d="M 280 240 Q 310 270 340 270 T 390 115"
                          fill="none"
                          stroke="#047857"
                          strokeWidth="2.5"
                          strokeDasharray="4 4"
                        />
                      </>
                    )}

                    {/* Rotterdam Disruption Zone Ring */}
                    {layers.disruptions && (
                      <circle cx="420" cy="110" r="28" fill="#991B1B" fillOpacity="0.15" stroke="#B91C1C" strokeWidth="1.5" className="animate-ping" />
                    )}

                    {/* Port Markers */}
                    {/* Mumbai */}
                    <g transform="translate(280, 240)" className="cursor-pointer" onClick={() => setSelectedAsset('MUMBAI')}>
                      <circle r="7" fill="#151719" />
                      <text x="12" y="4" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#151719">
                        MUMBAI (INNSA)
                      </text>
                    </g>

                    {/* Singapore */}
                    <g transform="translate(540, 260)" className="cursor-pointer" onClick={() => setSelectedAsset('SINGAPORE')}>
                      <circle r="7" fill="#D97706" />
                      <text x="12" y="4" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#151719">
                        SINGAPORE (SGSIN)
                      </text>
                    </g>

                    {/* Rotterdam (CRITICAL) */}
                    <g transform="translate(420, 110)" className="cursor-pointer" onClick={() => setSelectedAsset('ROTTERDAM')}>
                      <circle r="9" fill="#B91C1C" />
                      <text x="14" y="4" fontSize="11" fontWeight="900" fontFamily="monospace" fill="#991B1B">
                        ROTTERDAM (NLRTM) - 87% CRITICAL
                      </text>
                    </g>

                    {/* Antwerp (Alternative) */}
                    <g transform="translate(390, 115)" className="cursor-pointer" onClick={() => setSelectedAsset('ANTWERP')}>
                      <circle r="6" fill="#047857" />
                      <text x="-110" y="4" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="#047857">
                        ANTWERP (BEANR)
                      </text>
                    </g>

                    {/* Colombo */}
                    <g transform="translate(340, 270)" className="cursor-pointer" onClick={() => setSelectedAsset('COLOMBO')}>
                      <circle r="5" fill="#047857" />
                      <text x="10" y="12" fontSize="9" fontWeight="bold" fontFamily="monospace" fill="#555">
                        COLOMBO (LKCMB)
                      </text>
                    </g>

                    {/* Dubai */}
                    <g transform="translate(240, 200)" className="cursor-pointer" onClick={() => setSelectedAsset('DUBAI')}>
                      <circle r="5" fill="#555" />
                      <text x="-80" y="-8" fontSize="9" fontWeight="bold" fontFamily="monospace" fill="#555">
                        DUBAI (AEJEA)
                      </text>
                    </g>
                  </svg>

                  {/* On-Map Legend Bar */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-4 bg-white/95 border border-stone-300 rounded px-3 py-1.5 text-[9px] font-mono font-bold text-stone-700 shadow-2xs">
                    <span className="flex items-center gap-1">
                      <span className="size-2.5 rounded-full bg-[#B91C1C]" /> Primary Disrupted Route
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="size-2.5 rounded-full bg-[#047857]" /> Alternative Route
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* SECTION 6: NETWORK VIEW (Node Graph Dependency View) */
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between border-b border-stone-300 pb-3 text-xs font-mono font-black text-stone-900">
                  <span>SECTION 6 · NETWORK DEPENDENCY NODE GRAPH</span>
                  <span className="text-[10px] text-[#D94E28]">DOWNSTREAM IMPACT PROPAGATION</span>
                </div>

                {/* React Flow-like Node Flow Sequence */}
                <div className="grid gap-4 font-mono text-xs">
                  <div className="flex items-center justify-between rounded border border-stone-300 bg-white p-4 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <Warehouse className="size-5 text-stone-600" />
                      <div>
                        <span className="font-black text-stone-900">01 SUPPLIER (MUMBAI FACTORY)</span>
                        <p className="text-[10px] text-stone-500 font-bold">142 SKU Parts Allocated</p>
                      </div>
                    </div>
                    <span className="rounded bg-emerald-100 border border-emerald-300 px-2.5 py-1 text-[10px] font-black text-[#047857]">
                      NORMAL · 0% RISK
                    </span>
                  </div>

                  <div className="text-center text-[#D94E28] font-black">↓</div>

                  <div className="flex items-center justify-between rounded border border-stone-300 bg-white p-4 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <Ship className="size-5 text-[#D97706]" />
                      <div>
                        <span className="font-black text-stone-900">02 OCEAN VESSEL (MV ORION)</span>
                        <p className="text-[10px] text-stone-500 font-bold">Transit Speed: 8.2 Knots</p>
                      </div>
                    </div>
                    <span className="rounded bg-amber-100 border border-amber-300 px-2.5 py-1 text-[10px] font-black text-amber-800">
                      WARNING · 62% RISK
                    </span>
                  </div>

                  <div className="text-center text-[#D94E28] font-black">↓</div>

                  <div className="flex items-center justify-between rounded-2xl border-2 border-[#B91C1C] bg-[#FEF2F2] p-4 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <MapPin className="size-5 text-[#991B1B]" />
                      <div>
                        <span className="font-black text-[#7F1D1D]">03 ROTTERDAM CONTAINER PORT</span>
                        <p className="text-[10px] text-[#991B1B] font-bold">Berth Congestion: 87%</p>
                      </div>
                    </div>
                    <span className="rounded bg-[#B91C1C] text-white px-2.5 py-1 text-[10px] font-black">
                      CRITICAL · 91% RISK
                    </span>
                  </div>

                  <div className="text-center text-[#D94E28] font-black">↓ DOWNSTREAM PROPAGATION</div>

                  <div className="flex items-center justify-between rounded border border-stone-300 bg-white p-4 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <Warehouse className="size-5 text-[#991B1B]" />
                      <div>
                        <span className="font-black text-stone-900">04 ANTWERP CROSS-DOCK WAREHOUSE</span>
                        <p className="text-[10px] text-stone-500 font-bold">Buffer Depletion in 48H</p>
                      </div>
                    </div>
                    <span className="rounded bg-amber-100 border border-amber-300 px-2.5 py-1 text-[10px] font-black text-amber-800">
                      WARNING · 64% RISK
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── SECTION 2 & 5: RIGHT-SIDE ASSET & ROUTE INSPECTION PANEL ────────── */}
          <div className="rounded-lg border-2 border-stone-300 bg-white p-6 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-mono font-black text-[#D94E28]">ASSET INSPECTOR</span>
                <h3 className="text-xl font-black text-[#151719] mt-0.5">{activeAsset.title}</h3>
                <span className="text-[10px] font-mono text-stone-500 font-bold">[{activeAsset.code}] · {activeAsset.type}</span>
              </div>
              <span
                className={`rounded px-2.5 py-1 text-[10px] font-mono font-black ${
                  activeAsset.status === 'CRITICAL'
                    ? 'bg-[#B91C1C] text-white'
                    : activeAsset.status === 'WARNING'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-[#047857] border border-emerald-300'
                }`}
              >
                {activeAsset.status}
              </span>
            </div>

            {/* Asset KPI Metrics List */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">CONGESTION:</span>
                <span className="font-black text-stone-950">{activeAsset.congestion}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">CAPACITY UTILIZATION:</span>
                <span className="font-black text-stone-950">{activeAsset.utilization}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">EXPECTED DELAY:</span>
                <span className="font-black text-[#991B1B]">{activeAsset.expectedDelay}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">AFFECTED SHIPMENTS:</span>
                <span className="font-black text-stone-950">{activeAsset.affectedShipments}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">AFFECTED VESSELS:</span>
                <span className="font-black text-stone-950">{activeAsset.affectedVessels}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">ESTIMATED FINANCIAL IMPACT:</span>
                <span className="font-black text-[#D94E28]">{activeAsset.financialImpact}</span>
              </div>
            </div>

            {/* Primary Risk Drivers */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono font-black text-stone-500 block">PRIMARY RISK DRIVERS</span>
              <div className="space-y-1.5">
                {activeAsset.riskDrivers.map((driver, i) => (
                  <div key={i} className="flex items-center justify-between rounded bg-stone-50 p-2 text-xs font-bold border border-stone-200">
                    <span className="text-stone-800">{driver.name}</span>
                    <span className="font-mono text-[10px] font-black text-[#991B1B]">{driver.impact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: ROUTE INSPECTION (Mumbai -> Rotterdam) */}
            <div className="rounded border-2 border-orange-300 bg-orange-50/70 p-4 space-y-3 font-mono text-xs">
              <span className="text-[10px] font-black text-[#D94E28] block">SECTION 5 · ROUTE ANALYSIS</span>
              <div className="space-y-1">
                <div className="text-stone-900 font-black">Route: Mumbai → Singapore → Rotterdam</div>
                <div className="text-stone-600 text-[11px] font-bold">Disruption Risk: <span className="text-[#991B1B] font-black">73%</span></div>
                <div className="text-stone-600 text-[11px] font-bold">Expected Delay: <span className="text-[#991B1B] font-black">+18.4H</span></div>
                <div className="text-stone-600 text-[11px] font-bold">Estimated Cost: <span className="text-stone-950 font-black">$84,000</span></div>
              </div>

              <div className="pt-2 border-t border-orange-200 space-y-1">
                <span className="text-[10px] font-black text-[#047857] block">ALTERNATIVE ROUTE AVAILABLE</span>
                <div className="text-stone-900 font-bold text-[11px]">Mumbai → Colombo → Antwerp → Rotterdam</div>
                <div className="flex justify-between text-[11px] text-[#047857] font-black">
                  <span>Risk: 31%</span>
                  <span>Delay: +5.2H</span>
                  <span>Cost: $89K</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 7 & 8: REAL-TIME EVENT STREAM & NETWORK HEALTH ──────────── */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* SECTION 7: Active Network Events Feed */}
          <div className="rounded border border-stone-300 bg-white p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-mono font-black text-stone-900">SECTION 7 · ACTIVE NETWORK EVENTS</span>
              <span className="text-[10px] font-mono text-stone-500">REAL-TIME STREAM</span>
            </div>
            <div className="space-y-2.5 font-mono text-xs">
              {networkEvents.map((evt, idx) => (
                <div key={idx} className="flex items-center justify-between rounded bg-stone-50 p-2.5 border border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 text-[10px]">{evt.time}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-black ${
                        evt.type === 'CRITICAL'
                          ? 'bg-[#B91C1C] text-white'
                          : evt.type === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-[#047857]'
                      }`}
                    >
                      {evt.type}
                    </span>
                    <span className="text-stone-800 font-bold text-[11px]">{evt.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 8: Network Health Progress Indicators */}
          <div className="rounded border border-stone-300 bg-white p-5 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-mono font-black text-stone-900">SECTION 8 · NETWORK HEALTH METRICS</span>
              <span className="text-xs font-mono font-black text-[#047857]">82 / 100 OPERATIONAL</span>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-stone-700 font-bold">
                  <span>Route Reliability</span>
                  <span>78%</span>
                </div>
                <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                  <div className="bg-[#047857] h-full w-[78%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-stone-700 font-bold">
                  <span>Port Capacity</span>
                  <span>71%</span>
                </div>
                <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full w-[71%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-stone-700 font-bold">
                  <span>Fleet Availability</span>
                  <span>89%</span>
                </div>
                <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                  <div className="bg-[#047857] h-full w-[89%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-stone-700 font-bold">
                  <span>Warehouse Capacity</span>
                  <span>84%</span>
                </div>
                <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                  <div className="bg-[#047857] h-full w-[84%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-stone-300 bg-stone-900 text-white py-8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-12 text-xs text-stone-400">
          <div className="flex items-center gap-3">
            <span className="flex size-5 items-center justify-center rounded bg-[#D94E28] text-white font-mono text-[10px] font-black">
              F
            </span>
            <span className="font-black text-white">FLOWFORGE</span>
            <span>· PAGE 02: NETWORK INTELLIGENCE DIGITAL TWIN</span>
          </div>
          <Link href="/" className="hover:text-white transition-colors font-mono text-[10px] font-bold">
            RETURN TO PAGE 01 OVERVIEW →
          </Link>
        </div>
      </footer>
    </main>
  )
}
