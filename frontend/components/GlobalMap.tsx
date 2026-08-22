'use client'

import React, { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import {
  PORT_COORDS,
  SEA_NODES,
  SEA_GRAPH,
  computeDynamicReroutes,
  findPortKey
} from '@/lib/routeEngine'

// Calculate vessel position and heading along waypoint path
function getInterpolatedVesselPosition(waypoints: [number, number][], t: number) {
  if (!waypoints || waypoints.length < 2) return { lat: 30.63, lng: 122.07, heading: 45 }
  let total = 0
  const distances: number[] = [0]
  for (let i = 0; i < waypoints.length - 1; i++) {
    const d = Math.hypot(waypoints[i + 1][0] - waypoints[i][0], waypoints[i + 1][1] - waypoints[i][1])
    total += d
    distances.push(total)
  }
  if (total === 0) return { lat: waypoints[0][0], lng: waypoints[0][1], heading: 0 }
  const td = Math.max(0, Math.min(1, t)) * total
  let si = 0
  for (let i = 0; i < distances.length - 1; i++) {
    if (td >= distances[i] && td <= distances[i + 1]) {
      si = i
      break
    }
  }
  const u = distances[si + 1] - distances[si] > 0 ? (td - distances[si]) / (distances[si + 1] - distances[si]) : 0
  const p1 = waypoints[si]
  const p2 = waypoints[si + 1] || p1
  const lat = p1[0] + u * (p2[0] - p1[0])
  const lng = p1[1] + u * (p2[1] - p1[1])
  const dy = p2[0] - p1[0]
  const dx = (p2[1] - p1[1]) * Math.cos((lat * Math.PI) / 180)
  let heading = (Math.atan2(dx, dy) * 180) / Math.PI
  if (heading < 0) heading += 360
  return { lat, lng, heading: Math.round(heading) }
}

// ---------------------------------------------------------------------------
// Spatial Data Definitions for Environmental & Threat Layers
// ---------------------------------------------------------------------------

// 1. Ocean Weather Storm & Cyclone Zones
const WEATHER_ZONES = [
  {
    name: 'South China Sea Typhoon Risk Belt',
    center: [18.0, 116.0] as [number, number],
    radiusKm: 380,
    severity: 'Typhoon Force Sea State 8',
    details: 'Waves 6.8m · Wind 52 kts · Tropical Storm Warning',
    color: '#0284C7'
  },
  {
    name: 'North Atlantic Deep Depression',
    center: [52.0, -22.0] as [number, number],
    radiusKm: 520,
    severity: 'Severe Winter Gale',
    details: 'Waves 7.9m · Wind 58 kts · Heavy Swell',
    color: '#0369A1'
  },
  {
    name: 'Bay of Bengal Monsoon Squall Area',
    center: [15.0, 88.0] as [number, number],
    radiusKm: 320,
    severity: 'Monsoon Depression',
    details: 'Waves 4.5m · Wind 38 kts · Torrential Rain',
    color: '#0284C7'
  },
  {
    name: 'Arabian Sea High Swell Sector',
    center: [16.5, 65.0] as [number, number],
    radiusKm: 280,
    severity: 'SW Monsoon Swell',
    details: 'Waves 4.1m · Wind 32 kts',
    color: '#0369A1'
  }
]

// 2. Geopolitical Threat & Missile Defense Zones
const RISK_ZONES = [
  {
    name: 'Bab el-Mandeb & Red Sea Threat Zone',
    center: [14.5, 42.5] as [number, number],
    radiusKm: 290,
    threat: 'CRITICAL GEOPOLITICAL RISK',
    details: 'Houthi Anti-Ship Missile & UAV Strike Corridor (Exposure 88%)',
    color: '#DC2626'
  },
  {
    name: 'Strait of Hormuz Naval Surveillance Zone',
    center: [26.2, 56.2] as [number, number],
    radiusKm: 160,
    threat: 'HIGH RISK SECTOR',
    details: 'GPS Jamming, Electronic Interception & Boarding Risk',
    color: '#B91C1C'
  },
  {
    name: 'Taiwan Strait Defense Air Sector',
    center: [24.2, 119.8] as [number, number],
    radiusKm: 190,
    threat: 'EVALUATED MILITARY ZONE',
    details: 'Naval Live-Fire Exercises & Vessel Tracking Control',
    color: '#EF4444'
  }
]

// 3. Piracy Alert & Armed Skiff High Risk Areas
const PIRACY_ZONES = [
  {
    name: 'Gulf of Aden Piracy Alert Corridor',
    center: [12.8, 47.8] as [number, number],
    radiusKm: 260,
    threat: 'PIRACY ADVISORY (IMB)',
    details: 'Armed Skiff Attempted Boardings & Mother-Ship Operations',
    color: '#9333EA'
  },
  {
    name: 'Sulu-Celebes Sea Security Zone',
    center: [5.8, 121.2] as [number, number],
    radiusKm: 190,
    threat: 'MODERATE PIRACY RISK',
    details: 'Kidnap-for-Ransom & Small Craft Interception Area',
    color: '#A855F7'
  },
  {
    name: 'Gulf of Guinea Offshore Piracy Zone',
    center: [3.2, 5.2] as [number, number],
    radiusKm: 340,
    threat: 'CRITICAL PIRACY ZONE',
    details: 'Deepwater Vessel Attack & Crew Hijacking Sector',
    color: '#7E22CE'
  }
]

// 4. Global Port Congestion Metrics & Status
export const PORT_CONGESTION_DATA: Record<string, {
  status: 'Heavy' | 'Medium' | 'Normal'
  badge: string
  color: string
  waitingTime: string
  containerBacklog: string
  berthAvailability: string
  craneUtilization: string
}> = {
  'Shanghai Yangshan Port (CN)': {
    status: 'Heavy',
    badge: '🔴 Heavy Congestion',
    color: '#EF4444',
    waitingTime: '48.5 hours',
    containerBacklog: '89,500 TEU',
    berthAvailability: '96% Occupied (4% Available)',
    craneUtilization: '94% Quay Rate'
  },
  'Singapore Tuas Hub (SG)': {
    status: 'Normal',
    badge: '🟢 Normal',
    color: '#10B981',
    waitingTime: '4.2 hours',
    containerBacklog: '12,400 TEU',
    berthAvailability: '68% Occupied (32% Available)',
    craneUtilization: '74% Quay Rate'
  },
  'Port of Yokohama (JP)': {
    status: 'Normal',
    badge: '🟢 Normal',
    color: '#10B981',
    waitingTime: '2.8 hours',
    containerBacklog: '6,100 TEU',
    berthAvailability: '58% Occupied (42% Available)',
    craneUtilization: '65% Quay Rate'
  },
  'Port of Kobe (JP)': {
    status: 'Normal',
    badge: '🟢 Normal',
    color: '#10B981',
    waitingTime: '3.1 hours',
    containerBacklog: '7,800 TEU',
    berthAvailability: '62% Occupied (38% Available)',
    craneUtilization: '68% Quay Rate'
  },
  'Jebel Ali Port (AE)': {
    status: 'Medium',
    badge: '🟡 Medium',
    color: '#F59E0B',
    waitingTime: '18.4 hours',
    containerBacklog: '34,200 TEU',
    berthAvailability: '84% Occupied (16% Available)',
    craneUtilization: '82% Quay Rate'
  },
  'Rotterdam Gateway (NL)': {
    status: 'Medium',
    badge: '🟡 Medium',
    color: '#F59E0B',
    waitingTime: '22.1 hours',
    containerBacklog: '41,800 TEU',
    berthAvailability: '87% Occupied (13% Available)',
    craneUtilization: '85% Quay Rate'
  },
  'Jawaharlal Nehru Port (Mumbai, IN)': {
    status: 'Heavy',
    badge: '🔴 Heavy Congestion',
    color: '#EF4444',
    waitingTime: '52.0 hours',
    containerBacklog: '64,100 TEU',
    berthAvailability: '94% Occupied (6% Available)',
    craneUtilization: '91% Quay Rate'
  },
  'Port of Chittagong (BD)': {
    status: 'Heavy',
    badge: '🔴 Heavy Congestion',
    color: '#EF4444',
    waitingTime: '68.5 hours',
    containerBacklog: '48,200 TEU',
    berthAvailability: '98% Occupied (2% Available)',
    craneUtilization: '96% Quay Rate'
  },
  'Busan New Port (KR)': {
    status: 'Medium',
    badge: '🟡 Medium',
    color: '#F59E0B',
    waitingTime: '16.8 hours',
    containerBacklog: '28,900 TEU',
    berthAvailability: '79% Occupied (21% Available)',
    craneUtilization: '78% Quay Rate'
  },
  'Port of Hamburg (DE)': {
    status: 'Normal',
    badge: '🟢 Normal',
    color: '#10B981',
    waitingTime: '5.6 hours',
    containerBacklog: '14,300 TEU',
    berthAvailability: '71% Occupied (29% Available)',
    craneUtilization: '72% Quay Rate'
  }
}

// 5. Port Anchorage Congestion Heat Areas
const CONGESTION_ZONES = [
  {
    name: 'Singapore Outer Anchorage Congestion',
    center: [1.20, 103.95] as [number, number],
    radiusKm: 90,
    status: 'HIGH ANCHORAGE DENSITY',
    details: '118 Container Vessels Anchored · 38.4h Average Waiting Time',
    color: '#D97706'
  },
  {
    name: 'Ningbo-Zhoushan Anchorage Overflow',
    center: [29.80, 122.35] as [number, number],
    radiusKm: 110,
    status: 'CONGESTED ANCHORAGE',
    details: '94 Vessels Waiting · Berth Delays +44h',
    color: '#F59E0B'
  },
  {
    name: 'Rotterdam Maasvlakte Roads',
    center: [52.05, 3.85] as [number, number],
    radiusKm: 75,
    status: 'MODERATE QUEUE',
    details: '36 Vessels Pending Entry Clearance',
    color: '#D97706'
  },
  {
    name: 'Jebel Ali Anchorage Sector',
    center: [25.15, 54.85] as [number, number],
    radiusKm: 65,
    status: 'MODERATE ANCHORAGE CONGESTION',
    details: '24 Container Vessels Waiting',
    color: '#F59E0B'
  }
]

export type RouteDetail = {
  id: string
  name: string
  vessel: string
  originName: string
  hubName: string
  destName: string
  originCoords: [number, number]
  hubCoords: [number, number]
  destCoords: [number, number]
  waypoints: [number, number][]
  bypassWaypoints?: [number, number][]
  status: 'critical' | 'delayed' | 'optimal'
  speed: string
  heading: string
  eta: string
  riskFactor: number
  cargo: string
  color: string
}

interface GlobalMapProps {
  corridor?: RouteDetail
  originPort?: string
  destinationPort?: string
  activeReroute?: string
  onRerouteChange?: (id: string) => void
}

export default function GlobalMap({
  corridor: customCorridor,
  originPort,
  destinationPort,
  activeReroute = 'A',
  onRerouteChange
}: GlobalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const layerGroupRef = useRef<any>(null)

  // 9 Toggleable Map Layers State (ALL ENABLED BY DEFAULT)
  const [layers, setLayers] = useState({
    ship: true,
    recommended: true,
    alternatives: true,
    seaLanes: true,
    ports: true,
    weather: true,
    risk: true,
    piracy: true,
    congestion: true
  })

  const [panelOpen, setPanelOpen] = useState(false)

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const setAllLayers = (val: boolean) => {
    setLayers({
      ship: val,
      recommended: val,
      alternatives: val,
      seaLanes: val,
      ports: val,
      weather: val,
      risk: val,
      piracy: val,
      congestion: val
    })
  }

  // Dynamically compute primary route and all valid open-water reroute options via PostGIS A* model
  const { originKey: actualOriginKey, destKey: actualDestKey, primaryWaypoints, reroutes } = computeDynamicReroutes(
    originPort,
    destinationPort
  )

  const selectedReroute = reroutes.find((r) => r.id === activeReroute) || reroutes[0]

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return
    let mounted = true

    import('leaflet').then((L) => {
      if (!mounted || !mapContainerRef.current) return

      // Initialize Leaflet Map Instance
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [25.0, 120.0],
          zoom: 4,
          zoomControl: false,
          attributionControl: false,
          minZoom: 2,
          maxZoom: 18
        })

        // CartoDB Voyager Tile Layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd'
        }).addTo(map)

        layerGroupRef.current = L.layerGroup().addTo(map)
        mapInstanceRef.current = map
      }

      const map = mapInstanceRef.current
      const group = layerGroupRef.current
      group.clearLayers()

      const primary = primaryWaypoints

      // -----------------------------------------------------------------------
      // LAYER 1: Sea Lanes (Global Bathymetric NavMesh Network)
      // -----------------------------------------------------------------------
      if (layers.seaLanes) {
        const drawnEdges = new Set<string>()
        Object.entries(SEA_GRAPH).forEach(([sourceNode, targets]) => {
          const sourceCoords = SEA_NODES[sourceNode]
          if (!sourceCoords) return
          targets.forEach((targetNode) => {
            const targetCoords = SEA_NODES[targetNode]
            if (!targetCoords) return
            const edgeId = [sourceNode, targetNode].sort().join('----')
            if (drawnEdges.has(edgeId)) return
            drawnEdges.add(edgeId)

            L.polyline([sourceCoords, targetCoords], {
              color: '#64748B',
              weight: 1.2,
              opacity: 0.35,
              dashArray: '4, 4'
            })
              .addTo(group)
              .bindTooltip(`Sea Lane: ${sourceNode} ↔ ${targetNode}`, { permanent: false })
          })
        })
      }

      // -----------------------------------------------------------------------
      // LAYER 2: Weather Zones (Storms / Typhoons / Gales)
      // -----------------------------------------------------------------------
      if (layers.weather) {
        WEATHER_ZONES.forEach((w) => {
          L.circle(w.center, {
            radius: w.radiusKm * 1000,
            color: w.color,
            fillColor: w.color,
            fillOpacity: 0.18,
            weight: 1.5,
            dashArray: '6, 4'
          })
            .addTo(group)
            .bindTooltip(
              `<div style="font-family:monospace;font-size:11px;">
                <strong style="color:#0284C7;">⛈️ WEATHER ALERT: ${w.name}</strong><br/>
                <span>Severity: ${w.severity}</span><br/>
                <span style="color:#64748B;">${w.details}</span>
              </div>`,
              { permanent: false }
            )
        })
      }

      // -----------------------------------------------------------------------
      // LAYER 3: Geopolitical Risk Zones (Missiles / Conflicts / Jammings)
      // -----------------------------------------------------------------------
      if (layers.risk) {
        RISK_ZONES.forEach((r) => {
          L.circle(r.center, {
            radius: r.radiusKm * 1000,
            color: r.color,
            fillColor: r.color,
            fillOpacity: 0.22,
            weight: 2.0
          })
            .addTo(group)
            .bindTooltip(
              `<div style="font-family:monospace;font-size:11px;">
                <strong style="color:#DC2626;">🚨 THREAT ZONE: ${r.name}</strong><br/>
                <span style="color:#B91C1C;font-weight:bold;">${r.threat}</span><br/>
                <span>${r.details}</span>
              </div>`,
              { permanent: false }
            )
        })
      }

      // -----------------------------------------------------------------------
      // LAYER 4: Piracy Alert Zones
      // -----------------------------------------------------------------------
      if (layers.piracy) {
        PIRACY_ZONES.forEach((p) => {
          L.circle(p.center, {
            radius: p.radiusKm * 1000,
            color: p.color,
            fillColor: p.color,
            fillOpacity: 0.2,
            weight: 1.5,
            dashArray: '5, 5'
          })
            .addTo(group)
            .bindTooltip(
              `<div style="font-family:monospace;font-size:11px;">
                <strong style="color:#9333EA;">🏴‍☠️ PIRACY RISK SECTOR: ${p.name}</strong><br/>
                <span style="color:#7E22CE;font-weight:bold;">${p.threat}</span><br/>
                <span>${p.details}</span>
              </div>`,
              { permanent: false }
            )
        })
      }

      // -----------------------------------------------------------------------
      // LAYER 5: Port Anchorage Congestion Zones
      // -----------------------------------------------------------------------
      if (layers.congestion) {
        CONGESTION_ZONES.forEach((c) => {
          L.circle(c.center, {
            radius: c.radiusKm * 1000,
            color: c.color,
            fillColor: c.color,
            fillOpacity: 0.25,
            weight: 1.8
          })
            .addTo(group)
            .bindTooltip(
              `<div style="font-family:monospace;font-size:11px;">
                <strong style="color:#D97706;">⚓ CONGESTION ANCHORAGE: ${c.name}</strong><br/>
                <span style="color:#B45309;font-weight:bold;">${c.status}</span><br/>
                <span>${c.details}</span>
              </div>`,
              { permanent: false }
            )
        })
      }

      // -----------------------------------------------------------------------
      // LAYER 6: Alternative Routes (ALT-B & ALT-C)
      // -----------------------------------------------------------------------
      if (layers.alternatives) {
        reroutes.forEach((r) => {
          if (r.id === 'A') return // Handled in recommended layer
          if (!r.waypoints || r.waypoints.length < 2) return
          const isSelected = r.id === activeReroute
          const routeColor = r.id === 'B' ? '#F59E0B' : '#3B82F6'

          L.polyline(r.waypoints, {
            color: routeColor,
            weight: isSelected ? 4.5 : 2.5,
            opacity: isSelected ? 0.95 : 0.65,
            dashArray: '6, 6'
          }).addTo(group)
        })
      }

      // -----------------------------------------------------------------------
      // LAYER 7: Recommended Route (ALT-A) & Primary Disrupted Route
      // -----------------------------------------------------------------------
      if (layers.recommended) {
        // Disrupted baseline path
        if (primary.length > 1) {
          L.polyline(primary, {
            color: '#D94E28',
            weight: 2.5,
            opacity: 0.5,
            dashArray: '10, 6'
          }).addTo(group)
        }

        // Recommended ALT-A path
        const recOption = reroutes.find((r) => r.recommended) || reroutes[0]
        if (recOption && recOption.waypoints && recOption.waypoints.length > 1) {
          const isSelected = recOption.id === activeReroute
          L.polyline(recOption.waypoints, {
            color: '#10B981',
            weight: isSelected ? 4.8 : 3.5,
            opacity: 0.95
          }).addTo(group)
        }
      }

      // -----------------------------------------------------------------------
      // LAYER 8: Global Commercial Ports & Congestion Pins
      // -----------------------------------------------------------------------
      if (layers.ports) {
        Object.entries(PORT_COORDS).forEach(([portName, coords]) => {
          const isOrigin = portName === actualOriginKey
          const isDest = portName === actualDestKey

          const info = PORT_CONGESTION_DATA[portName] || {
            status: 'Normal',
            badge: '🟢 Normal',
            color: '#10B981',
            waitingTime: '4.5 hours',
            containerBacklog: '11,200 TEU',
            berthAvailability: '65% Occupied (35% Available)',
            craneUtilization: '70% Quay Rate'
          }

          const portColor = isOrigin ? '#1E293B' : isDest ? '#10B981' : info.color
          const radius = isOrigin || isDest ? 8 : info.status === 'Heavy' ? 7 : 5

          // Heavy Congestion Outer Pulsing Ring
          if (info.status === 'Heavy') {
            L.circleMarker(coords, {
              radius: 12,
              color: '#EF4444',
              fillColor: '#EF4444',
              fillOpacity: 0.25,
              weight: 1.5,
              dashArray: '3, 3'
            }).addTo(group)
          }

          const marker = L.circleMarker(coords, {
            radius: radius,
            fillColor: portColor,
            color: '#FFFFFF',
            weight: isOrigin || isDest ? 2.5 : 1.5,
            fillOpacity: 0.95
          }).addTo(group)

          marker.bindTooltip(
            `<div style="font-family:monospace;font-size:11px;padding:4px;min-width:180px;">
              <div style="font-weight:bold;color:#0F172A;font-size:12px;margin-bottom:2px;">${portName} ⚓</div>
              <div style="font-weight:bold;margin-bottom:6px;font-size:11px;color:${info.color};">${info.badge}</div>
              <div style="border-top:1px solid #E2E8F0;padding-top:4px;display:grid;gap:2px;">
                <div><span style="color:#64748B;">⏱️ Waiting Time:</span> <strong>${info.waitingTime}</strong></div>
                <div><span style="color:#64748B;">📦 Backlog:</span> <strong>${info.containerBacklog}</strong></div>
                <div><span style="color:#64748B;">⚓ Berth Occupancy:</span> <strong>${info.berthAvailability}</strong></div>
                <div><span style="color:#64748B;">🏗️ Crane Rate:</span> <strong>${info.craneUtilization}</strong></div>
              </div>
            </div>`,
            { permanent: false }
          )
        })
      }

      // -----------------------------------------------------------------------
      // LAYER 9: Ship Position (Live AIS Marker & Heading)
      // -----------------------------------------------------------------------
      if (layers.ship && primary.length > 1) {
        const pos = getInterpolatedVesselPosition(primary, 0.4)
        const vesselIcon = L.divIcon({
          className: '',
          html: `
            <div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">
              <div style="position:absolute;width:44px;height:44px;border-radius:50%;background:rgba(217,78,40,0.3);animation:ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="transform:rotate(${pos.heading}deg);width:28px;height:28px;background:#D94E28;border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.35);font-size:12px;">🚢</div>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        })

        L.marker([pos.lat, pos.lng], { icon: vesselIcon })
          .addTo(group)
          .bindTooltip(
            `<div style="font-family:monospace;font-size:11px;">
              <strong style="color:#D94E28;">🚢 FF HORIZON (IMO 984210)</strong><br/>
              <span>Speed: 18.4 kn · Heading: ${pos.heading}°</span><br/>
              <span style="color:#047857;">Live Telemetry: AIS Stream Active</span>
            </div>`,
            { permanent: false }
          )
      }

      // Auto Fit Bounds
      if (primary.length > 1) {
        const bounds = L.latLngBounds(primary)
        reroutes.forEach((r) => r.waypoints?.forEach((pt) => bounds.extend(pt)))
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 7 })
      }
    })

    return () => {
      mounted = false
    }
  }, [activeReroute, actualOriginKey, actualDestKey, primaryWaypoints, reroutes, selectedReroute, layers])

  const activeCount = Object.values(layers).filter(Boolean).length

  return (
    <div className="relative w-full h-[520px] bg-[#F6F6F3] rounded-2xl overflow-hidden shadow-xs border border-stone-300 font-sans">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Layer Control Panel (Top-Right Widget) */}
      <div className="absolute top-3 right-3 z-[1000] font-mono text-xs">
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/95 backdrop-blur-md border border-stone-300 shadow-md font-black text-stone-800 hover:bg-stone-50 transition-all"
        >
          <span>🗺️ MAP LAYERS</span>
          <span className="bg-[#D94E28] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {activeCount}/9 ACTIVE
          </span>
          <span className="text-stone-400 text-[10px]">{panelOpen ? '▲' : '▼'}</span>
        </button>

        {panelOpen && (
          <div className="mt-2 w-64 rounded-xl bg-white/95 backdrop-blur-md border border-stone-300 p-3 shadow-xl space-y-2 text-[11px] font-bold text-stone-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-black text-[#D94E28] uppercase text-[10px]">Select Map Layers</span>
              <div className="flex gap-2 text-[9px]">
                <button
                  onClick={() => setAllLayers(true)}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  ALL ON
                </button>
                <span className="text-stone-300">|</span>
                <button
                  onClick={() => setAllLayers(false)}
                  className="text-stone-500 font-bold hover:underline"
                >
                  CLEAR
                </button>
              </div>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {[
                { id: 'ship', label: 'Ship Position', icon: '🚢', tag: 'Live AIS' },
                { id: 'recommended', label: 'Recommended Route', icon: '🟢', tag: 'ALT-A' },
                { id: 'alternatives', label: 'Alternative Routes', icon: '🟡', tag: 'ALT-B / C' },
                { id: 'seaLanes', label: 'Sea Lanes', icon: '🌐', tag: 'NavMesh' },
                { id: 'ports', label: 'Ports', icon: '⚓', tag: '60+ Global' },
                { id: 'weather', label: 'Weather Zones', icon: '⛈️', tag: 'Storms' },
                { id: 'risk', label: 'Risk Zones', icon: '🚨', tag: 'Geopolitical' },
                { id: 'piracy', label: 'Pirate Zones', icon: '🏴‍☠️', tag: 'IMB Alerts' },
                { id: 'congestion', label: 'Congestion Zones', icon: '🛑', tag: 'Anchorage' }
              ].map((item) => {
                const key = item.id as keyof typeof layers
                const isChecked = layers[key]
                return (
                  <label
                    key={item.id}
                    className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
                      isChecked ? 'bg-stone-100/80 text-stone-900' : 'text-stone-400 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleLayer(key)}
                        className="rounded border-stone-300 text-[#D94E28] focus:ring-[#D94E28] size-3.5 cursor-pointer"
                      />
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[9px] font-mono text-stone-400 bg-stone-200/60 px-1.5 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Bottom Reroute Control Strip */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-t border-stone-300 px-4 py-3 flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest shrink-0">
          POSTGIS A* ROUTE SELECTOR:
        </span>
        {reroutes.map((r) => (
          <button
            key={r.id}
            onClick={() => onRerouteChange?.(r.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded border text-[11px] font-mono font-bold transition-all ${
              activeReroute === r.id
                ? r.recommended
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                  : r.id === 'B'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
                  : 'bg-blue-50 border-blue-300 text-blue-900 shadow-2xs'
                : 'bg-white border-stone-300 text-stone-600 hover:border-stone-400'
            }`}
          >
            <span
              className="size-2 rounded-full shrink-0"
              style={{
                background:
                  activeReroute === r.id
                    ? r.recommended
                      ? '#10B981'
                      : r.id === 'B'
                      ? '#F59E0B'
                      : '#3B82F6'
                    : '#94A3B8'
              }}
            />
            {r.label}
            {r.recommended && (
              <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                BEST ROI
              </span>
            )}
          </button>
        ))}

        {/* Legend */}
        <div className="ml-auto flex items-center gap-4 text-[10px] font-mono font-bold text-stone-500">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#D94E28] opacity-60" /> Disrupted Path
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-emerald-500" /> Optimal Reroute
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 border-t-2 border-dashed border-stone-400" /> PostGIS NavMesh
          </span>
        </div>
      </div>
    </div>
  )
}
