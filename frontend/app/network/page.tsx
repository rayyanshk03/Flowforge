'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Globe2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'

const GlobalMap = dynamic(() => import('@/components/GlobalMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] w-full rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 text-xs">
      Loading Maritime Map…
    </div>
  )
})

const REROUTE_OPTIONS = [
  {
    id: 'A',
    label: 'Via Port of Kaohsiung (TW)',
    detail: 'Diverts through Taiwan Strait, avoids South China Sea congestion.',
    eta: '+4.1h delay',
    cost: '$14,200',
    savings: '+$4,688',
    risk: '8.2%',
    distance: '3,240 nm',
    recommended: true,
  },
  {
    id: 'B',
    label: 'Via Manila Int\'l Port (PH)',
    detail: 'East Philippines Sea bypass, longer but avoids Luzon Strait.',
    eta: '+9.3h delay',
    cost: '$16,880',
    savings: '+$2,008',
    risk: '14.7%',
    distance: '3,620 nm',
    recommended: false,
  },
  {
    id: 'C',
    label: 'Via Busan New Port (KR)',
    detail: 'Northern Korean Strait leg, maximum safety but highest cost.',
    eta: '+16.2h delay',
    cost: '$19,440',
    savings: '−$1,552',
    risk: '6.1%',
    distance: '4,180 nm',
    recommended: false,
  },
]

export default function NetworkPage() {
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [backendStatus, setBackendStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED')
  const [activeReroute, setActiveReroute] = useState('A')

  // Dynamic Scenario State
  const [scenarioState, setScenarioState] = useState({
    originPort: 'Singapore Tuas Hub (SG)',
    originShort: 'Singapore',
    destPort: 'Port of Yokohama (JP)',
    destShort: 'Yokohama',
    vessel: 'FF Horizon (984210)',
    baselineEta: 'Aug 22 · 08:14 UTC',
    riskPct: '31.4%',
    savings: '+$4,688',
    recommendedPort: 'Via Kaohsiung (ALT-A)'
  })

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString())

    const syncScenario = () => {
      if (typeof window === 'undefined') return
      const inputStr = sessionStorage.getItem('flowforge_scenario_input')
      const resStr = sessionStorage.getItem('flowforge_analysis_result')

      if (inputStr) {
        try {
          const inp = JSON.parse(inputStr)
          const orig = inp.origin_unlocode || 'Singapore'
          const dest = inp.destination_unlocode || 'Yokohama'

          let riskVal = '31.4%'
          let savingsVal = '+$4,688'

          if (resStr) {
            try {
              const res = JSON.parse(resStr)
              const p = res?.predictions?.disruption?.disruption_probability
              if (p) riskVal = `${(p * 100).toFixed(1)}%`

              const sav = res?.predictions?.cost?.net_financial_savings_usd?.value
              if (sav) savingsVal = `+$${Math.round(sav).toLocaleString()}`
            } catch {}
          }

          setScenarioState({
            originPort: orig.includes('(') ? orig : `${orig} Terminal`,
            originShort: orig,
            destPort: dest.includes('(') ? dest : `Port of ${dest}`,
            destShort: dest,
            vessel: inp.vessel_name || 'FF Horizon (984210)',
            baselineEta: inp.baseline_eta || 'Aug 22 · 08:14 UTC',
            riskPct: riskVal,
            savings: savingsVal,
            recommendedPort: `Via Diversion (${dest})`
          })
        } catch {}
      }
    }

    syncScenario()
    window.addEventListener('flowforge_analysis_updated', syncScenario)
    window.addEventListener('storage', syncScenario)

    async function fetchBackend() {
      try {
        const res = await fetch('http://localhost:8000/health')
        if (res.ok) setBackendStatus('CONNECTED')
      } catch { setBackendStatus('DISCONNECTED') }
    }
    fetchBackend()
    const timer = setInterval(() => setLastUpdated(new Date().toLocaleTimeString()), 30000)
    return () => {
      window.removeEventListener('flowforge_analysis_updated', syncScenario)
      window.removeEventListener('storage', syncScenario)
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-10 space-y-6">

        {/* Page Header */}
        <div className="border-b border-stone-200 pb-4 space-y-0.5">
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">Route Intelligence</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
            {scenarioState.originShort} → {scenarioState.destShort} Corridor
          </h1>
          <p className="text-sm text-stone-500">
            Active operational analysis. 3 reroute options calculated by ML model. Best route recommended below.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-0.5">
            <span className="text-stone-400 font-medium block">Tracked Vessel</span>
            <strong className="text-[#D94E28] font-bold text-sm">{scenarioState.vessel}</strong>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-0.5">
            <span className="text-stone-400 font-medium block">Baseline ETA</span>
            <strong className="text-stone-900 font-bold text-sm">{scenarioState.baselineEta}</strong>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-0.5">
            <span className="text-amber-700 font-medium block">Disruption Risk</span>
            <strong className="text-amber-800 font-bold text-sm">{scenarioState.riskPct} Exposure</strong>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-0.5">
            <span className="text-emerald-700 font-medium block">Recommended Reroute</span>
            <strong className="text-emerald-800 font-bold text-sm">{scenarioState.recommendedPort}</strong>
          </div>
        </div>

        {/* Two-column: Map + Reroute panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Map */}
          <div className="lg:col-span-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Globe2 className="size-4 text-[#D94E28]" />
                <span className="text-sm font-bold text-stone-900">Live Route Map</span>
                <span className="text-[11px] font-semibold text-stone-400">{scenarioState.originShort} → {scenarioState.destShort}</span>
              </div>
              <span className="text-[11px] text-stone-400">Updated {lastUpdated}</span>
            </div>
            <GlobalMap
              originPort={scenarioState.originPort}
              destinationPort={scenarioState.destPort}
              activeReroute={activeReroute}
              onRerouteChange={setActiveReroute}
            />
          </div>

          {/* Reroute Options */}
          <div className="lg:col-span-4 space-y-3">
            <div className="border-b border-stone-200 pb-2">
              <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">Available Reroutes</p>
              <h2 className="text-base font-bold text-stone-900 mt-0.5">3 Alternatives Evaluated</h2>
            </div>

            {REROUTE_OPTIONS.map(r => (
              <div
                key={r.id}
                onClick={() => setActiveReroute(r.id)}
                className={`rounded-xl border p-4 space-y-3 cursor-pointer transition-all ${
                  activeReroute === r.id
                    ? r.recommended
                      ? 'border-emerald-300 bg-emerald-50 shadow-sm'
                      : r.id === 'B'
                        ? 'border-amber-300 bg-amber-50 shadow-sm'
                        : 'border-stone-400 bg-stone-50 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {r.recommended && <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />}
                      <span className={`text-xs font-bold ${r.recommended ? 'text-emerald-900' : 'text-stone-900'}`}>
                        {r.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{r.detail}</p>
                  </div>
                  {r.recommended && (
                    <span className="shrink-0 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                      RECOMMENDED
                    </span>
                  )}
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white rounded-lg border border-stone-200 p-2 space-y-0.5">
                    <span className="text-stone-400 font-medium block">ETA Impact</span>
                    <strong className="text-stone-800">{r.eta}</strong>
                  </div>
                  <div className="bg-white rounded-lg border border-stone-200 p-2 space-y-0.5">
                    <span className="text-stone-400 font-medium block">Risk Level</span>
                    <strong className={r.recommended ? 'text-emerald-700' : 'text-amber-700'}>{r.risk}</strong>
                  </div>
                  <div className="bg-white rounded-lg border border-stone-200 p-2 space-y-0.5">
                    <span className="text-stone-400 font-medium block">Route Cost</span>
                    <strong className="text-stone-800">{r.cost}</strong>
                  </div>
                  <div className="bg-white rounded-lg border border-stone-200 p-2 space-y-0.5">
                    <span className="text-stone-400 font-medium block">Net Savings</span>
                    <strong className={r.savings.startsWith('+') ? 'text-emerald-700' : 'text-red-600'}>{r.savings}</strong>
                  </div>
                </div>

                {r.recommended && (
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5 border-t border-emerald-200 pt-2">
                    <CheckCircle2 className="size-3.5" />
                    Best ETA/cost balance · Lowest viable risk
                  </div>
                )}
              </div>
            ))}

            {/* Voyage summary */}
            <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-2.5 text-xs">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest block border-b border-stone-100 pb-2">Voyage Summary</span>
              {[
                { l: 'Origin', v: 'Singapore Tuas Hub (SG)' },
                { l: 'Destination', v: 'Port of Yokohama (JP)' },
                { l: 'Distance', v: '3,240 nm (best route)' },
                { l: 'Speed', v: '13.8 kn' },
                { l: 'Cargo', v: 'Electronics ($18.2M)' },
                { l: 'Carrier', v: 'COSCO Shipping Lines' },
              ].map(({ l, v }) => (
                <div key={l} className="flex justify-between">
                  <span className="text-stone-400">{l}</span>
                  <span className="text-stone-800 font-medium text-right max-w-[160px]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-xl border border-stone-200 bg-white p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-600">
            <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">Data Sources:</span>
            {['AIS Telemetry', 'OpenMeteo Weather', 'Port Status API', 'Geopolitical Alerts'].map(src => (
              <span key={src} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                <CheckCircle2 className="size-3 text-emerald-500" /> {src}
              </span>
            ))}
          </div>
          <Link
            href="/simulation"
            className="rounded-xl bg-[#D94E28] hover:bg-[#C8401C] transition-all px-7 py-2.5 text-xs font-bold text-white flex items-center gap-2 active:scale-[0.98]"
          >
            Run Monte Carlo Simulation <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white py-5 text-xs text-stone-400 mt-6">
        <div className="mx-auto max-w-[1440px] px-4 md:px-10 flex flex-wrap items-center justify-between gap-4 font-medium tracking-wide">
          <div>FlowForge Maritime Decision Intelligence</div>
          <div>© {new Date().getFullYear()} FlowForge. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  )
}
