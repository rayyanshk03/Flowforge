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
  Globe2,
  Layers,
  MapPin,
  Navigation,
  Play,
  RefreshCw,
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
  Check
} from 'lucide-react'

import Navbar from '@/components/Navbar'

// Realistic Port List
const REALISTIC_PORTS = [
  { name: 'Shanghai', code: 'CNSHA', country: 'China' },
  { name: 'Singapore', code: 'SGSIN', country: 'Singapore' },
  { name: 'Yokohama', code: 'JPYOK', country: 'Japan' },
  { name: 'Kobe', code: 'JPUKB', country: 'Japan' },
  { name: 'Busan', code: 'KRPUS', country: 'South Korea' },
  { name: 'Rotterdam', code: 'NLRTM', country: 'Netherlands' },
  { name: 'Hamburg', code: 'DEHAM', country: 'Germany' },
  { name: 'Mumbai', code: 'INBOM', country: 'India' }
]

export default function OperationalIntelligencePage() {
  // Form State
  const [originPort, setOriginPort] = useState('Shanghai')
  const [destinationPort, setDestinationPort] = useState('Yokohama')
  const [vessel, setVessel] = useState('FF Horizon (984210)')
  const [carrier, setCarrier] = useState('Ocean Network Express (ONE)')
  const [cargoType, setCargoType] = useState('High-Tech Semiconductors')
  const [cargoWeight, setCargoWeight] = useState('4,500 TEU / 12,500 MT')
  const [cargoValue, setCargoValue] = useState('$24,500,000 USD')
  const [baselineEta, setBaselineEta] = useState('2026-08-18 14:35 UTC')
  const [requiredDeliveryTime, setRequiredDeliveryTime] = useState('2026-08-20 00:00 UTC')
  const [riskTolerance, setRiskTolerance] = useState('Balanced')
  const [priority, setPriority] = useState('Crucial / High Priority')

  // Live Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [disruptionProb, setDisruptionProb] = useState(22.95)
  const [statusExposure, setStatusExposure] = useState('MODERATE EXPOSURE')
  const [analysisTimestamp, setAnalysisTimestamp] = useState<string>('')

  useEffect(() => {
    setAnalysisTimestamp(new Date().toLocaleTimeString())
  }, [])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const res = await fetch('http://localhost:8000/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: originPort,
          destination: destinationPort,
          cargo_value: 24500000,
          risk_tolerance: riskTolerance
        })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.disruption_prediction) {
          const prob = (data.disruption_prediction.probability * 100).toFixed(2)
          setDisruptionProb(parseFloat(prob))
          if (parseFloat(prob) > 50) {
            setStatusExposure('HIGH EXPOSURE')
          } else if (parseFloat(prob) > 20) {
            setStatusExposure('MODERATE EXPOSURE')
          } else {
            setStatusExposure('LOW EXPOSURE')
          }
        }
      }
    } catch {
      // Fallback
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisTimestamp(new Date().toLocaleTimeString())
      }, 500)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 font-sans antialiased selection:bg-[#D94E28] selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-10 space-y-6">

        {/* Page Title & Subtitle */}
        <div className="space-y-1 border-b border-stone-200/80 pb-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-0.5 text-[11px] font-semibold text-[#D94E28] shadow-2xs">
            <span className="size-2 rounded-full bg-[#D94E28] animate-pulse" />
            OPERATIONAL INTELLIGENCE & SHIPMENT ANALYSIS
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Operational Intelligence
          </h1>
          <p className="text-xs md:text-sm text-stone-600 font-normal">
            Establish the current state of the shipment before evaluating alternative decisions.
          </p>
        </div>

        {/* Two-Column Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ================================================== */}
          {/* LEFT — SHIPMENT CONFIGURATION FORM (7 Columns) */}
          {/* ================================================== */}
          <div className="lg:col-span-7 rounded-2xl border border-stone-200 bg-white p-5 md:p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Shipment Configuration</h2>
                <p className="text-xs text-stone-500 font-medium">Configure telemetry parameters to score risk.</p>
              </div>
              <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-md">
                INPUT PARAMETERS
              </span>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              {/* Origin Port Searchable Dropdown */}
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 block">Origin Port</label>
                <select
                  value={originPort}
                  onChange={(e) => setOriginPort(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-medium text-stone-900 shadow-2xs focus:border-[#D94E28] focus:outline-none"
                >
                  {REALISTIC_PORTS.map((port) => (
                    <option key={port.code} value={port.name}>
                      {port.name} ({port.code}) — {port.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Port Searchable Dropdown */}
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 block">Destination Port</label>
                <select
                  value={destinationPort}
                  onChange={(e) => setDestinationPort(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-medium text-stone-900 shadow-2xs focus:border-[#D94E28] focus:outline-none"
                >
                  {REALISTIC_PORTS.map((port) => (
                    <option key={port.code} value={port.name}>
                      {port.name} ({port.code}) — {port.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vessel */}
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 block">Vessel</label>
                <input
                  type="text"
                  value={vessel}
                  onChange={(e) => setVessel(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-medium text-stone-900 shadow-2xs focus:border-[#D94E28] focus:outline-none"
                />
              </div>

              {/* Carrier */}
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 block">Carrier</label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-medium text-stone-900 shadow-2xs focus:border-[#D94E28] focus:outline-none"
                />
              </div>

              {/* Cargo Type */}
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 block">Cargo Type</label>
                <input
                  type="text"
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-medium text-stone-900 shadow-2xs focus:border-[#D94E28] focus:outline-none"
                />
              </div>

              {/* Cargo Weight */}
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 block">Cargo Weight</label>
                <input
                  type="text"
                  value={cargoWeight}
                  onChange={(e) => setCargoWeight(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-medium text-stone-900 shadow-2xs focus:border-[#D94E28] focus:outline-none"
                />
              </div>

              {/* Cargo Value */}
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 block">Cargo Value ($)</label>
                <input
                  type="text"
                  value={cargoValue}
                  onChange={(e) => setCargoValue(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-medium text-stone-900 shadow-2xs focus:border-[#D94E28] focus:outline-none"
                />
              </div>

              {/* Baseline ETA */}
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 block">Baseline ETA</label>
                <input
                  type="text"
                  value={baselineEta}
                  onChange={(e) => setBaselineEta(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-medium text-stone-900 shadow-2xs focus:border-[#D94E28] focus:outline-none"
                />
              </div>

              {/* Required Delivery Time */}
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 block">Required Delivery Time</label>
                <input
                  type="text"
                  value={requiredDeliveryTime}
                  onChange={(e) => setRequiredDeliveryTime(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-medium text-stone-900 shadow-2xs focus:border-[#D94E28] focus:outline-none"
                />
              </div>

              {/* Risk Tolerance Dropdown */}
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700 block">Risk Tolerance</label>
                <select
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-medium text-stone-900 shadow-2xs focus:border-[#D94E28] focus:outline-none"
                >
                  <option value="Low">Low (Risk Averse)</option>
                  <option value="Balanced">Balanced (Default)</option>
                  <option value="High">High (Cost Optimized)</option>
                </select>
              </div>

              {/* Priority Dropdown */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-stone-700 block">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-medium text-stone-900 shadow-2xs focus:border-[#D94E28] focus:outline-none"
                >
                  <option value="Crucial / High Priority">Crucial / High Priority (Perishable & Hazmat)</option>
                  <option value="Standard">Standard Commercial Shipping</option>
                  <option value="Flexible">Flexible Schedule / Bulk Container</option>
                </select>
              </div>
            </div>

            {/* Analyze Shipment Action Button */}
            <div className="pt-2">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full rounded-xl bg-[#D94E28] hover:bg-[#C8401C] transition-all py-3.5 text-xs font-bold text-white shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" /> Evaluating ML Risk & Environmental Feeds...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" /> Analyze Shipment
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ================================================== */}
          {/* RIGHT — LIVE INTELLIGENCE & RISK DISPLAY (5 Columns) */}
          {/* ================================================== */}
          <div className="lg:col-span-5 space-y-5">

            {/* Live Route Summary Card */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Live Route Summary</span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Updated {analysisTimestamp}
                </span>
              </div>

              {/* Minimal Vertical Route Flow */}
              <div className="bg-[#F9F8F6] rounded-xl border border-stone-200 p-4 space-y-3 font-sans text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">ORIGIN</span>
                  <strong className="text-stone-900 font-bold">{originPort}</strong>
                </div>

                <div className="flex items-center justify-center text-stone-400 font-bold text-xs">↓</div>

                <div className="flex items-center justify-between border-y border-stone-200/70 py-2">
                  <span className="text-stone-500 font-medium">CURRENT ROUTE</span>
                  <strong className="text-stone-900 font-bold">East China Sea Express</strong>
                </div>

                <div className="flex items-center justify-center text-stone-400 font-bold text-xs">↓</div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">DESTINATION</span>
                  <strong className="text-stone-900 font-bold">{destinationPort}</strong>
                </div>
              </div>

              {/* Live Environmental Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans pt-1">
                {/* Weather Wind */}
                <div className="rounded-xl border border-stone-200 bg-[#F9F8F6] p-3 text-center space-y-0.5">
                  <span className="text-[11px] font-semibold text-stone-500 block">Wind</span>
                  <strong className="text-stone-900 font-extrabold block text-sm">4.7 kts</strong>
                </div>

                {/* Wave Height */}
                <div className="rounded-xl border border-stone-200 bg-[#F9F8F6] p-3 text-center space-y-0.5">
                  <span className="text-[11px] font-semibold text-stone-500 block">Wave Height</span>
                  <strong className="text-stone-900 font-extrabold block text-sm">0.0 m</strong>
                </div>

                {/* Operational Stress */}
                <div className="rounded-xl border border-stone-200 bg-[#F9F8F6] p-3 text-center space-y-0.5">
                  <span className="text-[11px] font-semibold text-stone-500 block">Stress</span>
                  <strong className="text-stone-900 font-extrabold block text-sm">23%</strong>
                </div>

                {/* Port Congestion */}
                <div className="rounded-xl border border-stone-200 bg-[#F9F8F6] p-3 text-center space-y-0.5">
                  <span className="text-[11px] font-semibold text-stone-500 block">Congestion</span>
                  <strong className="text-amber-800 font-extrabold block text-sm">45%</strong>
                </div>
              </div>

              {/* Secondary Environmental Details */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-sans text-stone-700">
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-2.5 text-center">
                  <span className="text-stone-500 block">Waiting Time:</span>
                  <strong className="font-bold text-stone-900">18 h</strong>
                </div>
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-2.5 text-center">
                  <span className="text-stone-500 block">Geo Exposure:</span>
                  <strong className="font-bold text-red-700">HIGH</strong>
                </div>
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-2.5 text-center">
                  <span className="text-stone-500 block">Data Quality:</span>
                  <strong className="font-bold text-emerald-700">8/8 Sources</strong>
                </div>
              </div>
            </div>

            {/* ================================================== */}
            {/* RISK SUMMARY CARD */}
            {/* ================================================== */}
            <div className="rounded-2xl border-2 border-amber-300 bg-white p-5 md:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Risk Summary</span>
                <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full">
                  {statusExposure}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-stone-500 block">CURRENT DISRUPTION PROBABILITY</span>
                <div className="text-4xl font-extrabold text-[#D94E28] tracking-tight">
                  {disruptionProb.toFixed(2)}%
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
                FlowForge estimates the probability of a material operational disruption based on current environmental, port and geopolitical conditions.
              </p>
            </div>

            {/* ================================================== */}
            {/* MODEL EXPLANATION — "Why this score?" */}
            {/* ================================================== */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <h3 className="text-sm font-bold text-stone-900">Why this score?</h3>
                <span className="text-[11px] font-semibold text-stone-500">Current intelligence signals</span>
              </div>

              <div className="space-y-3.5 text-xs font-sans">
                {/* Signal 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-stone-700">Operational Stress</span>
                    <strong className="text-stone-900">23%</strong>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '23%' }} />
                  </div>
                </div>

                {/* Signal 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-stone-700">Port Congestion</span>
                    <strong className="text-stone-900">45%</strong>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>

                {/* Signal 3 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-stone-700">Geo-Port Exposure</span>
                    <strong className="text-stone-900">85%</strong>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
                    <div className="bg-[#D94E28] h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ================================================== */}
        {/* BOTTOM ACTION & DATA STATUS BAR */}
        {/* ================================================== */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm font-sans">
          {/* Left Data Verification Checkmarks */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-stone-700">
            <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">DATA VERIFIED:</span>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
              <Check className="size-3 text-emerald-600" /> Weather
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
              <Check className="size-3 text-emerald-600" /> Port
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
              <Check className="size-3 text-emerald-600" /> AIS
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
              <Check className="size-3 text-emerald-600" /> Geopolitical
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
              <Check className="size-3 text-emerald-600" /> Carrier
            </span>
          </div>

          {/* Right Navigation Button */}
          <Link
            href="/network"
            className="rounded-xl bg-[#D94E28] hover:bg-[#C8401C] transition-all px-7 py-3 text-xs font-bold text-white shadow-sm flex items-center gap-2 active:scale-[0.98]"
          >
            Continue to Route Intelligence <ArrowRight className="size-4" />
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
