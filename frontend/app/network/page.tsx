'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  AlertTriangle,
  Activity,
  Globe2,
  MapPin,
  RefreshCw,
  Ship,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Sparkles,
  Clock
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'

const GlobalMap = dynamic(() => import('@/components/GlobalMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] w-full rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 font-sans text-xs">
      Loading Maritime Map…
    </div>
  )
})

export default function NetworkPage() {
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [backendStatus, setBackendStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('DISCONNECTED')

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString())
    async function fetchBackend() {
      try {
        const res = await fetch('http://localhost:8000/health')
        if (res.ok) setBackendStatus('CONNECTED')
      } catch {
        setBackendStatus('DISCONNECTED')
      }
    }
    fetchBackend()
    const timer = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString())
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-10 space-y-6">

        {/* Page Header */}
        <div className="space-y-1 border-b border-stone-200 pb-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-0.5 text-[11px] font-semibold text-[#D94E28]">
            <span className="size-2 rounded-full bg-[#D94E28] animate-pulse" />
            ROUTE INTELLIGENCE
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Route Intelligence
          </h1>
          <p className="text-xs md:text-sm text-stone-600">
            Real-time maritime corridor tracking, route planning, and disruption visualization.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-1">
            <span className="text-stone-500 font-medium block">Active Corridor</span>
            <strong className="text-stone-900 font-bold text-sm">Shanghai → Yokohama</strong>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-1">
            <span className="text-stone-500 font-medium block">Vessel</span>
            <strong className="text-[#D94E28] font-bold text-sm">FF Horizon (984210)</strong>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-1">
            <span className="text-stone-500 font-medium block">Disruption Risk</span>
            <strong className="text-amber-700 font-bold text-sm">22.9% · Cyclone Alert</strong>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-1">
            <span className="text-stone-500 font-medium block">Recommended Diversion</span>
            <strong className="text-emerald-700 font-bold text-sm">Kobe Port (ALT-KOBE-01)</strong>
          </div>
        </div>

        {/* Two Column: Map + Intelligence Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* Left: Interactive Map */}
          <div className="lg:col-span-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Globe2 className="size-4 text-[#D94E28]" />
                <span className="text-sm font-bold text-stone-900">Global Maritime Digital Twin</span>
              </div>
              <span className="text-[11px] font-medium text-stone-500">
                Updated {lastUpdated}
              </span>
            </div>
            <GlobalMap />
          </div>

          {/* Right: Intelligence Summary */}
          <div className="lg:col-span-4 space-y-4">

            {/* Route Status Card */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3 text-xs font-sans">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block border-b border-stone-100 pb-2.5">
                Voyage Monitor
              </span>
              <div className="space-y-2.5 text-stone-800">
                <div className="flex justify-between">
                  <span className="text-stone-500">Corridor:</span>
                  <strong>Shanghai → Yokohama</strong>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-2">
                  <span className="text-stone-500">Baseline ETA:</span>
                  <strong>18 Aug · 14:35 UTC</strong>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-2">
                  <span className="text-stone-500">Speed:</span>
                  <strong>14.2 kn</strong>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-2">
                  <span className="text-stone-500">Heading:</span>
                  <strong>065° ENE</strong>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-2">
                  <span className="text-stone-500">Cargo:</span>
                  <strong className="text-right max-w-[140px]">Semiconductors ($24.5M)</strong>
                </div>
              </div>
            </div>

            {/* Risk Alert Card */}
            <div className="rounded-2xl border-2 border-amber-300 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Disruption Risk</span>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full">
                  MODERATE
                </span>
              </div>
              <div className="text-4xl font-extrabold text-[#D94E28]">22.9%</div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Cyclone warning in East China Sea. Kobe Port diversion recommended.
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex justify-between font-medium text-stone-700">
                  <span>Port Congestion</span><span>45%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '45%' }} />
                </div>
                <div className="flex justify-between font-medium text-stone-700 pt-1">
                  <span>Geo Exposure</span><span>85%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5">
                  <div className="bg-[#D94E28] h-1.5 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>

            {/* Financial Impact Card */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3 text-xs font-sans">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block border-b border-stone-100 pb-2.5">
                Financial Impact
              </span>
              <div className="space-y-2 text-stone-800">
                <div className="flex justify-between">
                  <span className="text-stone-500">Baseline Cost:</span>
                  <span className="line-through text-stone-400">$18,888</span>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-2">
                  <span className="text-stone-500">Kobe Diversion:</span>
                  <strong className="text-emerald-700">$10,510</strong>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-2">
                  <span className="text-stone-500">Net Savings:</span>
                  <strong className="text-emerald-700 font-extrabold text-sm">+$8,377</strong>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm font-sans">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-700">
            <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">Data Sources:</span>
            {['AIS Telemetry', 'Weather', 'Port Status', 'Geopolitical', 'Carrier'].map(src => (
              <span key={src} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
                <CheckCircle2 className="size-3 text-emerald-500" /> {src}
              </span>
            ))}
          </div>
          <Link
            href="/simulation"
            className="rounded-xl bg-[#D94E28] hover:bg-[#C8401C] transition-all px-7 py-3 text-xs font-bold text-white shadow-sm flex items-center gap-2 active:scale-[0.98]"
          >
            Continue to Monte Carlo Simulation <ArrowRight className="size-4" />
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-5 text-xs text-stone-500 mt-10 font-sans">
        <div className="mx-auto max-w-[1440px] px-4 md:px-10 flex flex-wrap items-center justify-between gap-4 font-medium">
          <div>FLOWFORGE MARITIME DECISION INTELLIGENCE</div>
          <div>© {new Date().getFullYear()} FLOWFORGE. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>
    </div>
  )
}
