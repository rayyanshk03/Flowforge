'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, XCircle, Zap } from 'lucide-react'
import Navbar from '@/components/Navbar'
import CreateScenarioModal from '@/components/CreateScenarioModal'

export default function HomePage() {
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-[1300px] px-4 md:px-10">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="pt-16 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Headline */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1 text-xs font-semibold text-[#D94E28]">
              <span className="size-2 rounded-full bg-[#D94E28] animate-pulse" />
              Live Maritime Intelligence Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-stone-900 tracking-tight leading-[1.05]">
              Ship smarter.<br />
              <span className="text-[#D94E28]">Not harder.</span>
            </h1>

            <p className="text-base text-stone-500 leading-relaxed max-w-md">
              FlowForge predicts disruptions before they hit, finds the best reroute, and quantifies the financial decision — in seconds.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setCreateScenarioOpen(true)}
                className="rounded-xl bg-[#D94E28] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#C8401C] transition-all flex items-center gap-2 shadow-sm active:scale-[0.98]"
              >
                Start Analysis <ArrowRight className="size-4" />
              </button>
              <Link
                href="/disruptions"
                className="rounded-xl border border-stone-300 bg-white px-7 py-3.5 text-sm font-bold text-stone-800 hover:bg-stone-50 transition-colors"
              >
                See How It Works
              </Link>
            </div>

            {/* Micro Stats */}
            <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-stone-500">
              <span><strong className="text-stone-900 text-sm">10,000</strong> simulations/run</span>
              <span><strong className="text-stone-900 text-sm">48h</strong> advance warning</span>
              <span><strong className="text-stone-900 text-sm">$8.3K</strong> avg. savings/reroute</span>
            </div>
          </div>

          {/* Right: Live Telemetry Card */}
          <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-6 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Live Voyage Monitor</span>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'Corridor', value: 'Shanghai → Yokohama', bold: true },
                { label: 'Vessel', value: 'FF Horizon (984210)', color: 'text-[#D94E28]' },
                { label: 'ETA Target', value: '18 Aug · 14:35 UTC' },
                { label: 'Disruption Risk', value: '22.9%', badge: 'amber' },
                { label: 'Diversion', value: 'Kobe Port (ALT-KOBE-01)', color: 'text-emerald-700' },
              ].map(({ label, value, bold, color, badge }) => (
                <div key={label} className="flex justify-between items-center border-b border-stone-50 pb-2 last:border-0">
                  <span className="text-stone-400">{label}:</span>
                  {badge === 'amber' ? (
                    <span className="text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">{value} — Cyclone</span>
                  ) : (
                    <strong className={`font-bold ${color || 'text-stone-900'}`}>{value}</strong>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setCreateScenarioOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 py-2.5 text-xs font-bold text-stone-800 transition-colors"
            >
              Run Reroute Simulation <ArrowRight className="size-3.5 text-[#D94E28]" />
            </button>
          </div>
        </section>

        {/* ── DIVIDER STAT BAR ─────────────────────────────────── */}
        <div className="border-y border-stone-200 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs font-sans">
          {[
            { stat: '$45B+', label: 'Annual maritime losses' },
            { stat: '22.9%', label: 'Cyclone disruption risk scored' },
            { stat: '< 2s', label: 'Decision recommendation' },
            { stat: '60+', label: 'Global ports covered' },
          ].map(({ stat, label }) => (
            <div key={stat} className="space-y-0.5">
              <div className="text-2xl font-extrabold text-stone-900">{stat}</div>
              <div className="text-stone-400 font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* ── PROBLEM SECTION ──────────────────────────────────── */}
        <section className="py-14 space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold text-[#D94E28] uppercase tracking-wider">The Problem</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Shipping runs blind.</h2>
            <p className="text-sm text-stone-500 max-w-md mx-auto">Most teams learn about disruptions only after the vessel is already stuck.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: '⏰',
                title: 'Too Late',
                body: 'Typhoons and port congestion are discovered after vessels are already anchored — not before.',
                tag: 'Costly Anchor Delays',
                color: 'border-red-200 hover:border-red-300',
                tagColor: 'text-red-700',
              },
              {
                icon: '📦',
                title: 'Uncertain ETAs',
                body: 'Single-point arrival estimates break under dynamic weather. No probability ranges.',
                tag: 'SLA Penalties',
                color: 'border-amber-200 hover:border-amber-300',
                tagColor: 'text-amber-700',
              },
              {
                icon: '💸',
                title: 'Blind Rerouting',
                body: "Diversion decisions lack real-time financial modeling. No one knows if a detour saves money.",
                tag: 'Unquantified Losses',
                color: 'border-stone-200 hover:border-stone-300',
                tagColor: 'text-stone-600',
              },
            ].map(({ icon, title, body, tag, color, tagColor }) => (
              <div key={title} className={`rounded-2xl border ${color} bg-white p-5 space-y-3 shadow-2xs transition-all flex flex-col justify-between`}>
                <div className="space-y-2">
                  <div className="text-2xl">{icon}</div>
                  <h3 className="text-base font-bold text-stone-900">{title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{body}</p>
                </div>
                <div className={`text-[11px] font-semibold ${tagColor} pt-3 border-t border-stone-100`}>→ {tag}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── VS TABLE ─────────────────────────────────────────── */}
        <section className="py-2 pb-14 space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Before vs. After</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Traditional vs. FlowForge</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Traditional */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Traditional Logistics</h3>
                  <p className="text-[11px] text-stone-400 font-medium">Reactive tracking</p>
                </div>
                <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">High Risk</span>
              </div>
              <ul className="space-y-2.5 text-xs text-stone-600">
                {['Learns of disruptions after vessel delays', 'Single fixed route, no backup', 'Deterministic ETA only', 'Manual 12–24h approval chain', 'Unquantified demurrage costs'].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <XCircle className="size-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FlowForge */}
            <div className="rounded-2xl border-2 border-[#D94E28] bg-white p-6 space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#D94E28] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-wider">
                RECOMMENDED
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">FlowForge Platform</h3>
                  <p className="text-[11px] text-[#D94E28] font-semibold">Proactive intelligence</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Optimized ROI</span>
              </div>
              <ul className="space-y-2.5 text-xs text-stone-700">
                {['ML risk prediction 48–72h in advance', 'A* alternative port routing', '10,000 Monte Carlo simulations', 'Instant decision recommendation < 2s', 'Quantified savings per reroute'].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 text-[#D94E28] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────── */}
        <section id="how-it-works" className="py-2 pb-14 space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Architecture</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">How FlowForge Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {[
              { step: '01', title: 'Data Ingestion', desc: 'AIS vessel telemetry, weather forecasts, port alerts', meta: '8 Live Feeds' },
              { step: '02', title: 'Risk Scoring', desc: 'ExtraTrees ML classifier scores corridor disruption probability', meta: 'ML Classifier' },
              { step: '03', title: 'Route Generation', desc: 'A* maritime router computes open-water diversion paths', meta: 'Spatial Router' },
              { step: '04', title: 'Monte Carlo', desc: 'Runs 10,000 trials for P50/P90/P95 ETA distributions', meta: '10,000 Trials' },
              { step: '05', title: 'Decision', desc: 'XGBoost ranks routes by net cost savings for approval', meta: 'Optimal Output', highlight: true },
            ].map(({ step, title, desc, meta, highlight }) => (
              <div key={step} className={`rounded-2xl border ${highlight ? 'border-[#D94E28]' : 'border-stone-200'} bg-white p-5 space-y-2.5 shadow-2xs flex flex-col justify-between`}>
                <div className="space-y-2">
                  <span className={`text-[11px] font-bold block ${highlight ? 'text-[#D94E28]' : 'text-[#D94E28]'}`}>STEP {step}</span>
                  <h4 className="text-sm font-bold text-stone-900">{title}</h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed">{desc}</p>
                </div>
                <div className={`text-[11px] font-semibold pt-2 border-t border-stone-100 ${highlight ? 'text-[#D94E28] font-bold' : 'text-stone-400'}`}>
                  {meta}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ───────────────────────────────────────── */}
        <section className="mb-10 rounded-2xl border border-stone-200 bg-white p-10 md:p-14 text-center space-y-5 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Get Started</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-stone-900">
            From uncertainty<br />to a decision.
          </h2>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Run route simulations, evaluate diversion ports, and generate audit-ready maritime decisions.
          </p>
          <button
            onClick={() => setCreateScenarioOpen(true)}
            className="rounded-xl bg-[#D94E28] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#C8401C] transition-all flex items-center gap-2 mx-auto shadow-sm active:scale-[0.98]"
          >
            Start Reroute Analysis <ArrowRight className="size-4" />
          </button>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-5 text-xs text-stone-400 font-sans">
        <div className="mx-auto max-w-[1300px] px-4 md:px-10 flex flex-wrap items-center justify-between gap-4 font-medium">
          <span>FLOWFORGE MARITIME DECISION INTELLIGENCE</span>
          <span>© {new Date().getFullYear()} FlowForge. All rights reserved.</span>
        </div>
      </footer>

      <CreateScenarioModal isOpen={createScenarioOpen} onClose={() => setCreateScenarioOpen(false)} />
    </div>
  )
}
