'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import CreateScenarioModal from '@/components/CreateScenarioModal'

export default function EnterpriseMaritimeLandingPage() {
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 font-sans antialiased selection:bg-[#D94E28] selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-4 py-8 md:px-10 space-y-14">

        {/* 1. HERO */}
        <section className="pt-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1 text-xs font-semibold text-[#D94E28] shadow-2xs">
                <span className="size-2 rounded-full bg-[#D94E28] animate-pulse" />
                Real-Time Maritime Decision Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.12]">
                Make the next shipping decision <br className="hidden md:inline" />
                before disruption makes it for you.
              </h1>
              <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-2xl">
                FlowForge combines live operational intelligence, predictive models, geospatial routing, and Monte Carlo simulation to turn uncertainty into a clear maritime decision.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setCreateScenarioOpen(true)}
                  className="rounded-xl bg-[#D94E28] px-8 py-4 text-white hover:bg-[#C8401C] transition-all flex items-center gap-2 text-sm font-bold shadow-sm active:scale-[0.98]"
                >
                  Start Analysis <ArrowRight className="size-4" />
                </button>
                <a
                  href="#how-it-works"
                  className="rounded-xl border border-stone-300 bg-white px-8 py-4 text-stone-900 hover:bg-stone-50 transition-colors shadow-2xs text-sm font-bold"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* Live Voyage Card */}
            <div className="lg:col-span-5 rounded-2xl border border-stone-200 bg-white p-7 text-xs font-sans space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Live Voyage Monitor</span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Active
                </span>
              </div>
              <div className="space-y-3.5 text-stone-800">
                {[
                  { label: 'Corridor', value: 'Shanghai → Yokohama', cls: 'font-bold text-stone-900' },
                  { label: 'Vessel', value: 'FF Horizon (984210)', cls: 'text-[#D94E28] font-bold' },
                  { label: 'ETA Target', value: '18 Aug · 14:35 UTC', cls: 'font-bold text-stone-900' },
                  { label: 'Disruption Risk', value: '22.9% — Cyclone Alert', cls: 'font-bold text-amber-700' },
                  { label: 'Recommended Diversion', value: 'Kobe Port (ALT-KOBE-01)', cls: 'font-bold text-emerald-700' },
                ].map(({ label, value, cls }) => (
                  <div key={label} className="flex justify-between items-center border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                    <span className="text-stone-500">{label}:</span>
                    <strong className={cls}>{value}</strong>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCreateScenarioOpen(true)}
                className="w-full rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors py-3.5 text-xs font-bold text-stone-900 border border-stone-200 flex items-center justify-center gap-2"
              >
                Run Reroute Simulation <ArrowRight className="size-3.5 text-[#D94E28]" />
              </button>
            </div>
          </div>
        </section>

        {/* 2. THE PROBLEM */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-block rounded-full bg-red-50 border border-red-200 px-3 py-0.5 text-[11px] font-semibold text-red-800">The Problem</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight">
              $45B lost every year.<br className="hidden md:inline" /> Here&apos;s why.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: '⚠️', title: 'Late Detection', body: 'Typhoons and blockages are discovered only after vessels are already stuck.', tag: '→ Costly anchor waiting', tagColor: 'text-red-600' },
              { icon: '⏱️', title: 'Uncertain ETAs', body: 'Single-point estimates shatter under dynamic weather. No probability distribution.', tag: '→ SLA penalties', tagColor: 'text-amber-600' },
              { icon: '💸', title: 'Blind Rerouting', body: 'Diverting without financial modelling means operators guess. FlowForge calculates.', tag: '→ Unquantified demurrage', tagColor: 'text-stone-600' },
            ].map(({ icon, title, body, tag, tagColor }) => (
              <div key={title} className="rounded-2xl bg-white border border-stone-200 p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
                <div className="text-5xl">{icon}</div>
                <h3 className="text-xl font-extrabold text-stone-900">{title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{body}</p>
                <div className={`pt-3 border-t border-stone-100 text-xs font-bold ${tagColor}`}>{tag}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. BEFORE VS AFTER */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight">Before vs. After FlowForge</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional */}
            <div className="rounded-2xl border border-stone-200 bg-white p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="size-11 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 text-xl font-black">✕</span>
                <div>
                  <p className="font-extrabold text-stone-900 text-base">Traditional Logistics</p>
                  <p className="text-xs text-stone-400">Reactive &amp; Manual</p>
                </div>
                <span className="ml-auto text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">High Risk</span>
              </div>
              <ul className="space-y-3.5 text-sm text-stone-600">
                {['Disruptions detected after delays', 'No backup port pre-calculated', '12–24h manual approval loop', 'Single fixed ETA, no variance', 'Demurrage losses go unnoticed'].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full bg-stone-300 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* FlowForge */}
            <div className="rounded-2xl border-2 border-[#D94E28] bg-white p-8 space-y-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#D94E28] text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-bl-xl tracking-widest">FlowForge</div>
              <div className="flex items-center gap-3">
                <span className="size-11 rounded-xl bg-[#D94E28] flex items-center justify-center text-white text-xl font-black">✓</span>
                <div>
                  <p className="font-extrabold text-stone-900 text-base">FlowForge Platform</p>
                  <p className="text-xs text-[#D94E28] font-semibold">Proactive &amp; Automated</p>
                </div>
                <span className="ml-auto text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Optimized ROI</span>
              </div>
              <ul className="space-y-3.5 text-sm text-stone-800">
                {['ML prediction 48–72h in advance', 'A* router calculates alternatives instantly', 'Decision output in under 2 seconds', 'P50 / P90 / P95 ETA distributions', '+$8,377 net savings per diversion'].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="size-4 text-[#D94E28] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section id="how-it-works" className="space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-block rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-[11px] font-semibold text-blue-900">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight">5 steps. One decision.</h2>
          </div>

          {/* Step flow — horizontal numbered text blocks */}
          <div className="flex flex-col md:flex-row items-stretch gap-0">
            {[
              { step: '01', title: 'Data Ingestion', body: 'Live AIS vessel telemetry, weather forecasts, port congestion & geopolitical feeds.', tag: '8 Live Feeds' },
              { step: '02', title: 'Risk Scoring', body: 'ExtraTrees ML classifier scores corridor risk and evaluates typhoon or strike exposure.', tag: 'ML Classifier' },
              { step: '03', title: 'Route Generation', body: 'A* spatial router computes feasible alternate diversion paths and viable port options.', tag: 'A* Spatial Router' },
              { step: '04', title: 'Monte Carlo', body: 'Executes 10,000 stochastic trials to compute P50, P90, and P95 arrival time percentiles.', tag: '10,000 Trials' },
              { step: '05', title: 'Decision', body: 'XGBoost cost engine ranks baseline vs. diversion and quantifies net financial savings.', tag: 'Optimal Output', highlight: true },
            ].map(({ step, title, body, tag, highlight }, i, arr) => (
              <React.Fragment key={step}>
                <div className={`flex-1 rounded-2xl border ${ highlight ? 'border-[#D94E28] bg-stone-900' : 'border-stone-200 bg-white' } p-6 space-y-3 shadow-sm`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black tracking-widest uppercase ${ highlight ? 'text-[#D94E28]' : 'text-stone-400' }`}>STEP {step}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ highlight ? 'bg-[#D94E28]/20 text-[#D94E28]' : 'bg-stone-100 text-stone-500' }`}>{tag}</span>
                  </div>
                  <h4 className={`text-base font-extrabold ${ highlight ? 'text-white' : 'text-stone-900' }`}>{title}</h4>
                  <p className={`text-xs leading-relaxed ${ highlight ? 'text-stone-400' : 'text-stone-500' }`}>{body}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden md:flex items-center px-1 text-stone-300 text-lg font-light select-none">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* 5. KEY CAPABILITIES */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-block rounded-full bg-stone-100 border border-stone-200 px-3 py-0.5 text-[11px] font-semibold text-stone-700">Platform Capabilities</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 tracking-tight">Built for the decisions<br className="hidden md:inline" /> that cost millions.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-stone-200 bg-white p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="text-xs font-black text-[#D94E28] uppercase tracking-widest">Disruption Prediction</div>
              <h3 className="text-2xl font-extrabold text-stone-900">48–72h Early Warning</h3>
              <p className="text-sm text-stone-500 leading-relaxed">ML classifier (ExtraTrees) detects typhoons, port strikes, and canal closures days before impact — giving fleet managers time to act.</p>
              <div className="pt-3 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-stone-600">
                <span className="size-1.5 rounded-full bg-[#D94E28]" /> ExtraTrees v1.8 Classifier
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="text-xs font-black text-[#D94E28] uppercase tracking-widest">Route Intelligence</div>
              <h3 className="text-2xl font-extrabold text-stone-900">A* Bathymetric Routing</h3>
              <p className="text-sm text-stone-500 leading-relaxed">Globally-aware maritime router computes 100% open-water diversion paths across 60+ ports, respecting TSS fairways and draft constraints.</p>
              <div className="pt-3 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-stone-600">
                <span className="size-1.5 rounded-full bg-[#D94E28]" /> 60+ Global Commercial Ports
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="text-xs font-black text-[#D94E28] uppercase tracking-widest">Stochastic ETA</div>
              <h3 className="text-2xl font-extrabold text-stone-900">Monte Carlo Simulation</h3>
              <p className="text-sm text-stone-500 leading-relaxed">10,000 stochastic trials generate P50, P90, and P95 arrival time distributions — replacing single-point guesses with full probability curves.</p>
              <div className="pt-3 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-stone-600">
                <span className="size-1.5 rounded-full bg-[#D94E28]" /> P50 / P90 / P95 Percentiles
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="text-xs font-black text-[#D94E28] uppercase tracking-widest">Financial Optimization</div>
              <h3 className="text-2xl font-extrabold text-stone-900">Real-Time Cost Ranking</h3>
              <p className="text-sm text-stone-500 leading-relaxed">XGBoost engine instantly calculates net savings of each diversion option — fuel surcharges, demurrage, berth fees — vs. the original route.</p>
              <div className="pt-3 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-stone-600">
                <span className="size-1.5 rounded-full bg-[#D94E28]" /> Avg. +$8,377 Saved Per Diversion
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="text-xs font-black text-[#D94E28] uppercase tracking-widest">Operational Control</div>
              <h3 className="text-2xl font-extrabold text-stone-900">Human-in-the-Loop</h3>
              <p className="text-sm text-stone-500 leading-relaxed">Every FlowForge recommendation goes through an audit-ready approval gate. Fleet managers stay in command — the system supports, not replaces, judgment.</p>
              <div className="pt-3 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-stone-600">
                <span className="size-1.5 rounded-full bg-[#D94E28]" /> Audit Trail & Decision Log
              </div>
            </div>

            <div className="rounded-2xl bg-stone-900 p-8 space-y-4 shadow-sm">
              <div className="text-xs font-black text-[#D94E28] uppercase tracking-widest">Decision Speed</div>
              <h3 className="text-2xl font-extrabold text-white">Under 2 Seconds</h3>
              <p className="text-sm text-stone-400 leading-relaxed">From disruption signal to ranked operational recommendation. No waiting, no manual coordination, no guesswork.</p>
              <div className="pt-3 border-t border-stone-700 flex items-center gap-2 text-xs font-semibold text-stone-500">
                <span className="size-1.5 rounded-full bg-[#D94E28]" /> Full Pipeline in &lt;2s
              </div>
            </div>
          </div>
        </section>

        {/* 6. CTA */}
        <section className="rounded-2xl bg-stone-900 p-12 md:p-20 text-center space-y-7 shadow-xl">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            From uncertainty to<br className="hidden md:inline" /> a clear decision.
          </h2>
          <p className="text-base text-stone-400 max-w-md mx-auto">Run simulations. Evaluate alternatives. Ship with confidence.</p>
          <button
            onClick={() => setCreateScenarioOpen(true)}
            className="rounded-xl bg-[#D94E28] hover:bg-[#C8401C] transition-all px-12 py-5 text-sm font-bold text-white shadow-sm mx-auto flex items-center gap-2 active:scale-[0.98]"
          >
            Start Analysis <ArrowRight className="size-5" />
          </button>
        </section>

      </main>

      <footer className="border-t border-stone-200 bg-white py-5 text-xs text-stone-500 mt-10 font-sans">
        <div className="mx-auto max-w-[1440px] px-4 md:px-10 flex flex-wrap items-center justify-between gap-4 font-medium">
          <div>FLOWFORGE MARITIME DECISION INTELLIGENCE</div>
          <div>© {new Date().getFullYear()} FLOWFORGE. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>

      <CreateScenarioModal
        isOpen={createScenarioOpen}
        onClose={() => setCreateScenarioOpen(false)}
      />
    </div>
  )
}
