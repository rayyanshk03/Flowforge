'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  CloudRain,
  Anchor,
  Navigation,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
  Package,
  Route,
  CheckCircle2
} from 'lucide-react'

export default function DisruptionCenterPanel() {
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)
  const [planGenerated, setPlanGenerated] = useState(false)

  // 3 ACTIVE DISRUPTIONS (Exact User Specification)
  const activeDisruptions = [
    {
      id: 'DIS-01',
      title: 'Heavy rainfall',
      location: 'Mumbai region',
      severity: 'HIGH',
      severityColor: 'bg-red-100 text-red-800 border-red-300',
      icon: CloudRain,
      details: 'Monsoon precipitation > 120mm/h causing urban inundation & port gate halts.'
    },
    {
      id: 'DIS-02',
      title: 'Port congestion',
      location: 'JNPT (Jawaharlal Nehru Port)',
      severity: 'MEDIUM',
      severityColor: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: Anchor,
      details: 'Gantry crane bottleneck & 52.0h anchorage waiting queue.'
    },
    {
      id: 'DIS-03',
      title: 'Highway closure',
      location: 'NH48 (Mumbai-Delhi Freight Corridor)',
      severity: 'HIGH',
      severityColor: 'bg-red-100 text-red-800 border-red-300',
      icon: Navigation,
      details: 'Landslide obstacle at Kasara Ghat. Full freight traffic detour in effect.'
    }
  ]

  // IMPACT ON YOUR NETWORK (Exact User Specification)
  const networkImpact = {
    shipmentsAffected: '17 shipments affected',
    valueExposed: '₹8.2L exposed', // ₹8.2 Lakhs ($820,000 USD equivalent)
    routesAtRisk: '4 routes at risk',
    expectedDelay: '+9.4 hours'
  }

  const handleGenerateResponsePlan = () => {
    setIsGeneratingPlan(true)
    setTimeout(() => {
      setIsGeneratingPlan(false)
      setPlanGenerated(true)

      // Smooth scroll to decision response plan or route intelligence
      const el = document.getElementById('response-plan-section')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }, 600)
  }

  return (
    <div className="rounded-2xl border-2 border-stone-300 bg-white p-6 md:p-8 space-y-8 font-mono shadow-md">

      {/* Screen Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded border border-stone-300 bg-[#F4F2EC] px-3 py-1 text-xs font-mono font-bold text-[#D94E28] shadow-2xs">
            <span className="size-2 rounded-full bg-[#D94E28] animate-pulse" />
            DISRUPTION INTELLIGENCE CENTER
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-[#151719] mt-2 tracking-tight">
            Disruption Intelligence
          </h2>
          <p className="text-xs text-stone-500 font-bold mt-1">
            Real-Time Network Operational Threat Assessment &amp; Autonomous Mitigation Engine
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-[#047857] bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded">
            🟢 LIVE FEED ACTIVE (100% TELEMETRY SYNC)
          </span>
        </div>
      </div>

      {/* 2-COLUMN MAIN GRID: ACTIVE DISRUPTIONS (Left 7 Cols) | IMPACT ON YOUR NETWORK (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT: ACTIVE DISRUPTIONS CARDS (3 Requested Cards) */}
        <div className="lg:col-span-7 rounded-xl border-2 border-stone-300 bg-[#F6F6F3] p-5 space-y-4 shadow-inner">
          <div className="flex items-center justify-between border-b border-stone-300 pb-3">
            <span className="text-xs font-black text-[#D94E28] uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className="size-4 text-[#D94E28]" /> ACTIVE DISRUPTIONS
            </span>
            <span className="text-[10px] font-black text-stone-600 bg-white border border-stone-300 px-2.5 py-0.5 rounded">
              3 ACTIVE EVENTS DETECTED
            </span>
          </div>

          {/* Disruption Cards */}
          <div className="space-y-3.5">
            {activeDisruptions.map((item) => {
              const IconComp = item.icon
              return (
                <div
                  key={item.id}
                  className="rounded-xl border-2 border-stone-300 bg-white p-4 space-y-2 transition-all hover:border-stone-400 shadow-2xs font-mono"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#D94E28] shrink-0">
                        <IconComp className="size-5" />
                      </div>
                      <div>
                        <div className="text-base font-black text-[#151719] flex items-center gap-2">
                          <span>⚠️ {item.title}</span>
                        </div>
                        <span className="text-xs font-bold text-stone-600 block">
                          📍 {item.location}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black px-2.5 py-1 rounded border uppercase ${item.severityColor}`}>
                      Severity: {item.severity}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500 font-semibold pt-1">
                    {item.details}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT: IMPACT ON YOUR NETWORK (4 Exact Requested Metrics) */}
        <div className="lg:col-span-5 rounded-xl border-2 border-[#D94E28] bg-orange-50/30 p-6 space-y-6 shadow-sm">
          <div className="border-b border-orange-200 pb-3 flex items-center justify-between">
            <span className="text-xs font-black text-[#D94E28] uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert className="size-4" /> IMPACT ON YOUR NETWORK
            </span>
            <span className="text-[9px] font-black text-white bg-[#D94E28] px-2 py-0.5 rounded">
              REAL-TIME
            </span>
          </div>

          {/* 4 Requested Metrics List */}
          <div className="space-y-4">

            {/* Metric 1: Shipments Affected */}
            <div className="rounded-lg border border-stone-300 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider block flex items-center gap-1.5">
                <Package className="size-3.5 text-[#D94E28]" /> SHIPMENTS AT RISK
              </span>
              <div className="text-2xl font-black text-[#151719]">
                {networkImpact.shipmentsAffected}
              </div>
            </div>

            {/* Metric 2: Financial Exposure */}
            <div className="rounded-lg border border-stone-300 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider block flex items-center gap-1.5">
                <DollarSign className="size-3.5 text-amber-600" /> FINANCIAL EXPOSURE
              </span>
              <div className="text-2xl font-black text-[#D94E28] font-mono">
                {networkImpact.valueExposed}
              </div>
            </div>

            {/* Metric 3: Routes at Risk */}
            <div className="rounded-lg border border-stone-300 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider block flex items-center gap-1.5">
                <Route className="size-3.5 text-[#047857]" /> AFFECTED CORRIDORS
              </span>
              <div className="text-2xl font-black text-[#151719]">
                {networkImpact.routesAtRisk}
              </div>
            </div>

            {/* Metric 4: Expected Delay */}
            <div className="rounded-lg border-2 border-red-300 bg-red-50/60 p-4 space-y-1 shadow-2xs">
              <span className="text-[10px] font-black text-red-800 uppercase tracking-wider block flex items-center gap-1.5">
                <Clock className="size-3.5 text-red-600" /> EXPECTED NETWORK DELAY
              </span>
              <div className="text-3xl font-black text-red-900 font-mono">
                {networkImpact.expectedDelay}
              </div>
            </div>

          </div>

          {/* GENERATE RESPONSE PLAN BUTTON (Exact Request) */}
          <div className="pt-2">
            <button
              onClick={handleGenerateResponsePlan}
              disabled={isGeneratingPlan}
              className="w-full rounded-xl bg-[#D94E28] hover:bg-[#C8401C] transition-all py-4 text-xs font-black text-white shadow-md flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-50"
            >
              {isGeneratingPlan ? (
                <>
                  <Zap className="size-4 animate-spin" /> GENERATING RESPONSE PLAN...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> GENERATE RESPONSE PLAN ⚡
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* DYNAMICALLY GENERATED RESPONSE PLAN PANEL (Unfolds when button clicked) */}
      {(planGenerated || isGeneratingPlan) && (
        <div id="response-plan-section" className="rounded-xl border-2 border-[#047857] bg-emerald-50/50 p-6 space-y-5 shadow-md font-mono animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-200 pb-3">
            <div>
              <span className="text-[10px] font-black text-[#047857] uppercase tracking-widest block">
                AUTONOMOUS MITIGATION PLAN GENERATED
              </span>
              <h4 className="text-lg font-black text-[#151719] mt-0.5">
                ⚡ OPTIMIZED NETWORK RESPONSE &amp; REROUTE DIRECTIVES
              </h4>
            </div>
            <span className="text-[10px] font-black text-white bg-[#047857] px-3 py-1 rounded">
              READY FOR EXECUTION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white rounded-lg border border-emerald-300 p-4 space-y-2">
              <span className="text-[10px] font-black text-emerald-800 uppercase block">RECOMMENDED DETOUR</span>
              <strong className="text-stone-900 font-black block text-sm">Ahmedabad ➔ Jaipur ➔ Delhi</strong>
              <p className="text-[11px] text-stone-600 font-semibold">Bypasses Kasara Ghat landslide &amp; NH48 freight bottleneck.</p>
            </div>

            <div className="bg-white rounded-lg border border-emerald-300 p-4 space-y-2">
              <span className="text-[10px] font-black text-emerald-800 uppercase block">EXPECTED DELAY RECOVERY</span>
              <strong className="text-[#047857] font-black block text-sm">Recovered +7.2 Hours (Net +2.2h)</strong>
              <p className="text-[11px] text-stone-600 font-semibold">91% SLA compliance maintained for all 17 shipments.</p>
            </div>

            <div className="bg-white rounded-lg border border-emerald-300 p-4 space-y-2">
              <span className="text-[10px] font-black text-emerald-800 uppercase block">EXPOSURE SAVINGS</span>
              <strong className="text-stone-900 font-black block text-sm">₹6.4L Saved (-78% Risk Exposure)</strong>
              <p className="text-[11px] text-stone-600 font-semibold">Demurrage &amp; line-haul delay penalties neutralized.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-emerald-200">
            <span className="text-xs font-bold text-emerald-900">
              Response plan ready. Proceed to decision execution layer to dispatch.
            </span>
            <Link
              href="/network"
              className="rounded-lg bg-[#047857] hover:bg-emerald-800 transition-all px-6 py-2.5 text-xs font-black text-white flex items-center gap-2 shadow-2xs active:scale-[0.98]"
            >
              Dispatch Response Plan <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      )}

    </div>
  )
}
