'use client'

import React, { useState } from 'react'
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Zap,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  PieChart,
  BarChart2,
  CheckCircle2,
  Clock,
  Fuel,
  Truck,
  Layers,
  Scale
} from 'lucide-react'

interface CostIntelligenceViewProps {
  originPort?: string
  destPort?: string
}

export default function CostIntelligenceView({
  originPort = 'Shanghai',
  destPort = 'Rotterdam'
}: CostIntelligenceViewProps) {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')

  // Cost conversion helper
  const inrToUsdRate = 83.2

  const formatCost = (inrLakhs: number) => {
    if (currency === 'INR') {
      return `₹${inrLakhs.toFixed(2)}L`
    } else {
      const usdVal = (inrLakhs * 100000) / inrToUsdRate
      return `$${Math.round(usdVal).toLocaleString()} USD`
    }
  }

  // 8 Cost Intelligence Metrics (Exact User Specification)
  const costMetrics = [
    { label: 'Transportation Cost', inrLakhs: 2.18, icon: Truck, desc: 'Base ocean & line-haul freight rate' },
    { label: 'Fuel Cost (HFO/MGO)', inrLakhs: 1.45, icon: Fuel, desc: 'Heavy Fuel Oil consumption per nautical mile' },
    { label: 'Delay Cost', inrLakhs: 0.48, icon: Clock, desc: 'Demurrage & vessel anchoring waiting costs' },
    { label: 'Risk-Adjusted Cost', inrLakhs: 0.36, icon: ShieldCheck, desc: 'Insurance premium & geo-exposure buffer' },
    { label: 'Handling & Terminal', inrLakhs: 0.24, icon: Layers, desc: 'Port stevedoring & quay crane operations' },
    { label: 'Penalties & SLA Risk', inrLakhs: 0.18, icon: Scale, desc: 'Late delivery penalty risk buffer' },
    { label: 'Expected Disruption Loss', inrLakhs: 0.54, icon: AlertTriangle, desc: 'Probabilistic loss under unmitigated route' },
    { label: 'Total Expected Cost', inrLakhs: 5.43, icon: DollarSign, desc: 'Combined baseline risk-adjusted total cost' }
  ]

  // NOMINAL COST VS EXPECTED COST COMPARISON (Exact User Example Story)
  const routesComparison = [
    {
      id: 'ROUTE_A',
      name: 'Route A (Nominally Cheaper Baseline)',
      badge: 'HIGH DISRUPTION RISK',
      badgeColor: 'bg-red-100 text-red-800 border-red-300',
      transportCost: 2.18,
      expectedDisruption: 0.54,
      expectedTotal: 2.72,
      isOptimal: false,
      note: 'Seems cheaper upfront (₹2.18L), but heavy disruption adds ₹0.54L expected loss!'
    },
    {
      id: 'ROUTE_C',
      name: 'Route C (Optimal Risk-Adjusted Reroute ⭐)',
      badge: 'RECOMMENDED OPTIMAL',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      transportCost: 2.42,
      expectedDisruption: 0.13,
      expectedTotal: 2.55,
      isOptimal: true,
      note: 'Slightly higher transport base (₹2.42L), but saves ₹0.41L in disruption loss! Net Savings: ₹0.17L per voyage.'
    }
  ]

  return (
    <div className="rounded-lg border-2 border-stone-300 bg-white p-6 shadow-md space-y-6 font-mono">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-[10px] font-black text-[#D94E28] tracking-widest block uppercase">
            SECTION 14 · COST INTELLIGENCE &amp; FINANCIAL OPTIMIZATION
          </span>
          <h3 className="text-xl font-black text-[#151719] mt-0.5 flex items-center gap-2">
            💰 COST INTELLIGENCE
          </h3>
        </div>

        {/* Currency Switcher (INR Lakhs vs USD) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#F4F2EC] p-1 rounded-lg border border-stone-300 text-[10px] font-black">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1.5 rounded transition-all ${
                currency === 'INR' ? 'bg-[#D94E28] text-white shadow-2xs font-black' : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              ₹ INR (LAKHS)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded transition-all ${
                currency === 'USD' ? 'bg-[#D94E28] text-white shadow-2xs font-black' : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              $ USD ($)
            </button>
          </div>
        </div>
      </div>

      {/* 1. 8 COST BREAKDOWN CATEGORY CARDS (Exact User List) */}
      <div className="space-y-3">
        <span className="text-xs font-black text-stone-600 uppercase tracking-widest block">
          FINANCIAL COST BREAKDOWN &amp; RISK-ADJUSTED CATEGORIES
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {costMetrics.map((metric, idx) => {
            const IconComp = metric.icon
            const isTotal = metric.label.includes('Total')
            const isLoss = metric.label.includes('Loss')

            return (
              <div
                key={idx}
                className={`rounded-xl border-2 p-4 space-y-1.5 shadow-2xs font-mono transition-all ${
                  isTotal
                    ? 'border-[#047857] bg-emerald-50/70 ring-2 ring-emerald-200'
                    : isLoss
                    ? 'border-red-300 bg-red-50/40'
                    : 'border-stone-300 bg-[#F6F6F3] hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                    <IconComp className={`size-3.5 ${isTotal ? 'text-[#047857]' : isLoss ? 'text-red-600' : 'text-[#D94E28]'}`} />
                    {metric.label}
                  </span>
                </div>

                <div className={`text-xl font-black ${isTotal ? 'text-[#047857] text-2xl' : isLoss ? 'text-red-900' : 'text-[#151719]'}`}>
                  {formatCost(metric.inrLakhs)}
                </div>

                <p className="text-[10px] text-stone-500 font-semibold truncate" title={metric.desc}>
                  {metric.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. CORE FEATURE: NOMINAL COST VS EXPECTED COST COMPARISON (Exact User Example) */}
      <div className="rounded-xl border-2 border-[#D94E28] bg-orange-50/30 p-6 space-y-5 shadow-sm font-mono">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-orange-200 pb-3">
          <div>
            <span className="text-xs font-black text-[#D94E28] uppercase tracking-widest block">
              CORE DECISION STORY
            </span>
            <h4 className="text-lg font-black text-[#151719] mt-0.5 flex items-center gap-2">
              ⚖️ NOMINAL COST VS EXPECTED COST
            </h4>
          </div>

          <span className="text-[10px] font-black text-white bg-[#D94E28] px-3 py-1 rounded">
            STRATEGIC BUSINESS ROI STORY
          </span>
        </div>

        {/* 2 Route Cards Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {routesComparison.map((route) => (
            <div
              key={route.id}
              className={`rounded-xl border-2 p-5 space-y-4 font-mono shadow-xs ${
                route.isOptimal
                  ? 'border-[#047857] bg-white ring-2 ring-emerald-300'
                  : 'border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h5 className="text-sm font-black text-[#151719]">{route.name}</h5>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${route.badgeColor}`}>
                  {route.badge}
                </span>
              </div>

              {/* Exact Requested Line Breakdown */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-stone-700 font-bold">
                  <span>Transport:</span>
                  <span className="font-black text-stone-900">{formatCost(route.transportCost)}</span>
                </div>

                <div className="flex justify-between items-center text-stone-700 font-bold">
                  <span>Expected disruption:</span>
                  <span className={route.isOptimal ? 'font-black text-[#047857]' : 'font-black text-red-600'}>
                    {formatCost(route.expectedDisruption)}
                  </span>
                </div>

                <div className="border-t-2 border-dashed border-stone-400 pt-2 flex justify-between items-center text-sm font-black">
                  <span className="text-stone-900">Expected total:</span>
                  <span className={`text-base font-mono font-black ${route.isOptimal ? 'text-[#047857]' : 'text-red-700'}`}>
                    {formatCost(route.expectedTotal)}
                  </span>
                </div>
              </div>

              <div className={`p-3 rounded-lg border text-[11px] font-semibold ${
                route.isOptimal ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 border-stone-200 text-stone-600'
              }`}>
                💡 {route.note}
              </div>
            </div>
          ))}
        </div>

        {/* Business Summary Highlight Box */}
        <div className="bg-white rounded-lg border border-stone-300 p-4 space-y-1.5 text-xs text-stone-700 font-mono shadow-2xs">
          <span className="text-[10px] font-black text-[#D94E28] uppercase tracking-wider block">
            EXECUTIVE FINANCIAL TAKEAWAY
          </span>
          <p className="font-semibold text-stone-800 leading-relaxed">
            While <strong>Route A</strong> has a nominally cheaper transport price (<strong>{formatCost(2.18)}</strong>), its high disruption risk adds <strong>{formatCost(0.54)}</strong> in expected loss.
            By choosing <strong>Route C (Optimal ⭐)</strong>, FlowForge mitigates 78% of disruption risk, reducing the Expected Total Cost from <strong>{formatCost(2.72)}</strong> to <strong>{formatCost(2.55)}</strong> (<strong>Net Savings: {formatCost(0.17)} per shipment</strong>).
          </p>
        </div>
      </div>

    </div>
  )
}
