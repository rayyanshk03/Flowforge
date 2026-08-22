'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
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
  Play,
  RefreshCw,
  Search,
  ShieldAlert,
  Ship,
  Sparkles,
  History,
  TrendingUp,
  Truck,
  Warehouse,
  X
} from 'lucide-react'
import DecisionHistoryDrawer from '@/components/DecisionHistoryDrawer'
import SystemSettingsModal from '@/components/SystemSettingsModal'
import CreateScenarioModal from '@/components/CreateScenarioModal'

// Incident type
type DisruptionId = 'ROTTERDAM' | 'ARABIAN_SEA' | 'SINGAPORE'

export default function DisruptionsPage() {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)
  const [selectedIncId, setSelectedIncId] = useState<DisruptionId>('ROTTERDAM')
  const [backendStatus, setBackendStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED')
  const [selectedNodeDetail, setSelectedNodeDetail] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>('14:09:32')

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch('http://localhost:8000/api/v1/health')
        if (res.ok) setBackendStatus('CONNECTED')
      } catch {
        setBackendStatus('DISCONNECTED')
      }
    }
    checkBackend()
    const timer = setInterval(() => {
      const d = new Date()
      setLastUpdated(d.toTimeString().split(' ')[0])
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Incident data
  const incidents: Record<DisruptionId, {
    id: DisruptionId
    location: string
    code: string
    type: string
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM'
    probability: number
    duration: string
    affectedShipments: number
    affectedVessels: number
    affectedWarehouses: number
    affectedDistPoints: number
    costExposure: string
    expectedDelay: string
    customerImpact: string
    confidence: number
    classification: string
    rootCauses: { name: string; impactPct: number; level: string }[]
    impactCascade: { time: string; text: string }[]
    trendRisk: { time: string; riskPct: number }[]
    impactedRoutes: { path: string; risk: string; delay: string; cost: string }[]
  }> = {
    ROTTERDAM: {
      id: 'ROTTERDAM',
      location: 'Rotterdam Port Terminal',
      code: 'NLRTM',
      type: 'Port Congestion & Berth Bottleneck',
      severity: 'CRITICAL',
      probability: 87,
      duration: '18–26 Hours',
      affectedShipments: 142,
      affectedVessels: 18,
      affectedWarehouses: 6,
      affectedDistPoints: 23,
      costExposure: '$82,400 USD',
      expectedDelay: '+18.4 Hours',
      customerImpact: '23%',
      confidence: 91,
      classification: 'PORT CONGESTION',
      rootCauses: [
        { name: 'PORT CONGESTION', impactPct: 87, level: 'HIGH' },
        { name: 'VESSEL BACKLOG', impactPct: 71, level: 'HIGH' },
        { name: 'WEATHER CONDITIONS', impactPct: 48, level: 'MEDIUM' },
        { name: 'BERTH UTILIZATION', impactPct: 92, level: 'HIGH' },
        { name: 'INBOUND VOLUME', impactPct: 64, level: 'MEDIUM' }
      ],
      impactCascade: [
        { time: 'T+0', text: 'Berth bottleneck anomaly detected at Rotterdam terminal.' },
        { time: 'T+4H', text: 'Vessel turnaround time increases by +6.2 hours.' },
        { time: 'T+8H', text: 'Arrival schedules shift for 18 feeder vessels.' },
        { time: 'T+12H', text: 'Antwerp cross-dock warehouse capacity imbalance.' },
        { time: 'T+18H', text: 'Tier 1 customer deliveries at risk of SLA breach.' },
        { time: 'T+24H', text: 'Demurrage and penalty clauses trigger $82.4K exposure.' }
      ],
      trendRisk: [
        { time: '08:00', riskPct: 31 },
        { time: '10:00', riskPct: 38 },
        { time: '12:00', riskPct: 49 },
        { time: '14:00', riskPct: 63 },
        { time: '16:00', riskPct: 73 },
        { time: '18:00', riskPct: 87 }
      ],
      impactedRoutes: [
        { path: 'Mumbai → Singapore → Rotterdam', risk: '73%', delay: '+18.4H', cost: '$84,000' },
        { path: 'Shanghai → Singapore → Rotterdam', risk: '68%', delay: '+14.2H', cost: '$54,000' },
        { path: 'Mumbai → Colombo → Antwerp → Rotterdam', risk: '31%', delay: '+5.2H', cost: '$89,000' }
      ]
    },
    ARABIAN_SEA: {
      id: 'ARABIAN_SEA',
      location: 'Arabian Sea Corridor',
      code: 'MARITIME_02',
      type: 'Severe Weather Anomaly',
      severity: 'HIGH',
      probability: 64,
      duration: '8–14 Hours',
      affectedShipments: 84,
      affectedVessels: 12,
      affectedWarehouses: 3,
      affectedDistPoints: 11,
      costExposure: '$38,600 USD',
      expectedDelay: '+9.6 Hours',
      customerImpact: '14%',
      confidence: 88,
      classification: 'SEVERE WEATHER',
      rootCauses: [
        { name: 'WAVE HEIGHT ANOMALY', impactPct: 78, level: 'HIGH' },
        { name: 'WIND SQUALL SEVERITY', impactPct: 64, level: 'HIGH' },
        { name: 'VESSEL SPEED REDUCTION', impactPct: 55, level: 'MEDIUM' }
      ],
      impactCascade: [
        { time: 'T+0', text: 'Wave height exceeds 4.5m safety threshold.' },
        { time: 'T+3H', text: 'Vessels reduce cruising speed to 8.2 knots.' },
        { time: 'T+6H', text: 'Colombo feeder slot schedule shifted.' }
      ],
      trendRisk: [
        { time: '08:00', riskPct: 22 },
        { time: '10:00', riskPct: 34 },
        { time: '12:00', riskPct: 48 },
        { time: '14:00', riskPct: 64 }
      ],
      impactedRoutes: [
        { path: 'Mumbai → Colombo → Rotterdam', risk: '64%', delay: '+9.6H', cost: '$42,000' }
      ]
    },
    SINGAPORE: {
      id: 'SINGAPORE',
      location: 'Singapore Port Feeder Hub',
      code: 'SGSIN',
      type: 'Transshipment Feeder Delay',
      severity: 'MEDIUM',
      probability: 42,
      duration: '4–8 Hours',
      affectedShipments: 38,
      affectedVessels: 6,
      affectedWarehouses: 2,
      affectedDistPoints: 8,
      costExposure: '$14,200 USD',
      expectedDelay: '+3.2 Hours',
      customerImpact: '8%',
      confidence: 84,
      classification: 'FEEDER DELAY',
      rootCauses: [
        { name: 'YARD CRANE QUEUE', impactPct: 52, level: 'MEDIUM' },
        { name: 'FEEDER SLOT GAP', impactPct: 41, level: 'MEDIUM' }
      ],
      impactCascade: [
        { time: 'T+0', text: 'Feeder slot delay at Singapore Terminal 3.' },
        { time: 'T+2H', text: 'Cross-dock feeder transfer delayed by 3.2 hours.' }
      ],
      trendRisk: [
        { time: '08:00', riskPct: 15 },
        { time: '10:00', riskPct: 28 },
        { time: '12:00', riskPct: 42 }
      ],
      impactedRoutes: [
        { path: 'Shanghai → Singapore → Rotterdam', risk: '42%', delay: '+3.2H', cost: '$28,000' }
      ]
    }
  }

  const activeInc = incidents[selectedIncId]

  // Chronological Event Stream
  const eventStream = [
    { time: '14:09:32', event: 'Rotterdam (NLRTM) congestion increased from 82% → 87%.', severity: 'CRITICAL' },
    { time: '14:07:15', event: 'Three additional ocean vessels entered the Rotterdam anchoring queue.', severity: 'WARNING' },
    { time: '14:05:01', event: 'Weather severity index increased in Arabian Sea corridor (Wave: 4.8m).', severity: 'WARNING' },
    { time: '14:02:44', event: 'New port congestion disruption detected by FlowForge signal monitor.', severity: 'CRITICAL' },
    { time: '13:55:10', event: 'Singapore transshipment feeder slot queue resolved.', severity: 'RESOLVED' }
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
          <nav className="flex items-center gap-6 text-xs font-semibold text-[#667085]">
            <Link href="/" className="hover:text-[#111827] transition-colors pb-1">
              Overview
            </Link>
            <Link href="/disruptions" className="text-[#D94E28] font-bold border-b-2 border-[#D94E28] pb-1">
              Intelligence
            </Link>
            <Link href="/network" className="hover:text-[#111827] transition-colors pb-1">
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
            <span className="hidden md:flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-stone-700 whitespace-nowrap">
              <span className={`size-2 rounded-full ${backendStatus === 'CONNECTED' ? 'bg-[#047857] animate-pulse' : 'bg-[#D94E28]'}`} />
              {backendStatus === 'CONNECTED' ? 'LIVE' : 'STANDBY'}
            </span>
            <Link
              href="/network"
              className="hidden lg:flex items-center gap-1.5 rounded border border-stone-300 bg-white px-3 py-1.5 text-[10px] font-mono font-black text-stone-800 hover:bg-stone-50 transition-all shadow-2xs whitespace-nowrap"
            >
              ENTER CONTROL TOWER →
            </Link>
          </div>
        </div>
        <DecisionHistoryDrawer isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
        <SystemSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <CreateScenarioModal isOpen={createScenarioOpen} onClose={() => setCreateScenarioOpen(false)} />
      </header>

      {/* ── PAGE TITLE BAR & INCIDENT METRIC BADGES ───────────────────────── */}
      <div className="border-b border-stone-300 bg-white py-5">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-black tracking-widest text-[#D94E28]">
              <ShieldAlert className="size-3.5" /> PAGE 03 · INCIDENT RESPONSE & PROPAGATION CENTER
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#151719] md:text-3xl mt-0.5">
              DISRUPTION INTELLIGENCE
            </h1>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">
              Detect, assess and trace the operational impact of events across the network.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs font-black">
            <div className="rounded border border-stone-300 bg-stone-50 px-3 py-1.5 text-stone-900">
              ACTIVE DISRUPTIONS: <strong className="text-[#D94E28]">03</strong>
            </div>
            <div className="rounded border border-red-300 bg-red-50 px-3 py-1.5 text-[#991B1B]">
              CRITICAL: 01
            </div>
            <div className="rounded border border-amber-300 bg-amber-50 px-3 py-1.5 text-amber-800">
              HIGH: 01
            </div>
            <div className="rounded border border-stone-300 bg-stone-50 px-3 py-1.5 text-stone-700">
              MEDIUM: 01
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-12 space-y-8">
        {/* ── MAIN 2-COLUMN WORKSPACE ────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr] items-start">
          {/* SECTION 1: Left-Side Incident Queue */}
          <div className="space-y-4">
            <span className="text-xs font-mono font-black text-stone-500 block">
              SECTION 1 · ACTIVE DISRUPTION QUEUE
            </span>
            <div className="space-y-3 font-mono">
              {(Object.keys(incidents) as DisruptionId[]).map((key) => {
                const inc = incidents[key]
                const isSelected = selectedIncId === key
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedIncId(key)}
                    className={`rounded border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-2 border-[#D94E28] bg-orange-50/80 shadow-md ring-2 ring-[#D94E28]/30'
                        : 'border-stone-300 bg-white hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-stone-950">{inc.location}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-[9px] font-black ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-[#B91C1C] text-white'
                            : inc.severity === 'HIGH'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-sans font-bold text-stone-600">{inc.type}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-stone-700 border-t border-stone-200 pt-2 font-bold">
                      <div>Prob: <span className="font-black text-[#D94E28]">{inc.probability}%</span></div>
                      <div>Duration: <span className="font-black text-stone-900">{inc.duration}</span></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Detailed Disruption Intelligence */}
          <div className="space-y-8">
            {/* SECTION 2: Selected Disruption Overview Panel */}
            <div className="rounded-lg border-2 border-stone-300 bg-white p-6 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-black text-[#D94E28]">
                    SECTION 2 · INCIDENT DETAIL INSPECTION
                  </span>
                  <h3 className="text-2xl font-black text-[#151719] mt-0.5">{activeInc.location}</h3>
                  <p className="text-xs text-stone-600 font-semibold">{activeInc.type} [{activeInc.code}]</p>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="rounded bg-[#B91C1C] text-white px-3 py-1 text-xs font-black">
                    STATUS: {activeInc.severity}
                  </span>
                  <span className="rounded bg-stone-100 border border-stone-300 px-3 py-1 text-xs font-bold text-stone-800">
                    Confidence: {activeInc.confidence}%
                  </span>
                </div>
              </div>

              {/* 6 Key Operational Impact Counters */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-6 font-mono text-center">
                <div className="rounded bg-stone-50 p-3 border border-stone-200">
                  <span className="text-[9px] text-stone-500 font-extrabold block">PROBABILITY</span>
                  <span className="text-xl font-black text-[#D94E28] block">{activeInc.probability}%</span>
                </div>
                <div className="rounded bg-stone-50 p-3 border border-stone-200">
                  <span className="text-[9px] text-stone-500 font-extrabold block">DURATION</span>
                  <span className="text-xl font-black text-stone-900 block">{activeInc.duration}</span>
                </div>
                <div className="rounded bg-stone-50 p-3 border border-stone-200">
                  <span className="text-[9px] text-stone-500 font-extrabold block">SHIPMENTS</span>
                  <span className="text-xl font-black text-[#991B1B] block">{activeInc.affectedShipments}</span>
                </div>
                <div className="rounded bg-stone-50 p-3 border border-stone-200">
                  <span className="text-[9px] text-stone-500 font-extrabold block">VESSELS</span>
                  <span className="text-xl font-black text-stone-900 block">{activeInc.affectedVessels}</span>
                </div>
                <div className="rounded bg-stone-50 p-3 border border-stone-200">
                  <span className="text-[9px] text-stone-500 font-extrabold block">ETA DELAY</span>
                  <span className="text-xl font-black text-[#991B1B] block">{activeInc.expectedDelay}</span>
                </div>
                <div className="rounded bg-stone-50 p-3 border border-stone-200">
                  <span className="text-[9px] text-stone-500 font-extrabold block">FINANCIAL</span>
                  <span className="text-xl font-black text-[#D94E28] block">{activeInc.costExposure}</span>
                </div>
              </div>
            </div>

            {/* SECTION 3: Root Cause Signals Panel */}
            <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4">
              <span className="text-xs font-mono font-black text-stone-900 block">
                SECTION 3 · ROOT CAUSE SIGNALS (WHY IS THIS HAPPENING?)
              </span>
              <div className="space-y-3 font-mono text-xs">
                {activeInc.rootCauses.map((cause, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-stone-800 font-bold">
                      <span>{cause.name}</span>
                      <span className="font-black text-[#D94E28]">{cause.impactPct}% (Impact: {cause.level})</span>
                    </div>
                    <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                      <div className="bg-[#D94E28] h-full" style={{ width: `${cause.impactPct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: Disruption Propagation Chain Visualization */}
            <div className="rounded-lg border-2 border-stone-300 bg-[#F4F2EC] p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-stone-300 pb-3">
                <span className="text-xs font-mono font-black text-stone-900">
                  SECTION 4 · DISRUPTION NETWORK PROPAGATION
                </span>
                <span className="text-[10px] font-mono text-stone-500">CLICK ANY NODE TO INSPECT DOWNSTREAM</span>
              </div>

              {/* Propagation Sequence */}
              <div className="grid gap-3 font-mono text-xs md:grid-cols-5 text-center">
                <div
                  onClick={() => setSelectedNodeDetail('PORT')}
                  className="rounded border-2 border-[#B91C1C] bg-[#FEF2F2] p-3 space-y-1 cursor-pointer hover:shadow-xs"
                >
                  <span className="text-[9px] text-[#991B1B] font-black block">DISRUPTION NODE</span>
                  <span className="font-black text-[#7F1D1D] text-xs block">{activeInc.code} PORT</span>
                  <span className="text-[10px] text-stone-600 font-bold">CRITICAL</span>
                </div>

                <div
                  onClick={() => setSelectedNodeDetail('VESSELS')}
                  className="rounded border border-stone-300 bg-white p-3 space-y-1 cursor-pointer hover:border-[#D94E28]"
                >
                  <span className="text-[9px] text-stone-500 font-bold block">AFFECTED VESSELS</span>
                  <span className="font-black text-stone-900 text-xs block">{activeInc.affectedVessels} VESSELS</span>
                  <span className="text-[10px] text-amber-700 font-bold">WARNING</span>
                </div>

                <div
                  onClick={() => setSelectedNodeDetail('SHIPMENTS')}
                  className="rounded border border-stone-300 bg-white p-3 space-y-1 cursor-pointer hover:border-[#D94E28]"
                >
                  <span className="text-[9px] text-stone-500 font-bold block">SHIPMENTS</span>
                  <span className="font-black text-stone-900 text-xs block">{activeInc.affectedShipments} SKU LINES</span>
                  <span className="text-[10px] text-amber-700 font-bold">WARNING</span>
                </div>

                <div
                  onClick={() => setSelectedNodeDetail('WAREHOUSES')}
                  className="rounded border border-stone-300 bg-white p-3 space-y-1 cursor-pointer hover:border-[#D94E28]"
                >
                  <span className="text-[9px] text-stone-500 font-bold block">WAREHOUSES</span>
                  <span className="font-black text-stone-900 text-xs block">{activeInc.affectedWarehouses} HUBS</span>
                  <span className="text-[10px] text-stone-600 font-bold">BUFFER RISKS</span>
                </div>

                <div
                  onClick={() => setSelectedNodeDetail('CUSTOMERS')}
                  className="rounded border border-stone-300 bg-white p-3 space-y-1 cursor-pointer hover:border-[#D94E28]"
                >
                  <span className="text-[9px] text-stone-500 font-bold block">DELIVERY RISK</span>
                  <span className="font-black text-[#991B1B] text-xs block">{activeInc.affectedDistPoints} STORES</span>
                  <span className="text-[10px] text-[#991B1B] font-bold">SLA EXPOSURE</span>
                </div>
              </div>

              {/* Selected Node Popover */}
              {selectedNodeDetail && (
                <div className="rounded bg-white p-4 border border-stone-300 font-mono text-xs flex justify-between items-center">
                  <div>
                    <span className="text-[#D94E28] font-black">SELECTED NODE: {selectedNodeDetail}</span>
                    <p className="text-[#151719] font-bold mt-0.5">
                      Detailed downstream impact analysis loaded for {selectedNodeDetail}. Operational buffer depleting.
                    </p>
                  </div>
                  <button onClick={() => setSelectedNodeDetail(null)} className="text-stone-400 hover:text-stone-900 font-bold">
                    [CLOSE]
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── SECTION 5 & 7: IMPACT CASCADE & RISK TREND ─────────────────────── */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* SECTION 5: Expected Impact Cascade Timeline */}
          <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4">
            <span className="text-xs font-mono font-black text-stone-900 block">
              SECTION 5 · EXPECTED IMPACT CASCADE TIMELINE
            </span>
            <div className="space-y-3 font-mono text-xs">
              {activeInc.impactCascade.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 border-l-2 border-stone-300 pl-3 py-1">
                  <span className="font-black text-[#D94E28] text-[10px] w-12">{step.time}</span>
                  <span className="text-stone-800 font-bold text-[11px]">{step.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: Disruption Risk Over Time Chart */}
          <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-mono font-black text-stone-900">
                SECTION 7 · DISRUPTION RISK OVER TIME
              </span>
              <span className="text-[10px] font-mono text-[#991B1B] font-black">DETERIORATING TREND</span>
            </div>

            {/* Time-series bar chart */}
            <div className="space-y-3 font-mono text-xs pt-2">
              {activeInc.trendRisk.map((pt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-12 text-[10px] text-stone-500 font-bold">{pt.time}</span>
                  <div className="h-3 flex-1 bg-stone-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${pt.riskPct >= 70 ? 'bg-[#991B1B]' : pt.riskPct >= 45 ? 'bg-amber-600' : 'bg-[#047857]'}`}
                      style={{ width: `${pt.riskPct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-black text-stone-900">{pt.riskPct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 8 & 9 & 10: CONFIDENCE, EVENTS & IMPACTED ROUTES ──────── */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* SECTION 8: Detection Confidence */}
          <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-2xs space-y-4 font-mono text-xs">
            <span className="text-[10px] font-black text-stone-500 block">SECTION 8 · MODEL DETECTION CONFIDENCE</span>
            <div className="text-3xl font-black text-[#047857]">{activeInc.confidence}%</div>
            <div className="space-y-1 text-[11px] text-stone-700 font-bold border-t border-stone-200 pt-3">
              <div>Classification: <span className="font-black text-stone-900">{activeInc.classification}</span></div>
              <div>Duration Confidence: <span className="font-black text-stone-900">84%</span></div>
              <div>Impact Confidence: <span className="font-black text-stone-900">88%</span></div>
            </div>
            <p className="text-[9px] text-stone-500 font-semibold pt-1">
              "Confidence reflects agreement across available operational and external signals."
            </p>
          </div>

          {/* SECTION 9: Live Event Feed */}
          <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-2xs space-y-3 font-mono text-xs">
            <span className="text-[10px] font-black text-stone-500 block">SECTION 9 · LIVE CHRONOLOGICAL EVENT STREAM</span>
            <div className="space-y-2">
              {eventStream.map((evt, idx) => (
                <div key={idx} className="border-b border-stone-100 pb-1.5 text-[10px]">
                  <span className="text-stone-400">{evt.time}</span> - <span className="font-bold text-stone-900">{evt.event}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 10: Impacted Routes */}
          <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-2xs space-y-3 font-mono text-xs">
            <span className="text-[10px] font-black text-stone-500 block">SECTION 10 · IMPACTED NETWORK CORRIDORS</span>
            <div className="space-y-2.5">
              {activeInc.impactedRoutes.map((rt, idx) => (
                <div key={idx} className="rounded bg-stone-50 p-2.5 border border-stone-200 space-y-1">
                  <div className="font-black text-[#151719] text-[11px]">{rt.path}</div>
                  <div className="flex justify-between text-[10px] text-stone-700 font-bold">
                    <span>Risk: <strong className="text-[#991B1B] font-black">{rt.risk}</strong></span>
                    <span>Delay: <strong className="text-[#991B1B] font-black">{rt.delay}</strong></span>
                    <span>Cost: <strong className="text-stone-950 font-black">{rt.cost}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 11: TRIGGER SIMULATION TRANSITION ──────────────────────── */}
        <div className="rounded-lg border-2 border-stone-300 bg-[#F4F2EC] p-8 text-center shadow-md space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-[#151719] tracking-tight">
              THE DISRUPTION IS UNDERSTOOD.<br />
              NOW WHAT HAPPENS NEXT?
            </h2>
            <p className="text-xs text-stone-700 font-semibold">
              FlowForge can simulate thousands of possible futures to determine how this event may evolve.
            </p>
          </div>

          <div>
            <Link
              href="/simulation"
              className="inline-flex items-center gap-2 rounded bg-[#D94E28] px-8 py-4 text-xs font-black text-white transition-all hover:bg-[#C84B24] shadow-md hover:shadow-lg"
            >
              <span>RUN SIMULATION →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-stone-300 bg-stone-900 text-white py-8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-12 text-xs text-stone-400">
          <div className="flex items-center gap-3">
            <span className="flex size-5 items-center justify-center rounded bg-[#D94E28] text-white font-mono text-[10px] font-black">
              F
            </span>
            <span className="font-black text-white">FLOWFORGE</span>
            <span>· PAGE 03: DISRUPTION INTELLIGENCE CENTER</span>
          </div>
          <Link href="/network" className="hover:text-white transition-colors font-mono text-[10px] font-bold">
            ← RETURN TO PAGE 02 NETWORK
          </Link>
        </div>
      </footer>
    </main>
  )
}
