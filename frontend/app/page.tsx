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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Data Ingestion', tag: '8 Live Feeds', icon: '📡' },
              { step: '02', title: 'Risk Scoring', tag: 'ML Classifier', icon: '🧠' },
              { step: '03', title: 'Route Generation', tag: 'A* Router', icon: '🗺️' },
              { step: '04', title: 'Monte Carlo', tag: '10,000 Trials', icon: '🎲' },
              { step: '05', title: 'Decision', tag: 'XGBoost Engine', icon: '✅' },
            ].map(({ step, title, tag, icon }) => (
              <div key={step} className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm hover:shadow-md hover:border-[#D94E28]/30 transition-all text-center space-y-4 flex flex-col items-center">
                <div className="text-5xl">{icon}</div>
                <span className="text-[11px] font-bold text-[#D94E28]">STEP {step}</span>
                <h4 className="text-sm font-extrabold text-stone-900">{title}</h4>
                <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-3 py-0.5 rounded-full">{tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. LIVE INTELLIGENCE METRICS */}
        <section className="rounded-2xl border border-stone-200 bg-white p-7 md:p-10 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-stone-100 pb-5">
            <div>
              <span className="text-[11px] font-bold text-[#D94E28] uppercase tracking-wider block mb-1">Live Intelligence</span>
              <h3 className="text-2xl font-extrabold text-stone-900">Shanghai → Yokohama</h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Live Feed
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Disruption Risk', value: '22.9%', sub: 'Cyclone Alert', valueColor: 'text-[#D94E28]' },
              { label: 'Port Congestion', value: '45%', sub: 'Shanghai · 1.2d delay', valueColor: 'text-amber-700' },
              { label: 'Net Savings', value: '+$8,377', sub: 'Kobe diversion', valueColor: 'text-emerald-600' },
              { label: 'P90 ETA Risk', value: '298h', sub: '10,000 MC trials', valueColor: 'text-stone-800' },
            ].map(({ label, value, sub, valueColor }) => (
              <div key={label} className="rounded-xl border border-stone-200 bg-[#F9F8F6] p-6 space-y-1.5">
                <span className="text-[11px] font-semibold text-stone-500 block">{label}</span>
                <div className={`text-4xl font-extrabold ${valueColor}`}>{value}</div>
                <span className="text-xs font-medium text-stone-500">{sub}</span>
              </div>
            ))}
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
