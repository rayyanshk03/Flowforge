'use client'

import React, { useState } from 'react'
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  ShieldCheck,
  Leaf,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Award,
  Anchor
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

  // Generate HTML for dedicated printable PDF window
  const generatePrintableReportHTML = () => {
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })

    return `
      <div class="header">
        <div>
          <div class="subtitle">FLOWFORGE MARITIME DECISION INTELLIGENCE</div>
          <h1 class="title">EXECUTIVE REROUTE RECOMMENDATION AUDIT REPORT</h1>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 10px; font-weight: 800; color: #78716C;">CLASSIFICATION: CONFIDENTIAL OPERATIONAL AUDIT</div>
          <div style="font-size: 11px; font-weight: 900; color: #151719;">DATE: ${timestamp}</div>
        </div>
      </div>

      <!-- VOYAGE METADATA GRID -->
      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">CORRIDOR</span>
          <span class="meta-val">${originPort} ➔ ${destPort}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">TRACKED VESSEL</span>
          <span class="meta-val">${vesselName}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">BASELINE DISTANCE</span>
          <span class="meta-val">${primaryNm.toLocaleString()} NM</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">EXECUTIVE DIRECTIVE</span>
          <span class="meta-val" style="color: #047857;">APPROVED ${approvedRoute?.id === 'A' ? 'ALT-A' : 'REROUTE'} ⭐</span>
        </div>
      </div>

      <!-- SECTION 1: WHY WE CHOOSE (APPROVED ROUTE) -->
      <div class="section section-approved">
        <span class="badge-approved">APPROVED FOR EXECUTION ⭐</span>
        <div class="section-title" style="color: #047857;">
          1. EXECUTIVE SELECTION: ${approvedRoute?.label}
        </div>
        
        <table style="margin-bottom: 12px;">
          <tr>
            <th>TOTAL VOYAGE COST</th>
            <th>TRANSIT DURATION</th>
            <th>RISK LEVEL</th>
            <th>FUEL & CII RATING</th>
          </tr>
          <tr>
            <td><b>${approvedRoute?.financialMetrics?.totalVoyageCost}</b></td>
            <td><b>${approvedRoute?.timeMetrics?.transitDays}</b></td>
            <td><b style="color: #047857;">${approvedRoute?.safetyMetrics?.overallRisk}</b></td>
            <td><b>${approvedRoute?.environmentalMetrics?.fuelMt} (${approvedRoute?.environmentalMetrics?.ciiRating})</b></td>
          </tr>
        </table>

        <div style="font-[#047857]; font-weight: 900; font-size: 11px; margin-top: 10px; margin-bottom: 4px;">
          STRATEGIC SELECTION RATIONALE (WHY WE CHOOSE THIS ROUTE):
        </div>
        <ul>
          ${approvedRoute?.decisionReasons.whyChoose.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <!-- SECTION 2: REJECTION & STANDBY AUDIT (WHY WE WON'T CHOOSE OTHER PATHS) -->
      <div class="section">
        <div class="section-title" style="color: #D94E28;">
          2. ALTERNATIVE PATH DISQUALIFICATION & STANDBY AUDIT
        </div>

        ${reroutes.filter(r => r.id !== approvedRoute?.id).map(r => `
          <div style="background: #F6F6F3; border: 1px solid #D6D3D1; border-radius: 6px; padding: 12px; margin-bottom: 12px;">
            ${r.decisionReasons.status === 'PAUSE' 
              ? '<span class="badge-pause">⏸️ PAUSED / STANDBY</span>' 
              : '<span class="badge-skip">🚫 SKIPPED / REJECTED</span>'}
            <div style="font-size: 13px; font-weight: 900; color: #151719;">
              ROUTE ${r.id}: ${r.label}
            </div>
            <div style="font-size: 10px; color: #78716C; margin-bottom: 8px;">
              Distance: ${r.distance} | Cost: ${r.cost} | ETA: ${r.etaDays} | Risk: ${r.riskLevel}
            </div>

            ${r.decisionReasons.whyPause.length > 0 ? `
              <div style="font-weight: 900; color: #78350F; font-size: 10px; margin-top: 6px;">STANDBY / HOLD TRIGGERS (WHEN ON PAUSE):</div>
              <ul>${r.decisionReasons.whyPause.map(p => `<li>${p}</li>`).join('')}</ul>
            ` : ''}

            ${r.decisionReasons.whySkip.length > 0 ? `
              <div style="font-weight: 900; color: #7F1D1D; font-size: 10px; margin-top: 6px;">DISQUALIFICATION & REJECTION RATIONALE (WHY WE WON'T CHOOSE):</div>
              <ul>${r.decisionReasons.whySkip.map(s => `<li>${s}</li>`).join('')}</ul>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- SECTION 3: COMPREHENSIVE MARITIME METRICS MATRIX TABLE -->
      <div class="section">
        <div class="section-title">
          3. COMPREHENSIVE MARITIME MULTI-METRIC MATRIX TABLE
        </div>
        <table>
          <thead>
            <tr>
              <th>OPERATIONAL METRIC</th>
              <th style="color: #047857;">ALT-A (DIRECT BATHYMETRIC ⭐)</th>
              <th style="color: #78350F;">ALT-B (COASTAL BYPASS)</th>
              <th style="color: #7F1D1D;">ALT-C (CAPE BYPASS)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>VOYAGE COST ($)</b></td>
              <td><b>${reroutes[0]?.cost}</b></td>
              <td>${reroutes[1]?.cost || 'N/A'}</td>
              <td>${reroutes[2]?.cost || 'N/A'}</td>
            </tr>
            <tr>
              <td><b>TRANSIT DAYS</b></td>
              <td><b>${reroutes[0]?.etaDays}</b></td>
              <td>${reroutes[1]?.etaDays || 'N/A'}</td>
              <td>${reroutes[2]?.etaDays || 'N/A'}</td>
            </tr>
            <tr>
              <td><b>OVERALL RISK (%)</b></td>
              <td><b style="color: #047857;">${reroutes[0]?.risk}</b></td>
              <td>${reroutes[1]?.risk || 'N/A'}</td>
              <td>${reroutes[2]?.risk || 'N/A'}</td>
            </tr>
            <tr>
              <td><b>FUEL CONSUMPTION (HFO MT)</b></td>
              <td><b>${reroutes[0]?.environmentalMetrics?.fuelMt}</b></td>
              <td>${reroutes[1]?.environmentalMetrics?.fuelMt || 'N/A'}</td>
              <td>${reroutes[2]?.environmentalMetrics?.fuelMt || 'N/A'}</td>
            </tr>
            <tr>
              <td><b>IMO CII RATING</b></td>
              <td><b style="color: #047857;">${reroutes[0]?.environmentalMetrics?.ciiRating}</b></td>
              <td>${reroutes[1]?.environmentalMetrics?.ciiRating || 'N/A'}</td>
              <td>${reroutes[2]?.environmentalMetrics?.ciiRating || 'N/A'}</td>
            </tr>
            <tr>
              <td><b>EXECUTIVE STATUS</b></td>
              <td><b style="color: #047857;">APPROVED ⭐</b></td>
              <td><b style="color: #78350F;">PAUSE ⏸️</b></td>
              <td><b style="color: #7F1D1D;">SKIP 🚫</b></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- SECTION 4: CAPTAIN & MARITIME MASTER SIGN-OFF -->
      <div class="signoff">
        <div class="signoff-box">
          MASTER MARINER / FLEET OPERATIONS SIGNATURE<br/><br/>
          ________________________________________<br/>
          CAPT. OPERATIONAL DIRECTIVE MASTER
        </div>
        <div class="signoff-box">
          CHIEF LOGISTICS OFFICER APPROVAL<br/><br/>
          ________________________________________<br/>
          HEAD OF ENTERPRISE SUPPLY CHAIN RISK
        </div>
      </div>
    `
  }

  // Generate plain text / markdown report content
  const generateMarkdownContent = () => {
    const timestamp = new Date().toISOString()
    let md = `# FLOWFORGE MARITIME DECISION INTELLIGENCE REPORT\n`
    md += `Generated: ${timestamp}\n`
    md += `Corridor: ${originPort} ➔ ${destPort}\n`
    md += `Tracked Vessel: ${vesselName}\n`
    md += `Baseline Distance: ${primaryNm.toLocaleString()} nm\n\n`

    md += `---------------------------------------------------------\n`
    md += `1. EXECUTIVE SUMMARY & DECISION DIRECTIVE\n`
    md += `---------------------------------------------------------\n`
    md += `APPROVED ROUTE: ${approvedRoute?.label}\n`
    md += `ETA: ${approvedRoute?.etaDays} | Cost: ${approvedRoute?.cost} | Risk: ${approvedRoute?.riskLevel}\n`
    md += `Selection Rationale: Direct open-water bathymetric route offering optimal fuel efficiency (-18%) and lowest voyage cost.\n\n`

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

  // Handle PDF Print Window (Clean dedicated print frame without webpage background)
  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank', 'width=950,height=1150')
    if (!printWindow) {
      window.print()
      return
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FlowForge Executive Maritime Decision Report — ${originPort} to ${destPort}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #151719; background: #FFF; padding: 20px; line-height: 1.5; font-size: 11px; }
            .header { border-bottom: 3px solid #D94E28; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            .title { font-size: 18px; font-weight: 900; color: #151719; text-transform: uppercase; margin: 0; }
            .subtitle { font-size: 10px; font-weight: 800; color: #D94E28; text-transform: uppercase; letter-spacing: 1px; }
            .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #F4F2EC; border: 1px solid #D6D3D1; padding: 12px; border-radius: 6px; margin-bottom: 20px; }
            .meta-item { display: flex; flex-direction: column; }
            .meta-label { font-size: 9px; font-weight: 800; color: #78716C; text-transform: uppercase; }
            .meta-val { font-size: 11px; font-weight: 900; color: #151719; }
            .section { border: 2px solid #E7E5E4; border-radius: 8px; padding: 16px; margin-bottom: 20px; page-break-inside: avoid; }
            .section-approved { border-color: #10B981; background: #ECFDF5; }
            .section-title { font-size: 12px; font-weight: 900; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #CBD5E1; padding-bottom: 6px; }
            .badge-approved { background: #047857; color: white; padding: 3px 8px; border-radius: 4px; font-weight: 900; font-size: 10px; float: right; }
            .badge-pause { background: #FEF3C7; border: 1px solid #F59E0B; color: #78350F; padding: 3px 8px; border-radius: 4px; font-weight: 900; font-size: 10px; float: right; }
            .badge-skip { background: #FEE2E2; border: 1px solid #EF4444; color: #7F1D1D; padding: 3px 8px; border-radius: 4px; font-weight: 900; font-size: 10px; float: right; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #F4F2EC; border: 1px solid #D6D3D1; padding: 8px; text-align: left; font-size: 10px; font-weight: 900; }
            td { border: 1px solid #E7E5E4; padding: 8px; font-size: 10px; }
            ul { margin: 6px 0; padding-left: 18px; font-weight: 700; }
            li { margin-bottom: 4px; }
            .signoff { margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; page-break-inside: avoid; border-top: 2px solid #E7E5E4; pt: 20px; }
            .signoff-box { border-top: 1px dashed #78716C; padding-top: 8px; font-size: 10px; font-weight: 800; color: #444; }
          </style>
        </head>
        <body>
          ${generatePrintableReportHTML()}
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 450)

    setDownloadSuccess('Dedicated Printable PDF Window Opened!')
    setTimeout(() => setDownloadSuccess(null), 3000)
  }

  const handleDownloadMarkdown = () => {
    const content = generateMarkdownContent()
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `FlowForge_Maritime_Executive_Report_${originPort}_${destPort}.md`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setDownloadSuccess('Markdown (.md) Executive Report Downloaded!')
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

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-stone-900/80 backdrop-blur-md p-4 overflow-y-auto font-mono animate-in fade-in">
      {/* Hide webpage background completely during print via CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #maritime-printable-report, #maritime-printable-report * {
            visibility: visible !important;
          }
          #maritime-printable-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      <div className="bg-white border-2 border-stone-300 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-stone-300 bg-[#F4F2EC] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-stone-900 text-white flex items-center justify-center font-black">
              <Anchor className="size-5 text-[#D94E28]" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#D94E28] uppercase tracking-widest block">
                FLOWFORGE MARITIME DECISION INTELLIGENCE
              </span>
              <h2 className="text-lg font-black text-[#151719] mt-0.5 uppercase">
                EXECUTIVE REROUTE RECOMMENDATION AUDIT REPORT
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-950 hover:bg-stone-200 rounded-lg transition-all"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body — Printable & Structured Executive Report */}
        <div id="maritime-printable-report" className="p-6 overflow-y-auto space-y-6 text-xs text-stone-800">

          {/* Toast Notification */}
          {downloadSuccess && (
            <div className="bg-emerald-50 border border-emerald-400 text-emerald-900 p-3 rounded-lg flex items-center gap-2 font-black text-xs">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Report Metadata Header Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#F4F2EC] p-4 rounded-lg border-2 border-stone-300 font-mono">
            <div>
              <span className="text-[9px] font-black text-stone-500 uppercase block">CORRIDOR</span>
              <strong className="text-stone-900 font-mono text-sm block">{originPort} ➔ {destPort}</strong>
            </div>
            <div>
              <span className="text-[9px] font-black text-stone-500 uppercase block">VESSEL TELEMETRY</span>
              <strong className="text-stone-900 font-mono block">{vesselName}</strong>
            </div>
            <div>
              <span className="text-[9px] font-black text-stone-500 uppercase block">BASELINE DISTANCE</span>
              <strong className="text-stone-900 font-mono block">{primaryNm.toLocaleString()} nm</strong>
            </div>
            <div>
              <span className="text-[9px] font-black text-[#047857] uppercase block">EXECUTIVE DIRECTIVE</span>
              <strong className="text-[#047857] font-black block">APPROVED ALT-A ⭐</strong>
            </div>
          </div>

          {/* ── SECTION 1: WHY WE CHOOSE (APPROVED ROUTE) ──────────────── */}
          <div className="rounded-xl border-2 border-[#047857] bg-emerald-50/70 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-emerald-300 pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-[#047857]" />
                <h3 className="text-sm font-black text-emerald-950 uppercase">
                  1. WHY WE CHOOSE: {approvedRoute.label}
                </h3>
              </div>
              <span className="text-[10px] font-black text-white bg-[#047857] px-3 py-1 rounded shadow-2xs">
                SELECTED FOR EXECUTION ⭐
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-300">
                <span className="text-stone-400 block text-[9px] font-bold">TOTAL VOYAGE COST</span>
                <strong className="text-stone-900 font-black text-xs">{approvedRoute.financialMetrics?.totalVoyageCost}</strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-300">
                <span className="text-stone-400 block text-[9px] font-bold">TRANSIT DURATION</span>
                <strong className="text-stone-900 font-black text-xs">{approvedRoute.timeMetrics?.transitDays}</strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-300">
                <span className="text-stone-400 block text-[9px] font-bold">RISK LEVEL</span>
                <strong className="text-[#047857] font-black text-xs">{approvedRoute.safetyMetrics?.overallRisk}</strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-300">
                <span className="text-stone-400 block text-[9px] font-bold">FUEL &amp; CII RATING</span>
                <strong className="text-stone-900 font-black text-xs">{approvedRoute.environmentalMetrics?.fuelMt} ({approvedRoute.environmentalMetrics?.ciiRating})</strong>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 font-mono">
              <span className="text-[10px] font-black text-emerald-900 uppercase block tracking-wider">
                STRATEGIC SELECTION RATIONALE (WHY WE CHOOSE THIS ROUTE):
              </span>
              <ul className="list-disc list-inside space-y-1 text-emerald-950 font-bold text-xs">
                {approvedRoute.decisionReasons.whyChoose.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── SECTION 2: WHY WE WON'T / PAUSE / SKIP (OTHER ROUTES) ───── */}
          <div className="rounded-xl border-2 border-stone-300 bg-white p-5 space-y-4 shadow-2xs font-mono">
            <div className="border-b border-stone-200 pb-2">
              <span className="text-[10px] font-black text-[#D94E28] uppercase tracking-widest block">
                2. ALTERNATIVE PATH DISQUALIFICATION &amp; STANDBY AUDIT
              </span>
              <h3 className="text-sm font-black text-stone-900 mt-0.5">
                WHY WE WON'T CHOOSE OTHER PATHS (HOLD &amp; REJECTION REASONS)
              </h3>
            </div>

            <div className="space-y-3">
              {reroutes.filter((r) => r.id !== approvedRoute.id).map((r) => (
                <div key={r.id} className="rounded-lg border-2 border-stone-300 p-4 space-y-2.5 bg-[#F6F6F3]">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="font-black text-stone-900 text-sm">
                      ROUTE {r.id}: {r.label}
                    </span>
                    <span className={`px-2.5 py-1 rounded text-[10px] font-black border ${
                      r.decisionReasons.status === 'PAUSE'
                        ? 'bg-amber-100 border-amber-400 text-amber-900'
                        : 'bg-red-100 border-red-400 text-red-900'
                    }`}>
                      {r.decisionReasons.status === 'PAUSE' ? '⏸️ ON STANDBY / PAUSE' : '🚫 SKIPPED / REJECTED'}
                    </span>
                  </div>

                  {/* Summary Metrics */}
                  <div className="grid grid-cols-4 gap-2 text-[10px] font-mono bg-white p-2.5 rounded-lg border border-stone-300">
                    <div><span className="text-stone-400 block font-normal">COST</span><strong>{r.cost}</strong></div>
                    <div><span className="text-stone-400 block font-normal">ETA</span><strong>{r.etaDays}</strong></div>
                    <div><span className="text-stone-400 block font-normal">RISK</span><strong>{r.riskLevel}</strong></div>
                    <div><span className="text-stone-400 block font-normal">FUEL</span><strong>{r.fuelImpact}</strong></div>
                  </div>

                  {/* Why Standby */}
                  {r.decisionReasons.whyPause.length > 0 && (
                    <div className="space-y-1 text-xs pt-1">
                      <span className="font-black text-amber-900 uppercase block text-[9px]">STANDBY / HOLD TRIGGERS (WHEN ON PAUSE):</span>
                      <ul className="list-disc list-inside text-amber-950 font-bold space-y-0.5">
                        {r.decisionReasons.whyPause.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Why Skip */}
                  {r.decisionReasons.whySkip.length > 0 && (
                    <div className="space-y-1 text-xs pt-1">
                      <span className="font-black text-red-900 uppercase block text-[9px]">DISQUALIFICATION RATIONALE (WHY WE WON'T CHOOSE):</span>
                      <ul className="list-disc list-inside text-red-950 font-bold space-y-0.5">
                        {r.decisionReasons.whySkip.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 3: COMPREHENSIVE MARITIME METRICS MATRIX TABLE ─────────────── */}
          <div className="rounded-xl border-2 border-stone-300 bg-white p-5 space-y-3 font-mono shadow-2xs">
            <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block border-b border-stone-200 pb-2">
              3. COMPREHENSIVE MARITIME MULTI-METRIC MATRIX TABLE
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-stone-300 bg-[#F4F2EC] text-stone-700 font-black">
                    <th className="p-2.5">OPERATIONAL METRIC</th>
                    <th className="p-2.5 text-[#047857]">ALT-A (DIRECT BATHYMETRIC ⭐)</th>
                    <th className="p-2.5 text-amber-900">ALT-B (COASTAL BYPASS)</th>
                    <th className="p-2.5 text-red-900">ALT-C (CAPE BYPASS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-bold">
                  <tr>
                    <td className="p-2.5 font-black text-stone-500">VOYAGE COST ($)</td>
                    <td className="p-2.5 text-[#047857] font-black">{reroutes[0]?.cost}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[1]?.cost || 'N/A'}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[2]?.cost || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-black text-stone-500">TRANSIT DURATION</td>
                    <td className="p-2.5 text-[#047857] font-black">{reroutes[0]?.etaDays}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[1]?.etaDays || 'N/A'}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[2]?.etaDays || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-black text-stone-500">OVERALL RISK LEVEL</td>
                    <td className="p-2.5 text-[#047857] font-black">{reroutes[0]?.risk}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[1]?.risk || 'N/A'}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[2]?.risk || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-black text-stone-500">FUEL CONSUMPTION</td>
                    <td className="p-2.5 text-[#047857] font-black">{reroutes[0]?.environmentalMetrics?.fuelMt}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[1]?.environmentalMetrics?.fuelMt || 'N/A'}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[2]?.environmentalMetrics?.fuelMt || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-black text-stone-500">IMO CII RATING</td>
                    <td className="p-2.5 text-[#047857] font-black">{reroutes[0]?.environmentalMetrics?.ciiRating}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[1]?.environmentalMetrics?.ciiRating || 'N/A'}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[2]?.environmentalMetrics?.ciiRating || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-black text-stone-500">EXECUTIVE STATUS</td>
                    <td className="p-2.5 text-[#047857] font-black">APPROVED ⭐</td>
                    <td className="p-2.5 text-amber-900">PAUSE ⏸️</td>
                    <td className="p-2.5 text-red-900">SKIP 🚫</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer — Action Buttons for Download */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-stone-300 bg-[#F4F2EC] px-6 py-4 font-mono">
          <div className="text-xs font-black text-stone-700">
            DOWNLOAD EXECUTIVE MARITIME REPORT:
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrintPDF}
              className="rounded-lg bg-stone-900 hover:bg-stone-800 transition-all px-4 py-2.5 text-xs font-black text-white flex items-center gap-1.5 active:scale-[0.98] shadow-2xs"
            >
              <Printer className="size-4" /> PRINT / SAVE PDF 🖨️
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="rounded-lg bg-[#D94E28] hover:bg-[#C8401C] transition-all px-4 py-2.5 text-xs font-black text-white flex items-center gap-1.5 active:scale-[0.98] shadow-2xs"
            >
              <Download className="size-4" /> DOWNLOAD .MD REPORT 📥
            </button>

            <button
              onClick={handleDownloadJSON}
              className="rounded-lg bg-white border-2 border-stone-300 hover:bg-stone-100 transition-all px-4 py-2.5 text-xs font-black text-stone-800 flex items-center gap-1.5 shadow-2xs"
            >
              <FileSpreadsheet className="size-4 text-[#047857]" /> EXPORT JSON DATA
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
