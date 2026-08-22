'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import {
  ArrowRight,
  AlertTriangle,
  Award,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Globe2,
  History,
  RotateCcw,
  Search,
  ShieldAlert,
  Ship,
  Sparkles,
  Warehouse,
  X
} from 'lucide-react'

interface DecisionHistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
}

type StatusFilter = 'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED' | 'STALE'
type SeverityFilter = 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'

interface DecisionItem {
  id: string
  createdDate: string
  approvedDate?: string
  disruption: string
  action: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'STALE'
  confidence: number
  riskBefore: number
  riskAfter: number
  lossAvoided: string
  extraCost: string
  netBenefit: string
  delayReduction: string
  simRef: string
  simRuns: string
  predictedDelay: string
  predictedLoss: string
  actualDelay?: string
  actualLoss?: string
  predictionAccuracy?: string
  alternatives: { route: string; risk: number; loss: string; status: 'SELECTED' | 'REJECTED' }[]
  timeline: { time: string; event: string; status: string }[]
  trace: string[]
}

const sampleDecisions: DecisionItem[] = [
  {
    id: 'DEC-00421',
    createdDate: '22 Aug 2026 · 14:08',
    approvedDate: '22 Aug 2026 · 14:11',
    disruption: 'ROTTERDAM PORT CONGESTION',
    action: 'Reroute 142 shipments via Antwerp',
    severity: 'CRITICAL',
    status: 'APPROVED',
    confidence: 91,
    riskBefore: 73,
    riskAfter: 28,
    lossAvoided: '$63,000 USD',
    extraCost: '+$4,700 USD',
    netBenefit: '+$58,300 USD',
    delayReduction: '13.2 Hours',
    simRef: 'SIM-9281',
    simRuns: '10,000 Scenarios',
    predictedDelay: '5.2 Hours',
    predictedLoss: '$19,000 USD',
    actualDelay: '4.7 Hours',
    actualLoss: '$17,800 USD',
    predictionAccuracy: '91%',
    alternatives: [
      { route: 'Current Route (Rotterdam)', risk: 73, loss: '$82,000', status: 'REJECTED' },
      { route: 'Route via Colombo', risk: 42, loss: '$41,000', status: 'REJECTED' },
      { route: 'Route via Antwerp', risk: 28, loss: '$19,000', status: 'SELECTED' }
    ],
    timeline: [
      { time: '14:02:11', event: 'Rotterdam Port congestion disruption detected (87%).', status: 'CRITICAL' },
      { time: '14:04:40', event: 'Impact assessment completed (142 shipments exposed).', status: 'COMPLETED' },
      { time: '14:06:30', event: '10,000 Monte Carlo stochastic scenarios initiated (SIM-9281).', status: 'COMPLETED' },
      { time: '14:08:10', event: 'XGBoost cost & delay objective function optimized.', status: 'COMPLETED' },
      { time: '14:08:32', event: 'Route via Antwerp selected as most robust strategy.', status: 'SELECTED' },
      { time: '14:11:05', event: 'Decision approved for operational execution.', status: 'APPROVED' }
    ],
    trace: [
      'Input Conditions: Rotterdam berth congestion 87%, North Sea weather wave 4.8m.',
      'Disruption Analysis: 142 SKU lines exposed across 18 ocean vessels.',
      'Monte Carlo Engine: 10,000 stochastic futures simulated across 72H horizon (P90: +13.7H, P95: +18.2H).',
      'Route Optimization: Rotterdam Primary (73% Risk), Colombo (42% Risk), Antwerp (28% Risk).',
      'Cost Optimization: Extra transport cost $4.7K vs expected loss avoided $63.0K.',
      'Selected Recommendation: Reroute via Antwerp (BEANR) selected with 91% confidence.'
    ]
  },
  {
    id: 'DEC-00420',
    createdDate: '22 Aug 2026 · 13:42',
    approvedDate: '22 Aug 2026 · 13:45',
    disruption: 'SINGAPORE VESSEL DELAY',
    action: 'Reroute 84 shipments via Colombo',
    severity: 'HIGH',
    status: 'APPROVED',
    confidence: 88,
    riskBefore: 61,
    riskAfter: 34,
    lossAvoided: '$27,000 USD',
    extraCost: '+$3,200 USD',
    netBenefit: '+$23,800 USD',
    delayReduction: '8.4 Hours',
    simRef: 'SIM-9274',
    simRuns: '10,000 Scenarios',
    predictedDelay: '4.1 Hours',
    predictedLoss: '$14,200 USD',
    actualDelay: '4.0 Hours',
    actualLoss: '$13,900 USD',
    predictionAccuracy: '94%',
    alternatives: [
      { route: 'Current Route (Singapore)', risk: 61, loss: '$41,200', status: 'REJECTED' },
      { route: 'Route via Colombo', risk: 34, loss: '$14,200', status: 'SELECTED' }
    ],
    timeline: [
      { time: '13:40:02', event: 'Singapore feeder gate queue detected.', status: 'WARNING' },
      { time: '13:42:15', event: 'Decision generated & approved by operator.', status: 'APPROVED' }
    ],
    trace: [
      'Input Conditions: Singapore feeder slot queue delayed by 6.2H.',
      'Monte Carlo Engine: 10,000 scenarios evaluated (SIM-9274).',
      'Selected Recommendation: Reroute via Colombo selected with 88% confidence.'
    ]
  },
  {
    id: 'DEC-00419',
    createdDate: '22 Aug 2026 · 12:18',
    disruption: 'ARABIAN SEA WEATHER',
    action: 'Delay shipment release by 4 hours',
    severity: 'MEDIUM',
    status: 'PENDING',
    confidence: 84,
    riskBefore: 52,
    riskAfter: 31,
    lossAvoided: '$11,400 USD',
    extraCost: '+$800 USD',
    netBenefit: '+$10,600 USD',
    delayReduction: '4.0 Hours',
    simRef: 'SIM-9260',
    simRuns: '10,000 Scenarios',
    predictedDelay: '2.5 Hours',
    predictedLoss: '$8,200 USD',
    alternatives: [
      { route: 'Direct Departure', risk: 52, loss: '$19,600', status: 'REJECTED' },
      { route: 'Delay Release +4H', risk: 31, loss: '$8,200', status: 'SELECTED' }
    ],
    timeline: [
      { time: '12:15:00', event: 'Arabian Sea wave height threshold warning.', status: 'WARNING' },
      { time: '12:18:04', event: 'Decision pending operator review.', status: 'PENDING' }
    ],
    trace: [
      'Input Conditions: Wave height 4.5m in Arabian Sea.',
      'Selected Recommendation: Delay release +4H to bypass storm wave peak.'
    ]
  },
  {
    id: 'DEC-00417',
    createdDate: '22 Aug 2026 · 11:05',
    disruption: 'HAMBURG BERTH STRIKE',
    action: 'Emergency Diversion via Gdansk',
    severity: 'HIGH',
    status: 'REJECTED',
    confidence: 76,
    riskBefore: 68,
    riskAfter: 54,
    lossAvoided: '$4,200 USD',
    extraCost: '+$12,800 USD',
    netBenefit: '-$8,600 USD',
    delayReduction: '1.2 Hours',
    simRef: 'SIM-9251',
    simRuns: '10,000 Scenarios',
    predictedDelay: '11.4 Hours',
    predictedLoss: '$34,000 USD',
    alternatives: [
      { route: 'Direct Route (Hamburg)', risk: 68, loss: '$38,200', status: 'SELECTED' },
      { route: 'Diversion via Gdansk', risk: 54, loss: '$34,000', status: 'REJECTED' }
    ],
    timeline: [
      { time: '11:00:00', event: 'Berth strike warning detected in Hamburg.', status: 'WARNING' },
      { time: '11:05:12', event: 'Diversion proposal rejected due to high transit surcharge.', status: 'REJECTED' }
    ],
    trace: [
      'Input Conditions: High rail freight surcharges via Gdansk offset disruption risk reduction.',
      'Decision Outcome: Recommendation REJECTED by human operator feedback loop.'
    ]
  },
  {
    id: 'DEC-00418',
    createdDate: '22 Aug 2026 · 09:30',
    disruption: 'COLOMBO YARD BOTTLENECK',
    action: 'Reallocate 36 TEU to Rail Feeder',
    severity: 'MEDIUM',
    status: 'STALE',
    confidence: 81,
    riskBefore: 48,
    riskAfter: 29,
    lossAvoided: '$8,200 USD',
    extraCost: '+$1,100 USD',
    netBenefit: '+$7,100 USD',
    delayReduction: '3.1 Hours',
    simRef: 'SIM-9242',
    simRuns: '10,000 Scenarios',
    predictedDelay: '2.0 Hours',
    predictedLoss: '$4,100 USD',
    alternatives: [
      { route: 'Standard Ocean Feeder', risk: 48, loss: '$12,300', status: 'REJECTED' },
      { route: 'Rail Feeder Allocation', risk: 29, loss: '$4,100', status: 'SELECTED' }
    ],
    timeline: [
      { time: '09:28:10', event: 'Yard congestion anomaly in Colombo.', status: 'WARNING' },
      { time: '10:45:00', event: 'Network conditions changed. Decision marked STALE.', status: 'STALE' }
    ],
    trace: [
      'Input Conditions: Yard crane backlog cleared.',
      'Note: Network conditions updated. Recommendation marked STALE.'
    ]
  }
]

export default function DecisionHistoryDrawer({ isOpen, onClose }: DecisionHistoryDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [selectedDecId, setSelectedDecId] = useState<string>('DEC-00421')
  const [expandTrace, setExpandTrace] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filtered decisions list
  const filteredDecisions = sampleDecisions.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.disruption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.action.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Ensure active decision is set dynamically
  const activeDec =
    filteredDecisions.find((d) => d.id === selectedDecId) ||
    filteredDecisions[0] ||
    sampleDecisions[0]

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex justify-end overflow-hidden">
      {/* Solid Dark Backdrop */}
      <div className="fixed inset-0 bg-stone-950/75 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Right-Side Drawer Container (Full Viewport Height) */}
      <div className="relative z-[100000] flex h-screen w-full flex-col bg-[#F6F6F3] shadow-2xl transition-all md:w-[85vw] lg:w-[75vw] max-w-[1400px] border-l-2 border-stone-400 overflow-hidden">
        {/* ── DRAWER HEADER ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 border-b border-stone-300 bg-white p-5 md:px-8 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-black tracking-widest text-[#D94E28]">
                <History className="size-3.5" /> SYSTEM AUDITABILITY & DECISION HISTORY LAYER
              </div>
              <h2 className="text-2xl font-black tracking-tight text-[#151719] mt-0.5">
                DECISION HISTORY
              </h2>
              <p className="text-xs text-stone-600 font-semibold mt-0.5">
                Review previous analyses, recommendations and operational outcomes.
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 rounded border border-stone-300 bg-stone-100 px-3 py-1.5 text-xs font-black text-stone-800 hover:bg-stone-200 transition-colors shadow-2xs font-mono"
            >
              <X className="size-4" /> CLOSE ×
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs font-bold pt-1 border-t border-stone-200">
            <div className="rounded bg-stone-100 px-3 py-1 text-stone-900 border border-stone-300">
              TOTAL DECISIONS: <strong className="font-black">24</strong>
            </div>
            <div className="rounded bg-emerald-100 px-3 py-1 text-[#047857] border border-emerald-300 font-black">
              APPROVED: 18
            </div>
            <div className="rounded bg-amber-100 px-3 py-1 text-amber-800 border border-amber-300 font-black">
              PENDING: 4
            </div>
            <div className="rounded bg-red-100 px-3 py-1 text-[#991B1B] border border-red-300 font-black">
              REJECTED: 1
            </div>
            <div className="rounded bg-stone-200 px-3 py-1 text-stone-700 border border-stone-300 font-black">
              STALE: 2
            </div>
          </div>
        </div>

        {/* ── SEARCH & FILTERS BAR ───────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-300 bg-white px-5 py-3 md:px-8 font-mono text-xs shrink-0">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-2.5 size-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search decisions, routes or disruptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-stone-300 bg-stone-50 pl-9 pr-3 py-1.5 text-xs font-semibold text-stone-900 focus:border-[#D94E28] focus:outline-none"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 text-[10px] font-black">
            <span className="text-stone-500 mr-1">STATUS:</span>
            {(['ALL', 'APPROVED', 'PENDING', 'REJECTED', 'STALE'] as StatusFilter[]).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded border px-2.5 py-1 transition-all ${
                  statusFilter === st
                    ? 'bg-[#151719] text-white border-[#151719] shadow-2xs font-black'
                    : 'bg-stone-100 text-stone-600 border-stone-300 hover:text-stone-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN DRAWER SPLIT WORKSPACE ────────────────────────────────────── */}
        <div className="grid flex-1 overflow-hidden lg:grid-cols-[1fr_1.6fr] bg-white">
          {/* LEFT: Chronological Decision List */}
          <div className="overflow-y-auto border-r border-stone-300 bg-white p-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center pb-1 border-b border-stone-200 text-[10px] font-black text-stone-500">
              <span>CHRONOLOGICAL AUDIT LOG</span>
              <span>{filteredDecisions.length} ITEMS</span>
            </div>

            {filteredDecisions.length === 0 ? (
              <div className="rounded border border-dashed border-stone-300 bg-stone-50 p-8 text-center space-y-2">
                <ShieldAlert className="size-6 text-stone-400 mx-auto" />
                <p className="text-xs font-black text-stone-800">No decisions match filter "{statusFilter}"</p>
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className="text-[10px] text-[#D94E28] font-black hover:underline"
                >
                  RESET FILTER TO ALL
                </button>
              </div>
            ) : (
              filteredDecisions.map((item) => {
                const isSelected = item.id === activeDec.id
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDecId(item.id)}
                    className={`rounded border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-2 border-[#D94E28] bg-orange-50/90 shadow-md ring-2 ring-[#D94E28]/30'
                        : 'border-stone-300 bg-stone-50 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-black">
                      <span className="text-[#D94E28]">{item.id}</span>
                      <span className="text-stone-400 font-bold">{item.createdDate}</span>
                    </div>

                    <h4 className="mt-1 text-xs font-black text-stone-900">{item.disruption}</h4>
                    <p className="mt-0.5 text-[11px] font-sans font-bold text-stone-600">{item.action}</p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-200 text-[10px] font-bold">
                      <span className="text-stone-600">Risk: {item.riskBefore}% → <strong className="text-[#047857] font-black">{item.riskAfter}%</strong></span>
                      <span className="text-[#047857] font-black">{item.lossAvoided}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-black ${
                          item.status === 'APPROVED'
                            ? 'bg-emerald-100 text-[#047857]'
                            : item.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'REJECTED'
                            ? 'bg-red-100 text-[#991B1B]'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        ● {item.status}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* RIGHT: Detailed Decision Audit Inspection Panel */}
          <div className="overflow-y-auto p-6 md:p-8 space-y-6 bg-[#F6F6F3]">
            {/* Decision Title Header */}
            <div className="rounded-lg border-2 border-stone-300 bg-white p-6 shadow-md space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono font-black text-[#D94E28]">
                    <span>{activeDec.id}</span> · <span>CREATED {activeDec.createdDate}</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#151719] mt-0.5">{activeDec.disruption}</h3>
                  <p className="text-xs text-stone-600 font-semibold">{activeDec.action}</p>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span
                    className={`rounded px-3 py-1.5 text-xs font-black ${
                      activeDec.status === 'APPROVED'
                        ? 'bg-emerald-100 text-[#047857] border border-emerald-300'
                        : activeDec.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : activeDec.status === 'REJECTED'
                        ? 'bg-red-100 text-[#991B1B] border border-red-300'
                        : 'bg-stone-200 text-stone-700 border border-stone-300'
                    }`}
                  >
                    ● {activeDec.status}
                  </span>
                  <span className="rounded bg-stone-100 border border-stone-300 px-3 py-1.5 text-xs font-black text-stone-800">
                    Confidence: {activeDec.confidence}%
                  </span>
                </div>
              </div>

              {/* Business Impact Metrics */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 font-mono text-center">
                <div className="rounded bg-stone-50 p-3 border border-stone-200">
                  <span className="text-[9px] text-stone-500 font-extrabold block">RISK REDUCTION</span>
                  <span className="text-lg font-black text-[#047857] block">-{activeDec.riskBefore - activeDec.riskAfter} pts</span>
                </div>
                <div className="rounded bg-stone-50 p-3 border border-stone-200">
                  <span className="text-[9px] text-stone-500 font-extrabold block">DELAY REDUCTION</span>
                  <span className="text-lg font-black text-[#047857] block">{activeDec.delayReduction}</span>
                </div>
                <div className="rounded bg-stone-50 p-3 border border-stone-200">
                  <span className="text-[9px] text-stone-500 font-extrabold block">LOSS AVOIDED</span>
                  <span className="text-lg font-black text-[#047857] block">{activeDec.lossAvoided}</span>
                </div>
                <div className="rounded bg-stone-50 p-3 border border-stone-200">
                  <span className="text-[9px] text-stone-500 font-extrabold block">NET BENEFIT</span>
                  <span className="text-lg font-black text-stone-950 block">{activeDec.netBenefit}</span>
                </div>
              </div>
            </div>

            {/* Simulation Reference */}
            <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-2xs space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-black text-stone-900">SIMULATION REFERENCE: {activeDec.simRef}</span>
                <Link href="/simulation" onClick={onClose} className="text-[#D94E28] font-black hover:underline">
                  VIEW SIMULATION →
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-700 font-bold">
                <div>Scenarios: <strong className="text-stone-950 font-black">{activeDec.simRuns}</strong></div>
                <div>Horizon: <strong className="text-stone-950 font-black">72 Hours</strong></div>
                <div>Confidence: <strong className="text-stone-950 font-black">95%</strong></div>
              </div>
            </div>

            {/* Alternatives Evaluated */}
            <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-2xs space-y-3 font-mono text-xs">
              <span className="font-black text-stone-900 block">ALTERNATIVES EVALUATED</span>
              <div className="space-y-2">
                {activeDec.alternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className={`rounded p-2.5 border flex justify-between items-center ${
                      alt.status === 'SELECTED'
                        ? 'border-[#047857] bg-[#ECFDF5] text-[#064E3B] font-black'
                        : 'border-stone-200 bg-stone-50 text-stone-700 font-bold'
                    }`}
                  >
                    <span>{alt.route} (Risk: {alt.risk}%, Loss: {alt.loss})</span>
                    <span className="text-[10px] font-mono">{alt.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Timeline */}
            <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-2xs space-y-3 font-mono text-xs">
              <span className="font-black text-stone-900 block">AUDIT TIMELINE</span>
              <div className="space-y-2 text-[11px]">
                {activeDec.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-stone-100 pb-1.5 font-bold">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400">{item.time}</span>
                      <span className="text-stone-800">{item.event}</span>
                    </div>
                    <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[9px] font-black text-stone-700">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expandable Decision Trace */}
            <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-2xs space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandTrace(!expandTrace)}>
                <span className="font-black text-stone-900">VIEW DECISION REASONING TRACE</span>
                <button className="text-[#D94E28] font-black">
                  {expandTrace ? '[HIDE TRACE]' : '[EXPAND TRACE →]'}
                </button>
              </div>
              {expandTrace && (
                <div className="pt-3 border-t border-stone-200 space-y-1.5 text-[11px] font-bold text-stone-700">
                  {activeDec.trace.map((tr, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#D94E28] font-black">{i + 1}.</span>
                      <span>{tr}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actual Outcome vs Predicted (Verification) */}
            <div className="rounded-lg border border-stone-300 bg-white p-5 shadow-2xs space-y-3 font-mono text-xs">
              <span className="font-black text-stone-900 block">PREDICTED VS ACTUAL OUTCOME</span>
              {activeDec.actualDelay ? (
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded bg-stone-50 p-2.5 border border-stone-200">
                    <span className="text-[9px] text-stone-500 block">PREDICTED DELAY</span>
                    <strong className="text-stone-950 font-black">{activeDec.predictedDelay}</strong>
                  </div>
                  <div className="rounded bg-stone-50 p-2.5 border border-stone-200">
                    <span className="text-[9px] text-stone-500 block">ACTUAL DELAY</span>
                    <strong className="text-[#047857] font-black">{activeDec.actualDelay}</strong>
                  </div>
                  <div className="rounded bg-[#ECFDF5] p-2.5 border border-[#A7F3D0]">
                    <span className="text-[9px] text-[#065F46] block">PREDICTION ACCURACY</span>
                    <strong className="text-[#047857] font-black">{activeDec.predictionAccuracy}</strong>
                  </div>
                </div>
              ) : (
                <div className="text-stone-500 font-bold text-[11px]">
                  ACTUAL OUTCOME: Awaiting operational telemetry feedback.
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
              <Link
                href="/decisions"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded bg-[#D94E28] px-5 py-2.5 text-xs font-black text-white shadow-2xs hover:bg-[#C84B24]"
              >
                <span>VIEW FULL DECISION CENTER →</span>
              </Link>
              <Link
                href="/simulation"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded border border-stone-300 bg-white px-5 py-2.5 text-xs font-extrabold text-stone-800 hover:bg-stone-50 shadow-2xs"
              >
                <span>RUN NEW SIMULATION →</span>
              </Link>
              <button
                disabled
                title="Export functionality ready for production PDF audit generator"
                className="flex items-center gap-1.5 rounded border border-stone-200 bg-stone-100 px-4 py-2.5 text-xs font-bold text-stone-400 cursor-not-allowed"
              >
                <Download className="size-3.5" /> EXPORT REPORT (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
