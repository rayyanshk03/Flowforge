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

import Navbar from '@/components/Navbar'
import CreateScenarioModal from '@/components/CreateScenarioModal'

export default function EnterpriseMaritimeLandingPage() {
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)
  const [backendConnected, setBackendConnected] = useState(true)

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch('http://localhost:8000/health')
        if (res.ok) setBackendConnected(true)
      } catch {
        setBackendConnected(false)
      }
    }
    checkBackend()
  }, [])

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#111827] font-sans antialiased selection:bg-[#D94E28] selection:text-white">
      {/* 1. TOP NAVIGATION */}
      <Navbar />

      {/* MAIN CONTENT CONTAINER */}
      <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-12 space-y-12">

        {/* 2. HERO SECTION */}
        <section className="py-4 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Headline & Supporting Text (7 Columns - Sitting Unboxed on Canvas) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-1.5 text-xs font-mono font-bold text-[#D94E28] shadow-2xs">
                <span className="size-2 rounded-full bg-[#D94E28] animate-pulse" />
                OPERATIONAL CONTROL TOWER · REAL-TIME DECISION ENGINE
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-[#111827] tracking-tight leading-[1.1]">
                Make the next shipping decision <br className="hidden md:inline" />
                before disruption makes it for you.
              </h1>

              <p className="text-base md:text-lg text-[#4B5563] font-normal leading-relaxed max-w-2xl">
                FlowForge combines live operational intelligence, predictive models, geospatial routing and Monte Carlo simulation to turn uncertainty into an actionable maritime decision.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono font-bold">
                <button
                  onClick={() => setCreateScenarioOpen(true)}
                  className="rounded-lg bg-[#D94E28] px-7 py-4 text-white shadow-sm hover:bg-[#C8401C] transition-all flex items-center gap-2.5 uppercase tracking-wider text-xs font-extrabold active:scale-[0.98]"
                >
                  Start Analysis <ArrowRight className="size-4" />
                </button>
                <a
                  href="#visualization"
                  className="rounded-lg border border-[#D9D9D6] bg-white px-7 py-4 text-[#111827] hover:bg-stone-50 transition-colors shadow-2xs uppercase tracking-wider text-xs font-bold"
                >
                  Explore How It Works
                </a>
              </div>
            </div>

            {/* Right Telemetry Control Card (5 Columns - Bold White Box) */}
            <div className="lg:col-span-5 rounded-xl border-2 border-stone-300 bg-white p-6 md:p-7 text-xs font-mono space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="text-[10px] font-bold text-[#667085] uppercase tracking-widest block">ACTIVE VOYAGE TELEMETRY</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  MONITORING
                </span>
              </div>

              <div className="space-y-3.5 text-[#111827]">
                <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                  <span className="text-[#667085]">CORRIDOR:</span>
                  <strong className="font-black text-stone-950">Shanghai → Yokohama</strong>
                </div>
                <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                  <span className="text-[#667085]">VESSEL:</span>
                  <strong className="text-[#D94E28] font-black">FF Horizon (984210)</strong>
                </div>
                <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                  <span className="text-[#667085]">ETA TARGET:</span>
                  <strong className="font-bold text-stone-900">18 Aug · 14:35 UTC</strong>
                </div>
                <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                  <span className="text-[#667085]">SPEED:</span>
                  <strong className="text-[#111827] font-bold">14.2 Knots</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#667085]">LIVE ENGINE:</span>
                  <strong className="text-emerald-700 font-extrabold">XGBoost 2.1.0 Ready</strong>
                </div>
              </div>

              <button
                onClick={() => setCreateScenarioOpen(true)}
                className="w-full text-center rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors py-2.5 text-[11px] font-bold text-stone-800 uppercase tracking-wider mt-2 border border-stone-300"
              >
                TEST THIS VOYAGE →
              </button>
            </div>
          </div>
        </section>

        {/* 3. LIVE SYSTEM VISUALIZATION */}
        <section id="visualization" className="rounded-xl border border-[#D9D9D6] bg-white p-8 md:p-10 space-y-8 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D94E28] block">
                SECTION 3 · LIVE SYSTEM VISUALIZATION
              </span>
              <h2 className="text-2xl font-black text-[#111827] mt-1">Maritime Corridor Route & Disruption Flow</h2>
            </div>
            <span className="rounded-md bg-[#F7F6F2] px-3 py-1.5 text-xs font-mono font-bold text-stone-800 border border-[#D9D9D6]">
              CORRIDOR: CNSHA → JPYOK
            </span>
          </div>

          {/* Minimal Maritime Route Visualization Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs font-mono items-stretch">
            {/* ORIGIN */}
            <div className="rounded-lg border border-[#D9D9D6] bg-[#F7F6F2] p-5 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#667085] block uppercase tracking-wider">ORIGIN</span>
                <span className="text-lg font-black text-[#111827] block mt-1">Shanghai</span>
              </div>
              <span className="text-[10px] text-[#667085] font-bold block pt-2 border-t border-stone-200">
                UN/LOCODE: CNSHA
              </span>
            </div>

            {/* CURRENT ROUTE */}
            <div className="rounded-lg border border-[#D9D9D6] bg-[#F7F6F2] p-5 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#667085] block uppercase tracking-wider">CURRENT ROUTE</span>
                <span className="text-base font-bold text-[#111827] block mt-1">East China Sea</span>
              </div>
              <span className="text-[10px] text-[#667085] font-bold block pt-2 border-t border-stone-200">
                Direct Express Corridor
              </span>
            </div>

            {/* DISRUPTION */}
            <div className="rounded-lg border-2 border-red-300 bg-red-50/80 p-5 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-red-700 block uppercase tracking-wider">DISRUPTION</span>
                <span className="text-base font-black text-red-900 block mt-1">Cyclone Hazard</span>
              </div>
              <span className="text-[10px] text-red-700 font-bold block pt-2 border-t border-red-200">
                HIGH EXPOSURE
              </span>
            </div>

            {/* ALTERNATIVE */}
            <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50/80 p-5 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 block uppercase tracking-wider">ALTERNATIVE</span>
                <span className="text-lg font-black text-emerald-950 block mt-1">Kobe</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-bold block pt-2 border-t border-emerald-200">
                UN/LOCODE: JPUKB
              </span>
            </div>

            {/* DESTINATION */}
            <div className="rounded-lg border border-[#D9D9D6] bg-[#F7F6F2] p-5 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#667085] block uppercase tracking-wider">DESTINATION</span>
                <span className="text-lg font-black text-[#111827] block mt-1">Yokohama</span>
              </div>
              <span className="text-[10px] text-[#667085] font-bold block pt-2 border-t border-stone-200">
                UN/LOCODE: JPYOK
              </span>
            </div>
          </div>

          {/* Small Live Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 font-mono">
            <div className="flex items-center justify-between rounded-lg bg-[#F7F6F2] p-4 border border-[#D9D9D6]">
              <span className="text-xs font-bold text-[#667085]">Operational Stress</span>
              <strong className="text-xl font-black text-[#111827]">23%</strong>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-[#F7F6F2] p-4 border border-[#D9D9D6]">
              <span className="text-xs font-bold text-[#667085]">Disruption Probability</span>
              <strong className="text-xl font-black text-[#D94E28]">22.9%</strong>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-[#F7F6F2] p-4 border border-[#D9D9D6]">
              <span className="text-xs font-bold text-[#667085]">ETA Exposure</span>
              <strong className="text-xl font-black text-amber-700">+18h</strong>
            </div>
          </div>
        </section>

        {/* 4. PROBLEM → INTELLIGENCE → DECISION */}
        <section className="space-y-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D94E28] block">
            SECTION 4 · OPERATIONAL FRAMEWORK
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* PROBLEM */}
            <div className="rounded-xl border border-[#D9D9D6] bg-white p-7 space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-block rounded-full bg-red-100 px-3 py-1 text-[11px] font-mono font-bold text-red-900 uppercase tracking-wider">
                  PROBLEM
                </div>
                <h3 className="text-xl font-bold text-[#111827] leading-snug">
                  "Disruptions are detected too late."
                </h3>
              </div>
              <p className="text-xs text-[#667085] leading-relaxed pt-3 border-t border-stone-200">
                Traditional logistics systems react only after berth delays occur, resulting in costly demurrage fines, SLA penalties, and emergency reroutes.
              </p>
            </div>

            {/* INTELLIGENCE */}
            <div className="rounded-xl border border-[#D9D9D6] bg-white p-7 space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-[11px] font-mono font-bold text-blue-900 uppercase tracking-wider">
                  INTELLIGENCE
                </div>
                <h3 className="text-xl font-bold text-[#111827] leading-snug">
                  "FlowForge evaluates weather, port conditions, geopolitical exposure, vessel constraints and historical patterns."
                </h3>
              </div>
              <p className="text-xs text-[#667085] leading-relaxed pt-3 border-t border-stone-200">
                Machine learning models and live telemetry continuously score network bottlenecks and operational risk ahead of arrival.
              </p>
            </div>

            {/* DECISION */}
            <div className="rounded-xl border border-[#D9D9D6] bg-white p-7 space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-mono font-bold text-emerald-900 uppercase tracking-wider">
                  DECISION
                </div>
                <h3 className="text-xl font-bold text-[#111827] leading-snug">
                  "Operators receive ranked alternative routes with quantified risk, ETA and financial impact."
                </h3>
              </div>
              <p className="text-xs text-[#667085] leading-relaxed pt-3 border-t border-stone-200">
                Deterministic decision engines compare baseline vs diversion options with 10,000 Monte Carlo stochastic scenarios to ensure maximum ROI.
              </p>
            </div>
          </div>
        </section>

        {/* 5. CORE CAPABILITIES */}
        <section className="space-y-6">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D94E28] block">
              SECTION 5 · CORE CAPABILITIES
            </span>
            <h2 className="text-2xl font-black text-[#111827] mt-1">Maritime Intelligence Engine</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Card 1 */}
            <div className="rounded-xl border border-[#D9D9D6] bg-white p-6 space-y-3 shadow-2xs hover:border-stone-400 transition-colors flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#D94E28] block">01</span>
                <h4 className="text-xs font-mono font-black text-[#111827] uppercase tracking-wider">DISRUPTION PREDICTION</h4>
              </div>
              <p className="text-xs text-[#667085] leading-relaxed">
                Predict probability of operational disruption.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-[#D9D9D6] bg-white p-6 space-y-3 shadow-2xs hover:border-stone-400 transition-colors flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#D94E28] block">02</span>
                <h4 className="text-xs font-mono font-black text-[#111827] uppercase tracking-wider">ROUTE INTELLIGENCE</h4>
              </div>
              <p className="text-xs text-[#667085] leading-relaxed">
                Discover feasible alternative routes and diversion ports.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-[#D9D9D6] bg-white p-6 space-y-3 shadow-2xs hover:border-stone-400 transition-colors flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#D94E28] block">03</span>
                <h4 className="text-xs font-mono font-black text-[#111827] uppercase tracking-wider">ETA FORECAST</h4>
              </div>
              <p className="text-xs text-[#667085] leading-relaxed">
                Predict arrival time under changing conditions.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl border border-[#D9D9D6] bg-white p-6 space-y-3 shadow-2xs hover:border-stone-400 transition-colors flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#D94E28] block">04</span>
                <h4 className="text-xs font-mono font-black text-[#111827] uppercase tracking-wider">MONTE CARLO</h4>
              </div>
              <p className="text-xs text-[#667085] leading-relaxed">
                Simulate thousands of possible futures.
              </p>
            </div>

            {/* Card 5 */}
            <div className="rounded-xl border border-[#D9D9D6] bg-white p-6 space-y-3 shadow-2xs hover:border-stone-400 transition-colors col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-[#D94E28] block">05</span>
                <h4 className="text-xs font-mono font-black text-[#111827] uppercase tracking-wider">DECISION OPTIMIZATION</h4>
              </div>
              <p className="text-xs text-[#667085] leading-relaxed">
                Balance risk, time and cost.
              </p>
            </div>
          </div>
        </section>

        {/* 6. SYSTEM PIPELINE */}
        <section className="rounded-xl border border-[#D9D9D6] bg-[#111827] text-white p-8 md:p-10 space-y-6 shadow-md">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D94E28] block">
              SECTION 6 · SYSTEM PIPELINE
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Automated Intelligence Processing Pipeline</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center text-xs font-bold font-mono">
            <div className="rounded-lg bg-slate-800 p-4 border border-slate-700 text-slate-100 flex flex-col justify-center">
              LIVE DATA
            </div>
            <div className="rounded-lg bg-slate-800 p-4 border border-slate-700 text-slate-100 flex flex-col justify-center">
              RISK
            </div>
            <div className="rounded-lg bg-slate-800 p-4 border border-slate-700 text-slate-100 flex flex-col justify-center">
              DISRUPTION
            </div>
            <div className="rounded-lg bg-slate-800 p-4 border border-slate-700 text-slate-100 flex flex-col justify-center">
              ETA + COST
            </div>
            <div className="rounded-lg bg-slate-800 p-4 border border-slate-700 text-slate-100 flex flex-col justify-center">
              ROUTE GENERATION
            </div>
            <div className="rounded-lg bg-slate-800 p-4 border border-slate-700 text-slate-100 flex flex-col justify-center">
              MONTE CARLO
            </div>
            <div className="rounded-lg bg-slate-800 p-4 border border-slate-700 text-slate-100 flex flex-col justify-center">
              OPTIMIZATION
            </div>
            <div className="rounded-lg bg-[#D94E28] p-4 text-white font-black border border-orange-500 shadow-2xs flex flex-col justify-center">
              DECISION
            </div>
          </div>
        </section>

        {/* 7. FINAL CTA */}
        <section className="rounded-xl border-2 border-[#D9D9D6] bg-white p-10 md:p-14 text-center space-y-6 shadow-sm">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D94E28] block">
              SECTION 7 · MISSION CONTROL
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#111827] tracking-tight">
              From uncertainty <br className="hidden sm:inline" />
              to an operational decision.
            </h2>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCreateScenarioOpen(true)}
              className="rounded-lg bg-[#D94E28] px-8 py-4 text-xs font-mono font-bold text-white shadow-xs hover:bg-[#C8401C] transition-all uppercase tracking-wider inline-flex items-center gap-2"
            >
              Run Your First Analysis <ArrowRight className="size-4" />
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#D9D9D6] bg-white py-6 font-mono text-xs text-[#667085] mt-12">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12 flex flex-wrap items-center justify-between gap-4">
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
