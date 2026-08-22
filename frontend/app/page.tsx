'use client'

import React, { useState } from 'react'
import { ArrowRight, CheckCircle2, XCircle, Activity, Globe2, Layers, ShieldCheck, Zap, BarChart3, Clock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import CreateScenarioModal from '@/components/CreateScenarioModal'

export default function EnterpriseMaritimeLandingPage() {
  const [createScenarioOpen, setCreateScenarioOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F6F6F3] text-[#151719] font-sans antialiased selection:bg-[#D94E28] selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-5 py-10 md:px-12 space-y-20">

        {/* ── 1. HERO SECTION ── */}
        <section className="pt-4 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Headline & Action */}
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2.5 rounded-md border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-mono font-bold text-[#D94E28] shadow-xs">
                <span className="size-2 rounded-full bg-[#D94E28] animate-pulse" />
                SYSTEM STATUS · LIVE MARITIME TELEMETRY
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#151719] tracking-tight leading-[1.15]">
                Make the next shipping decision <br className="hidden sm:inline" />
                <span className="font-cursive text-3xl sm:text-4xl lg:text-5xl font-normal text-[#D94E28] tracking-normal inline-block mt-1">
                  before disruption makes it for you.
                </span>
              </h1>

              <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-2xl font-normal">
                FlowForge combines live AIS telemetry, predictive ML models, bathymetric A* routing, and 10,000 Monte Carlo simulations to turn maritime uncertainty into audit-ready decisions.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setCreateScenarioOpen(true)}
                  className="rounded-xl bg-[#D94E28] px-8 py-4 text-white hover:bg-[#C8401C] transition-all flex items-center gap-2.5 text-sm font-bold shadow-xs active:scale-[0.98]"
                >
                  Start Reroute Analysis <ArrowRight className="size-4" />
                </button>
                <a
                  href="#how-it-works"
                  className="rounded-xl border border-stone-300 bg-white px-8 py-4 text-stone-800 hover:bg-stone-50 transition-colors text-sm font-bold shadow-xs"
                >
                  Explore How It Works
                </a>
              </div>
            </div>

            {/* Right Telemetry Card */}
            <div className="lg:col-span-5 rounded-2xl border border-stone-300 bg-white p-7 md:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-[#D94E28]" />
                  <span className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                    LIVE VOYAGE TELEMETRY
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded">
                  ● ACTIVE
                </span>
              </div>

              <div className="space-y-4 text-xs font-sans">
                {[
                  { label: 'Corridor', value: 'Singapore → Yokohama', valCls: 'font-bold text-[#151719]' },
                  { label: 'Tracked Vessel', value: 'FF Horizon (IMO 984210)', valCls: 'font-bold text-[#D94E28]' },
                  { label: 'Target ETA', value: '18 Aug · 14:35 UTC', valCls: 'font-bold text-[#151719]' },
                  { label: 'Disruption Risk', value: '31.4% (Typhoon Haikui)', valCls: 'font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded font-mono' },
                  { label: 'Optimal Reroute', value: 'Port of Kaohsiung (+4.1h)', valCls: 'font-bold text-emerald-800' },
                ].map(({ label, value, valCls }) => (
                  <div key={label} className="flex justify-between items-center border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                    <span className="text-stone-500 font-medium">{label}:</span>
                    <span className={valCls}>{value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCreateScenarioOpen(true)}
                className="w-full rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 transition-colors py-3.5 text-xs font-bold text-stone-800 flex items-center justify-center gap-2 border-dashed"
              >
                Run 10,000 Monte Carlo Simulations <ArrowRight className="size-3.5 text-[#D94E28]" />
              </button>
            </div>
          </div>
        </section>


        {/* ── 2. THE DISRUPTION PROBLEM ── */}
        <section className="space-y-8">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#D94E28] uppercase tracking-widest block">
              SECTION 01 · THE DISRUPTION CRISIS
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#151719] tracking-tight">
              Why maritime supply chains lose $45B every year
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
              Traditional logistics relies on reactive email chains and static single-point ETA estimates. FlowForge replaces blind guesswork with automated risk intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Late Disruption Detection',
                desc: 'Typhoons, canal blockages, and port strikes are discovered only after vessels hit bottleneck zones — leaving zero time to negotiate backup berths.',
                badge: 'Unplanned Anchor Waiting Fees'
              },
              {
                num: '02',
                title: 'Uncertain Single-Point ETAs',
                desc: 'Static arrival predictions shatter under dynamic ocean weather. Without stochastic probability curves, fleet managers cannot quantify arrival risk.',
                badge: 'Missed Warehouse SLA Penalties'
              },
              {
                num: '03',
                title: 'Blind Diversion Cost Tradeoffs',
                desc: 'Rerouting without a real-time financial model means operators guess at bunker fuel, demurrage, and port charges rather than calculating net ROI.',
                badge: 'Unquantified Demurrage Exposure'
              }
            ].map(({ num, title, desc, badge }) => (
              <div key={num} className="rounded-2xl border border-stone-300 bg-white p-8 space-y-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-xs font-mono font-bold text-[#D94E28]">PROBLEM {num}</span>
                    <span className="size-2 rounded-full bg-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-[#151719] leading-snug">{title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{desc}</p>
                </div>
                <div className="pt-4 border-t border-stone-100 text-[11px] font-mono font-bold text-stone-500 flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-red-500 shrink-0" />
                  {badge}
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ── 3. OPERATIONAL COMPARISON ── */}
        <section className="space-y-8">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#D94E28] uppercase tracking-widest block">
              SECTION 02 · OPERATIONAL COMPARISON
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#151719] tracking-tight">
              Traditional Logistics vs. FlowForge Intelligence
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
              Compare how FlowForge transforms reactive troubleshooting into proactive, data-driven decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Card */}
            <div className="rounded-2xl border border-stone-300 bg-white p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">
                    WITHOUT FLOWFORGE
                  </span>
                  <h3 className="text-xl font-extrabold text-[#151719] mt-1">Traditional Logistics</h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded">
                  HIGH RISK & COST
                </span>
              </div>

              <ul className="space-y-4 text-xs text-stone-700">
                {[
                  'Disruptions detected only after vessel enters congested harbor berth zones',
                  'No backup port options pre-calculated before ocean weather degrades',
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

            {/* FlowForge Card */}
            <div className="rounded-2xl border-2 border-[#D94E28] bg-white p-8 space-y-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#D94E28] text-white text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
                RECOMMENDED PLATFORM
              </div>

              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest">
                    WITH FLOWFORGE
                  </span>
                  <h3 className="text-xl font-extrabold text-[#151719] mt-1">FlowForge Platform</h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded">
                  OPTIMIZED ROI
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


        {/* ── 4. HOW IT WORKS (CLEAN STEP TIMELINE) ── */}
        <section id="how-it-works" className="space-y-8">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#D94E28] uppercase tracking-widest block">
              SECTION 03 · ARCHITECTURE & WORKFLOW
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#151719] tracking-tight">
              5 Steps from Data Stream to Operational Decision
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
              An autonomous 5-stage pipeline processing global telemetry into actionable reroute decisions.
            </p>
          </div>

          {/* Clean Step Grid with ample room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              {
                step: '01',
                title: 'Data Ingestion',
                body: 'Aggregates real-time AIS vessel telemetry, OpenMeteo weather forecasts, and port congestion feeds.',
                tag: '8 Live Feeds'
              },
              {
                step: '02',
                title: 'Risk Scoring',
                body: 'ExtraTrees ML classifier evaluates corridor risk score, typhoon paths, and strike probabilities.',
                tag: 'ML Classifier'
              },
              {
                step: '03',
                title: 'Route Generation',
                body: 'A* spatial router computes 100% open-water diversion routes across 60+ commercial ports.',
                tag: 'A* Spatial Router'
              },
              {
                step: '04',
                title: 'Monte Carlo',
                body: 'Executes 10,000 stochastic trials to compute P50, P90, and P95 arrival distribution curves.',
                tag: '10,000 Trials'
              },
              {
                step: '05',
                title: 'Decision Engine',
                body: 'XGBoost cost engine ranks baseline vs. diversion options and quantifies net financial savings.',
                tag: 'Optimal Decision',
                highlight: true
              }
            ].map(({ step, title, body, tag, highlight }) => (
              <div
                key={step}
                className={`rounded-2xl border p-6 space-y-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all ${
                  highlight
                    ? 'bg-[#151719] border-[#151719] text-white'
                    : 'bg-white border-stone-300 text-[#151719]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2.5 border-stone-200">
                    <span className={`text-xs font-mono font-bold ${highlight ? 'text-[#D94E28]' : 'text-stone-400'}`}>
                      STEP {step}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${highlight ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600'}`}>
                      {tag}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold">{title}</h4>
                  <p className={`text-xs leading-relaxed ${highlight ? 'text-stone-400' : 'text-stone-600'}`}>
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ── 5. PLATFORM CAPABILITIES ── */}
        <section className="space-y-8">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#D94E28] uppercase tracking-widest block">
              SECTION 04 · PLATFORM CAPABILITIES
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#151719] tracking-tight">
              Engineered for decisions that cost millions
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
              Built with mathematical rigor and real-world maritime constraints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                cat: 'DISRUPTION PREDICTION',
                title: '48–72h Early Warning',
                desc: 'ExtraTrees ML classifier flags typhoons, port strikes, and canal closures days before impact — giving fleet operators time to act.',
                meta: 'ExtraTrees v1.8 Model'
              },
              {
                cat: 'ROUTE INTELLIGENCE',
                title: 'A* Bathymetric Routing',
                desc: 'Globally-aware spatial router computes 100% open-water diversion paths across 60+ ports, respecting TSS channels and draft limits.',
                meta: '60+ Commercial Ports'
              },
              {
                cat: 'STOCHASTIC ETA ENGINE',
                title: 'Monte Carlo Simulation',
                desc: '10,000 stochastic trials generate P50, P90, and P95 arrival distributions — replacing static single-point ETA guesses.',
                meta: 'P50 / P90 / P95 Percentiles'
              },
              {
                cat: 'FINANCIAL OPTIMIZATION',
                title: 'Real-Time Cost Ranking',
                desc: 'XGBoost engine calculates net savings of each diversion option — bunker fuel, demurrage, berth charges — vs. original route.',
                meta: 'Avg. +$8,377 Saved / Diversion'
              },
              {
                cat: 'OPERATIONAL CONTROL',
                title: 'Human-in-the-Loop',
                desc: 'Every recommendation passes through an audit-ready approval gate. Fleet managers stay in full command with exportable audit logs.',
                meta: 'Audit Trail & Decision Logs'
              },
              {
                cat: 'DECISION SPEED',
                title: 'Under 2 Seconds',
                desc: 'From disruption signal to ranked operational recommendation. No waiting, no manual email coordination, no guesswork.',
                meta: 'Full Pipeline < 2.0s',
                dark: true
              }
            ].map(({ cat, title, desc, meta, dark }) => (
              <div
                key={title}
                className={`rounded-2xl border p-8 space-y-4 hover:shadow-md transition-all flex flex-col justify-between ${
                  dark
                    ? 'bg-[#151719] border-[#151719] text-white'
                    : 'bg-white border-stone-300 text-[#151719] shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold text-[#D94E28] tracking-widest block">
                    {cat}
                  </span>
                  <h3 className="text-xl font-extrabold">{title}</h3>
                  <p className={`text-xs leading-relaxed ${dark ? 'text-stone-400' : 'text-stone-600'}`}>{desc}</p>
                </div>
                <div className={`pt-4 border-t text-[11px] font-mono font-bold flex items-center gap-2 ${dark ? 'border-stone-800 text-stone-400' : 'border-stone-100 text-stone-500'}`}>
                  <span className="size-1.5 rounded-full bg-[#D94E28] shrink-0" />
                  {meta}
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ── 6. CALL TO ACTION ── */}
        <section className="rounded-2xl bg-[#151719] border border-stone-800 p-12 md:p-16 text-center space-y-6 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-block rounded border border-stone-700 bg-stone-800 px-3.5 py-1 text-xs font-mono font-bold text-[#D94E28]">
              READY TO OPERATIONALIZE FLOWFORGE?
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
              className="rounded-xl bg-[#D94E28] hover:bg-[#C8401C] transition-all px-10 py-4 text-sm font-bold text-white shadow-xs mx-auto flex items-center gap-2 active:scale-[0.98]"
            >
              Start Reroute Analysis <ArrowRight className="size-4" />
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-300 bg-white py-6 text-xs text-stone-500 mt-12 font-sans">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] font-bold">
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
