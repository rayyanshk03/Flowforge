'use client'

import React, { useState } from 'react'
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import CreateScenarioModal from '@/components/CreateScenarioModal'

// A clean section label — no colour, just text + thin rule
function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 justify-center">
      <span className="h-px w-8 bg-stone-300" />
      <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-[0.15em]">{text}</span>
      <span className="h-px w-8 bg-stone-300" />
    </div>
  )
}

export default function EnterpriseMaritimeLandingPage() {
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 antialiased selection:bg-[#D94E28] selection:text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-4 py-8 md:px-10 space-y-20">

        {/* ── 1. HERO ── */}
        <section className="pt-10 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2 border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#D94E28] rounded-full">
                <span className="size-2 rounded-full bg-[#D94E28] animate-pulse" />
                Real-Time Maritime Decision Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Make the next shipping decision <br className="hidden md:inline" />
                before disruption makes it for you.
              </h1>
              <p className="text-base md:text-lg text-stone-500 leading-relaxed max-w-xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                FlowForge combines live operational intelligence, predictive models, geospatial routing, and Monte Carlo simulation to turn uncertainty into a clear maritime decision.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  onClick={() => setCreateScenarioOpen(true)}
                  className="rounded-xl bg-[#D94E28] px-8 py-3.5 text-white hover:bg-[#C8401C] transition-all flex items-center gap-2 text-sm font-semibold shadow-sm active:scale-[0.98]"
                >
                  Start Analysis <ArrowRight className="size-4" />
                </button>
                <a
                  href="#how-it-works"
                  className="rounded-xl border border-stone-300 bg-white px-8 py-3.5 text-stone-800 hover:bg-stone-50 transition-colors text-sm font-semibold"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* Live Voyage Monitor Card */}
            <div className="lg:col-span-5 rounded-2xl border border-stone-200 bg-white p-7 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">Live Voyage Monitor</span>
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                </span>
              </div>
              <div className="space-y-4 text-sm">
                {[
                  { label: 'Corridor', value: 'Shanghai → Yokohama' },
                  { label: 'Vessel', value: 'FF Horizon (984210)', accent: true },
                  { label: 'ETA Target', value: '18 Aug · 14:35 UTC' },
                  { label: 'Disruption Risk', value: '22.9% — Cyclone Alert', warn: true },
                  { label: 'Recommended Diversion', value: 'Kobe Port (ALT-KOBE-01)', success: true },
                ].map(({ label, value, accent, warn, success }) => (
                  <div key={label} className="flex justify-between items-center border-b border-stone-100 pb-3.5 last:border-0 last:pb-0">
                    <span className="text-stone-400 font-medium">{label}</span>
                    <span className={`font-semibold text-right max-w-[200px] ${accent ? 'text-[#D94E28]' : warn ? 'text-amber-700' : success ? 'text-emerald-700' : 'text-stone-900'}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCreateScenarioOpen(true)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors py-3 text-xs font-semibold text-stone-700 flex items-center justify-center gap-2"
              >
                Run Reroute Simulation <ArrowRight className="size-3.5 text-[#D94E28]" />
              </button>
            </div>
          </div>
        </section>

        {/* ── 2. THE PROBLEM ── */}
        <section className="space-y-10">
          <div className="space-y-4 text-center">
            <SectionLabel text="The Problem" />
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
              $45B lost every year.<br className="hidden md:inline" /> Here&apos;s why.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: '01', title: 'Late Detection', body: 'Typhoons and blockages are discovered only after vessels are already stuck. Zero time to negotiate alternative berths.' },
              { num: '02', title: 'Uncertain ETAs', body: 'Single-point estimates fail under dynamic weather. No stochastic probability curves — supply chain managers cannot predict true arrival risk.' },
              { num: '03', title: 'Blind Rerouting', body: 'Diverting without real-time financial comparison means operators guess. FlowForge calculates fuel, demurrage, and berth fees instantly.' },
            ].map(({ num, title, body }) => (
              <div key={num} className="rounded-2xl border border-stone-200 bg-white p-8 space-y-4 hover:shadow-md transition-all">
                <span className="text-[11px] font-semibold text-stone-400 tracking-widest">{num}</span>
                <h3 className="text-lg font-bold text-stone-900">{title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. TRADITIONAL VS FLOWFORGE ── */}
        <section className="space-y-10">
          <div className="space-y-4 text-center">
            <SectionLabel text="Operational Comparison" />
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
              Before vs. After FlowForge
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional */}
            <div className="rounded-2xl border border-stone-200 bg-white p-8 space-y-6">
              <div className="border-b border-stone-100 pb-5">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">Without FlowForge</p>
                <h3 className="text-xl font-bold text-stone-900">Traditional Logistics</h3>
                <p className="text-sm text-stone-400 mt-1">Reactive &amp; Manual</p>
              </div>
              <ul className="space-y-4">
                {[
                  'Disruptions detected only after delays occur',
                  'No backup port pre-calculated for weather changes',
                  '12–24 hour manual diversion approval',
                  'Single fixed ETA — no variance modelling',
                  'Demurrage losses accumulate unnoticed',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-stone-600">
                    <XCircle className="size-4 text-stone-300 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* FlowForge */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900 p-8 space-y-6">
              <div className="border-b border-stone-700 pb-5">
                <p className="text-xs font-semibold text-[#D94E28] uppercase tracking-widest mb-1">With FlowForge</p>
                <h3 className="text-xl font-bold text-white">FlowForge Platform</h3>
                <p className="text-sm text-stone-400 mt-1">Proactive &amp; Automated</p>
              </div>
              <ul className="space-y-4">
                {[
                  'ML risk prediction 48–72h before impact',
                  'A* router calculates alternative ports instantly',
                  'Full decision output in under 2 seconds',
                  'P50 / P90 / P95 stochastic ETA distributions',
                  '+$8,377 average net savings per diversion',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-stone-300">
                    <CheckCircle2 className="size-4 text-[#D94E28] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── 4. HOW IT WORKS ── */}
        <section id="how-it-works" className="space-y-10">
          <div className="space-y-4 text-center">
            <SectionLabel text="Architecture & Workflow" />
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight">5 steps. One decision.</h2>
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-px bg-stone-200 rounded-2xl overflow-hidden border border-stone-200">
            {[
              { step: '01', title: 'Data Ingestion', body: 'Live AIS telemetry, OpenMeteo weather, port congestion & geopolitical alerts.', tag: '8 Live Feeds' },
              { step: '02', title: 'Risk Scoring', body: 'ExtraTrees ML classifier scores corridor risk probability — typhoon, strike, closure.', tag: 'ML Classifier' },
              { step: '03', title: 'Route Generation', body: 'A* spatial router computes feasible open-water diversion paths across 60+ global ports.', tag: 'A* Spatial Router' },
              { step: '04', title: 'Monte Carlo', body: 'Executes 10,000 stochastic trials to compute P50, P90, and P95 arrival percentiles.', tag: '10,000 Trials' },
              { step: '05', title: 'Decision', body: 'XGBoost cost engine ranks baseline vs. diversion options and quantifies net savings.', tag: 'Optimal Output', last: true },
            ].map(({ step, title, body, tag, last }) => (
              <div key={step} className={`flex-1 p-6 space-y-3 ${last ? 'bg-stone-900' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${last ? 'text-[#D94E28]' : 'text-stone-400'}`}>
                    {step}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${last ? 'bg-stone-800 text-stone-400' : 'bg-stone-100 text-stone-500'}`}>
                    {tag}
                  </span>
                </div>
                <h4 className={`text-sm font-bold ${last ? 'text-white' : 'text-stone-900'}`}>{title}</h4>
                <p className={`text-xs leading-relaxed ${last ? 'text-stone-400' : 'text-stone-500'}`}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. PLATFORM CAPABILITIES ── */}
        <section className="space-y-10">
          <div className="space-y-4 text-center">
            <SectionLabel text="Platform Capabilities" />
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
              Built for decisions<br className="hidden md:inline" /> that cost millions.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { cat: 'Disruption Prediction', title: '48–72h Early Warning', body: 'ML classifier detects typhoons, port strikes, and canal closures days before impact — giving fleet managers time to act proactively.', foot: 'ExtraTrees v1.8 Classifier' },
              { cat: 'Route Intelligence', title: 'A* Bathymetric Routing', body: 'Globally-aware maritime router computes 100% open-water diversion paths across 60+ ports, respecting TSS fairways and draft constraints.', foot: '60+ Global Commercial Ports' },
              { cat: 'Stochastic ETA', title: 'Monte Carlo Simulation', body: '10,000 stochastic trials generate full P50, P90, and P95 arrival time distributions — replacing single-point guesses with real probability curves.', foot: 'P50 / P90 / P95 Percentiles' },
              { cat: 'Financial Optimization', title: 'Real-Time Cost Ranking', body: 'XGBoost engine calculates net savings of each diversion option — fuel surcharges, demurrage, berth fees — against the original route in real time.', foot: 'Avg. +$8,377 Saved Per Diversion' },
              { cat: 'Operational Control', title: 'Human-in-the-Loop', body: 'Every recommendation passes through an audit-ready approval gate. Fleet managers stay in command — the system supports, not replaces, judgment.', foot: 'Audit Trail & Decision Log' },
              { cat: 'Decision Speed', title: 'Under 2 Seconds', body: 'From disruption signal to ranked operational recommendation. No waiting, no manual coordination, no guesswork — just a clear, actionable decision.', foot: 'Full Pipeline in <2s', dark: true },
            ].map(({ cat, title, body, foot, dark }) => (
              <div key={title} className={`rounded-2xl border p-8 space-y-4 hover:shadow-md transition-all ${dark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
                <p className="text-[11px] font-semibold text-[#D94E28] uppercase tracking-widest">{cat}</p>
                <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-stone-900'}`}>{title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? 'text-stone-400' : 'text-stone-500'}`}>{body}</p>
                <div className={`pt-3 border-t text-xs font-medium flex items-center gap-2 ${dark ? 'border-stone-700 text-stone-500' : 'border-stone-100 text-stone-500'}`}>
                  <span className="size-1.5 rounded-full bg-[#D94E28] shrink-0" /> {foot}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. CTA ── */}
        <section className="rounded-2xl bg-stone-900 border border-stone-800 p-12 md:p-20 text-center space-y-7">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            From uncertainty to<br className="hidden md:inline" /> a clear decision.
          </h2>
          <p className="text-base text-stone-400 max-w-sm mx-auto">Run simulations. Evaluate alternatives. Ship with confidence.</p>
          <button
            onClick={() => setCreateScenarioOpen(true)}
            className="rounded-xl bg-[#D94E28] hover:bg-[#C8401C] transition-all px-12 py-4 text-sm font-semibold text-white mx-auto flex items-center gap-2 active:scale-[0.98]"
          >
            Start Analysis <ArrowRight className="size-5" />
          </button>
        </section>

      </main>

      <footer className="border-t border-stone-200 bg-white py-5 text-xs text-stone-400 mt-10">
        <div className="mx-auto max-w-[1440px] px-4 md:px-10 flex flex-wrap items-center justify-between gap-4 font-medium tracking-wide uppercase">
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
