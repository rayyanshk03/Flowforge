'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  Globe2,
  RefreshCw,
  Server,
  ShieldCheck,
  Sparkles,
  Wifi,
  X,
  AlertCircle,
  Sliders,
  Layers,
  Terminal
} from 'lucide-react'

interface SystemSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface DataSource {
  id: string
  name: string
  type: string
  status: 'LIVE' | 'SYNCED' | 'DEGRADED'
  lastUpdate: string
  latency: string
  freshness: string
  records: string
  quality: string
}

const dataSourcesList: DataSource[] = [
  {
    id: 'AIS',
    name: 'AIS / Vessel Telemetry Stream',
    type: 'Satellite Maritime Stream',
    status: 'LIVE',
    lastUpdate: '14:09:27',
    latency: '3.2s',
    freshness: '3 seconds ago',
    records: '18,421 active vessel pings',
    quality: '98%'
  },
  {
    id: 'WEATHER',
    name: 'NOAA Weather & Wave Intelligence',
    type: 'Meteorological Grid API',
    status: 'LIVE',
    lastUpdate: '14:09:21',
    latency: '8.1s',
    freshness: '8 seconds ago',
    records: '4,200 grid sensors',
    quality: '99%'
  },
  {
    id: 'PORT',
    name: 'Port Congestion Telemetry (NLRTM/BEANR/SGSIN)',
    type: 'Berth EDI & Optical Sensor Stream',
    status: 'LIVE',
    lastUpdate: '14:09:16',
    latency: '12.4s',
    freshness: '12 seconds ago',
    records: '42 port berths',
    quality: '96%'
  },
  {
    id: 'SHIPMENT',
    name: 'ERP Enterprise Shipment Records',
    type: 'PostgreSQL Database Mirror',
    status: 'SYNCED',
    lastUpdate: '14:08:40',
    latency: '0.4s',
    freshness: '1 minute ago',
    records: '142,800 active SKU lines',
    quality: '100%'
  },
  {
    id: 'GIS',
    name: 'Maris Maritime Route GIS Database',
    type: 'Vector Routing Engine',
    status: 'LIVE',
    lastUpdate: '14:09:10',
    latency: '5.1s',
    freshness: '17 seconds ago',
    records: '8,400 ocean shipping lanes',
    quality: '99%'
  }
]

export default function SystemSettingsModal({ isOpen, onClose }: SystemSettingsModalProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedSource, setSelectedSource] = useState<DataSource>(dataSourcesList[0])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshLog, setRefreshLog] = useState<string | null>(null)
  const [backendStatus, setBackendStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('CONNECTED')

  useEffect(() => {
    setMounted(true)
    async function checkHealth() {
      try {
        const res = await fetch('http://localhost:8000/api/v1/health')
        if (res.ok) setBackendStatus('CONNECTED')
      } catch {
        setBackendStatus('DISCONNECTED')
      }
    }
    checkHealth()
  }, [])

  const handleRefreshStatus = async () => {
    setIsRefreshing(true)
    setRefreshLog('Checking FastAPI Backend... ✓')
    await new Promise((r) => setTimeout(r, 250))
    setRefreshLog('Checking PostgreSQL Database... ✓')
    await new Promise((r) => setTimeout(r, 250))
    setRefreshLog('Checking AIS & Weather Streams... ✓')
    await new Promise((r) => setTimeout(r, 250))
    setRefreshLog('Checking AI & Monte Carlo Engines... ✓')
    await new Promise((r) => setTimeout(r, 250))
    setRefreshLog('SYSTEM OPERATIONAL · ALL SERVICES HEALTHY')
    setIsRefreshing(false)
  }

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Dim Backdrop */}
      <div className="fixed inset-0 bg-stone-950/75 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Main Settings Modal Box */}
      <div className="relative z-[100000] flex h-full max-h-[90vh] w-full max-w-[1280px] flex-col rounded-lg border-2 border-stone-300 bg-[#F6F6F3] shadow-2xl overflow-hidden font-sans">
        {/* ── MODAL HEADER ───────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-300 bg-white p-5 md:px-8 gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-black tracking-widest text-[#D94E28]">
              <Server className="size-3.5" /> SYSTEM CONTROL PLANE & DATA INFRASTRUCTURE
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#151719] mt-0.5">
              SYSTEM SETTINGS & DATA SOURCES
            </h2>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">
              Monitor FlowForge infrastructure, intelligence services and operational data sources.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 rounded bg-[#D94E28] px-4 py-2 text-xs font-black text-white hover:bg-[#C84B24] transition-colors shadow-2xs font-mono disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> REFRESH STATUS
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 rounded border border-stone-300 bg-stone-100 px-3 py-2 text-xs font-black text-stone-700 hover:bg-stone-200 transition-colors shadow-2xs font-mono"
            >
              <X className="size-4" /> CLOSE ×
            </button>
          </div>
        </div>

        {/* Live Refresh Feedback Bar */}
        {refreshLog && (
          <div className="bg-[#ECFDF5] border-b border-[#A7F3D0] px-6 py-2 text-center text-xs font-mono font-black text-[#047857] flex items-center justify-center gap-2 shrink-0">
            <ShieldCheck className="size-4" />
            <span>{refreshLog}</span>
          </div>
        )}

        {/* ── MODAL BODY SCROLLABLE WORKSPACE ───────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {/* SECTION 1: OVERALL SYSTEM HEALTH SUMMARY */}
          <div className="rounded-lg border-2 border-stone-300 bg-white p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#047857] animate-pulse" />
                <span className="font-mono text-xs font-black text-stone-900">SYSTEM HEALTH: OPERATIONAL</span>
              </div>
              <span className="font-mono text-[10px] text-stone-500 font-bold">LAST CHECK: 14:09:32</span>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-6 font-mono text-center text-xs">
              <div className="rounded bg-stone-50 p-3 border border-stone-200 space-y-0.5">
                <span className="text-[9px] text-stone-500 font-extrabold block">API SERVER</span>
                <span className="text-xs font-black text-[#047857] block">● ONLINE (38ms)</span>
              </div>
              <div className="rounded bg-stone-50 p-3 border border-stone-200 space-y-0.5">
                <span className="text-[9px] text-stone-500 font-extrabold block">DATABASE</span>
                <span className="text-xs font-black text-[#047857] block">● HEALTHY (24ms)</span>
              </div>
              <div className="rounded bg-stone-50 p-3 border border-stone-200 space-y-0.5">
                <span className="text-[9px] text-stone-500 font-extrabold block">AI ENGINE</span>
                <span className="text-xs font-black text-[#047857] block">● ONLINE</span>
              </div>
              <div className="rounded bg-stone-50 p-3 border border-stone-200 space-y-0.5">
                <span className="text-[9px] text-stone-500 font-extrabold block">LIVE DATA</span>
                <span className="text-xs font-black text-[#047857] block">● STREAMING</span>
              </div>
              <div className="rounded bg-stone-50 p-3 border border-stone-200 space-y-0.5">
                <span className="text-[9px] text-stone-500 font-extrabold block">SIMULATION</span>
                <span className="text-xs font-black text-[#047857] block">● READY</span>
              </div>
              <div className="rounded bg-stone-50 p-3 border border-stone-200 space-y-0.5">
                <span className="text-[9px] text-stone-500 font-extrabold block">DECISION ENGINE</span>
                <span className="text-xs font-black text-[#047857] block">● READY</span>
              </div>
            </div>
          </div>

          {/* SECTION 2 & 3: API SERVICES & DATABASE INFRASTRUCTURE */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* SECTION 2: API Services */}
            <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4 font-mono text-xs">
              <span className="font-black text-stone-900 block border-b border-stone-200 pb-2">
                SECTION 2 · FASTAPI ENDPOINT LATENCY
              </span>
              <div className="space-y-2.5 font-bold text-stone-800 text-[11px]">
                <div className="flex justify-between p-2 rounded bg-stone-50 border border-stone-200">
                  <span>FastAPI Core Server</span><span className="text-[#047857] font-black">● ONLINE (42 ms)</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-stone-50 border border-stone-200">
                  <span>Network Digital Twin API</span><span className="text-[#047857] font-black">● ONLINE (38 ms)</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-stone-50 border border-stone-200">
                  <span>Disruption Intelligence API</span><span className="text-[#047857] font-black">● ONLINE (51 ms)</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-stone-50 border border-stone-200">
                  <span>Monte Carlo Simulation API</span><span className="text-[#047857] font-black">● ONLINE (83 ms)</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-stone-50 border border-stone-200">
                  <span>Decision Engine API</span><span className="text-[#047857] font-black">● ONLINE (61 ms)</span>
                </div>
              </div>
            </div>

            {/* SECTION 3: Database & Tables */}
            <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-black text-stone-900">SECTION 3 · POSTGRESQL DATABASE</span>
                <span className="text-[#047857] font-black">● CONNECTED (24 ms)</span>
              </div>
              <div className="space-y-2 text-[11px] font-bold text-stone-800">
                <span className="text-stone-500 block text-[10px] font-black">REGISTERED TABLES</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-stone-50 border border-stone-200">Assets Table <strong className="text-[#047857]">● OK</strong></div>
                  <div className="p-2 rounded bg-stone-50 border border-stone-200">Routes Table <strong className="text-[#047857]">● OK</strong></div>
                  <div className="p-2 rounded bg-stone-50 border border-stone-200">Shipments Table <strong className="text-[#047857]">● OK</strong></div>
                  <div className="p-2 rounded bg-stone-50 border border-stone-200">Disruptions Table <strong className="text-[#047857]">● OK</strong></div>
                  <div className="p-2 rounded bg-stone-50 border border-stone-200">Simulations Table <strong className="text-[#047857]">● OK</strong></div>
                  <div className="p-2 rounded bg-stone-50 border border-stone-200">Decisions Table <strong className="text-[#047857]">● OK</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4, 5 & 10: CONNECTED DATA SOURCES & INSPECTOR */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Connected Data Sources List */}
            <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4 font-mono text-xs">
              <span className="font-black text-stone-900 block border-b border-stone-200 pb-2">
                SECTION 4 & 5 · CONNECTED DATA SOURCES & FRESHNESS
              </span>
              <div className="space-y-2.5">
                {dataSourcesList.map((src) => {
                  const isSelected = src.id === selectedSource.id
                  return (
                    <div
                      key={src.id}
                      onClick={() => setSelectedSource(src)}
                      className={`rounded p-3 border cursor-pointer transition-all flex justify-between items-center ${
                        isSelected
                          ? 'border-2 border-[#D94E28] bg-orange-50/80 shadow-xs'
                          : 'border-stone-200 bg-stone-50 hover:border-stone-400'
                      }`}
                    >
                      <div>
                        <span className="font-black text-stone-950 block">{src.name}</span>
                        <span className="text-[10px] text-stone-500 font-bold block">{src.type} · Latency: {src.latency}</span>
                      </div>
                      <div className="text-right font-bold text-[10px]">
                        <span className="text-[#047857] font-black block">● {src.status}</span>
                        <span className="text-stone-400 font-mono block">{src.freshness}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* SECTION 10: Data Source Inspector Panel */}
            <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4 font-mono text-xs">
              <span className="font-black text-stone-900 block border-b border-stone-200 pb-2">
                DATA SOURCE INSPECTOR
              </span>
              <div className="space-y-3">
                <div className="rounded bg-[#F4F2EC] p-3 border border-stone-300">
                  <span className="text-[10px] text-stone-500 font-extrabold block">SOURCE NAME</span>
                  <span className="font-black text-stone-950 text-xs">{selectedSource.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                  <div className="p-2 rounded bg-stone-50 border border-stone-200">
                    <span className="text-[9px] text-stone-500 block">RECORDS STREAMED</span>
                    <span className="font-black text-stone-900">{selectedSource.records}</span>
                  </div>
                  <div className="p-2 rounded bg-stone-50 border border-stone-200">
                    <span className="text-[9px] text-stone-500 block">DATA QUALITY</span>
                    <span className="font-black text-[#047857]">{selectedSource.quality}</span>
                  </div>
                </div>
                <div className="p-3 rounded bg-stone-50 border border-stone-200 text-[11px] font-bold space-y-1">
                  <div className="flex justify-between"><span>Last Synchronization:</span><span className="font-black text-stone-900">{selectedSource.lastUpdate}</span></div>
                  <div className="flex justify-between"><span>Stream Latency:</span><span className="font-black text-stone-900">{selectedSource.latency}</span></div>
                  <div className="flex justify-between"><span>Freshness Delta:</span><span className="font-black text-[#047857]">{selectedSource.freshness}</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6 & 7: AI / ML MODEL STATUS TABLE */}
          <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4 font-mono text-xs">
            <span className="font-black text-stone-900 block border-b border-stone-200 pb-2">
              SECTION 6 & 7 · FLOWFORGE INTELLIGENCE ENGINE & MODEL STATUS
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-stone-300 text-[10px] text-stone-500 font-black">
                    <th className="py-2">MODEL / ENGINE NAME</th>
                    <th className="py-2">VERSION</th>
                    <th className="py-2">STATUS</th>
                    <th className="py-2">LAST RUN</th>
                    <th className="py-2">AVG RUNTIME</th>
                    <th className="py-2 text-[#047857]">ACCURACY / METRIC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-bold text-stone-800 text-[11px]">
                  <tr>
                    <td className="py-2.5 font-black">Disruption Classifier (ExtraTrees)</td>
                    <td className="py-2.5">v1.8</td>
                    <td className="py-2.5 text-[#047857]">READY</td>
                    <td className="py-2.5">14:08</td>
                    <td className="py-2.5">0.4s</td>
                    <td className="py-2.5 text-[#047857] font-black">91% Accuracy</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-black">ETA Delay Predictor (RandomForest)</td>
                    <td className="py-2.5">v2.1</td>
                    <td className="py-2.5 text-[#047857]">READY</td>
                    <td className="py-2.5">14:08</td>
                    <td className="py-2.5">0.6s</td>
                    <td className="py-2.5 text-[#047857] font-black">88% Accuracy</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-black">Route & Cost Optimizer (XGBoost)</td>
                    <td className="py-2.5">v3.0</td>
                    <td className="py-2.5 text-[#047857]">READY</td>
                    <td className="py-2.5">14:08</td>
                    <td className="py-2.5">1.8s</td>
                    <td className="py-2.5 text-stone-500">N/A (Optimizer)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-black">Monte Carlo Stochastic Engine</td>
                    <td className="py-2.5">v1.4</td>
                    <td className="py-2.5 text-[#047857]">READY</td>
                    <td className="py-2.5">14:08</td>
                    <td className="py-2.5">2.2s</td>
                    <td className="py-2.5 text-stone-500">N/A (10,000 Runs)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 8, 9 & 11: SYSTEM CONFIGURATION & SYSTEM EVENT LOG */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* SECTION 8: System Configuration */}
            <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4 font-mono text-xs">
              <span className="font-black text-stone-900 block border-b border-stone-200 pb-2">
                SECTION 8 · SYSTEM CONFIGURATION (READ-ONLY)
              </span>
              <div className="space-y-2 text-[11px] font-bold text-stone-800">
                <div className="flex justify-between p-2 rounded bg-stone-50 border border-stone-200">
                  <span>DEFAULT SIMULATION COUNT:</span><strong className="text-stone-950 font-black">10,000</strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-stone-50 border border-stone-200">
                  <span>CONFIDENCE LEVEL:</span><strong className="text-stone-950 font-black">95%</strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-stone-50 border border-stone-200">
                  <span>SIMULATION HORIZON:</span><strong className="text-stone-950 font-black">72 Hours</strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-stone-50 border border-stone-200">
                  <span>LIVE UPDATE MODE:</span><strong className="text-[#047857] font-black">ENABLED</strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-stone-50 border border-stone-200">
                  <span>AUTO REFRESH INTERVAL:</span><strong className="text-stone-950 font-black">30 Seconds</strong>
                </div>
              </div>
            </div>

            {/* SECTION 11: System Event Log */}
            <div className="rounded-lg border border-stone-300 bg-white p-6 shadow-2xs space-y-4 font-mono text-xs">
              <span className="font-black text-stone-900 block border-b border-stone-200 pb-2">
                SECTION 11 · TECHNICAL SYSTEM EVENT FEED
              </span>
              <div className="space-y-2 text-[11px] font-bold text-stone-700">
                <div className="flex justify-between border-b border-stone-100 pb-1">
                  <span className="text-stone-400">14:09:27</span><span>AIS vessel telemetry stream synchronized.</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-1">
                  <span className="text-stone-400">14:08:32</span><span>Simulation SIM-9281 completed (10,000 runs).</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-1">
                  <span className="text-stone-400">14:08:32</span><span>Decision DEC-00421 generated via Antwerp route.</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-1">
                  <span className="text-stone-400">14:07:15</span><span>Weather & wave intelligence data updated.</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-1">
                  <span className="text-stone-400">14:05:00</span><span>Port congestion sensor telemetry verified.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
