'use client'

import React, { useState } from 'react'
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import CreateScenarioModal from '@/components/CreateScenarioModal'

export default function EnterpriseMaritimeLandingPage() {
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 antialiased selection:bg-[#D94E28] selection:text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-4 py-8 md:px-10 space-y-10">

        {/* ── HERO ── */}
        <section className="pt-6 pb-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#D94E28] rounded-full">
                <span className="size-2 rounded-full bg-[#D94E28] animate-pulse" />
                Real-Time Maritime Decision Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
                Make the next shipping decision<br className="hidden md:inline" /> before disruption makes it for you.
              </h1>
              <p className="text-base text-stone-500 leading-relaxed max-w-xl">
                FlowForge combines live operational intelligence, predictive models, geospatial routing, and Monte Carlo simulation to turn uncertainty into a clear maritime decision.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => setCreateScenarioOpen(true)}
                  className="rounded-xl bg-[#D94E28] px-7 py-3.5 text-white hover:bg-[#C8401C] transition-all flex items-center gap-2 text-sm font-semibold active:scale-[0.98]"
                >
                  Start Analysis <ArrowRight className="size-4" />
                </button>
                <a
                  href="#how-it-works"
                  className="rounded-xl border border-stone-300 bg-white px-7 py-3.5 text-stone-800 hover:bg-stone-50 transition-colors text-sm font-semibold"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* Live Voyage Monitor */}
            <div className="lg:col-span-5 rounded-2xl border border-stone-200 bg-white p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">Live Voyage Monitor</span>
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                </span>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Corridor',              value: 'Shanghai → Yokohama',         cls: 'text-stone-900 font-semibold' },
                  { label: 'Vessel',                value: 'FF Horizon (984210)',          cls: 'text-[#D94E28] font-semibold' },
                  { label: 'ETA Target',            value: '18 Aug · 14:35 UTC',           cls: 'text-stone-900 font-semibold' },
                  { label: 'Disruption Risk',       value: '22.9% — Cyclone Alert',        cls: 'text-amber-700 font-semibold' },
                  { label: 'Recommended Diversion', value: 'Kobe Port (ALT-KOBE-01)',      cls: 'text-emerald-700 font-semibold' },
                ].map(({ label, value, cls }) => (
                  <div key={label} className="flex justify-between items-center border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                    <span className="text-stone-400">{label}</span>
                    <span className={cls}>{value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCreateScenarioOpen(true)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors py-2.5 text-xs font-semibold text-stone-700 flex items-center justify-center gap-2"
              >
                Run Reroute Simulation <ArrowRight className="size-3.5 text-[#D94E28]" />
              </button>
            </div>
          </div>
        </section>

        {/* ── THE PROBLEM + COMPARISON — combined dense section ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left: Problem cards stacked */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">The Problem</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">Why maritime supply chains lose $45B a year</h2>
            </div>
            {[
              { n: '01', title: 'Late Disruption Detection', body: 'Typhoons, canal blockages, and port strikes are discovered only after vessels are already stuck — leaving zero time to negotiate alternatives.' },
              { n: '02', title: 'Single-Point ETA Estimates', body: 'Fixed arrival time predictions fail under dynamic weather. Without stochastic curves, managers cannot quantify true arrival risk.' },
              { n: '03', title: 'Blind Diversion Cost Tradeoffs', body: 'Rerouting without a real-time financial model means operators guess at fuel, demurrage, and berth costs rather than calculating them.' },
            ].map(({ n, title, body }) => (
              <div key={n} className="rounded-xl border border-stone-200 bg-white p-5 flex gap-4">
                <span className="text-[11px] font-bold text-stone-300 pt-0.5 shrink-0">{n}</span>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-stone-900">{title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Before vs After */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Operational Comparison</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">Traditional logistics vs. FlowForge</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
              {/* Traditional */}
              <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">Without FlowForge</p>
                  <h3 className="text-base font-bold text-stone-900 mt-1">Traditional Logistics</h3>
                </div>
                <ul className="space-y-2.5">
                  {[
                    'Disruptions detected after delays',
                    'No backup port pre-calculated',
                    '12–24h manual approval loop',
                    'Single fixed ETA, no variance',
                    'Demurrage losses go unnoticed',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-stone-500">
                      <XCircle className="size-3.5 text-stone-300 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* FlowForge */}
              <div className="rounded-xl border border-stone-800 bg-stone-900 p-5 space-y-4">
                <div className="border-b border-stone-700 pb-3">
                  <p className="text-[11px] font-semibold text-[#D94E28] uppercase tracking-widest">With FlowForge</p>
                  <h3 className="text-base font-bold text-white mt-1">FlowForge Platform</h3>
                </div>
                <ul className="space-y-2.5">
                  {[
                    'ML prediction 48–72h in advance',
                    'A* router calculates alternatives instantly',
                    'Decision output in under 2 seconds',
                    'P50 / P90 / P95 ETA distributions',
                    '+$8,377 average net savings per diversion',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-stone-300">
                      <CheckCircle2 className="size-3.5 text-[#D94E28] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Architecture & Workflow</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">5 steps. One decision.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { step: '01', title: 'Data Ingestion',    body: 'Live AIS telemetry, weather forecasts, port congestion & geopolitical alerts.',           tag: '8 Live Feeds',    dark: false },
              { step: '02', title: 'Risk Scoring',      body: 'ExtraTrees ML classifier scores corridor risk probability — typhoon, strike, closure.',    tag: 'ML Classifier',   dark: false },
              { step: '03', title: 'Route Generation',  body: 'A* spatial router computes open-water diversion paths across 60+ global ports.',           tag: 'A* Spatial Router', dark: false },
              { step: '04', title: 'Monte Carlo',       body: '10,000 stochastic trials compute P50, P90, and P95 arrival time percentiles.',             tag: '10,000 Trials',   dark: false },
              { step: '05', title: 'Decision',          body: 'XGBoost cost engine ranks baseline vs. diversion options and quantifies net savings.',     tag: 'Optimal Output',  dark: true  },
            ].map(({ step, title, body, tag, dark }) => (
              <div key={step} className={`rounded-xl border p-5 space-y-3 ${dark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold tracking-widest ${dark ? 'text-[#D94E28]' : 'text-stone-400'}`}>{step}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${dark ? 'bg-stone-800 text-stone-400' : 'bg-stone-100 text-stone-500'}`}>{tag}</span>
                </div>
                <h4 className={`text-sm font-bold ${dark ? 'text-white' : 'text-stone-900'}`}>{title}</h4>
                <p className={`text-xs leading-relaxed ${dark ? 'text-stone-400' : 'text-stone-500'}`}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PLATFORM CAPABILITIES ── */}
        <section className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Platform Capabilities</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">Built for decisions that cost millions.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { cat: 'Disruption Prediction', title: '48–72h Early Warning',      body: 'ML classifier detects typhoons, port strikes, and canal closures days before impact — giving fleet managers time to act.', foot: 'ExtraTrees v1.8 Classifier', dark: false },
              { cat: 'Route Intelligence',    title: 'A* Bathymetric Routing',    body: 'Globally-aware router computes 100% open-water diversion paths across 60+ commercial ports, respecting TSS fairways.',    foot: '60+ Global Ports',          dark: false },
              { cat: 'Stochastic ETA',        title: 'Monte Carlo Simulation',    body: '10,000 trials generate full P50, P90, P95 arrival distributions — replacing single-point guesses with real probability.',   foot: 'P50 / P90 / P95',           dark: false },
              { cat: 'Financial Modeling',    title: 'Real-Time Cost Ranking',    body: 'XGBoost engine calculates net savings of each diversion — fuel surcharges, demurrage, berth fees — against the baseline.',  foot: 'Avg. +$8,377 Per Diversion', dark: false },
              { cat: 'Operational Control',   title: 'Human-in-the-Loop',         body: 'Every recommendation passes through an audit-ready approval gate. Fleet managers stay in command at all times.',             foot: 'Audit Trail & Decision Log', dark: false },
              { cat: 'Decision Speed',        title: 'Under 2 Seconds',           body: 'From disruption signal to ranked operational recommendation — no waiting, no coordination, no guesswork. Just clarity.',      foot: 'Full Pipeline in <2s',       dark: true  },
            ].map(({ cat, title, body, foot, dark }) => (
              <div key={title} className={`rounded-xl border p-6 space-y-3 hover:shadow-sm transition-all ${dark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
                <p className="text-[10px] font-bold text-[#D94E28] uppercase tracking-widest">{cat}</p>
                <h3 className={`text-base font-bold ${dark ? 'text-white' : 'text-stone-900'}`}>{title}</h3>
                <p className={`text-xs leading-relaxed ${dark ? 'text-stone-400' : 'text-stone-500'}`}>{body}</p>
                <div className={`pt-2 border-t text-[11px] font-medium flex items-center gap-1.5 ${dark ? 'border-stone-700 text-stone-500' : 'border-stone-100 text-stone-400'}`}>
                  <span className="size-1.5 rounded-full bg-[#D94E28] shrink-0" /> {foot}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="rounded-2xl bg-stone-900 border border-stone-800 px-10 py-14 text-center space-y-5">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            From uncertainty to a clear decision.
          </h2>
          <p className="text-sm text-stone-400 max-w-sm mx-auto">Run simulations. Evaluate alternatives. Ship with confidence.</p>
          <button
            onClick={() => setCreateScenarioOpen(true)}
            className="rounded-xl bg-[#D94E28] hover:bg-[#C8401C] transition-all px-10 py-3.5 text-sm font-semibold text-white mx-auto flex items-center gap-2 active:scale-[0.98]"
          >
            Start Analysis <ArrowRight className="size-4" />
          </button>
        </section>

      </main>

      <footer className="border-t border-stone-200 bg-white py-5 text-xs text-stone-400 mt-6">
        <div className="mx-auto max-w-[1440px] px-4 md:px-10 flex flex-wrap items-center justify-between gap-4 font-medium tracking-wide">
          <div>FlowForge Maritime Decision Intelligence</div>
          <div>© {new Date().getFullYear()} FlowForge. All Rights Reserved.</div>
        </div>
      </footer>

      <CreateScenarioModal
        isOpen={createScenarioOpen}
        onClose={() => setCreateScenarioOpen(false)}
      />
    </div>
  )
}
