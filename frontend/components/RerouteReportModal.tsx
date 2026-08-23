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

  // Generate HTML for dedicated printable PDF window — Tuned for crisp 2-Page Executive A4 layout
  const generatePrintableReportHTML = () => {
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })

    return `
      <!-- PAGE 1: EXECUTIVE DIRECTIVE & APPROVED ROUTE -->
      <div class="pdf-page">
        <div class="header">
          <div class="brand-badge">
            <span class="brand-title">FLOWFORGE MARITIME INTELLIGENCE</span>
            <h1 class="report-title">EXECUTIVE REROUTE RECOMMENDATION REPORT</h1>
          </div>
          <div class="meta-right">
            <div class="doc-id">DOC-ID: FF-AUD-${Math.floor(10000 + Math.random() * 90000)}</div>
            <div class="doc-date">DATE: ${timestamp}</div>
            <span class="confidential-pill">CONFIDENTIAL AUDIT</span>
          </div>
        </div>

        <!-- TELEMETRY STRIP -->
        <div class="meta-grid">
          <div class="meta-card">
            <span class="meta-label">MARITIME CORRIDOR</span>
            <span class="meta-val">${originPort} ➔ ${destPort}</span>
          </div>
          <div class="meta-card">
            <span class="meta-label">TRACKED VESSEL</span>
            <span class="meta-val">${vesselName}</span>
          </div>
          <div class="meta-card">
            <span class="meta-label">BASELINE DISTANCE</span>
            <span class="meta-val">${primaryNm.toLocaleString()} NM</span>
          </div>
          <div class="meta-card highlight">
            <span class="meta-label">RECOMMENDED DIRECTIVE</span>
            <span class="meta-val-green">APPROVED ${approvedRoute?.id === 'A' ? 'ALT-A' : 'REROUTE'} ★</span>
          </div>
        </div>

        <!-- SECTION 1: APPROVED ROUTE DETAILS -->
        <div class="section approved-section">
          <div class="section-header">
            <div class="section-heading text-emerald">
              1. EXECUTIVE SELECTION: ${approvedRoute?.label}
            </div>
            <span class="badge-approved">SELECTED FOR EXECUTION ★</span>
          </div>
          
          <div class="kpi-grid">
            <div class="kpi-card">
              <span class="kpi-label">TOTAL VOYAGE COST</span>
              <span class="kpi-val">${approvedRoute?.financialMetrics?.totalVoyageCost}</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">TRANSIT DURATION</span>
              <span class="kpi-val">${approvedRoute?.timeMetrics?.transitDays}</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">RISK PROFILE</span>
              <span class="kpi-val text-emerald">${approvedRoute?.safetyMetrics?.overallRisk}</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">FUEL & CII RATING</span>
              <span class="kpi-val">${approvedRoute?.environmentalMetrics?.fuelMt} (${approvedRoute?.environmentalMetrics?.ciiRating})</span>
            </div>
          </div>

          <div class="rationale-block">
            <div class="rationale-title text-emerald">STRATEGIC SELECTION RATIONALE (WHY WE CHOOSE THIS ROUTE):</div>
            <ul class="bullet-list">
              ${approvedRoute?.decisionReasons.whyChoose.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      <!-- PAGE 2: STANDBY/SKIP AUDIT, METRICS MATRIX & MASTER SIGN-OFF -->
      <div class="pdf-page page-break">
        <!-- SECTION 2: ALTERNATIVE PATH DISQUALIFICATION AUDIT -->
        <div class="section">
          <div class="section-title text-orange">
            2. ALTERNATIVE PATH DISQUALIFICATION & STANDBY AUDIT
          </div>

          <div class="alt-grid">
            ${reroutes.filter(r => r.id !== approvedRoute?.id).map(r => `
              <div class="alt-card">
                <div class="alt-card-header">
                  <span class="alt-name">ROUTE ${r.id}: ${r.label}</span>
                  ${r.decisionReasons.status === 'PAUSE' 
                    ? '<span class="badge-pause">⏸ ON STANDBY</span>' 
                    : '<span class="badge-skip">🚫 REJECTED</span>'}
                </div>
                <div class="alt-metrics">
                  <span>Dist: <b>${r.distance}</b></span>
                  <span>Cost: <b>${r.cost}</b></span>
                  <span>ETA: <b>${r.etaDays}</b></span>
                  <span>Risk: <b>${r.riskLevel}</b></span>
                </div>

                ${r.decisionReasons.whyPause.length > 0 ? `
                  <div class="reason-subhead text-amber">STANDBY / HOLD TRIGGERS (WHEN ON PAUSE):</div>
                  <ul class="bullet-list-sm">${r.decisionReasons.whyPause.map(p => `<li>${p}</li>`).join('')}</ul>
                ` : ''}

                ${r.decisionReasons.whySkip.length > 0 ? `
                  <div class="reason-subhead text-red">DISQUALIFICATION RATIONALE (WHY WE WON'T CHOOSE):</div>
                  <ul class="bullet-list-sm">${r.decisionReasons.whySkip.map(s => `<li>${s}</li>`).join('')}</ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- SECTION 3: MATRIX TABLE -->
        <div class="section">
          <div class="section-title">
            3. COMPREHENSIVE MARITIME METRICS MATRIX TABLE
          </div>
          <table class="matrix-table">
            <thead>
              <tr>
                <th>OPERATIONAL METRIC</th>
                <th class="text-emerald">ALT-A (DIRECT BATHYMETRIC ★)</th>
                <th class="text-amber">ALT-B (COASTAL BYPASS)</th>
                <th class="text-red">ALT-C (CAPE BYPASS)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>VOYAGE COST ($)</b></td>
                <td><b class="text-emerald">${reroutes[0]?.cost}</b></td>
                <td>${reroutes[1]?.cost || 'N/A'}</td>
                <td>${reroutes[2]?.cost || 'N/A'}</td>
              </tr>
              <tr>
                <td><b>TRANSIT DURATION</b></td>
                <td><b class="text-emerald">${reroutes[0]?.etaDays}</b></td>
                <td>${reroutes[1]?.etaDays || 'N/A'}</td>
                <td>${reroutes[2]?.etaDays || 'N/A'}</td>
              </tr>
              <tr>
                <td><b>OVERALL RISK LEVEL</b></td>
                <td><b class="text-emerald">${reroutes[0]?.risk}</b></td>
                <td>${reroutes[1]?.risk || 'N/A'}</td>
                <td>${reroutes[2]?.risk || 'N/A'}</td>
              </tr>
              <tr>
                <td><b>FUEL CONSUMPTION (MT)</b></td>
                <td><b class="text-emerald">${reroutes[0]?.environmentalMetrics?.fuelMt}</b></td>
                <td>${reroutes[1]?.environmentalMetrics?.fuelMt || 'N/A'}</td>
                <td>${reroutes[2]?.environmentalMetrics?.fuelMt || 'N/A'}</td>
              </tr>
              <tr>
                <td><b>IMO CII RATING</b></td>
                <td><b class="text-emerald">${reroutes[0]?.environmentalMetrics?.ciiRating}</b></td>
                <td>${reroutes[1]?.environmentalMetrics?.ciiRating || 'N/A'}</td>
                <td>${reroutes[2]?.environmentalMetrics?.ciiRating || 'N/A'}</td>
              </tr>
              <tr>
                <td><b>EXECUTIVE DIRECTIVE</b></td>
                <td><b class="text-emerald">APPROVED ★</b></td>
                <td><b class="text-amber">PAUSE ⏸</b></td>
                <td><b class="text-red">SKIP 🚫</b></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SECTION 4: MASTER MARINER SIGN-OFF -->
        <div class="signoff-section">
          <div class="signoff-box">
            <div class="signoff-title">FLEET OPERATIONS MASTER MARINER</div>
            <div class="signoff-line">_______________________________________</div>
            <div class="signoff-role">CAPT. OPERATIONAL DIRECTIVE MASTER</div>
          </div>
          <div class="signoff-box">
            <div class="signoff-title">CHIEF LOGISTICS OFFICER APPROVAL</div>
            <div class="signoff-line">_______________________________________</div>
            <div class="signoff-role">HEAD OF ENTERPRISE SUPPLY CHAIN RISK</div>
          </div>
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

  // Handle PDF Print Window (Clean dedicated 2-Page A4 print frame)
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
            @page {
              size: A4 portrait;
              margin: 12mm 14mm;
            }
            * {
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #1E293B;
              background: #FFFFFF;
              margin: 0;
              padding: 0;
              font-size: 11px;
              line-height: 1.45;
            }
            .pdf-page {
              width: 100%;
              position: relative;
            }
            .page-break {
              page-break-before: always !important;
              margin-top: 15px;
            }
            
            /* Header */
            .header {
              border-bottom: 2.5px solid #D94E28;
              padding-bottom: 10px;
              margin-bottom: 14px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .brand-title {
              font-size: 9px;
              font-weight: 800;
              color: #D94E28;
              letter-spacing: 1.2px;
              text-transform: uppercase;
              display: block;
              margin-bottom: 2px;
            }
            .report-title {
              font-size: 16px;
              font-weight: 900;
              color: #0F172A;
              margin: 0;
              letter-spacing: -0.2px;
            }
            .meta-right {
              text-align: right;
            }
            .doc-id {
              font-size: 9px;
              font-weight: 700;
              color: #64748B;
            }
            .doc-date {
              font-size: 10px;
              font-weight: 800;
              color: #0F172A;
            }
            .confidential-pill {
              display: inline-block;
              background: #F1F5F9;
              border: 1px solid #CBD5E1;
              color: #475569;
              font-size: 8px;
              font-weight: 800;
              padding: 2px 6px;
              border-radius: 3px;
              margin-top: 3px;
            }

            /* Telemetry Strip */
            .meta-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 8px;
              background: #F8FAFC;
              border: 1px solid #E2E8F0;
              padding: 10px 12px;
              border-radius: 6px;
              margin-bottom: 14px;
            }
            .meta-card {
              display: flex;
              flex-direction: column;
            }
            .meta-label {
              font-size: 8px;
              font-weight: 800;
              color: #64748B;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .meta-val {
              font-size: 11px;
              font-weight: 800;
              color: #0F172A;
              margin-top: 2px;
            }
            .meta-val-green {
              font-size: 11px;
              font-weight: 900;
              color: #047857;
              margin-top: 2px;
            }

            /* Section Styling */
            .section {
              border: 1px solid #E2E8F0;
              border-radius: 6px;
              padding: 12px 14px;
              margin-bottom: 14px;
              background: #FFFFFF;
            }
            .approved-section {
              border: 1.5px solid #10B981;
              background: #F0FDF4;
            }
            .section-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
              border-bottom: 1px solid #CBD5E1;
              padding-bottom: 6px;
            }
            .section-heading {
              font-size: 12px;
              font-weight: 900;
              text-transform: uppercase;
            }
            .section-title {
              font-size: 11px;
              font-weight: 900;
              text-transform: uppercase;
              margin-bottom: 8px;
              border-bottom: 1px solid #E2E8F0;
              padding-bottom: 5px;
              color: #0F172A;
            }

            /* Badges */
            .badge-approved {
              background: #047857;
              color: #FFFFFF;
              font-size: 9px;
              font-weight: 800;
              padding: 3px 8px;
              border-radius: 4px;
            }
            .badge-pause {
              background: #FEF3C7;
              border: 1px solid #F59E0B;
              color: #78350F;
              font-size: 8px;
              font-weight: 800;
              padding: 2px 6px;
              border-radius: 3px;
            }
            .badge-skip {
              background: #FEE2E2;
              border: 1px solid #EF4444;
              color: #7F1D1D;
              font-size: 8px;
              font-weight: 800;
              padding: 2px 6px;
              border-radius: 3px;
            }

            /* KPI Cards Grid */
            .kpi-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 8px;
              margin-bottom: 10px;
            }
            .kpi-card {
              background: #FFFFFF;
              border: 1px solid #CBD5E1;
              border-radius: 5px;
              padding: 6px 8px;
            }
            .kpi-label {
              font-size: 8px;
              font-weight: 700;
              color: #64748B;
              display: block;
            }
            .kpi-val {
              font-size: 11px;
              font-weight: 900;
              color: #0F172A;
            }

            /* Text Helpers */
            .text-emerald { color: #047857 !important; }
            .text-amber { color: #B45309 !important; }
            .text-red { color: #B91C1C !important; }
            .text-orange { color: #D94E28 !important; }

            .rationale-block {
              margin-top: 8px;
            }
            .rationale-title {
              font-size: 9px;
              font-weight: 800;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .bullet-list {
              margin: 0;
              padding-left: 16px;
              font-size: 10.5px;
              font-weight: 600;
              color: #1E293B;
            }
            .bullet-list li {
              margin-bottom: 3px;
            }
            .bullet-list-sm {
              margin: 2px 0 0 0;
              padding-left: 14px;
              font-size: 9.5px;
              font-weight: 600;
              color: #334155;
            }
            .bullet-list-sm li {
              margin-bottom: 2px;
            }

            /* Alt Cards Grid */
            .alt-grid {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .alt-card {
              background: #F8FAFC;
              border: 1px solid #E2E8F0;
              border-radius: 5px;
              padding: 8px 10px;
            }
            .alt-card-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 4px;
            }
            .alt-name {
              font-size: 10.5px;
              font-weight: 800;
              color: #0F172A;
            }
            .alt-metrics {
              font-size: 9px;
              color: #64748B;
              display: flex;
              gap: 12px;
              margin-bottom: 4px;
              background: #FFFFFF;
              padding: 4px 6px;
              border-radius: 3px;
              border: 1px solid #E2E8F0;
            }
            .reason-subhead {
              font-size: 8.5px;
              font-weight: 800;
              text-transform: uppercase;
              margin-top: 4px;
            }

            /* Matrix Table */
            .matrix-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 4px;
            }
            .matrix-table th {
              background: #F1F5F9;
              border: 1px solid #CBD5E1;
              padding: 6px 8px;
              text-align: left;
              font-size: 9px;
              font-weight: 800;
            }
            .matrix-table td {
              border: 1px solid #E2E8F0;
              padding: 5px 8px;
              font-size: 9.5px;
              font-weight: 600;
            }

            /* Signoff */
            .signoff-section {
              margin-top: 14px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              padding-top: 10px;
            }
            .signoff-box {
              border-top: 1px dashed #94A3B8;
              padding-top: 6px;
            }
            .signoff-title {
              font-size: 9px;
              font-weight: 800;
              color: #334155;
            }
            .signoff-line {
              font-size: 9px;
              color: #94A3B8;
              margin: 12px 0 4px 0;
            }
            .signoff-role {
              font-size: 8px;
              font-weight: 700;
              color: #64748B;
            }
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

    setDownloadSuccess('Executive 2-Page PDF Document Generated!')
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
          <div className="rounded-xl border-2 border-[#047857] bg-emerald-50/70 p-5 space-y-3 shadow-xs font-sans">
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

            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-black text-emerald-900 uppercase block tracking-wider">
                STRATEGIC SELECTION RATIONALE (WHY WE CHOOSE THIS ROUTE):
              </span>
              <ul className="list-disc list-inside space-y-1 text-emerald-950 font-semibold text-xs">
                {approvedRoute.decisionReasons.whyChoose.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── SECTION 2: WHY WE WON'T / PAUSE / SKIP (OTHER ROUTES) ───── */}
          <div className="rounded-xl border-2 border-stone-300 bg-white p-5 space-y-4 shadow-2xs font-sans">
            <div className="border-b border-stone-200 pb-2">
              <span className="text-[10px] font-black text-[#D94E28] uppercase tracking-widest block font-mono">
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
                      <ul className="list-disc list-inside text-amber-950 font-medium space-y-0.5">
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
                      <ul className="list-disc list-inside text-red-950 font-medium space-y-0.5">
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
          <div className="rounded-xl border-2 border-stone-300 bg-white p-5 space-y-3 font-sans shadow-2xs">
            <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block border-b border-stone-200 pb-2 font-mono">
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
                <tbody className="divide-y divide-stone-200 font-medium">
                  <tr>
                    <td className="p-2.5 font-black text-stone-600">VOYAGE COST ($)</td>
                    <td className="p-2.5 text-[#047857] font-black">{reroutes[0]?.cost}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[1]?.cost || 'N/A'}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[2]?.cost || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-black text-stone-600">TRANSIT DURATION</td>
                    <td className="p-2.5 text-[#047857] font-black">{reroutes[0]?.etaDays}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[1]?.etaDays || 'N/A'}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[2]?.etaDays || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-black text-stone-600">OVERALL RISK LEVEL</td>
                    <td className="p-2.5 text-[#047857] font-black">{reroutes[0]?.risk}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[1]?.risk || 'N/A'}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[2]?.risk || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-black text-stone-600">FUEL CONSUMPTION</td>
                    <td className="p-2.5 text-[#047857] font-black">{reroutes[0]?.environmentalMetrics?.fuelMt}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[1]?.environmentalMetrics?.fuelMt || 'N/A'}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[2]?.environmentalMetrics?.fuelMt || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-black text-stone-600">IMO CII RATING</td>
                    <td className="p-2.5 text-[#047857] font-black">{reroutes[0]?.environmentalMetrics?.ciiRating}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[1]?.environmentalMetrics?.ciiRating || 'N/A'}</td>
                    <td className="p-2.5 text-stone-800">{reroutes[2]?.environmentalMetrics?.ciiRating || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-black text-stone-600">EXECUTIVE DIRECTIVE</td>
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
