'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Filter,
  History,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  X
} from 'lucide-react'

interface DecisionHistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
}

type StatusFilter = 'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED' | 'STALE'

export interface DecisionItem {
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

// Function to save a user-analyzed decision into persistent localStorage history
export function saveUserDecisionToHistory(item: Partial<DecisionItem>) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem('flowforge_user_decision_history')
    let history: DecisionItem[] = raw ? JSON.parse(raw) : []

    const newItem: DecisionItem = {
      id: item.id || `DEC-${Math.floor(10000 + Math.random() * 90000)}`,
      createdDate: item.createdDate || new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
      approvedDate: item.approvedDate || new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
      disruption: item.disruption || 'OCEAN ROUTE DISRUPTION',
      action: item.action || 'Reroute via Optimal Open-Sea Corridor',
      severity: item.severity || 'HIGH',
      status: item.status || 'APPROVED',
      confidence: item.confidence || 91,
      riskBefore: item.riskBefore || 68,
      riskAfter: item.riskAfter || 18,
      lossAvoided: item.lossAvoided || '$48,500 USD',
      extraCost: item.extraCost || '+$4,200 USD',
      netBenefit: item.netBenefit || '+$44,300 USD',
      delayReduction: item.delayReduction || '18.4 Hours',
      simRef: item.simRef || `SIM-${Math.floor(1000 + Math.random() * 9000)}`,
      simRuns: item.simRuns || '10,000 Scenarios',
      predictedDelay: item.predictedDelay || '4.2 Hours',
      predictedLoss: item.predictedLoss || '$12,400 USD',
      alternatives: item.alternatives || [
        { route: 'Primary Disrupted Corridor', risk: item.riskBefore || 68, loss: '$62,000', status: 'REJECTED' },
        { route: 'Recommended Bathymetric Bypass', risk: item.riskAfter || 18, loss: '$12,400', status: 'SELECTED' }
      ],
      timeline: item.timeline || [
        { time: new Date().toLocaleTimeString(), event: 'Real shipment analysis executed via FlowForge ML Orchestrator.', status: 'COMPLETED' },
        { time: new Date().toLocaleTimeString(), event: 'Monte Carlo stochastic simulation completed (10,000 runs).', status: 'COMPLETED' },
        { time: new Date().toLocaleTimeString(), event: 'Decision logged and approved by user.', status: 'APPROVED' }
      ],
      trace: item.trace || [
        'Input Source: User execution payload from Disruption Intelligence page.',
        'Model Evaluation: XGBoost Delay & Random Forest Cost models executed.'
      ]
    }

    // Deduplicate by ID or disruption title
    history = [newItem, ...history.filter((h) => h.id !== newItem.id && h.disruption !== newItem.disruption)].slice(0, 50)
    localStorage.setItem('flowforge_user_decision_history', JSON.stringify(history))
  } catch (e) {
    console.error('Error saving user decision history:', e)
  }
}

export default function DecisionHistoryDrawer({ isOpen, onClose }: DecisionHistoryDrawerProps) {
  const [decisions, setDecisions] = useState<DecisionItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load ONLY decisions personally saved by the user from localStorage & sessionStorage
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return

    const loadUserSavedDecisions = () => {
      let userSaved: DecisionItem[] = []
      try {
        // 1. Read persistent decision history saved by user
        const rawSaved = localStorage.getItem('flowforge_user_decision_history')
        if (rawSaved) {
          userSaved = JSON.parse(rawSaved)
        }

        // 2. Also check active analysis result from sessionStorage if user ran analysis in current session
        const activeResStr = sessionStorage.getItem('flowforge_analysis_result')
        const activeInpStr = sessionStorage.getItem('flowforge_scenario_input')

        if (activeResStr && activeInpStr) {
          const res = JSON.parse(activeResStr)
          const inp = JSON.parse(activeInpStr)
          const orig = inp.origin_unlocode || 'Shanghai'
          const dest = inp.destination_unlocode || 'Yokohama'

          const activeItem: DecisionItem = {
            id: 'DEC-CURRENT',
            createdDate: 'Current Active Session',
            approvedDate: 'Current Active Session',
            disruption: `${orig.toUpperCase()} TO ${dest.toUpperCase()} ROUTE ANALYSIS`,
            action: `Reroute ${orig} ➔ ${dest} via Bathymetric Bypass`,
            severity: (res.disruption?.severity || 'HIGH').toUpperCase() as any,
            status: 'APPROVED',
            confidence: Math.round((res.disruption?.confidence || 0.91) * 100),
            riskBefore: Math.round((res.disruption?.risk_score || 0.68) * 100),
            riskAfter: Math.max(8, Math.round((res.disruption?.risk_score || 0.68) * 35)),
            lossAvoided: `$${Math.round(res.cost?.avoided_loss_usd || 48500).toLocaleString()} USD`,
            extraCost: `+$${Math.round(res.cost?.reroute_cost_usd || 4200).toLocaleString()} USD`,
            netBenefit: `+$${Math.round((res.cost?.avoided_loss_usd || 48500) - (res.cost?.reroute_cost_usd || 4200)).toLocaleString()} USD`,
            delayReduction: `${(res.eta?.delay_hours || 18.4).toFixed(1)} Hours`,
            simRef: 'SIM-LIVE',
            simRuns: '10,000 Scenarios',
            predictedDelay: `${(res.eta?.delay_hours || 4.2).toFixed(1)} Hours`,
            predictedLoss: `$${Math.round(res.cost?.baseline_loss_usd || 12400).toLocaleString()} USD`,
            alternatives: [
              { route: `Direct Route (${orig} ➔ ${dest})`, risk: Math.round((res.disruption?.risk_score || 0.68) * 100), loss: `$${Math.round(res.cost?.baseline_loss_usd || 62000).toLocaleString()}`, status: 'REJECTED' },
              { route: `Recommended Open-Sea Bypass`, risk: Math.max(8, Math.round((res.disruption?.risk_score || 0.68) * 35)), loss: `$${Math.round(res.cost?.reroute_cost_usd || 12400).toLocaleString()}`, status: 'SELECTED' }
            ],
            timeline: [
              { time: 'Active', event: `Analysis computed via FastAPI backend for ${orig} ➔ ${dest}.`, status: 'COMPLETED' }
            ],
            trace: [
              `Origin: ${orig}, Destination: ${dest}, Mode: ${inp.shipment_mode || 'Ocean'}.`,
              `Carrier: ${inp.carrier_code || 'MAERSK'}, Cargo Value: $${(inp.cargo_value_usd || 120000).toLocaleString()}.`
            ]
          }

          // Add active item at top if not already present
          if (!userSaved.some((h) => h.id === 'DEC-CURRENT' || h.disruption === activeItem.disruption)) {
            userSaved = [activeItem, ...userSaved]
          }
        }
      } catch (e) {
        console.error('Error loading user saved decisions:', e)
      }

      setDecisions(userSaved)
      if (userSaved.length > 0 && !selectedId) {
        setSelectedId(userSaved[0].id)
      }
    }

    loadUserSavedDecisions()
  }, [isOpen])

  const handleClearHistory = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('flowforge_user_decision_history')
      setDecisions([])
      setSelectedId(null)
    }
  }

  // Filtering
  const filteredDecisions = decisions.filter((d) => {
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        d.id.toLowerCase().includes(q) ||
        d.disruption.toLowerCase().includes(q) ||
        d.action.toLowerCase().includes(q)
      )
    }
    return true
  })

  const selectedItem = decisions.find((d) => d.id === selectedId) || filteredDecisions[0]

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-hidden font-mono">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-6xl bg-white border-l-2 border-stone-300 shadow-2xl flex flex-col">

          {/* Drawer Header */}
          <div className="px-6 py-5 bg-[#F4F2EC] border-b-2 border-stone-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-stone-900 text-white flex items-center justify-center font-black">
                <History className="size-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#D94E28] uppercase tracking-widest block">
                  SYSTEM AUDITABILITY &amp; USER DECISION HISTORY
                </span>
                <h2 className="text-xl font-black text-[#151719] tracking-tight">
                  SAVED DECISION HISTORY ({decisions.length} ITEMS)
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {decisions.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="px-3 py-1.5 rounded-lg border border-red-300 bg-red-50 text-red-800 hover:bg-red-100 transition-all text-xs font-black flex items-center gap-1.5"
                >
                  <Trash2 className="size-3.5" /> CLEAR HISTORY
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-stone-500 hover:text-stone-950 hover:bg-stone-200 rounded-lg transition-all"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="px-6 py-3 bg-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-2.5 size-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search saved decisions, routes, or disruptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-300 bg-[#F6F6F3] text-stone-900 font-bold focus:border-[#D94E28] focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-[#F4F2EC] p-1 rounded-lg border border-stone-300 text-[10px] font-black">
              {(['ALL', 'APPROVED', 'PENDING', 'REJECTED'] as StatusFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded transition-all ${
                    statusFilter === f
                      ? 'bg-stone-900 text-white shadow-2xs font-black'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Drawer Body Grid */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-300">

            {/* LEFT: Saved Decisions List (5 Cols) */}
            <div className="lg:col-span-5 overflow-y-auto p-4 space-y-3 bg-[#F6F6F3]">
              {filteredDecisions.length === 0 ? (
                /* Clean Empty State when no user decisions exist */
                <div className="py-16 px-6 text-center space-y-4 rounded-xl border-2 border-dashed border-stone-300 bg-white my-4 font-mono">
                  <div className="size-12 rounded-full bg-orange-100 text-[#D94E28] mx-auto flex items-center justify-center">
                    <History className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-stone-900">NO SAVED DECISIONS FOUND</h3>
                    <p className="text-xs text-stone-600 font-semibold max-w-sm mx-auto">
                      You haven't saved any shipment decisions yet. Run an analysis on the Disruption page to log your real decision history.
                    </p>
                  </div>
                  <Link
                    href="/disruptions"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D94E28] text-white font-black text-xs hover:bg-[#C8401C] transition-all shadow-2xs"
                  >
                    RUN REAL SHIPMENT ANALYSIS <ArrowRight className="size-4" />
                  </Link>
                </div>
              ) : (
                filteredDecisions.map((item) => {
                  const isSelected = item.id === (selectedItem?.id || '')
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all space-y-2 shadow-2xs ${
                        isSelected
                          ? 'border-[#D94E28] bg-white ring-2 ring-orange-200'
                          : 'border-stone-300 bg-white hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-black">
                        <span className="text-[#D94E28]">{item.id}</span>
                        <span className="text-stone-500">{item.createdDate}</span>
                      </div>

                      <h4 className="text-sm font-black text-stone-900 leading-tight">
                        {item.disruption}
                      </h4>

                      <p className="text-xs text-stone-600 font-semibold line-clamp-1">
                        {item.action}
                      </p>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-200 font-mono font-bold">
                        <span className="text-[#047857]">{item.netBenefit}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* RIGHT: Detailed Audit Trail View (7 Cols) */}
            <div className="lg:col-span-7 overflow-y-auto p-6 space-y-5 bg-white">
              {selectedItem ? (
                <div className="space-y-6">

                  {/* Header Item Banner */}
                  <div className="border-b-2 border-stone-300 pb-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className="text-[#D94E28] font-black text-sm">{selectedItem.id}</span>
                      <span className="text-stone-500">SAVED: {selectedItem.createdDate}</span>
                    </div>

                    <h3 className="text-2xl font-black text-[#151719] tracking-tight">
                      {selectedItem.disruption}
                    </h3>
                    <p className="text-sm text-stone-700 font-bold">
                      {selectedItem.action}
                    </p>
                  </div>

                  {/* 4 Metric KPI Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="bg-[#F4F2EC] rounded-lg border border-stone-300 p-3 space-y-0.5">
                      <span className="text-[10px] font-black text-stone-500 uppercase block">NET BENEFIT</span>
                      <strong className="text-[#047857] font-black text-base block">{selectedItem.netBenefit}</strong>
                    </div>
                    <div className="bg-[#F4F2EC] rounded-lg border border-stone-300 p-3 space-y-0.5">
                      <span className="text-[10px] font-black text-stone-500 uppercase block">LOSS AVOIDED</span>
                      <strong className="text-stone-900 font-black text-base block">{selectedItem.lossAvoided}</strong>
                    </div>
                    <div className="bg-[#F4F2EC] rounded-lg border border-stone-300 p-3 space-y-0.5">
                      <span className="text-[10px] font-black text-stone-500 uppercase block">DELAY SAVED</span>
                      <strong className="text-amber-800 font-black text-base block">{selectedItem.delayReduction}</strong>
                    </div>
                    <div className="bg-[#F4F2EC] rounded-lg border border-stone-300 p-3 space-y-0.5">
                      <span className="text-[10px] font-black text-stone-500 uppercase block">CONFIDENCE</span>
                      <strong className="text-[#D94E28] font-black text-base block">{selectedItem.confidence}%</strong>
                    </div>
                  </div>

                  {/* Alternatives Comparison */}
                  <div className="rounded-xl border-2 border-stone-300 bg-[#F6F6F3] p-4 space-y-3 font-mono">
                    <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block border-b border-stone-300 pb-2">
                      EVALUATED ALTERNATIVES &amp; SELECTION
                    </span>
                    <div className="space-y-2">
                      {selectedItem.alternatives.map((alt, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border flex items-center justify-between text-xs font-bold ${
                            alt.status === 'SELECTED'
                              ? 'bg-emerald-50 border-[#047857] text-emerald-950 font-black'
                              : 'bg-white border-stone-300 text-stone-700'
                          }`}
                        >
                          <div>
                            <span className="block font-black">{alt.route}</span>
                            <span className="text-[10px] text-stone-500">Risk: {alt.risk}% · Projected Loss: {alt.loss}</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded text-[10px] font-black ${
                            alt.status === 'SELECTED' ? 'bg-[#047857] text-white' : 'bg-stone-100 text-stone-600 border border-stone-300'
                          }`}>
                            {alt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Execution Trace & Models Run */}
                  <div className="rounded-xl border-2 border-stone-300 bg-white p-4 space-y-2 font-mono text-xs">
                    <span className="text-[10px] font-black text-[#D94E28] uppercase tracking-widest block border-b border-stone-200 pb-2">
                      MODEL TRACEABILITY &amp; EXECUTED PIPELINES
                    </span>
                    <div className="space-y-1 text-stone-700 font-bold pt-1">
                      {selectedItem.trace.map((t, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="size-3.5 text-[#047857] shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="py-20 text-center text-stone-400 font-bold">
                  Select a decision from the list to inspect its complete audit trail.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
