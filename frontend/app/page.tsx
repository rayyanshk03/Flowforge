'use client'

import React, { useState } from 'react'
import { ArrowRight, CheckCircle2, XCircle, ShieldCheck, Zap, Activity, Navigation, Database, Brain } from 'lucide-react'
import Navbar from '@/components/Navbar'
import CreateScenarioModal from '@/components/CreateScenarioModal'

export default function EnterpriseMaritimeLandingPage() {
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 antialiased selection:bg-[#D94E28] selection:text-white font-sans">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-4 py-8 md:px-10 space-y-16">

        {/* ── 1. HERO SECTION ── */}
        <section className="pt-6 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Headline & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#D94E28] rounded-full shadow-2xs">
                <span className="size-2 rounded-full bg-[#D94E28] animate-pulse" />
                Real-Time Maritime Decision Intelligence
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.12]">
                Make the next shipping decision <br className="hidden md:inline" />
                before disruption makes it for you.
              </h1>

              <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-2xl font-normal">
                FlowForge combines live AIS telemetry, predictive ML models, bathymetric A* routing, and Monte Carlo simulations to resolve vessel delays and diversion costs in seconds.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setCreateScenarioOpen(true)}
                  className="rounded-xl bg-[#D94E28] px-8 py-4 text-white hover:bg-[#C8401C] transition-all flex items-center gap-2.5 text-sm font-semibold shadow-sm active:scale-[0.98]"
                >
                  Start Analysis <ArrowRight className="size-4" />
                </button>
                <a
                  href="#how-it-works"
                  className="rounded-xl border border-stone-300 bg-white px-8 py-4 text-stone-800 hover:bg-stone-50 transition-colors text-sm font-semibold shadow-2xs"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* Right Live Voyage Monitor Card */}
            <div className="lg:col-span-5 rounded-2xl border border-stone-200 bg-white p-7 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-[#D94E28]" />
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Live Voyage Telemetry</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Feed
                </span>
              </div>

              <div className="space-y-3.5 text-sm">
                {[
                  { label: 'Primary Corridor', value: 'Singapore → Yokohama', cls: 'text-stone-900 font-bold' },
                  { label: 'Tracked Vessel', value: 'FF Horizon (IMO 984210)', cls: 'text-[#D94E28] font-bold' },
                  { label: 'Baseline ETA', value: '18 Aug · 14:35 UTC', cls: 'text-stone-900 font-semibold' },
                  { label: 'Disruption Alert', value: '31.4% Risk — Typhoon Haikui', cls: 'text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs' },
                  { label: 'Optimal Reroute', value: 'Port of Kaohsiung (+4.1h delay)', cls: 'text-emerald-700 font-bold' },
                ].map(({ label, value, cls }) => (
                  <div key={label} className="flex justify-between items-center border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                    <span className="text-stone-500 font-medium text-xs">{label}</span>
                    <span className={`text-xs ${cls}`}>{value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCreateScenarioOpen(true)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors py-3 text-xs font-semibold text-stone-800 flex items-center justify-center gap-2 mt-2"
              >
                Run Reroute Simulation <ArrowRight className="size-3.5 text-[#D94E28]" />
              </button>
            </div>
          </div>
        </section>

        {/* ── 2. THE PROBLEM SECTION ── */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#D94E28] uppercase tracking-widest block">The Disruption Crisis</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              Why global maritime supply chains lose $45B annually
            </h2>
            <p className="text-sm text-stone-500 max-w-2xl">
              Traditional logistics relies on reactive email chains and static ETA spreadsheets. FlowForge replaces manual guesswork with automated decision science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Late Disruption Detection',
                desc: 'Typhoons, canal blockages, and port strikes are discovered only after vessels are already stuck — leaving zero time to pre-book alternative berths.',
                impact: 'Unplanned Anchor Delay Costs'
              },
              {
                step: '02',
                title: 'Single-Point Single ETA Failures',
                desc: 'Static arrival time estimates fail under dynamic weather. Without stochastic probability curves, logistics managers cannot predict arrival variance.',
                impact: 'Warehouse Missed SLA Penalties'
              },
              {
                step: '03',
                title: 'Blind Reroute Cost Tradeoffs',
                desc: 'Diverting to backup ports without financial modelling means operators guess at bunker fuel, demurrage, and terminal charges.',
                impact: 'Unquantified Demurrage Exposure'
              }
            ].map(({ step, title, desc, impact }) => (
              <div key={step} className="rounded-2xl border border-stone-200 bg-white p-7 space-y-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#D94E28] tracking-widest">PROBLEM {step}</span>
                    <span className="size-2 rounded-full bg-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 leading-snug">{title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{desc}</p>
                </div>
                <div className="pt-3 border-t border-stone-100 text-[11px] font-semibold text-stone-500 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-red-500 shrink-0" />
                  {impact}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. OPERATIONAL COMPARISON (TRADITIONAL VS FLOWFORGE) ── */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#D94E28] uppercase tracking-widest block">Operational Comparison</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              Traditional Logistics vs. FlowForge Intelligence
            </h2>
            <p className="text-sm text-stone-500 max-w-2xl">
              Compare how FlowForge transforms reactive troubleshooting into proactive, audit-ready operational decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional Column */}
            <div className="rounded-2xl border border-stone-200 bg-white p-7 space-y-6 shadow-2xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest">Without FlowForge</span>
                  <h3 className="text-xl font-extrabold text-stone-900 mt-1">Traditional Logistics</h3>
                </div>
                <span className="text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  High Risk & Cost
                </span>
              </div>

              <ul className="space-y-4 text-xs text-stone-700">
                {[
                  'Disruptions detected only after vessel enters congested berth zones',
                  'No backup port options pre-calculated before weather degrades',
                  '12 to 24 hour manual email coordination loop to approve diversions',
                  'Single fixed ETA estimate that ignores ocean weather stochastic variance',
                  'Demurrage losses and warehouse SLA penalties accumulate unmanaged'
                ].map(text => (
                  <li key={text} className="flex items-start gap-3">
                    <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FlowForge Column */}
            <div className="rounded-2xl border-2 border-[#D94E28] bg-white p-7 space-y-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#D94E28] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
                FlowForge Intelligence
              </div>

              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">With FlowForge</span>
                  <h3 className="text-xl font-extrabold text-stone-900 mt-1">FlowForge Platform</h3>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Optimized ROI
                </span>
              </div>

              <ul className="space-y-4 text-xs text-stone-800">
                {[
                  'ML ExtraTrees classifier predicts disruption risk 48 to 72 hours in advance',
                  'A* bathymetric router computes 100% open-water alternate port diversions',
                  'Instant decision output ranking optimal reroutes in under 2 seconds',
                  '10,000 Monte Carlo trials generate full P50, P90, P95 ETA probability curves',
                  'Average +$8,377 net cost savings quantified per diverted shipment'
                ].map(text => (
                  <li key={text} className="flex items-start gap-3 font-medium">
                    <CheckCircle2 className="size-4 text-[#D94E28] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── 4. HOW IT WORKS ── */}
        <section id="how-it-works" className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#D94E28] uppercase tracking-widest block">Architecture & Workflow</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              5 Steps from Data Stream to Operational Decision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Data Ingestion',
                body: 'Aggregates real-time AIS vessel tracking, OpenMeteo marine forecasts, port congestion & AIS telemetry.',
                tag: '8 Live Feeds'
              },
              {
                step: '02',
                title: 'Risk Scoring',
                body: 'ExtraTrees ML classifier evaluates corridor risk score, typhoon paths, and port strike probabilities.',
                tag: 'ML Classifier'
              },
              {
                step: '03',
                title: 'Route Generation',
                body: 'A* spatial router computes 100% open-water diversion routes across 60+ global commercial ports.',
                tag: 'A* Spatial Router'
              },
              {
                step: '04',
                title: 'Monte Carlo',
                body: 'Executes 10,000 stochastic trials to compute P50, P90, and P95 arrival time distribution curves.',
                tag: '10,000 Trials'
              },
              {
                step: '05',
                title: 'Decision',
                body: 'XGBoost cost engine ranks baseline vs. diversion options and quantifies net financial savings.',
                tag: 'Optimal Decision',
                highlight: true
              }
            ].map(({ step, title, body, tag, highlight }) => (
              <div
                key={step}
                className={`rounded-2xl border p-6 space-y-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all ${
                  highlight ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-900'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold tracking-widest uppercase ${highlight ? 'text-[#D94E28]' : 'text-stone-400'}`}>
                      STEP {step}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${highlight ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600'}`}>
                      {tag}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold">{title}</h4>
                  <p className={`text-xs leading-relaxed ${highlight ? 'text-stone-400' : 'text-stone-600'}`}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. PLATFORM CAPABILITIES ── */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#D94E28] uppercase tracking-widest block">Platform Capabilities</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              Engineered for decisions that cost millions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                cat: 'Disruption Prediction',
                title: '48–72h Early Warning',
                desc: 'ExtraTrees ML classifier flags typhoons, port strikes, and canal closures days before impact — giving fleet operators time to act.',
                meta: 'ExtraTrees v1.8 Model'
              },
              {
                cat: 'Route Intelligence',
                title: 'A* Bathymetric Routing',
                desc: 'Globally-aware spatial router computes 100% open-water diversion paths across 60+ ports, respecting TSS channels and draft limits.',
                meta: '60+ Global Commercial Ports'
              },
              {
                cat: 'Stochastic ETA Engine',
                title: 'Monte Carlo Simulation',
                desc: '10,000 stochastic trials generate P50, P90, and P95 arrival distributions — replacing static single-point ETA guesses.',
                meta: 'P50 / P90 / P95 Percentiles'
              },
              {
                cat: 'Financial Optimization',
                title: 'Real-Time Cost Ranking',
                desc: 'XGBoost engine calculates net savings of each diversion option — bunker fuel, demurrage, berth charges — vs. original route.',
                meta: 'Avg. +$8,377 Saved / Diversion'
              },
              {
                cat: 'Operational Control',
                title: 'Human-in-the-Loop',
                desc: 'Every recommendation passes through an audit-ready approval gate. Fleet managers stay in full command with an exportable audit log.',
                meta: 'Audit Trail & Decision Logs'
              },
              {
                cat: 'Decision Speed',
                title: 'Under 2 Seconds',
                desc: 'From disruption signal to ranked operational recommendation. No waiting, no manual email coordination, no guesswork.',
                meta: 'Full Pipeline < 2.0s',
                dark: true
              }
            ].map(({ cat, title, desc, meta, dark }) => (
              <div
                key={title}
                className={`rounded-2xl border p-7 space-y-4 hover:shadow-md transition-all flex flex-col justify-between ${
                  dark ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-900 shadow-2xs'
                }`}
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-[#D94E28] uppercase tracking-widest block">{cat}</span>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className={`text-xs leading-relaxed ${dark ? 'text-stone-400' : 'text-stone-600'}`}>{desc}</p>
                </div>
                <div className={`pt-3 border-t text-[11px] font-medium flex items-center gap-2 ${dark ? 'border-stone-800 text-stone-400' : 'border-stone-100 text-stone-500'}`}>
                  <span className="size-1.5 rounded-full bg-[#D94E28] shrink-0" />
                  {meta}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. CALL TO ACTION ── */}
        <section className="rounded-2xl bg-stone-900 border border-stone-800 p-12 md:p-16 text-center space-y-6 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-block rounded-full bg-stone-800 border border-stone-700 px-3.5 py-1 text-xs font-semibold text-[#D94E28]">
              Ready to Operationalize FlowForge?
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              From uncertainty to a clear maritime decision.
            </h2>
            <p className="text-sm md:text-base text-stone-400 leading-relaxed">
              Run predictive route simulations, evaluate alternative diversion ports, and generate audit-ready logistics decisions in seconds.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCreateScenarioOpen(true)}
              className="rounded-xl bg-[#D94E28] hover:bg-[#C8401C] transition-all px-10 py-4 text-sm font-semibold text-white shadow-sm mx-auto flex items-center gap-2 active:scale-[0.98]"
            >
              Start Your Reroute Analysis <ArrowRight className="size-4" />
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-xs text-stone-500 mt-12 font-sans">
        <div className="mx-auto max-w-[1440px] px-4 md:px-10 flex flex-wrap items-center justify-between gap-4 font-medium tracking-wide">
          <div>FLOWFORGE MARITIME DECISION INTELLIGENCE</div>
          <div>© {new Date().getFullYear()} FLOWFORGE. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>

      {/* Modal */}
      <CreateScenarioModal
        isOpen={createScenarioOpen}
        onClose={() => setCreateScenarioOpen(false)}
      />
    </div>
  )
}
