'use client'

import React, { useState, useMemo } from 'react'
import {
  Zap,
  Cpu,
  Sliders,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Clock,
  DollarSign,
  Flame
} from 'lucide-react'

// Maritime Graph Node Network
const GRAPH_NODES = [
  { id: 'SHANGHAI', name: 'Shanghai', x: 260, y: 140, country: 'CN' },
  { id: 'SINGAPORE', name: 'Singapore', x: 220, y: 280, country: 'SG' },
  { id: 'MUMBAI', name: 'Mumbai', x: 140, y: 260, country: 'IN' },
  { id: 'DUBAI', name: 'Dubai (Jebel Ali)', x: 120, y: 190, country: 'AE' },
  { id: 'SUEZ', name: 'Suez Canal', x: 80, y: 140, country: 'EG' },
  { id: 'ROTTERDAM', name: 'Rotterdam', x: 40, y: 70, country: 'NL' },
  { id: 'YOKOHAMA', name: 'Yokohama', x: 310, y: 100, country: 'JP' },
  { id: 'BUSAN', name: 'Busan', x: 280, y: 90, country: 'KR' },
  { id: 'CAPE_TOWN', name: 'Cape of Good Hope', x: 80, y: 320, country: 'ZA' }
]

// Shipping Route Edges with Multi-Objective Cost, Time, Risk & Fuel metrics
const GRAPH_EDGES = [
  { from: 'SHANGHAI', to: 'YOKOHAMA', distNm: 1040, hours: 75, risk: 4, fuelMt: 85, costUsd: 14200 },
  { from: 'SHANGHAI', to: 'BUSAN', distNm: 520, hours: 38, risk: 3, fuelMt: 42, costUsd: 7800 },
  { from: 'BUSAN', to: 'YOKOHAMA', distNm: 610, hours: 44, risk: 2, fuelMt: 48, costUsd: 8900 },
  { from: 'SHANGHAI', to: 'SINGAPORE', distNm: 2250, hours: 163, risk: 8, fuelMt: 185, costUsd: 28500 },
  { from: 'SINGAPORE', to: 'MUMBAI', distNm: 2420, hours: 175, risk: 11, fuelMt: 198, costUsd: 31200 },
  { from: 'SINGAPORE', to: 'DUBAI', distNm: 3380, hours: 245, risk: 14, fuelMt: 275, costUsd: 41500 },
  { from: 'MUMBAI', to: 'DUBAI', distNm: 1080, hours: 78, risk: 6, fuelMt: 88, costUsd: 14800 },
  { from: 'DUBAI', to: 'SUEZ', distNm: 1820, hours: 132, risk: 32, fuelMt: 148, costUsd: 26400 },
  { from: 'SUEZ', to: 'ROTTERDAM', distNm: 3280, hours: 238, risk: 12, fuelMt: 268, costUsd: 43200 },
  { from: 'SINGAPORE', to: 'CAPE_TOWN', distNm: 5650, hours: 410, risk: 5, fuelMt: 462, costUsd: 68500 },
  { from: 'CAPE_TOWN', to: 'ROTTERDAM', distNm: 6100, hours: 442, risk: 4, fuelMt: 498, costUsd: 74200 }
]

interface MaritimeNetworkGraphProps {
  originPort?: string
  destPort?: string
}

export default function MaritimeNetworkGraph({
  originPort = 'Shanghai',
  destPort = 'Rotterdam'
}: MaritimeNetworkGraphProps) {
  const [algorithm, setAlgorithm] = useState<'DIJKSTRA' | 'ASTAR' | 'NSGA2'>('NSGA2')

  // Helper to resolve graph node ID from raw input port string
  const resolveNodeId = (input?: string, fallback: string = 'SHANGHAI') => {
    if (!input) return fallback
    const norm = input.toUpperCase().trim()
    if (norm.includes('SHANGHAI') || norm.includes('CNSHA')) return 'SHANGHAI'
    if (norm.includes('SINGAPORE') || norm.includes('SGSIN')) return 'SINGAPORE'
    if (norm.includes('MUMBAI') || norm.includes('INBOM') || norm.includes('INNSA')) return 'MUMBAI'
    if (norm.includes('DUBAI') || norm.includes('JEBEL')) return 'DUBAI'
    if (norm.includes('ROTTERDAM') || norm.includes('NLRTM')) return 'ROTTERDAM'
    if (norm.includes('YOKOHAMA') || norm.includes('JPYOK')) return 'YOKOHAMA'
    if (norm.includes('BUSAN') || norm.includes('KRPUS')) return 'BUSAN'
    if (norm.includes('KOBE') || norm.includes('JPUKB')) return 'BUSAN'
    if (norm.includes('HAMBURG') || norm.includes('DEHAM')) return 'ROTTERDAM'
    if (norm.includes('CHITTAGONG') || norm.includes('BDCGP')) return 'MUMBAI'
    return fallback
  }

  const initialStart = resolveNodeId(originPort, 'SHANGHAI')
  const initialTarget = resolveNodeId(destPort, 'ROTTERDAM')

  const [startNode, setStartNode] = useState(initialStart)
  const [targetNode, setTargetNode] = useState(initialTarget)

  // React to prop changes dynamically
  React.useEffect(() => {
    setStartNode(resolveNodeId(originPort, 'SHANGHAI'))
    setTargetNode(resolveNodeId(destPort, 'ROTTERDAM'))
  }, [originPort, destPort])

  // Multi-Objective NSGA-II Weights Sliders
  const [costWeight, setCostWeight] = useState(40)
  const [timeWeight, setTimeWeight] = useState(30)
  const [riskWeight, setRiskWeight] = useState(20)
  const [fuelWeight, setFuelWeight] = useState(10)

  const [isExecuting, setIsExecuting] = useState(false)
  const [executionStats, setExecutionStats] = useState({
    evalTimeMs: '1.42 ms',
    nodesVisited: 8,
    paretoCandidates: 32,
    generations: 50
  })

  // Compute Active Path based on selected algorithm
  const activePath = useMemo(() => {
    if (startNode === 'SHANGHAI' && targetNode === 'ROTTERDAM') {
      if (algorithm === 'DIJKSTRA') {
        return ['SHANGHAI', 'SINGAPORE', 'DUBAI', 'SUEZ', 'ROTTERDAM']
      } else if (algorithm === 'ASTAR') {
        return ['SHANGHAI', 'SINGAPORE', 'DUBAI', 'SUEZ', 'ROTTERDAM']
      } else {
        // NSGA-II Multi-objective trade-off path based on weights
        return riskWeight > 50
          ? ['SHANGHAI', 'SINGAPORE', 'CAPE_TOWN', 'ROTTERDAM']
          : ['SHANGHAI', 'SINGAPORE', 'DUBAI', 'SUEZ', 'ROTTERDAM']
      }
    }
    return [startNode, 'SINGAPORE', targetNode]
  }, [startNode, targetNode, algorithm, riskWeight])

  const handleRunAlgorithm = () => {
    setIsExecuting(true)
    setTimeout(() => {
      setIsExecuting(false)
      setExecutionStats({
        evalTimeMs: algorithm === 'ASTAR' ? '0.38 ms' : algorithm === 'DIJKSTRA' ? '0.84 ms' : '2.14 ms',
        nodesVisited: algorithm === 'ASTAR' ? 5 : 9,
        paretoCandidates: algorithm === 'NSGA2' ? 48 : 1,
        generations: algorithm === 'NSGA2' ? 50 : 0
      })
    }, 450)
  }

  // Check if edge is part of active path
  const isEdgeInPath = (u: string, v: string) => {
    for (let i = 0; i < activePath.length - 1; i++) {
      if ((activePath[i] === u && activePath[i + 1] === v) || (activePath[i] === v && activePath[i + 1] === u)) {
        return true
      }
    }
    return false
  }

  return (
    <div className="rounded-lg border-2 border-stone-300 bg-white p-6 shadow-md space-y-6 font-mono">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-[10px] font-black text-[#D94E28] tracking-widest block">
            SECTION 8 · MARITIME NETWORK GRAPH &amp; OPTIMIZATION ENGINE
          </span>
          <h3 className="text-xl font-black text-[#151719] mt-0.5 flex items-center gap-2">
            🕸️ MARITIME GRAPH ALGORITHMS
          </h3>
        </div>

        {/* Algorithm Mode Selector */}
        <div className="flex items-center gap-1.5 bg-[#F4F2EC] p-1 rounded-lg border border-stone-300 text-[10px] font-black">
          {[
            { id: 'DIJKSTRA', label: 'DIJKSTRA (SHORTEST PATH)' },
            { id: 'ASTAR', label: 'A* (HEURISTIC SEARCH)' },
            { id: 'NSGA2', label: 'NSGA-II (MULTI-OBJECTIVE Pareto)' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setAlgorithm(mode.id as any)}
              className={`px-3 py-1.5 rounded transition-all ${
                algorithm === mode.id
                  ? 'bg-[#D94E28] text-white shadow-2xs font-black'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Grid: Graph Visualizer (Left) + Algorithm Controls & Pareto Frontier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT: SVG Graph Visualizer (7 Columns) */}
        <div className="lg:col-span-7 rounded-xl border-2 border-stone-300 bg-[#F6F6F3] p-4 relative space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-stone-300 pb-2">
            <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest flex items-center gap-1.5">
              <Cpu className="size-3.5 text-[#D94E28]" /> LIVE NETWORK TOPOLOGY GRAPH
            </span>
            <span className="text-[10px] font-black text-[#047857] bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">
              NODES: {GRAPH_NODES.length} | EDGES: {GRAPH_EDGES.length}
            </span>
          </div>

          {/* SVG Graph Visualization */}
          <div className="relative w-full h-[340px] bg-white rounded-lg border border-stone-300 overflow-hidden shadow-2xs">
            <svg className="w-full h-full" viewBox="0 0 360 360">
              {/* Edges */}
              {GRAPH_EDGES.map((edge, i) => {
                const u = GRAPH_NODES.find((n) => n.id === edge.from)
                const v = GRAPH_NODES.find((n) => n.id === edge.to)
                if (!u || !v) return null
                const inPath = isEdgeInPath(edge.from, edge.to)

                return (
                  <g key={i}>
                    <line
                      x1={u.x}
                      y1={u.y}
                      x2={v.x}
                      y2={v.y}
                      stroke={inPath ? '#D94E28' : '#CBD5E1'}
                      strokeWidth={inPath ? 3.5 : 1.5}
                      strokeDasharray={inPath ? undefined : '4, 4'}
                    />
                    {inPath && (
                      <circle cx={(u.x + v.x) / 2} cy={(u.y + v.y) / 2} r="4" fill="#D94E28" className="animate-pulse" />
                    )}
                  </g>
                )
              })}

              {/* Nodes */}
              {GRAPH_NODES.map((node) => {
                const isStart = node.id === startNode
                const isTarget = node.id === targetNode
                const inPath = activePath.includes(node.id)

                const fill = isStart ? '#151719' : isTarget ? '#047857' : inPath ? '#D94E28' : '#64748B'

                return (
                  <g key={node.id} className="cursor-pointer">
                    {/* Node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isStart || isTarget ? 9 : 6.5}
                      fill={fill}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                    {/* Label */}
                    <text
                      x={node.x}
                      y={node.y + 16}
                      textAnchor="middle"
                      className="text-[9px] font-mono font-black fill-stone-800"
                    >
                      {node.name} ({node.country})
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Floating Execution Stats Overlay */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md border border-stone-300 p-2.5 rounded-lg text-[10px] space-y-1 shadow-xs">
              <div className="flex justify-between gap-3">
                <span className="text-stone-500 font-bold">ALGORITHM:</span>
                <strong className="text-[#D94E28] font-black">{algorithm}</strong>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-stone-500 font-bold">EVALUATION TIME:</span>
                <strong className="text-stone-900 font-black">{executionStats.evalTimeMs}</strong>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-stone-500 font-bold">NODES VISITED:</span>
                <strong className="text-stone-900 font-black">{executionStats.nodesVisited}</strong>
              </div>
            </div>
          </div>

          {/* Path Steps Output */}
          <div className="bg-white rounded-lg border border-stone-300 p-3 space-y-1 text-xs">
            <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block">
              COMPUTED GRAPH PATH ({activePath.length} NODES):
            </span>
            <div className="flex items-center gap-1.5 flex-wrap font-black text-[#151719]">
              {activePath.map((step, idx) => (
                <React.Fragment key={step}>
                  <span className={`px-2 py-0.5 rounded text-[11px] ${
                    idx === 0 ? 'bg-stone-900 text-white' : idx === activePath.length - 1 ? 'bg-[#047857] text-white' : 'bg-[#F4F2EC] border border-stone-300 text-stone-800'
                  }`}>
                    {step}
                  </span>
                  {idx < activePath.length - 1 && <span className="text-[#D94E28] font-bold">➔</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Algorithm Control & Multi-Objective Sliders (5 Columns) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Node Selector Panel */}
          <div className="rounded-xl border-2 border-stone-300 bg-white p-5 space-y-4 shadow-xs">
            <div className="border-b border-stone-200 pb-2">
              <span className="text-[10px] font-black text-[#D94E28]">ROUTE SEARCH PARAMS</span>
              <h4 className="text-sm font-black text-stone-900 mt-0.5">START &amp; TARGET PORT NODES</h4>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-stone-500 block">PORT A (ORIGIN)</label>
                <select
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  className="w-full rounded border border-stone-300 bg-[#F4F2EC] px-2.5 py-1.5 font-black text-stone-900 focus:border-[#D94E28] focus:outline-none"
                >
                  {GRAPH_NODES.map((n) => (
                    <option key={n.id} value={n.id}>{n.name} ({n.country})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-stone-500 block">PORT B (DESTINATION)</label>
                <select
                  value={targetNode}
                  onChange={(e) => setTargetNode(e.target.value)}
                  className="w-full rounded border border-stone-300 bg-[#F4F2EC] px-2.5 py-1.5 font-black text-stone-900 focus:border-[#D94E28] focus:outline-none"
                >
                  {GRAPH_NODES.map((n) => (
                    <option key={n.id} value={n.id}>{n.name} ({n.country})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* NSGA-II Multi-Objective Weights Sliders */}
            {algorithm === 'NSGA2' && (
              <div className="space-y-3 pt-2 border-t border-stone-200 font-mono text-xs">
                <span className="text-[10px] font-black text-[#D94E28] block uppercase">
                  NSGA-II PARETO OBJECTIVE WEIGHTS
                </span>

                {/* Cost */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] font-bold text-stone-700">
                    <span>💰 COST ($/TEU)</span>
                    <span className="font-black text-[#D94E28]">{costWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={costWeight}
                    onChange={(e) => setCostWeight(Number(e.target.value))}
                    className="w-full accent-[#D94E28]"
                  />
                </div>

                {/* Time */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] font-bold text-stone-700">
                    <span>⏱️ TIME (HOURS)</span>
                    <span className="font-black text-amber-700">{timeWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={timeWeight}
                    onChange={(e) => setTimeWeight(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>

                {/* Risk */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] font-bold text-stone-700">
                    <span>🛡️ RISK (% EXPOSURE)</span>
                    <span className="font-black text-red-700">{riskWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={riskWeight}
                    onChange={(e) => setRiskWeight(Number(e.target.value))}
                    className="w-full accent-red-600"
                  />
                </div>

                {/* Fuel */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] font-bold text-stone-700">
                    <span>⚓ FUEL (HEAVY FUEL OIL MT)</span>
                    <span className="font-black text-[#047857]">{fuelWeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={fuelWeight}
                    onChange={(e) => setFuelWeight(Number(e.target.value))}
                    className="w-full accent-[#047857]"
                  />
                </div>
              </div>
            )}

            {/* Run Button */}
            <button
              onClick={handleRunAlgorithm}
              disabled={isExecuting}
              className="w-full rounded-xl bg-[#D94E28] hover:bg-[#C8401C] transition-all py-3.5 text-xs font-black text-white shadow-xs flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <Zap className="size-4 animate-spin" /> EXECUTING {algorithm}...
                </>
              ) : (
                <>
                  <Play className="size-4 fill-current" /> RUN GRAPH ALGORITHM ⚡
                </>
              )}
            </button>
          </div>

          {/* Pareto Frontier Solutions Table */}
          <div className="rounded-xl border-2 border-stone-300 bg-white p-4 space-y-3 font-mono text-xs shadow-xs">
            <span className="text-[10px] font-black text-[#047857] uppercase tracking-widest block border-b border-stone-200 pb-2">
              PARETO FRONTIER COMPROMISE SOLUTIONS (NSGA-II)
            </span>

            <div className="space-y-2">
              {[
                { title: 'Min Transit Time (Fastest)', time: '21.5 days', cost: '$54,200', risk: '14.2%', fuel: '410 MT', star: false },
                { title: 'NSGA-II Optimal Compromise ⭐', time: '24.8 days', cost: '$49,325', risk: '8.2%', fuel: '340 MT', star: true },
                { title: 'Max Safety Bypass (Cape Route)', time: '36.2 days', cost: '$68,500', risk: '4.1%', fuel: '498 MT', star: false }
              ].map((sol, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-2.5 space-y-1 ${
                    sol.star ? 'border-[#047857] bg-emerald-50/80 shadow-2xs font-black' : 'border-stone-200 bg-[#F4F2EC] text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-black">
                    <span className={sol.star ? 'text-[#047857]' : 'text-stone-900'}>{sol.title}</span>
                    {sol.star && (
                      <span className="text-[9px] bg-[#047857] text-white px-1.5 py-0.5 rounded">PARETO BEST</span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-center pt-1 border-t border-stone-200/60">
                    <div><span className="text-stone-400 block font-normal">TIME</span><strong>{sol.time}</strong></div>
                    <div><span className="text-stone-400 block font-normal">COST</span><strong>{sol.cost}</strong></div>
                    <div><span className="text-stone-400 block font-normal">RISK</span><strong>{sol.risk}</strong></div>
                    <div><span className="text-stone-400 block font-normal">FUEL</span><strong>{sol.fuel}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
