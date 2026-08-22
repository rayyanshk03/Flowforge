'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  AlertTriangle,
  Activity,
  Anchor,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Cpu,
  Database,
  DollarSign,
  Eye,
  Filter,
  Gauge,
  Globe2,
  Layers,
  MapPin,
  Navigation,
  Play,
  RotateCcw,
  Search,
  Shield,
  ShieldAlert,
  Ship,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Warehouse,
  Wind,
  Waves,
  X
} from 'lucide-react'

import CreateScenarioModal from '@/components/CreateScenarioModal'
import Navbar from '@/components/Navbar'

export default function OverviewCommandCenter() {
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)
  const [backendConnected, setBackendConnected] = useState(true)

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch('http://localhost:8000/api/v1/health')
        if (res.ok) setBackendConnected(true)
      } catch {
        setBackendConnected(false)
      }
    }
    checkBackend()
  }, [])

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#111827] font-sans antialiased selection:bg-[#D94E28] selection:text-white">
      {/* GLOBAL NAVIGATION SHELL */}
      <Navbar />

      {/* MAIN CONTENT AREA */}
      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* HERO / COMMAND HEADER */}
        <section className="rounded-xl border border-[#D9D9D6] bg-white p-6 md:p-8 shadow-2xs">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Left Content */}
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-[#F7F6F2] px-3.5 py-1 text-xs font-bold text-[#D94E28]">
                <span>●</span> OPERATIONAL CONTROL TOWER
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-[#111827] tracking-tight leading-tight">
                Make the next shipping decision <br className="hidden md:inline" />
                before disruption makes it for you.
              </h1>

              <p className="text-sm md:text-base text-[#667085] font-normal leading-relaxed">
                FlowForge combines live operational intelligence, predictive models, geospatial routing and Monte Carlo simulation to turn uncertainty into an actionable maritime decision.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold">
                <button
                  onClick={() => setCreateScenarioOpen(true)}
                  className="rounded-lg bg-[#D94E28] px-6 py-3 text-white shadow-xs hover:bg-[#C8401C] transition-colors flex items-center gap-2 uppercase tracking-wider"
                >
                  START ANALYSIS <ArrowRight className="size-4" />
                </button>
                <a
                  href="#visualization"
                  className="rounded-lg border border-stone-300 bg-white px-6 py-3 text-[#111827] hover:bg-stone-50 transition-colors shadow-2xs uppercase tracking-wider"
                >
                  EXPLORE INTELLIGENCE
                </a>
              </div>
            </div>

            {/* Right Live Voyage Card */}
            <div className="w-full lg:w-80 rounded-xl border border-[#D9D9D6] bg-[#F7F6F2] p-5 text-xs space-y-3.5 shrink-0 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#D9D9D6] pb-2.5">
                <span className="text-[10px] font-bold text-[#667085] uppercase tracking-widest">ACTIVE VOYAGE</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                  ● MONITORING
                </span>
              </div>
              <div className="space-y-2.5 text-[#111827]">
                <div className="flex justify-between items-center">
                  <span className="text-[#667085]">CORRIDOR:</span>
                  <strong className="font-bold text-stone-900">Shanghai → Yokohama</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#667085]">VESSEL:</span>
                  <strong className="text-[#D94E28] font-bold">FF Horizon (984210)</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#667085]">ETA TARGET:</span>
                  <strong className="font-bold text-stone-900">18 Aug · 14:35 UTC</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#667085]">SPEED:</span>
                  <strong className="text-[#111827] font-bold">14.2 Knots</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TOP KPI COMMAND STRIP (5 Dense Compact Cards Grid) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1 */}
          <div className="rounded-xl border border-[#D9D9D6] bg-white p-5 space-y-2 shadow-2xs">
            <span className="text-[10px] font-bold text-[#667085] uppercase tracking-widest block">ACTIVE VOYAGES</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#111827]">24</span>
              <span className="text-xs font-bold text-emerald-600">+2 vs baseline</span>
            </div>
            <span className="text-[11px] text-[#667085] block pt-1">Nominal fleet tracking</span>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-red-200 bg-red-50/60 p-5 space-y-2 shadow-2xs">
            <span className="text-[10px] font-bold text-red-700 uppercase tracking-widest block">AT-RISK VOYAGES</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-red-700">7</span>
              <span className="text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded-full">HIGH EXPOSURE</span>
            </div>
            <span className="text-[11px] text-red-800/80 block pt-1">Requires intervention</span>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 space-y-2 shadow-2xs">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">EXPECTED DELAY</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-amber-900">+18.4 H</span>
              <span className="text-xs font-bold text-amber-700">MODERATE</span>
            </div>
            <span className="text-[11px] text-amber-800/80 block pt-1">XGBoost ETA Model</span>
          </div>

          {/* Card 4 */}
          <div className="rounded-xl border border-[#D9D9D6] bg-white p-5 space-y-2 shadow-2xs">
            <span className="text-[10px] font-bold text-[#667085] uppercase tracking-widest block">FINANCIAL EXPOSURE</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#111827]">$284K</span>
              <span className="text-xs font-bold text-[#667085]">USD</span>
            </div>
            <span className="text-[11px] text-[#667085] block pt-1">Fuel & demurrage impact</span>
          </div>

          {/* Card 5 */}
          <div className="rounded-xl border border-[#D9D9D6] bg-white p-5 space-y-2 shadow-2xs col-span-1 sm:col-span-2 lg:col-span-1">
            <span className="text-[10px] font-bold text-[#667085] uppercase tracking-widest block">NETWORK RISK</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-[#D94E28]">32%</span>
              <span className="text-xs font-bold text-emerald-600">SAFE</span>
            </div>
            <span className="text-[11px] text-[#667085] block pt-1">Operational Stress score</span>
          </div>
        </section>

        {/* LIVE SYSTEM VISUALIZATION (Horizontal Corridor Node Flow) */}
        <section id="visualization" className="rounded-xl border border-[#D9D9D6] bg-white p-6 md:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D94E28]">
                LIVE SYSTEM VISUALIZATION
              </span>
              <h2 className="text-xl font-bold text-[#111827] mt-0.5">Maritime Corridor Route & Disruption Flow</h2>
            </div>
            <span className="rounded-full bg-stone-100 px-3.5 py-1 text-xs font-bold text-[#111827] border border-[#D9D9D6]">
              CORRIDOR: CNSHA → JPYOK
            </span>
          </div>

          {/* Clean 5-Column Corridor Node Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            {/* Node 1 */}
            <div className="rounded-xl border border-[#D9D9D6] bg-[#F7F6F2] p-4 space-y-1.5">
              <span className="text-[10px] font-bold text-[#667085] block uppercase">ORIGIN</span>
              <span className="text-base font-black text-[#111827] block">Shanghai</span>
              <span className="text-[10px] text-[#667085] font-bold block">UN/LOCODE: CNSHA</span>
            </div>

            {/* Node 2 */}
            <div className="rounded-xl border border-[#D9D9D6] bg-[#F7F6F2] p-4 space-y-1.5">
              <span className="text-[10px] font-bold text-[#667085] block uppercase">CURRENT ROUTE</span>
              <span className="text-base font-bold text-[#111827] block">East China Sea</span>
              <span className="text-[10px] text-[#667085] font-bold block">Direct Express</span>
            </div>

            {/* Node 3 */}
            <div className="rounded-xl border-2 border-red-300 bg-red-50 p-4 space-y-1.5">
              <span className="text-[10px] font-bold text-red-700 block uppercase">DISRUPTION</span>
              <span className="text-base font-black text-red-900 block">Cyclone Hazard</span>
              <span className="text-[10px] text-red-700 font-bold block">HIGH Exposure</span>
            </div>

            {/* Node 4 */}
            <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-700 block uppercase">ALTERNATIVE</span>
              <span className="text-base font-black text-emerald-950 block">Kobe</span>
              <span className="text-[10px] text-emerald-800 font-bold block">UN/LOCODE: JPUKB</span>
            </div>

            {/* Node 5 */}
            <div className="rounded-xl border border-[#D9D9D6] bg-[#F7F6F2] p-4 space-y-1.5">
              <span className="text-[10px] font-bold text-[#667085] block uppercase">DESTINATION</span>
              <span className="text-base font-black text-[#111827] block">Yokohama</span>
              <span className="text-[10px] text-[#667085] font-bold block">UN/LOCODE: JPYOK</span>
            </div>
          </div>

          {/* Live Indicator Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#D9D9D6]">
            <div className="flex items-center justify-between rounded-xl bg-[#F7F6F2] p-4 border border-[#D9D9D6]">
              <span className="text-xs font-bold text-[#667085]">Operational Stress</span>
              <span className="text-lg font-black text-[#111827]">23%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#F7F6F2] p-4 border border-[#D9D9D6]">
              <span className="text-xs font-bold text-[#667085]">Disruption Probability</span>
              <span className="text-lg font-black text-[#D94E28]">22.9%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#F7F6F2] p-4 border border-[#D9D9D6]">
              <span className="text-xs font-bold text-[#667085]">ETA Exposure</span>
              <span className="text-lg font-black text-[#111827]">+18h</span>
            </div>
          </div>
        </section>

        {/* PROBLEM → INTELLIGENCE → DECISION (3 Horizontal Columns) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* PROBLEM */}
          <div className="rounded-xl border border-[#D9D9D6] bg-white p-6 space-y-3 shadow-2xs">
            <div className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800 uppercase tracking-wider">
              01 / PROBLEM
            </div>
            <h3 className="text-base font-bold text-[#111827]">
              "Disruptions are detected too late."
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Traditional logistics systems react only after berth delays occur, resulting in costly demurrage fines, SLA penalties, and emergency reroutes.
            </p>
          </div>

          {/* INTELLIGENCE */}
          <div className="rounded-xl border border-[#D9D9D6] bg-white p-6 space-y-3 shadow-2xs">
            <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900 uppercase tracking-wider">
              02 / INTELLIGENCE
            </div>
            <h3 className="text-base font-bold text-[#111827]">
              "FlowForge evaluates weather, port conditions, geopolitical exposure, vessel constraints and historical patterns."
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Machine learning models and live telemetry continuously score network bottlenecks and operational risk ahead of arrival.
            </p>
          </div>

          {/* DECISION */}
          <div className="rounded-xl border border-[#D9D9D6] bg-white p-6 space-y-3 shadow-2xs">
            <div className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 uppercase tracking-wider">
              03 / DECISION
            </div>
            <h3 className="text-base font-bold text-[#111827]">
              "Operators receive ranked alternative routes with quantified risk, ETA and financial impact."
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Deterministic decision engines compare baseline vs diversion options with 10,000 Monte Carlo stochastic scenarios to ensure maximum ROI.
            </p>
          </div>
        </section>

        {/* CORE CAPABILITIES (5 Cards) */}
        <section className="space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D94E28]">
              CORE CAPABILITIES
            </span>
            <h2 className="text-xl font-bold text-[#111827] mt-0.5">Maritime Intelligence Engine</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="rounded-xl border border-[#D9D9D6] bg-white p-5 space-y-2 shadow-2xs hover:border-stone-400 transition-colors">
              <span className="text-[10px] font-bold text-[#667085] block uppercase">01</span>
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">DISRUPTION PREDICTION</h4>
              <p className="text-xs text-[#667085] leading-relaxed">
                Predict probability of operational disruption.
              </p>
            </div>

            <div className="rounded-xl border border-[#D9D9D6] bg-white p-5 space-y-2 shadow-2xs hover:border-stone-400 transition-colors">
              <span className="text-[10px] font-bold text-[#667085] block uppercase">02</span>
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">ROUTE INTELLIGENCE</h4>
              <p className="text-xs text-[#667085] leading-relaxed">
                Discover feasible alternative routes and diversion ports.
              </p>
            </div>

            <div className="rounded-xl border border-[#D9D9D6] bg-white p-5 space-y-2 shadow-2xs hover:border-stone-400 transition-colors">
              <span className="text-[10px] font-bold text-[#667085] block uppercase">03</span>
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">ETA FORECAST</h4>
              <p className="text-xs text-[#667085] leading-relaxed">
                Predict arrival time under changing conditions.
              </p>
            </div>

            <div className="rounded-xl border border-[#D9D9D6] bg-white p-5 space-y-2 shadow-2xs hover:border-stone-400 transition-colors">
              <span className="text-[10px] font-bold text-[#667085] block uppercase">04</span>
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">MONTE CARLO</h4>
              <p className="text-xs text-[#667085] leading-relaxed">
                Simulate thousands of possible futures.
              </p>
            </div>

            <div className="rounded-xl border border-[#D9D9D6] bg-white p-5 space-y-2 shadow-2xs hover:border-stone-400 transition-colors col-span-1 sm:col-span-2 lg:col-span-1">
              <span className="text-[10px] font-bold text-[#667085] block uppercase">05</span>
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">DECISION OPTIMIZATION</h4>
              <p className="text-xs text-[#667085] leading-relaxed">
                Balance risk, time and cost.
              </p>
            </div>
          </div>
        </section>

        {/* SYSTEM PIPELINE (8 Horizontal Steps) */}
        <section className="rounded-xl border border-[#D9D9D6] bg-[#111827] text-white p-6 md:p-8 space-y-4 shadow-md">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D94E28]">
              SYSTEM PIPELINE
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">Automated Intelligence Processing</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs font-bold font-mono">
            <div className="rounded-lg bg-slate-800 p-3 border border-slate-700 text-slate-100">
              LIVE DATA
            </div>
            <div className="rounded-lg bg-slate-800 p-3 border border-slate-700 text-slate-100">
              RISK
            </div>
            <div className="rounded-lg bg-slate-800 p-3 border border-slate-700 text-slate-100">
              DISRUPTION
            </div>
            <div className="rounded-lg bg-slate-800 p-3 border border-slate-700 text-slate-100">
              ETA + COST
            </div>
            <div className="rounded-lg bg-slate-800 p-3 border border-slate-700 text-slate-100">
              ROUTE GEN
            </div>
            <div className="rounded-lg bg-slate-800 p-3 border border-slate-700 text-slate-100">
              MONTE CARLO
            </div>
            <div className="rounded-lg bg-slate-800 p-3 border border-slate-700 text-slate-100">
              OPTIMIZATION
            </div>
            <div className="rounded-lg bg-[#D94E28] p-3 text-white font-black border border-orange-500 shadow-2xs">
              DECISION
            </div>
          </div>
        </section>

        {/* DECISION CENTER & KEY BUSINESS IMPACT RESULT */}
        <section className="rounded-xl border-2 border-[#D94E28] bg-white p-6 md:p-8 space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D9D9D6] pb-4">
            <div>
              <span className="text-[10px] font-bold text-[#D94E28] uppercase tracking-widest">DECISION CENTER</span>
              <h2 className="text-xl font-black text-[#111827] mt-0.5">RECOMMENDED ACTION: DIVERT VIA KOBE (JPUKB)</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                CONFIDENCE: 91%
              </span>
              <button
                onClick={() => setCreateScenarioOpen(true)}
                className="bg-[#D94E28] hover:bg-[#C8401C] text-white font-bold text-xs px-5 py-2.5 rounded-lg uppercase tracking-wider transition-colors shadow-2xs"
              >
                APPROVE DECISION →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Impact Metrics */}
            <div className="space-y-4">
              <p className="text-xs text-[#667085] leading-relaxed border-l-2 border-[#D94E28] pl-3 py-1">
                "Current corridor has elevated cyclone exposure (78% probability). Kobe alternative reduces expected transit delay by 11 hours at an estimated incremental cost of $4,700 USD."
              </p>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="rounded-xl bg-[#F7F6F2] p-3 border border-[#D9D9D6]">
                  <span className="text-[10px] text-[#667085] block font-bold">RISK REDUCTION</span>
                  <strong className="text-emerald-700 text-base block font-black">58% → 17%</strong>
                </div>
                <div className="rounded-xl bg-[#F7F6F2] p-3 border border-[#D9D9D6]">
                  <span className="text-[10px] text-[#667085] block font-bold">DELAY REDUCTION</span>
                  <strong className="text-emerald-700 text-base block font-black">+18.4H → +5.2H</strong>
                </div>
                <div className="rounded-xl bg-[#F7F6F2] p-3 border border-[#D9D9D6]">
                  <span className="text-[10px] text-[#667085] block font-bold">EXPECTED LOSS</span>
                  <strong className="text-[#111827] text-base block font-bold">$19K → $5K</strong>
                </div>
              </div>
            </div>

            {/* Key Business Impact Card */}
            <div className="rounded-xl bg-orange-50/60 border border-orange-200 p-5 space-y-3 text-xs">
              <span className="text-[10px] font-bold text-[#D94E28] uppercase tracking-widest block border-b border-orange-200 pb-2">
                KEY BUSINESS RESULT
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-[#D94E28]">$14,400 USD</span>
                <span className="text-xs font-bold text-[#111827]">GROSS SAVINGS</span>
              </div>
              <p className="text-xs text-[#667085]">EXPECTED FINANCIAL LOSS AVOIDED</p>

              <div className="pt-2 border-t border-orange-200 flex justify-between items-center text-xs font-bold">
                <span className="text-[#667085]">Additional Transport Cost: <strong className="text-[#111827]">$4,700 USD</strong></span>
                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-black">
                  NET BENEFIT: +$9,700 USD
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D9D9D6] bg-white py-6 font-sans text-xs text-[#667085] mt-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-wrap items-center justify-between gap-4">
          <div>FLOWFORGE MARITIME DECISION INTELLIGENCE</div>
          <div>© {new Date().getFullYear()} FLOWFORGE. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>

      {/* Create Scenario Modal */}
      <CreateScenarioModal
        isOpen={createScenarioOpen}
        onClose={() => setCreateScenarioOpen(false)}
      />
    </div>
  )
}
