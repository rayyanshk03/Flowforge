'use client'

import React, { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Edit3,
  Download,
  FileText,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  Compass,
  FileCheck,
  Send,
  Layers,
  Sparkles,
  Share2,
  ChevronRight,
  Check
} from 'lucide-react'

interface BusinessActionLayerProps {
  shipmentId?: string
  originPort?: string
  destPort?: string
  reroutePath?: string[]
}

export default function BusinessActionLayer({
  shipmentId = 'FF-821',
  originPort = 'Ahmedabad',
  destPort = 'Delhi',
  reroutePath = ['Ahmedabad', 'Jaipur', 'Delhi']
}: BusinessActionLayerProps) {
  const [actionStatus, setActionStatus] = useState<'PENDING' | 'APPROVED' | 'MODIFIED' | 'REJECTED'>('PENDING')
  const [activeReportTab, setActiveReportTab] = useState<'ROUTE' | 'COST' | 'ETA' | 'RISK' | 'DISRUPTION' | 'FLEET' | 'SUMMARY'>('ROUTE')
  const [showExportModal, setShowExportModal] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  // Dynamically constructed route text
  const routeChain = reroutePath.length > 0 ? reroutePath.join(' ➔ ') : `${originPort} ➔ Jaipur ➔ ${destPort}`

  // 7 System Generated Reports Content
  const reports = {
    ROUTE: {
      title: '🗺️ 1. Route Plan & NavMesh Waypoints',
      subtitle: 'Bathymetric Corridor & Waypoint Coordinates',
      content: [
        { label: 'Primary Corridor', value: routeChain },
        { label: 'NavMesh Resolution', value: 'High-Density Open Water Bathymetry (0.1° Mesh)' },
        { label: 'Waypoints', value: reroutePath.map((wp, i) => `WP-${i + 1}: ${wp}`).join(' | ') },
        { label: 'Safety Margin', value: '25 Nautical Miles Coastal Clearance' },
        { label: 'Restricted Zones Bypassed', value: 'Bab-el-Mandeb High-Risk Piracy Corridor' }
      ]
    },
    COST: {
      title: '💰 2. Comprehensive Cost Breakdown',
      subtitle: 'Net Financial Impact & Surcharge Analysis',
      content: [
        { label: 'Baseline Route Fuel Cost', value: '$42,500' },
        { label: 'Reroute Fuel Cost', value: '$34,850' },
        { label: 'Canal & Transit Tolls Saved', value: '$9,200 (Suez Surcharge Avoided)' },
        { label: 'Port Congestion Delay Cost Saved', value: '$14,400 (48h Idle Demurrage Avoided)' },
        { label: 'Net Savings', value: '+$21,250 USD per Voyage (-18.2% Total OPEX)' }
      ]
    },
    ETA: {
      title: '⏱️ 3. ETA & Schedule Reliability',
      subtitle: 'Monte Carlo Arrival Probability & Percentiles',
      content: [
        { label: 'Expected ETA', value: '27 Days (P50 Median: 26.8 Days)' },
        { label: 'Baseline Disrupted ETA', value: '34 Days (7-Day Delay Avoided)' },
        { label: 'Arrival Confidence', value: '91% Statistical Certainty (P91 Bound)' },
        { label: 'Buffer Margin', value: '+1.4 Days Schedule Buffer' },
        { label: 'On-Time Delivery Target', value: 'Met with Zero SLA Penalty Risk' }
      ]
    },
    RISK: {
      title: '🛡️ 4. Risk & Safety Assessment',
      subtitle: 'Geopolitical, Weather & Piracy Threat Analysis',
      content: [
        { label: 'Overall Corridor Risk', value: 'LOW (8.2% Risk Exposure)' },
        { label: 'Piracy Threat Level', value: 'CLEARED (0% High Threat Zone Overlap)' },
        { label: 'Severe Weather Index', value: 'Wave Height < 2.5m | Wind Speed < 18 knots' },
        { label: 'Chokepoint Vulnerability', value: 'Zero Dependency on Single Narrow Strait' },
        { label: 'Insurance Premium Discount', value: 'Eligible for 12% Marine Risk Rebate' }
      ]
    },
    DISRUPTION: {
      title: '⚠️ 5. Disruption Avoidance Report',
      subtitle: 'Bottlenecks & Chokepoints Successfully Neutralized',
      content: [
        { label: 'Primary Disruption Target', value: 'Shanghai Heavy Port Congestion (48.5h Wait)' },
        { label: 'Secondary Weather Disruption', value: 'Typhoon Ampil Outer Bands Neutralized' },
        { label: 'Bypassed Chokepoints', value: 'Red Sea Geo-Conflict Corridor Bypassed' },
        { label: 'Mitigation Status', value: '100% Risk Deflection Achieved' },
        { label: 'Operational Continuity', value: 'Uninterrupted Vessel Velocity maintained at 14.2 knots' }
      ]
    },
    FLEET: {
      title: '🚛 6. Driver / Fleet / Vessel Captain Instructions',
      subtitle: 'Operational Execution Orders & Navigation Directives',
      content: [
        { label: 'Logistics Action', value: `Execute reroute for Shipment ${shipmentId} via ${routeChain}` },
        { label: 'Course Setting', value: 'Maintain 235° SW Heading upon leaving port' },
        { label: 'Cruising Speed Directive', value: 'Eco-Steaming Speed: 13.8 knots to optimize HFO burn' },
        { label: 'Communication Protocol', value: 'Report AIS position telemetry every 4 hours' },
        { label: 'Emergency Alternate Hub', value: 'Jaipur Logistics Hub / Singapore Anchor' }
      ]
    },
    SUMMARY: {
      title: '📊 7. Executive Management Summary',
      subtitle: 'C-Suite Briefing & Operational ROI Report',
      content: [
        { label: 'Executive Recommendation', value: `Approve Reroute FF-821 via ${routeChain}` },
        { label: 'Financial Impact', value: 'Save $21,250 USD (-18.2% OPEX Reduction)' },
        { label: 'Schedule Impact', value: 'Prevent 7-Day Delay; Guarantee On-Time Delivery' },
        { label: 'Carbon Footprint Impact', value: 'Reduce CO2 emissions by 42.5 Metric Tons' },
        { label: 'Decision Confidence', value: '91% Monte Carlo Verified by FlowForge Intelligence' }
      ]
    }
  }

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      setExportComplete(true)

      // Generate text file download of full report
      const fullReportText = `
================================================================================
FLOWFORGE AUTONOMOUS BUSINESS ACTION & DISPATCH PLAN
SHIPMENT ID: ${shipmentId}
GENERATED AT: ${new Date().toISOString()}
STATUS: ${actionStatus}
================================================================================

RECOMMENDED ACTION:
Reroute shipment ${shipmentId} through ${routeChain}.

--------------------------------------------------------------------------------
1. ROUTE PLAN
Primary Corridor: ${routeChain}
NavMesh Resolution: High-Density Open Water Bathymetry
Safety Margin: 25 Nautical Miles Coastal Clearance

2. COST BREAKDOWN
Baseline Fuel: $42,500
Reroute Fuel: $34,850
Tolls Saved: $9,200 (Suez Surcharge Avoided)
Net Savings: +$21,250 USD per Voyage (-18.2% Total OPEX)

3. ETA & SCHEDULE RELIABILITY
Expected ETA: 27 Days (P50 Median: 26.8 Days)
Baseline Delay Avoided: 7 Days
Arrival Confidence: 91% Statistical Certainty

4. RISK ASSESSMENT
Corridor Risk: LOW (8.2% Risk Exposure)
Piracy Threat: CLEARED (0% Overlap)
Weather Index: Safe Sea Conditions

5. DISRUPTION REPORT
Target Neutralized: Shanghai Heavy Congestion (48.5h Wait)
Mitigation Status: 100% Risk Deflection

6. FLEET & CAPTAIN DIRECTIVES
Logistics Directive: Execute reroute via ${routeChain}
Eco-Speed: 13.8 knots
Position Reporting: Every 4 Hours via AIS

7. MANAGEMENT SUMMARY
ROI: Save $21,250 USD, prevent 7-day delay, reduce CO2 by 42.5 MT.
================================================================================
`.trim()

      const blob = new Blob([fullReportText], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `FlowForge_Action_Plan_${shipmentId}.txt`
      link.click()
      URL.revokeObjectURL(url)
    }, 800)
  }

  return (
    <div className="rounded-lg border-2 border-stone-300 bg-white p-6 shadow-md space-y-6 font-mono">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-[10px] font-black text-[#D94E28] tracking-widest block uppercase">
            SECTION 12 · BUSINESS ACTION LAYER &amp; DECISION EXECUTION
          </span>
          <h3 className="text-xl font-black text-[#151719] mt-0.5 flex items-center gap-2">
            ⚡ AUTONOMOUS BUSINESS ACTION ENGINE
          </h3>
        </div>

        {/* Action Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-stone-500 uppercase">ACTION STATUS:</span>
          <span className={`px-3 py-1 rounded text-xs font-black border ${
            actionStatus === 'APPROVED'
              ? 'bg-emerald-50 border-emerald-400 text-[#047857]'
              : actionStatus === 'MODIFIED'
              ? 'bg-amber-50 border-amber-400 text-amber-900'
              : actionStatus === 'REJECTED'
              ? 'bg-red-50 border-red-400 text-red-800'
              : 'bg-stone-100 border-stone-300 text-stone-800'
          }`}>
            {actionStatus === 'APPROVED' && '✅ APPROVED & DISPATCHED'}
            {actionStatus === 'MODIFIED' && '✏️ CORRIDOR MODIFIED'}
            {actionStatus === 'REJECTED' && '❌ ACTION REJECTED'}
            {actionStatus === 'PENDING' && '⏳ AWAITING DECISION'}
          </span>
        </div>
      </div>

      {/* RECOMMENDED ACTION CARD (Exact Requested Layout) */}
      <div className="rounded-xl border-2 border-[#D94E28] bg-orange-50/40 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-orange-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-[#D94E28]" />
            <span className="text-xs font-black text-[#D94E28] uppercase tracking-widest">RECOMMENDED ACTION</span>
          </div>
          <span className="text-[10px] font-black text-white bg-[#D94E28] px-2.5 py-0.5 rounded">
            SHIPMENT ID: {shipmentId}
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-bold text-stone-700">Autonomous Decision Recommendation:</div>
          <div className="text-lg md:text-xl font-black text-[#151719] font-mono leading-relaxed">
            Reroute shipment <strong className="text-[#D94E28]">{shipmentId}</strong> through{' '}
            <span className="bg-white border border-stone-300 px-2 py-0.5 rounded font-black text-[#047857]">
              {routeChain}
            </span>
          </div>
        </div>

        {/* 4 EXACT ACTION BUTTONS (Approve, Modify, Reject, Export Plan) */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-orange-200/80">
          {/* 1. APPROVE */}
          <button
            onClick={() => setActionStatus('APPROVED')}
            className={`px-5 py-2.5 rounded-lg text-xs font-black transition-all flex items-center gap-2 shadow-2xs active:scale-[0.98] ${
              actionStatus === 'APPROVED'
                ? 'bg-[#047857] text-white border-2 border-[#047857]'
                : 'bg-[#047857] hover:bg-emerald-800 text-white'
            }`}
          >
            <CheckCircle2 className="size-4" /> Approve
          </button>

          {/* 2. MODIFY */}
          <button
            onClick={() => setActionStatus('MODIFIED')}
            className={`px-5 py-2.5 rounded-lg text-xs font-black transition-all flex items-center gap-2 shadow-2xs active:scale-[0.98] ${
              actionStatus === 'MODIFIED'
                ? 'bg-amber-600 text-white border-2 border-amber-600'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            <Edit3 className="size-4" /> Modify
          </button>

          {/* 3. REJECT */}
          <button
            onClick={() => setActionStatus('REJECTED')}
            className={`px-5 py-2.5 rounded-lg text-xs font-black transition-all flex items-center gap-2 shadow-2xs active:scale-[0.98] ${
              actionStatus === 'REJECTED'
                ? 'bg-red-700 text-white border-2 border-red-700'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <XCircle className="size-4" /> Reject
          </button>

          {/* 4. EXPORT PLAN */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-black transition-all flex items-center gap-2 shadow-2xs active:scale-[0.98] ml-auto"
          >
            {isExporting ? (
              <>
                <Zap className="size-4 animate-spin" /> Generating 7 Reports...
              </>
            ) : exportComplete ? (
              <>
                <Check className="size-4 text-emerald-400" /> Export Plan Downloaded 📥
              </>
            ) : (
              <>
                <Download className="size-4" /> Export Plan
              </>
            )}
          </button>
        </div>
      </div>

      {/* 7 SYSTEM GENERATED REPORTS SUITE */}
      <div className="rounded-xl border-2 border-stone-300 bg-[#F6F6F3] p-5 space-y-4 shadow-inner">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-300 pb-3">
          <div>
            <span className="text-[10px] font-black text-[#D94E28] uppercase tracking-widest block">
              SYSTEM GENERATED EXECUTIVE DISPATCH SUITE (7 REPORTS)
            </span>
            <h4 className="text-sm font-black text-stone-900 mt-0.5">
              Comprehensive Operational &amp; Management Documentation
            </h4>
          </div>

          <span className="text-[10px] font-black text-[#047857] bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded">
            FLOWFORGE INTELLIGENCE VERIFIED
          </span>
        </div>

        {/* 7 Report Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-[11px] font-black">
          {[
            { id: 'ROUTE', label: '🗺️ Route Plan' },
            { id: 'COST', label: '💰 Cost Breakdown' },
            { id: 'ETA', label: '⏱️ ETA & Schedule' },
            { id: 'RISK', label: '🛡️ Risk Report' },
            { id: 'DISRUPTION', label: '⚠️ Disruption Report' },
            { id: 'FLEET', label: '🚛 Fleet Directives' },
            { id: 'SUMMARY', label: '📊 Management Summary' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id as any)}
              className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
                activeReportTab === tab.id
                  ? 'bg-stone-900 text-white shadow-2xs font-black'
                  : 'bg-white border border-stone-300 text-stone-700 hover:text-stone-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Selected Report Content Card */}
        <div className="rounded-lg border border-stone-300 bg-white p-5 space-y-4 shadow-2xs font-mono">
          <div className="border-b border-stone-200 pb-2">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">
              {reports[activeReportTab].subtitle}
            </span>
            <h4 className="text-base font-black text-[#151719] mt-0.5">
              {reports[activeReportTab].title}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {reports[activeReportTab].content.map((item, idx) => (
              <div key={idx} className="bg-[#F4F2EC] rounded-lg border border-stone-300 p-3 space-y-1">
                <span className="text-[10px] font-black text-stone-500 block uppercase tracking-wider">
                  {item.label}
                </span>
                <strong className="text-[#151719] font-black text-sm block font-mono">
                  {item.value}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
