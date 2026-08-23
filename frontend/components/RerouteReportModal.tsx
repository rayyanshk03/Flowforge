'use client'

import React, { useState } from 'react'
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  DollarSign,
  ShieldCheck,
  Leaf,
  FileSpreadsheet,
  Printer,
  Sparkles
} from 'lucide-react'
import { DynamicRerouteOption } from '@/lib/routeEngine'

interface RerouteReportModalProps {
  isOpen: boolean
  onClose: () => void
  originPort: string
  destPort: string
  primaryNm: number
  reroutes: DynamicRerouteOption[]
  vesselName?: string
}

export default function RerouteReportModal({
  isOpen,
  onClose,
  originPort,
  destPort,
  primaryNm,
  reroutes,
  vesselName = 'FlowForge Pioneer (IMO 9845120)'
}: RerouteReportModalProps) {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)

  if (!isOpen) return null

  // Chosen / Approved route
  const approvedRoute = reroutes.find((r) => r.decisionReasons.status === 'APPROVE') || reroutes[0]
  const pausedRoutes = reroutes.filter((r) => r.decisionReasons.status === 'PAUSE')
  const skippedRoutes = reroutes.filter((r) => r.decisionReasons.status === 'SKIP')

  // Generate plain text / markdown report content
  const generateMarkdownContent = () => {
    const timestamp = new Date().toISOString()
    let md = `# FLOWFORGE MARITIME DECISION INTELLIGENCE REPORT\n`
    md += `Generated: ${timestamp}\n`
    md += `Corridor: ${originPort} ➔ ${destPort}\n`
    md += `Tracked Vessel: ${vesselName}\n`
    md += `Baseline Distance: ${primaryNm.toLocaleString()} nm\n\n`

    md += `---------------------------------------------------------\n`
    md += `1. EXECUTIVE SUMMARY & DECISION ACTION\n`
    md += `---------------------------------------------------------\n`
    md += `CHOSEN ROUTE: ${approvedRoute?.label}\n`
    md += `ETA: ${approvedRoute?.etaDays} | Cost: ${approvedRoute?.cost} | Risk: ${approvedRoute?.riskLevel}\n`
    md += `Rationale: Direct open-water bathymetric route offering optimal fuel efficiency (-18%) and lowest voyage cost.\n\n`

    md += `---------------------------------------------------------\n`
    md += `2. COMPARATIVE ROUTE EVALUATION MATRIX\n`
    md += `---------------------------------------------------------\n`
    reroutes.forEach((r) => {
      md += `[ROUTE ${r.id}] ${r.label}\n`
      md += `  - Decision Status: ${r.decisionReasons.status}\n`
      md += `  - Distance: ${r.distance} | ETA: ${r.etaDays}\n`
      md += `  - Voyage Cost: ${r.financialMetrics?.totalVoyageCost} | Fuel Expenses: ${r.financialMetrics?.fuelBunkeringCost}\n`
      md += `  - Overall Risk: ${r.safetyMetrics?.overallRisk} | Wave Height: ${r.safetyMetrics?.maxWaveHeight}\n`
      md += `  - Fuel: ${r.environmentalMetrics?.fuelMt} | CII Rating: ${r.environmentalMetrics?.ciiRating}\n\n`
    })

    md += `---------------------------------------------------------\n`
    md += `3. STRATEGIC RATIONALE: WHY WE CHOOSE\n`
    md += `---------------------------------------------------------\n`
    approvedRoute?.decisionReasons.whyChoose.forEach((item) => {
      md += `  ✓ ${item}\n`
    })
    md += `\n`

    md += `---------------------------------------------------------\n`
    md += `4. STRATEGIC RATIONALE: WHY WE WON'T / PAUSE / SKIP\n`
    md += `---------------------------------------------------------\n`
    reroutes.filter((r) => r.id !== approvedRoute?.id).forEach((r) => {
      md += `ROUTE ${r.id} (${r.label}) — Status: ${r.decisionReasons.status}\n`
      md += `  Why Standby / Pause:\n`
      r.decisionReasons.whyPause.forEach((p) => { md += `    - ${p}\n` })
      md += `  Why Rejection / Skip:\n`
      r.decisionReasons.whySkip.forEach((s) => { md += `    - ${s}\n` })
      md += `\n`
    })

    return md
  }

  // Handle Downloads
  const handleDownloadMarkdown = () => {
    const content = generateMarkdownContent()
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `FlowForge_Reroute_Decision_Report_${originPort}_${destPort}.md`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setDownloadSuccess('Markdown Report (.md) Downloaded!')
    setTimeout(() => setDownloadSuccess(null), 3000)
  }

  const handleDownloadJSON = () => {
    const payload = {
      reportTitle: 'FlowForge Maritime Reroute Decision Intelligence Report',
      timestamp: new Date().toISOString(),
      corridor: { originPort, destPort, primaryNm, vesselName },
      approvedRoute,
      allEvaluatedRoutes: reroutes
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `FlowForge_Reroute_Telemetry_${originPort}_${destPort}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setDownloadSuccess('Telemetry JSON Export Downloaded!')
    setTimeout(() => setDownloadSuccess(null), 3000)
  }

  const handlePrintPDF = () => {
    window.print()
    setDownloadSuccess('PDF Print Dialog Triggered!')
    setTimeout(() => setDownloadSuccess(null), 3000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto font-mono animate-in fade-in">
      <div className="bg-white border-2 border-stone-300 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-300 bg-[#F4F2EC] px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-[#D94E28]" />
            <div>
              <span className="text-[10px] font-black text-[#D94E28] uppercase tracking-widest block">
                EXECUTIVE DECISION INTELLIGENCE REPORT
              </span>
              <h2 className="text-lg font-black text-[#151719] mt-0.5">
                REROUTE RECOMMENDATION AUDIT REPORT
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-950 hover:bg-stone-200 rounded-lg transition-all"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body — Printable & Scannable Executive Report */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-800">

          {/* Download Toast Notification */}
          {downloadSuccess && (
            <div className="bg-emerald-50 border border-emerald-400 text-emerald-900 p-3 rounded-lg flex items-center gap-2 font-black text-xs">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Report Metadata Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#F4F2EC] p-3.5 rounded-lg border border-stone-300">
            <div>
              <span className="text-[9px] font-black text-stone-500 uppercase block">CORRIDOR</span>
              <strong className="text-stone-900 font-mono text-sm block">{originPort} ➔ {destPort}</strong>
            </div>
            <div>
              <span className="text-[9px] font-black text-stone-500 uppercase block">VESSEL</span>
              <strong className="text-stone-900 font-mono block">{vesselName}</strong>
            </div>
            <div>
              <span className="text-[9px] font-black text-stone-500 uppercase block">BASELINE DISTANCE</span>
              <strong className="text-stone-900 font-mono block">{primaryNm.toLocaleString()} nm</strong>
            </div>
            <div>
              <span className="text-[9px] font-black text-[#047857] uppercase block">EXECUTIVE ACTION</span>
              <strong className="text-[#047857] font-black block">APPROVED ALT-A</strong>
            </div>
          </div>

          {/* ── SECTION 1: WHY WE CHOOSE (APPROVED ROUTE) ──────────────── */}
          <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50/60 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-300 pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-[#047857]" />
                <h3 className="text-sm font-black text-emerald-950 uppercase">
                  1. WHY WE CHOOSE: {approvedRoute.label}
                </h3>
              </div>
              <span className="text-[10px] font-black text-white bg-[#047857] px-2.5 py-1 rounded">
                SELECTED FOR EXECUTION ⭐
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
              <div className="bg-white p-2 rounded border border-emerald-200">
                <span className="text-stone-400 block text-[9px]">TOTAL VOYAGE COST</span>
                <strong className="text-stone-900 font-black text-xs">{approvedRoute.financialMetrics?.totalVoyageCost}</strong>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-200">
                <span className="text-stone-400 block text-[9px]">TRANSIT TIME</span>
                <strong className="text-stone-900 font-black text-xs">{approvedRoute.timeMetrics?.transitDays}</strong>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-200">
                <span className="text-stone-400 block text-[9px]">RISK LEVEL</span>
                <strong className="text-[#047857] font-black text-xs">{approvedRoute.safetyMetrics?.overallRisk}</strong>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-200">
                <span className="text-stone-400 block text-[9px]">FUEL &amp; CII RATING</span>
                <strong className="text-stone-900 font-black text-xs">{approvedRoute.environmentalMetrics?.fuelMt} ({approvedRoute.environmentalMetrics?.ciiRating})</strong>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-black text-emerald-900 uppercase block">KEY ADVANTAGES &amp; SELECTION REASONS:</span>
              <ul className="list-disc list-inside space-y-1 text-[#151719] font-bold">
                {approvedRoute.decisionReasons.whyChoose.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── SECTION 2: WHY WE WON'T / PAUSE / SKIP (OTHER ROUTES) ───── */}
          <div className="rounded-xl border-2 border-stone-300 bg-white p-5 space-y-4 shadow-2xs">
            <div className="border-b border-stone-200 pb-2">
              <span className="text-[10px] font-black text-[#D94E28] uppercase tracking-widest block">
                2. REJECTION &amp; STANDBY AUDIT: WHY WE WON'T CHOOSE OTHER PATHS
              </span>
              <h3 className="text-sm font-black text-stone-900 mt-0.5">
                DISQUALIFICATION &amp; HOLD RATIONALE
              </h3>
            </div>

            <div className="space-y-3">
              {reroutes.filter((r) => r.id !== approvedRoute.id).map((r) => (
                <div key={r.id} className="rounded-lg border border-stone-300 p-4 space-y-2 bg-[#F6F6F3]">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-stone-900 text-sm">
                      {r.label} (ALT-{r.id})
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                      r.decisionReasons.status === 'PAUSE'
                        ? 'bg-amber-100 border border-amber-400 text-amber-900'
                        : 'bg-red-100 border border-red-400 text-red-900'
                    }`}>
                      {r.decisionReasons.status === 'PAUSE' ? '⏸️ ON STANDBY / PAUSE' : '🚫 SKIPPED / REJECTED'}
                    </span>
                  </div>

                  {/* Summary Metrics */}
                  <div className="grid grid-cols-4 gap-2 text-[10px] font-mono bg-white p-2 rounded border border-stone-200">
                    <div><span className="text-stone-400 block">COST</span><strong>{r.cost}</strong></div>
                    <div><span className="text-stone-400 block">ETA</span><strong>{r.etaDays}</strong></div>
                    <div><span className="text-stone-400 block">RISK</span><strong>{r.riskLevel}</strong></div>
                    <div><span className="text-stone-400 block">FUEL</span><strong>{r.fuelImpact}</strong></div>
                  </div>

                  {/* Why Standby */}
                  <div className="space-y-1 text-[11px]">
                    <span className="font-black text-amber-900 uppercase block text-[9px]">WHEN ON STANDBY / PAUSE:</span>
                    <ul className="list-disc list-inside text-stone-800 font-bold space-y-0.5">
                      {r.decisionReasons.whyPause.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Why Skip */}
                  <div className="space-y-1 text-[11px]">
                    <span className="font-black text-red-900 uppercase block text-[9px]">REASONS FOR REJECTION / SKIP:</span>
                    <ul className="list-disc list-inside text-stone-800 font-bold space-y-0.5">
                      {r.decisionReasons.whySkip.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 3: COMPARATIVE METRICS MATRIX TABLE ─────────────── */}
          <div className="rounded-xl border-2 border-stone-300 bg-white p-5 space-y-3 font-mono shadow-2xs">
            <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block border-b border-stone-200 pb-2">
              3. ALL POSSIBLE METRICS COMPARATIVE MATRIX
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-stone-300 bg-[#F4F2EC] text-stone-700 font-black">
                    <th className="p-2">METRIC</th>
                    <th className="p-2 text-emerald-900">ALT-A (CHOSEN ⭐)</th>
                    <th className="p-2 text-amber-900">ALT-B (COASTAL)</th>
                    <th className="p-2 text-red-900">ALT-C (CAPE BYPASS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-bold">
                  <tr>
                    <td className="p-2 font-black text-stone-500">VOYAGE COST ($)</td>
                    <td className="p-2 text-emerald-900 font-black">{reroutes[0]?.cost}</td>
                    <td className="p-2 text-stone-800">{reroutes[1]?.cost}</td>
                    <td className="p-2 text-stone-800">{reroutes[2]?.cost}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-black text-stone-500">TRANSIT DAYS</td>
                    <td className="p-2 text-emerald-900 font-black">{reroutes[0]?.etaDays}</td>
                    <td className="p-2 text-stone-800">{reroutes[1]?.etaDays}</td>
                    <td className="p-2 text-stone-800">{reroutes[2]?.etaDays}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-black text-stone-500">RISK LEVEL (%)</td>
                    <td className="p-2 text-emerald-900 font-black">{reroutes[0]?.risk}</td>
                    <td className="p-2 text-stone-800">{reroutes[1]?.risk}</td>
                    <td className="p-2 text-stone-800">{reroutes[2]?.risk}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-black text-stone-500">FUEL CONSUMPTION</td>
                    <td className="p-2 text-emerald-900 font-black">{reroutes[0]?.environmentalMetrics?.fuelMt}</td>
                    <td className="p-2 text-stone-800">{reroutes[1]?.environmentalMetrics?.fuelMt}</td>
                    <td className="p-2 text-stone-800">{reroutes[2]?.environmentalMetrics?.fuelMt}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-black text-stone-500">CII RATING</td>
                    <td className="p-2 text-emerald-900 font-black">{reroutes[0]?.environmentalMetrics?.ciiRating}</td>
                    <td className="p-2 text-stone-800">{reroutes[1]?.environmentalMetrics?.ciiRating}</td>
                    <td className="p-2 text-stone-800">{reroutes[2]?.environmentalMetrics?.ciiRating}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-black text-stone-500">DECISION STATUS</td>
                    <td className="p-2 text-emerald-900 font-black">APPROVE ⭐</td>
                    <td className="p-2 text-amber-900">PAUSE ⏸️</td>
                    <td className="p-2 text-red-900">SKIP 🚫</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer — Action Buttons for Download */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-stone-300 bg-[#F4F2EC] px-6 py-4">
          <div className="text-[11px] font-bold text-stone-600">
            DOWNLOAD EXECUTIVE DECISION REPORT:
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrintPDF}
              className="rounded bg-stone-900 hover:bg-stone-800 transition-all px-4 py-2 text-xs font-black text-white flex items-center gap-1.5 active:scale-[0.98] shadow-2xs"
            >
              <Printer className="size-3.5" /> PRINT / SAVE PDF 📄
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="rounded bg-[#D94E28] hover:bg-[#C8401C] transition-all px-4 py-2 text-xs font-black text-white flex items-center gap-1.5 active:scale-[0.98] shadow-2xs"
            >
              <Download className="size-3.5" /> DOWNLOAD .MD REPORT 📥
            </button>

            <button
              onClick={handleDownloadJSON}
              className="rounded bg-white border border-stone-300 hover:bg-stone-100 transition-all px-4 py-2 text-xs font-black text-stone-800 flex items-center gap-1.5 shadow-2xs"
            >
              <FileSpreadsheet className="size-3.5 text-[#047857]" /> EXPORT JSON DATA
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
