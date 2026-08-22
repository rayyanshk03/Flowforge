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
  X,
  XCircle,
  Zap,
  ArrowUpRight
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
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 font-sans antialiased selection:bg-[#D94E28] selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Container */}
      <main className="mx-auto max-w-[1440px] px-5 py-10 md:px-12 space-y-20">

        {/* 1. HERO SECTION */}
        <section className="pt-2 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headline & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-semibold text-[#D94E28] shadow-2xs">
                <span className="size-2 rounded-full bg-[#D94E28] animate-pulse" />
                Real-Time Maritime Decision Platform
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
                Make the next shipping decision <br className="hidden md:inline" />
                before disruption makes it for you.
              </h1>

              <p className="text-base md:text-lg text-stone-600 font-normal leading-relaxed max-w-2xl">
                FlowForge combines live operational intelligence, predictive models, geospatial routing, and Monte Carlo simulation to turn uncertainty into an actionable maritime decision.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold">
                <button
                  onClick={() => setCreateScenarioOpen(true)}
                  className="rounded-xl bg-[#D94E28] px-8 py-4 text-white shadow-sm hover:bg-[#C8401C] transition-all flex items-center gap-2.5 text-xs font-bold active:scale-[0.98]"
                >
                  Start Analysis <ArrowRight className="size-4" />
                </button>
                <a
                  href="#how-it-works"
                  className="rounded-xl border border-stone-300 bg-white px-8 py-4 text-stone-900 hover:bg-stone-50 transition-colors shadow-2xs text-xs font-bold"
                >
                  Explore How It Works
                </a>
              </div>
            </div>

            {/* Right Column: Active Telemetry Control Panel */}
            <div className="lg:col-span-5 rounded-2xl border border-stone-200 bg-white p-6 md:p-8 text-xs font-sans space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Live Voyage Monitor</span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Telemetry
                </span>
              </div>

              <div className="space-y-3.5 text-stone-800">
                <div className="flex justify-between items-center border-b border-stone-100 pb-2.5">
                  <span className="text-stone-500 font-medium">Corridor:</span>
                  <strong className="font-bold text-stone-900">Shanghai → Yokohama</strong>
                </div>
                <div className="flex justify-between items-center border-b border-stone-100 pb-2.5">
                  <span className="text-stone-500 font-medium">Vessel:</span>
                  <strong className="text-[#D94E28] font-bold">FF Horizon (984210)</strong>
                </div>
                <div className="flex justify-between items-center border-b border-stone-100 pb-2.5">
                  <span className="text-stone-500 font-medium">ETA Target:</span>
                  <strong className="font-bold text-stone-900">18 Aug · 14:35 UTC</strong>
                </div>
                <div className="flex justify-between items-center border-b border-stone-100 pb-2.5">
                  <span className="text-stone-500 font-medium">Disruption Risk:</span>
                  <strong className="text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md text-[11px]">
                    22.9% (Cyclone Alert)
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-medium">Recommended Diversion:</span>
                  <strong className="text-emerald-700 font-bold">Kobe Port (ALT-KOBE-01)</strong>
                </div>
              </div>

              <button
                onClick={() => setCreateScenarioOpen(true)}
                className="w-full text-center rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors py-3 text-xs font-bold text-stone-900 mt-2 border border-stone-200 flex items-center justify-center gap-2"
              >
                Run Reroute Simulation <ArrowRight className="size-3.5 text-[#D94E28]" />
              </button>
            </div>
          </div>
        </section>

        {/* 2. WHERE THE PROBLEM COMES IN */}
        <section className="space-y-8 pt-2">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block rounded-full bg-amber-50 border border-amber-200 px-4 py-1 text-xs font-semibold text-amber-900">
              The Logistics Disruption Crisis
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              Where The Problem Comes In Modern Shipping
            </h2>
            <p className="text-base text-stone-600 font-normal leading-relaxed">
              Global maritime supply chains lose over $45B annually due to late disruption detection and blind reactive decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Problem Card 1 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-8 space-y-5 shadow-2xs hover:shadow-md hover:border-red-200 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="size-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-bold">
                  <AlertTriangle className="size-5" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 leading-snug">
                  Disruptions Are Detected Too Late
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Shipping operators usually find out about typhoons, canal blockages, or port congestion only after vessels hit bottlenecks, giving zero time to negotiate alternative berths.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 text-xs font-semibold text-red-700 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-red-500" /> Costly Anchor Waiting Time
              </div>
            </div>

            {/* Problem Card 2 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-8 space-y-5 shadow-2xs hover:shadow-md hover:border-amber-200 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="size-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                  <Clock className="size-5" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 leading-snug">
                  Uncertainty in Arrival Times (ETA)
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Single-point ETA estimates fail under dynamic weather. Without stochastic probability curves, supply chain managers cannot predict true arrival risk distribution.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-500" /> Missed Warehouse Slots & SLA Penalties
              </div>
            </div>

            {/* Problem Card 3 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-8 space-y-5 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="size-11 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 font-bold">
                  <DollarSign className="size-5" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 leading-snug">
                  Blind Reroute Cost Tradeoffs
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Diverting to an alternative port involves extra fuel, bunker costs, and terminal charges. Operators lack real-time financial comparison to verify if a detour actually saves money.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-stone-500" /> Unquantified Demurrage Losses
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRADITIONAL VS FLOWFORGE COMPARISON MATRIX */}
        <section className="space-y-8 pt-2">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block rounded-full bg-slate-100 border border-slate-200 px-4 py-1 text-xs font-semibold text-slate-800">
              Operational Comparison
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              Traditional Logistics vs. FlowForge Intelligence
            </h2>
            <p className="text-base text-stone-600 font-normal leading-relaxed">
              See how FlowForge transforms reactive supply chain troubleshooting into proactive, data-driven decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Traditional Logistics Column */}
            <div className="rounded-2xl border border-stone-200 bg-white p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-bold text-sm">
                    ✕
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">Traditional Logistics</h3>
                    <span className="text-xs text-stone-500 font-medium">Reactive Manifest Tracking</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  High Cost Risk
                </span>
              </div>

              <ul className="space-y-4 text-xs font-normal text-stone-700">
                <li className="flex items-start gap-3">
                  <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Reactive Tracking:</strong> Operators only learn of disruptions after berth delays occur.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Single Fixed Route:</strong> No backup port option pre-calculated when weather changes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Deterministic Single ETA:</strong> Assumes perfect conditions, ignoring weather variance.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Manual Email Coordination:</strong> Takes 12-24 hours to clear diversion approval.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Accumulated Financial Loss:</strong> Heavy demurrage fees and missed delivery SLAs.</span>
                </li>
              </ul>
            </div>

            {/* FlowForge Column */}
            <div className="rounded-2xl border-2 border-[#D94E28] bg-white p-8 space-y-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#D94E28] text-white text-[11px] font-bold uppercase px-4 py-1.5 rounded-bl-xl tracking-wider">
                Recommended Platform
              </div>

              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-[#D94E28] text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">FlowForge Platform</h3>
                    <span className="text-xs text-[#D94E28] font-semibold">Proactive Decision Intelligence</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Optimized ROI
                </span>
              </div>

              <ul className="space-y-4 text-xs font-normal text-stone-800">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-[#D94E28] shrink-0 mt-0.5" />
                  <span><strong>Proactive Disruption Prediction:</strong> ML ExtraTrees classifier predicts risk 48-72h in advance.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-[#D94E28] shrink-0 mt-0.5" />
                  <span><strong>Automated Diversion Routing:</strong> A* maritime router calculates alternative ports (e.g. Kobe).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-[#D94E28] shrink-0 mt-0.5" />
                  <span><strong>10,000 Monte Carlo Simulations:</strong> Generates P50, P90, P95 stochastic arrival distributions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-[#D94E28] shrink-0 mt-0.5" />
                  <span><strong>Instant Decision Recommendation:</strong> Calculates net financial savings in under 2 seconds.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-[#D94E28] shrink-0 mt-0.5" />
                  <span><strong>Human-in-the-Loop Approval:</strong> Audit-ready approval gates for fleet managers.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS (STEP-BY-STEP OPERATIONAL FLOW) */}
        <section id="how-it-works" className="space-y-8 pt-2">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block rounded-full bg-blue-50 border border-blue-200 px-4 py-1 text-xs font-semibold text-blue-900">
              Architecture & Workflow
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              How FlowForge Works
            </h2>
            <p className="text-base text-stone-600 font-normal leading-relaxed">
              Five integrated intelligence layers turning complex maritime telemetry into clear operational decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {/* Step 1 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#D94E28] block">STEP 01</span>
                <h4 className="text-base font-bold text-stone-900">Live Data Ingestion</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Aggregates real-time AIS vessel telemetry, OpenMeteo weather forecasts, port congestion & geopolitical alerts.
                </p>
              </div>
              <div className="text-xs font-medium text-stone-500 pt-3 border-t border-stone-100">
                8 Live Data Feeds
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#D94E28] block">STEP 02</span>
                <h4 className="text-base font-bold text-stone-900">Risk Prediction</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  ExtraTrees classifier scores corridor risk probability and evaluates typhoon or strike exposure.
                </p>
              </div>
              <div className="text-xs font-medium text-stone-500 pt-3 border-t border-stone-100">
                ML Risk Classifier
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#D94E28] block">STEP 03</span>
                <h4 className="text-base font-bold text-stone-900">Route Generation</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  A* maritime spatial router generates feasible alternate diversion paths and port options (e.g. Kobe).
                </p>
              </div>
              <div className="text-xs font-medium text-stone-500 pt-3 border-t border-stone-100">
                A* Spatial Router
              </div>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#D94E28] block">STEP 04</span>
                <h4 className="text-base font-bold text-stone-900">Monte Carlo Engine</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Executes 10,000 stochastic trials to compute P50, P90, and P95 arrival time and cost percentiles.
                </p>
              </div>
              <div className="text-xs font-medium text-stone-500 pt-3 border-t border-stone-100">
                10,000 Stochastic Trials
              </div>
            </div>

            {/* Step 5 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#D94E28] block">STEP 05</span>
                <h4 className="text-base font-bold text-stone-900">Decision Optimization</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  XGBoost cost engine ranks baseline vs diversion options and quantifies net financial savings.
                </p>
              </div>
              <div className="text-xs font-bold text-[#D94E28] pt-3 border-t border-stone-100">
                Optimal Decision
              </div>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE LIVE MARITIME CORRIDOR VISUALIZER */}
        <section className="rounded-2xl border border-stone-200 bg-white p-8 md:p-10 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D94E28] block">
                Live Corridor Demo
              </span>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">Shanghai → Yokohama Route & Diversion Flow</h3>
            </div>
            <span className="rounded-lg bg-stone-100 px-3.5 py-1.5 text-xs font-semibold text-stone-800 border border-stone-200">
              Corridor: CNSHA → JPYOK
            </span>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-3 text-xs font-sans">
            {/* ORIGIN */}
            <div className="w-full lg:flex-1 rounded-xl border border-stone-200 bg-[#F9F8F6] p-5 space-y-2 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="text-xs font-medium text-stone-500 block uppercase tracking-wider">Origin</span>
                <span className="text-lg font-bold text-stone-900 block mt-1">Shanghai</span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium block pt-2 border-t border-stone-200/80">
                UN/LOCODE: CNSHA
              </span>
            </div>

            <div className="text-stone-400 font-bold text-base hidden lg:block shrink-0 px-1">→</div>

            {/* CURRENT ROUTE */}
            <div className="w-full lg:flex-1 rounded-xl border border-stone-200 bg-[#F9F8F6] p-5 space-y-2 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="text-xs font-medium text-stone-500 block uppercase tracking-wider">Current Route</span>
                <span className="text-base font-bold text-stone-900 block mt-1">East China Sea</span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium block pt-2 border-t border-stone-200/80">
                Direct Express Corridor
              </span>
            </div>

            <div className="text-red-500 font-bold text-base hidden lg:block shrink-0 px-1">→</div>

            {/* DISRUPTION */}
            <div className="w-full lg:flex-1 rounded-xl border-2 border-red-300 bg-red-50/70 p-5 space-y-2 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="text-xs font-bold text-red-700 block uppercase tracking-wider">Disruption</span>
                <span className="text-base font-bold text-red-950 block mt-1">Cyclone Hazard</span>
              </div>
              <span className="text-[11px] text-red-800 font-bold block pt-2 border-t border-red-200">
                22.9% Risk Probability
              </span>
            </div>

            <div className="text-emerald-600 font-bold text-base hidden lg:block shrink-0 px-1">→</div>

            {/* ALTERNATIVE */}
            <div className="w-full lg:flex-1 rounded-xl border-2 border-emerald-400 bg-emerald-50/80 p-5 space-y-2 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="text-xs font-bold text-emerald-800 block uppercase tracking-wider">Recommended Diversion</span>
                <span className="text-lg font-bold text-emerald-950 block mt-1">Kobe Port</span>
              </div>
              <span className="text-[11px] text-emerald-800 font-bold block pt-2 border-t border-emerald-200">
                UN/LOCODE: JPUKB
              </span>
            </div>

            <div className="text-stone-400 font-bold text-base hidden lg:block shrink-0 px-1">→</div>

            {/* DESTINATION */}
            <div className="w-full lg:flex-1 rounded-xl border border-stone-200 bg-[#F9F8F6] p-5 space-y-2 flex flex-col justify-between shadow-2xs">
              <div>
                <span className="text-xs font-medium text-stone-500 block uppercase tracking-wider">Destination</span>
                <span className="text-lg font-bold text-stone-900 block mt-1">Yokohama</span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium block pt-2 border-t border-stone-200/80">
                UN/LOCODE: JPYOK
              </span>
            </div>
          </div>
        </section>

        {/* 6. FINAL CTA BANNER */}
        <section className="rounded-2xl border border-stone-200 bg-white p-10 md:p-14 text-center space-y-6 shadow-sm">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-block rounded-full bg-stone-100 border border-stone-200 px-4 py-1 text-xs font-semibold text-stone-800">
              Get Started With FlowForge
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
              From uncertainty <br className="hidden sm:inline" />
              to an operational decision.
            </h2>
            <p className="text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
              Run predictive route simulations, evaluate alternative diversion ports, and generate audit-ready maritime decisions.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCreateScenarioOpen(true)}
              className="rounded-xl bg-[#D94E28] px-9 py-4 text-xs font-bold text-white shadow-sm hover:bg-[#C8401C] transition-all uppercase tracking-wider inline-flex items-center gap-2 active:scale-[0.98]"
            >
              Start Your Reroute Analysis <ArrowRight className="size-4" />
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-xs text-stone-500 mt-16 font-sans">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12 flex flex-wrap items-center justify-between gap-4 font-medium">
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
