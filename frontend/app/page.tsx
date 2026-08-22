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

      {/* Main Content Container - Compact & Tight Layout */}
      <main className="mx-auto max-w-[1440px] px-4 py-8 md:px-10 space-y-12">

        {/* 1. HERO SECTION */}
        <section className="pt-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Headline & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1 text-xs font-semibold text-[#D94E28] shadow-2xs">
                <span className="size-2 rounded-full bg-[#D94E28] animate-pulse" />
                Real-Time Maritime Decision Platform
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.12]">
                Make the next shipping decision <br className="hidden md:inline" />
                before disruption makes it for you.
              </h1>

              <p className="text-base md:text-lg text-stone-600 font-normal leading-relaxed max-w-2xl">
                FlowForge combines live operational intelligence, predictive models, geospatial routing, and Monte Carlo simulation to turn uncertainty into an actionable maritime decision.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3 text-xs font-semibold">
                <button
                  onClick={() => setCreateScenarioOpen(true)}
                  className="rounded-xl bg-[#D94E28] px-8 py-4 text-white shadow-sm hover:bg-[#C8401C] transition-all flex items-center gap-2 text-xs font-bold active:scale-[0.98]"
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

            {/* Right Column: Active Telemetry Control Panel (Compact Fit) */}
            <div className="lg:col-span-5 rounded-2xl border border-stone-200 bg-white p-7 text-xs font-sans space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Live Voyage Monitor</span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Telemetry
                </span>
              </div>

              <div className="space-y-3.5 text-stone-800">
                <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                  <span className="text-stone-500 font-medium">Corridor:</span>
                  <strong className="font-bold text-stone-900">Shanghai → Yokohama</strong>
                </div>
                <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                  <span className="text-stone-500 font-medium">Vessel:</span>
                  <strong className="text-[#D94E28] font-bold">FF Horizon (984210)</strong>
                </div>
                <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                  <span className="text-stone-500 font-medium">ETA Target:</span>
                  <strong className="font-bold text-stone-900">18 Aug · 14:35 UTC</strong>
                </div>
                <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                  <span className="text-stone-500 font-medium">Disruption Risk:</span>
                  <strong className="text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
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
                className="w-full text-center rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors py-3.5 text-xs font-bold text-stone-900 mt-2 border border-stone-200 flex items-center justify-center gap-2"
              >
                Run Reroute Simulation <ArrowRight className="size-3.5 text-[#D94E28]" />
              </button>
            </div>
          </div>
        </section>

        {/* 2. WHERE THE PROBLEM COMES IN (Compact Padding) */}
        <section className="space-y-4 pt-1">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="inline-block rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 text-[11px] font-semibold text-amber-900">
              The Logistics Disruption Crisis
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
              Where The Problem Comes In Modern Shipping
            </h2>
            <p className="text-xs text-stone-600 font-normal">
              Global maritime supply chains lose over $45B annually due to late disruption detection and blind reactive decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Problem Card 1 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3 shadow-2xs hover:shadow-sm hover:border-red-200 transition-all flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="size-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-bold">
                  <AlertTriangle className="size-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  Disruptions Are Detected Too Late
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Shipping operators usually find out about typhoons, canal blockages, or port congestion only after vessels hit bottlenecks, giving zero time to negotiate alternative berths.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-[11px] font-semibold text-red-700 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-red-500" /> Costly Anchor Waiting Time
              </div>
            </div>

            {/* Problem Card 2 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3 shadow-2xs hover:shadow-sm hover:border-amber-200 transition-all flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="size-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                  <Clock className="size-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  Uncertainty in Arrival Times (ETA)
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Single-point ETA estimates fail under dynamic weather. Without stochastic probability curves, supply chain managers cannot predict true arrival risk distribution.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-[11px] font-semibold text-amber-700 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-amber-500" /> Missed Warehouse Slots & SLA Penalties
              </div>
            </div>

            {/* Problem Card 3 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3 shadow-2xs hover:shadow-sm hover:border-stone-300 transition-all flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="size-9 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 font-bold">
                  <DollarSign className="size-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  Blind Reroute Cost Tradeoffs
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Diverting to an alternative port involves extra fuel, bunker costs, and terminal charges. Operators lack real-time financial comparison to verify if a detour actually saves money.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-[11px] font-semibold text-stone-700 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-stone-500" /> Unquantified Demurrage Losses
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRADITIONAL VS FLOWFORGE COMPARISON MATRIX (Compact Fit) */}
        <section className="space-y-4 pt-1">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="inline-block rounded-full bg-slate-100 border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-800">
              Operational Comparison
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
              Traditional Logistics vs. FlowForge Intelligence
            </h2>
            <p className="text-xs text-stone-600 font-normal">
              See how FlowForge transforms reactive supply chain troubleshooting into proactive, data-driven decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* Traditional Logistics Column */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-bold text-xs">
                    ✕
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">Traditional Logistics</h3>
                    <span className="text-[11px] text-stone-500 font-medium">Reactive Manifest Tracking</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                  High Cost Risk
                </span>
              </div>

              <ul className="space-y-3 text-xs font-normal text-stone-700">
                <li className="flex items-start gap-2.5">
                  <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Reactive Tracking:</strong> Operators only learn of disruptions after berth delays occur.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Single Fixed Route:</strong> No backup port option pre-calculated when weather changes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Deterministic Single ETA:</strong> Assumes perfect conditions, ignoring weather variance.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Manual Email Coordination:</strong> Takes 12-24 hours to clear diversion approval.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Accumulated Financial Loss:</strong> Heavy demurrage fees and missed delivery SLAs.</span>
                </li>
              </ul>
            </div>

            {/* FlowForge Column */}
            <div className="rounded-2xl border-2 border-[#D94E28] bg-white p-6 space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#D94E28] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
                Recommended Platform
              </div>

              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-[#D94E28] text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">FlowForge Platform</h3>
                    <span className="text-[11px] text-[#D94E28] font-semibold">Proactive Decision Intelligence</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Optimized ROI
                </span>
              </div>

              <ul className="space-y-3 text-xs font-normal text-stone-800">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#D94E28] shrink-0 mt-0.5" />
                  <span><strong>Proactive Disruption Prediction:</strong> ML ExtraTrees classifier predicts risk 48-72h in advance.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#D94E28] shrink-0 mt-0.5" />
                  <span><strong>Automated Diversion Routing:</strong> A* maritime router calculates alternative ports (e.g. Kobe).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#D94E28] shrink-0 mt-0.5" />
                  <span><strong>10,000 Monte Carlo Simulations:</strong> Generates P50, P90, P95 stochastic arrival distributions.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#D94E28] shrink-0 mt-0.5" />
                  <span><strong>Instant Decision Recommendation:</strong> Calculates net financial savings in under 2 seconds.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#D94E28] shrink-0 mt-0.5" />
                  <span><strong>Human-in-the-Loop Approval:</strong> Audit-ready approval gates for fleet managers.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS (STEP-BY-STEP OPERATIONAL FLOW) */}
        <section id="how-it-works" className="space-y-4 pt-1">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="inline-block rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-[11px] font-semibold text-blue-900">
              Architecture & Workflow
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
              How FlowForge Works
            </h2>
            <p className="text-xs text-stone-600 font-normal">
              Five integrated intelligence layers turning complex maritime telemetry into clear operational decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {/* Step 1 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3 shadow-2xs hover:shadow-sm hover:border-stone-300 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#D94E28] block">STEP 01</span>
                <h4 className="text-sm font-bold text-stone-900">Live Data Ingestion</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Aggregates real-time AIS vessel telemetry, OpenMeteo weather forecasts, port congestion & geopolitical alerts.
                </p>
              </div>
              <div className="text-[11px] font-medium text-stone-500 pt-2 border-t border-stone-100">
                8 Live Data Feeds
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3 shadow-2xs hover:shadow-sm hover:border-stone-300 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#D94E28] block">STEP 02</span>
                <h4 className="text-sm font-bold text-stone-900">Risk Prediction</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  ExtraTrees classifier scores corridor risk probability and evaluates typhoon or strike exposure.
                </p>
              </div>
              <div className="text-[11px] font-medium text-stone-500 pt-2 border-t border-stone-100">
                ML Risk Classifier
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3 shadow-2xs hover:shadow-sm hover:border-stone-300 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#D94E28] block">STEP 03</span>
                <h4 className="text-sm font-bold text-stone-900">Route Generation</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  A* maritime spatial router generates feasible alternate diversion paths and port options (e.g. Kobe).
                </p>
              </div>
              <div className="text-[11px] font-medium text-stone-500 pt-2 border-t border-stone-100">
                A* Spatial Router
              </div>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3 shadow-2xs hover:shadow-sm hover:border-stone-300 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#D94E28] block">STEP 04</span>
                <h4 className="text-sm font-bold text-stone-900">Monte Carlo Engine</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Executes 10,000 stochastic trials to compute P50, P90, and P95 arrival time and cost percentiles.
                </p>
              </div>
              <div className="text-[11px] font-medium text-stone-500 pt-2 border-t border-stone-100">
                10,000 Stochastic Trials
              </div>
            </div>

            {/* Step 5 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3 shadow-2xs hover:shadow-sm hover:border-stone-300 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#D94E28] block">STEP 05</span>
                <h4 className="text-sm font-bold text-stone-900">Decision Optimization</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  XGBoost cost engine ranks baseline vs diversion options and quantifies net financial savings.
                </p>
              </div>
              <div className="text-[11px] font-bold text-[#D94E28] pt-2 border-t border-stone-100">
                Optimal Decision
              </div>
            </div>
          </div>
        </section>

        {/* 5. NEW COMPACT LIVE INTELLIGENCE COMMAND CONSOLE */}
        <section className="rounded-2xl border border-stone-200 bg-white p-5 md:p-6 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D94E28] block">
                Live Intelligence Console
              </span>
              <h3 className="text-xl font-bold text-stone-900 mt-0.5">Real-Time Operational Decision Telemetry</h3>
            </div>
            <span className="rounded-lg bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-800 border border-stone-200">
              Corridor: Shanghai → Yokohama
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
            {/* Metric 1: Port Congestion Radar */}
            <div className="rounded-xl border border-stone-200 bg-[#F9F8F6] p-4 space-y-2 shadow-2xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-stone-600">Port Congestion</span>
                <span className="text-[10px] font-bold bg-stone-200 text-stone-800 px-2 py-0.5 rounded">3 PORTS</span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between"><span>Shanghai (CNSHA):</span> <strong className="text-amber-700">1.2 Days Delay</strong></div>
                <div className="flex justify-between"><span>Kobe (JPUKB):</span> <strong className="text-emerald-700">0.1 Days Delay</strong></div>
                <div className="flex justify-between"><span>Yokohama (JPYOK):</span> <strong className="text-stone-800">0.4 Days Delay</strong></div>
              </div>
            </div>

            {/* Metric 2: Disruption Risk Model */}
            <div className="rounded-xl border border-stone-200 bg-[#F9F8F6] p-4 space-y-2 shadow-2xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-stone-600">ML Risk Model</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">MODERATE</span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between"><span>Disruption Risk:</span> <strong className="text-[#D94E28]">22.9% Probability</strong></div>
                <div className="flex justify-between"><span>Primary Hazard:</span> <strong className="text-stone-800">Typhoon Wind Force 8</strong></div>
                <div className="flex justify-between"><span>Classifier:</span> <strong className="text-stone-700">ExtraTrees v1.8</strong></div>
              </div>
            </div>

            {/* Metric 3: Financial Optimization */}
            <div className="rounded-xl border border-stone-200 bg-[#F9F8F6] p-4 space-y-2 shadow-2xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-stone-600">Financial Impact</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded">SAVINGS</span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between"><span>Baseline Cost:</span> <span className="line-through text-stone-500">$18,888</span></div>
                <div className="flex justify-between"><span>Kobe Diversion:</span> <strong className="text-emerald-800">$10,510</strong></div>
                <div className="flex justify-between"><span>Net Cost Savings:</span> <strong className="text-emerald-700 font-extrabold">+$8,377.77</strong></div>
              </div>
            </div>

            {/* Metric 4: Stochastic Monte Carlo */}
            <div className="rounded-xl border border-stone-200 bg-[#F9F8F6] p-4 space-y-2 shadow-2xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-stone-600">Monte Carlo (10,000)</span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200 px-2 py-0.5 rounded">STOCHASTIC</span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between"><span>P50 Expected ETA:</span> <strong className="text-stone-800">+8.2 Hours</strong></div>
                <div className="flex justify-between"><span>P90 Weather Exposure:</span> <strong className="text-amber-800">+298.2 Hours</strong></div>
                <div className="flex justify-between"><span>P95 Worst-Case:</span> <strong className="text-red-700">+335.0 Hours</strong></div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FINAL CTA BANNER (Compact & Content Fit) */}
        <section className="rounded-2xl border border-stone-200 bg-white p-8 md:p-10 text-center space-y-4 shadow-sm">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="inline-block rounded-full bg-stone-100 border border-stone-200 px-3 py-0.5 text-xs font-semibold text-stone-800">
              Get Started With FlowForge
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              From uncertainty to an operational decision.
            </h2>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
              Run predictive route simulations, evaluate alternative diversion ports, and generate audit-ready maritime decisions.
            </p>
          </div>

          <div className="pt-1">
            <button
              onClick={() => setCreateScenarioOpen(true)}
              className="rounded-xl bg-[#D94E28] px-8 py-3.5 text-xs font-bold text-white shadow-sm hover:bg-[#C8401C] transition-all flex items-center gap-2 mx-auto active:scale-[0.98]"
            >
              Start Your Reroute Analysis <ArrowRight className="size-4" />
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-5 text-xs text-stone-500 mt-10 font-sans">
        <div className="mx-auto max-w-[1440px] px-4 md:px-10 flex flex-wrap items-center justify-between gap-4 font-medium">
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
