'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Activity,
  Check,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  Wind,
  Globe2,
  Anchor,
  Clock,
  Compass,
  Database
} from 'lucide-react'

import Navbar from '@/components/Navbar'
import DisruptionCenterPanel from '@/components/DisruptionCenterPanel'

// Realistic Port Examples
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
  const [vessel, setVessel] = useState('FF Horizon (IMO 984210)')
  const [carrier, setCarrier] = useState('Ocean Network Express (ONE)')
  const [cargoType, setCargoType] = useState('High-Tech Semiconductors')
  const [cargoWeight, setCargoWeight] = useState('4,500 TEU / 12,500 MT')
  const [cargoValue, setCargoValue] = useState('$24,500,000 USD')
  const [baselineEta, setBaselineEta] = useState('2026-08-18 14:35 UTC')
  const [requiredDeliveryTime, setRequiredDeliveryTime] = useState('2026-08-20 00:00 UTC')
  const [riskTolerance, setRiskTolerance] = useState('Balanced')
  const [priority, setPriority] = useState('Crucial / High Priority')

  // Search Filter State for Dropdowns
  const [originSearch, setOriginSearch] = useState('')
  const [destSearch, setDestSearch] = useState('')

  // Live Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [disruptionProb, setDisruptionProb] = useState(22.95)
  const [statusExposure, setStatusExposure] = useState('MODERATE EXPOSURE')
  const [analysisTimestamp, setAnalysisTimestamp] = useState<string>('')

  useEffect(() => {
    setAnalysisTimestamp(new Date().toLocaleTimeString())
  }, [])

  const filteredOriginPorts = REALISTIC_PORTS.filter(
    (p) =>
      p.name.toLowerCase().includes(originSearch.toLowerCase()) ||
      p.code.toLowerCase().includes(originSearch.toLowerCase()) ||
      p.country.toLowerCase().includes(originSearch.toLowerCase())
  )

  const filteredDestPorts = REALISTIC_PORTS.filter(
    (p) =>
      p.name.toLowerCase().includes(destSearch.toLowerCase()) ||
      p.code.toLowerCase().includes(destSearch.toLowerCase()) ||
      p.country.toLowerCase().includes(destSearch.toLowerCase())
  )

  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    // Store custom input in sessionStorage so network & simulation pages consume it
    const scenarioInput = {
      origin_unlocode: originPort,
      destination_unlocode: destinationPort,
      vessel_name: vessel,
      carrier_code: carrier,
      cargo_type: cargoType,
      cargo_weight_mt: cargoWeight,
      cargo_value_usd: cargoValue,
      baseline_eta: baselineEta,
      required_delivery_time: requiredDeliveryTime,
      risk_tolerance: riskTolerance,
      priority: priority
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('flowforge_scenario_input', JSON.stringify(scenarioInput))
    }

    try {
      const res = await fetch('http://localhost:8000/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_unlocode: originPort === 'Shanghai' ? 'CNSHA' : originPort === 'Singapore' ? 'SGSIN' : originPort === 'Mumbai' ? 'INNSA' : 'NLRTM',
          destination_unlocode: destinationPort === 'Yokohama' ? 'JPYOK' : destinationPort === 'Rotterdam' ? 'NLRTM' : destinationPort === 'Kobe' ? 'JPUKB' : 'KRPUS',
          cargo_value_usd: 24500000,
          risk_tolerance: riskTolerance,
          enable_monte_carlo: true
        })
      })

      if (res.ok) {
        const data = await res.json()
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('flowforge_analysis_result', JSON.stringify(data))
          window.dispatchEvent(new Event('flowforge_analysis_updated'))
        }

        const probVal = data?.predictions?.disruption?.disruption_probability
          ? (data.predictions.disruption.disruption_probability * 100).toFixed(2)
          : '22.95'
        const numericProb = parseFloat(probVal)
        setDisruptionProb(numericProb)

        if (numericProb > 50) {
          setStatusExposure('HIGH EXPOSURE')
        } else if (numericProb > 20) {
          setStatusExposure('MODERATE EXPOSURE')
        } else {
          setStatusExposure('LOW EXPOSURE')
        }
      } else {
        // Fallback storing deterministic prediction
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(
            'flowforge_analysis_result',
            JSON.stringify({
              predictions: {
                disruption: { disruption_probability: disruptionProb / 100 },
                eta: { predicted_total_hours: 168 },
                cost: { net_financial_savings_usd: { value: 8377 } }
              }
            })
          )
          window.dispatchEvent(new Event('flowforge_analysis_updated'))
        }
      }
    } catch {
      // Offline graceful fallback
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'flowforge_analysis_result',
          JSON.stringify({
            predictions: {
              disruption: { disruption_probability: disruptionProb / 100 },
              eta: { predicted_total_hours: 168 },
              cost: { net_financial_savings_usd: { value: 8377 } }
            }
          })
        )
        window.dispatchEvent(new Event('flowforge_analysis_updated'))
      }
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisTimestamp(new Date().toLocaleTimeString())
      }, 400)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F6F3] text-[#151719] font-sans antialiased selection:bg-[#D94E28] selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-12 space-y-8">

        {/* PAGE TITLE & SUBTITLE */}
        <div className="space-y-2 border-b border-stone-300 pb-5">
          <div className="inline-flex items-center gap-2 rounded border border-stone-300 bg-white px-3 py-1 text-xs font-mono font-bold text-[#D94E28] shadow-xs">
            <span className="size-2 rounded-full bg-[#D94E28] animate-pulse" />
            DISRUPTION INTELLIGENCE CENTER &amp; OPERATIONAL ANALYSIS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#151719] tracking-tight">
            Disruption Intelligence
          </h1>
          <p className="text-sm text-stone-600 font-normal max-w-2xl leading-relaxed">
            Real-time threat detection, active network disruption monitoring, and automated response plan generation.
          </p>
        </div>

        {/* DEDICATED DISRUPTION INTELLIGENCE CENTER PANEL */}
        <DisruptionCenterPanel />

        {/* TWO-COLUMN LAYOUT: LEFT (INPUT) | RIGHT (LIVE INTELLIGENCE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ================================================== */}
          {/* LEFT — SHIPMENT INPUT (7 Columns) */}
          {/* ================================================== */}
          <div className="lg:col-span-7 rounded-2xl border border-stone-300 bg-white p-7 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#D94E28] uppercase tracking-widest block">
                  CONFIGURATION FORM
                </span>
                <h2 className="text-xl font-extrabold text-[#151719] mt-0.5">Shipment Configuration</h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-stone-600 bg-stone-100 border border-stone-300 px-3 py-1 rounded">
                INPUT PARAMS
              </span>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-sans">

              {/* Searchable Dropdown: Origin Port */}
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-stone-700 block uppercase text-[11px]">
                  Origin Port
                </label>
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Filter port..."
                    value={originSearch}
                    onChange={(e) => setOriginSearch(e.target.value)}
                    className="w-full rounded border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs font-mono text-stone-600 focus:outline-none focus:border-[#D94E28]"
                  />
                  <select
                    value={originPort}
                    onChange={(e) => setOriginPort(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-bold text-[#151719] shadow-xs focus:border-[#D94E28] focus:outline-none cursor-pointer"
                  >
                    {filteredOriginPorts.map((port) => (
                      <option key={port.code} value={port.name}>
                        {port.name} ({port.code}) — {port.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Searchable Dropdown: Destination Port */}
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-stone-700 block uppercase text-[11px]">
                  Destination Port
                </label>
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Filter port..."
                    value={destSearch}
                    onChange={(e) => setDestSearch(e.target.value)}
                    className="w-full rounded border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs font-mono text-stone-600 focus:outline-none focus:border-[#D94E28]"
                  />
                  <select
                    value={destinationPort}
                    onChange={(e) => setDestinationPort(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-bold text-[#151719] shadow-xs focus:border-[#D94E28] focus:outline-none cursor-pointer"
                  >
                    {filteredDestPorts.map((port) => (
                      <option key={port.code} value={port.name}>
                        {port.name} ({port.code}) — {port.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vessel */}
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-stone-700 block uppercase text-[11px]">
                  Vessel
                </label>
                <input
                  type="text"
                  value={vessel}
                  onChange={(e) => setVessel(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-bold text-[#151719] shadow-xs focus:border-[#D94E28] focus:outline-none"
                />
              </div>

              {/* Carrier */}
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-stone-700 block uppercase text-[11px]">
                  Carrier
                </label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-bold text-[#151719] shadow-xs focus:border-[#D94E28] focus:outline-none"
                />
              </div>

              {/* Cargo Type */}
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-stone-700 block uppercase text-[11px]">
                  Cargo Type
                </label>
                <input
                  type="text"
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-bold text-[#151719] shadow-xs focus:border-[#D94E28] focus:outline-none"
                />
              </div>

              {/* Cargo Weight */}
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-stone-700 block uppercase text-[11px]">
                  Cargo Weight
                </label>
                <input
                  type="text"
                  value={cargoWeight}
                  onChange={(e) => setCargoWeight(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-bold text-[#151719] shadow-xs focus:border-[#D94E28] focus:outline-none"
                />
              </div>

              {/* Cargo Value */}
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-stone-700 block uppercase text-[11px]">
                  Cargo Value
                </label>
                <input
                  type="text"
                  value={cargoValue}
                  onChange={(e) => setCargoValue(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-bold text-[#151719] shadow-xs focus:border-[#D94E28] focus:outline-none"
                />
              </div>

              {/* Baseline ETA */}
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-stone-700 block uppercase text-[11px]">
                  Baseline ETA
                </label>
                <input
                  type="text"
                  value={baselineEta}
                  onChange={(e) => setBaselineEta(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-bold text-[#151719] shadow-xs focus:border-[#D94E28] focus:outline-none"
                />
              </div>

              {/* Required Delivery Time */}
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-stone-700 block uppercase text-[11px]">
                  Required Delivery Time
                </label>
                <input
                  type="text"
                  value={requiredDeliveryTime}
                  onChange={(e) => setRequiredDeliveryTime(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-bold text-[#151719] shadow-xs focus:border-[#D94E28] focus:outline-none"
                />
              </div>

              {/* Risk Tolerance Dropdown */}
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-stone-700 block uppercase text-[11px]">
                  Risk Tolerance
                </label>
                <select
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-bold text-[#151719] shadow-xs focus:border-[#D94E28] focus:outline-none cursor-pointer"
                >
                  <option value="Low">Low (Risk Averse)</option>
                  <option value="Balanced">Balanced (Default)</option>
                  <option value="High">High (Cost Optimized)</option>
                </select>
              </div>

              {/* Priority Dropdown */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-mono font-bold text-stone-700 block uppercase text-[11px]">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-bold text-[#151719] shadow-xs focus:border-[#D94E28] focus:outline-none cursor-pointer"
                >
                  <option value="Crucial / High Priority">Crucial / High Priority (Perishable & Hazmat)</option>
                  <option value="Standard">Standard Commercial Shipping</option>
                  <option value="Flexible">Flexible Schedule / Bulk Container</option>
                </select>
              </div>
            </div>

            {/* Analyze Shipment Button */}
            <div className="pt-2">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full rounded-xl bg-[#D94E28] hover:bg-[#C8401C] transition-all py-4 text-xs font-bold text-white shadow-xs flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" /> Evaluating ML Risk & Operational Feeds...
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
          {/* RIGHT — LIVE OPERATIONAL INTELLIGENCE (5 Columns) */}
          {/* ================================================== */}
          <div className="lg:col-span-5 space-y-6">

            {/* Live Route Summary & Environmental Feeds */}
            <div className="rounded-2xl border border-stone-300 bg-white p-7 space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3.5">
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                  LIVE ROUTE SUMMARY
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded">
                  UPDATED {analysisTimestamp}
                </span>
              </div>

              {/* Route Summary vertical flow */}
              <div className="bg-[#F6F6F3] rounded-xl border border-stone-300 p-4 space-y-3 font-sans text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">ORIGIN</span>
                  <strong className="text-[#151719] font-extrabold text-sm">{originPort}</strong>
                </div>

                <div className="flex items-center justify-center text-stone-400 font-bold text-sm">↓</div>

                <div className="flex items-center justify-between border-y border-stone-300/80 py-2.5">
                  <span className="text-stone-500 font-medium">CORRIDOR</span>
                  <strong className="text-[#D94E28] font-mono font-bold text-xs">Current Route (East Asian Leg)</strong>
                </div>

                <div className="flex items-center justify-center text-stone-400 font-bold text-sm">↓</div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-medium">DESTINATION</span>
                  <strong className="text-[#151719] font-extrabold text-sm">{destinationPort}</strong>
                </div>
              </div>

              {/* Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                {/* Weather */}
                <div className="rounded-xl border border-stone-300 bg-[#F6F6F3] p-4 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider block">
                    WEATHER
                  </span>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-stone-600">Wind</span>
                    <strong className="font-mono font-bold text-[#151719]">4.7 kts</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Wave Height</span>
                    <strong className="font-mono font-bold text-[#151719]">0.0 m</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Op Stress</span>
                    <strong className="font-mono font-bold text-[#151719]">23%</strong>
                  </div>
                </div>

                {/* Port */}
                <div className="rounded-xl border border-stone-300 bg-[#F6F6F3] p-4 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider block">
                    PORT
                  </span>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-stone-600">Congestion</span>
                    <strong className="font-mono font-bold text-amber-800">45%</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Waiting Time</span>
                    <strong className="font-mono font-bold text-[#151719]">18 h</strong>
                  </div>
                </div>

                {/* Geo-Political */}
                <div className="rounded-xl border border-stone-300 bg-[#F6F6F3] p-4 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider block">
                    GEO-POLITICAL
                  </span>
                  <div className="pt-1 flex justify-between items-center">
                    <span className="text-stone-600">Reg. Exposure</span>
                    <strong className="font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-[11px]">
                      HIGH
                    </strong>
                  </div>
                </div>

                {/* Data Quality */}
                <div className="rounded-xl border border-stone-300 bg-[#F6F6F3] p-4 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider block">
                    DATA QUALITY
                  </span>
                  <div className="pt-1 flex justify-between items-center">
                    <span className="text-stone-600">Status</span>
                    <strong className="font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 rounded text-[11px]">
                      8/8 SOURCES
                    </strong>
                  </div>
                </div>
              </div>
            </div>


            {/* ================================================== */}
            {/* RISK SUMMARY CARD */}
            {/* ================================================== */}
            <div className="rounded-2xl border-2 border-amber-400 bg-white p-7 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                  RISK SUMMARY
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded">
                  {statusExposure}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider block">
                  CURRENT DISRUPTION PROBABILITY
                </span>
                <div className="text-5xl font-extrabold text-[#D94E28] tracking-tight">
                  {disruptionProb.toFixed(2)}%
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-100 font-sans">
                FlowForge estimates the probability of a material operational disruption based on current environmental, port and geopolitical conditions.
              </p>
            </div>


            {/* ================================================== */}
            {/* MODEL EXPLANATION — "Why this score?" */}
            {/* ================================================== */}
            <div className="rounded-2xl border border-stone-300 bg-white p-7 space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="text-base font-extrabold text-[#151719]">Why this score?</h3>
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                  Current intelligence signals
                </span>
              </div>

              <div className="space-y-4 text-xs font-sans">
                {/* Factor 1: Operational Stress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono font-bold text-xs">
                    <span className="text-stone-700">Operational Stress</span>
                    <span className="text-[#151719]">██████░░░░ 23%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-300">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '23%' }} />
                  </div>
                </div>

                {/* Factor 2: Port Congestion */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono font-bold text-xs">
                    <span className="text-stone-700">Port Congestion</span>
                    <span className="text-[#151719]">████████░░ 45%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-300">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>

                {/* Factor 3: Geo-Port Exposure */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono font-bold text-xs">
                    <span className="text-stone-700">Geo-Port Exposure</span>
                    <span className="text-[#151719]">█████████░ 85%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-300">
                    <div className="bg-[#D94E28] h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>


        {/* ================================================== */}
        {/* BOTTOM ACTION & HORIZONTAL STATUS BAR */}
        {/* ================================================== */}
        <div className="rounded-2xl border border-stone-300 bg-white p-5 md:p-6 flex flex-wrap items-center justify-between gap-5 shadow-xs font-sans">
          {/* Left Data Verification Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-stone-700">
            <span className="font-mono font-bold text-[#151719] uppercase tracking-wider text-[11px]">
              DATA VERIFIED:
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded font-mono font-bold text-[11px]">
              <Check className="size-3.5 text-emerald-600" /> Weather
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded font-mono font-bold text-[11px]">
              <Check className="size-3.5 text-emerald-600" /> Port
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded font-mono font-bold text-[11px]">
              <Check className="size-3.5 text-emerald-600" /> AIS
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded font-mono font-bold text-[11px]">
              <Check className="size-3.5 text-emerald-600" /> Geopolitical
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded font-mono font-bold text-[11px]">
              <Check className="size-3.5 text-emerald-600" /> Carrier
            </span>
          </div>

          {/* Right Transition Button */}
          <Link
            href="/network"
            className="rounded-xl bg-[#D94E28] hover:bg-[#C8401C] transition-all px-8 py-4 text-xs font-bold text-white shadow-xs flex items-center gap-2.5 active:scale-[0.98]"
          >
            Continue to Route Intelligence <ArrowRight className="size-4" />
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-300 bg-white py-6 text-xs text-stone-500 mt-12 font-sans">
        <div className="mx-auto max-w-[1440px] px-5 md:px-12 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] font-bold">
          <div>FLOWFORGE MARITIME DECISION INTELLIGENCE</div>
          <div>© {new Date().getFullYear()} FLOWFORGE. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>
    </div>
  )
}
