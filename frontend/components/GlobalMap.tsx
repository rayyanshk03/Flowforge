'use client'

import React, { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import {
  Navigation, Ship, ShieldCheck, AlertTriangle, CheckCircle2,
  Layers, ZoomIn, ZoomOut, RotateCcw, MapPin, Waves, Compass,
  ChevronDown, ChevronUp, X, Maximize2, Minimize2, Sparkles, Check
} from 'lucide-react'
import { resolveRoute, resolveBypassRoute } from '@/lib/routeEngine'

export interface RouteDetail {
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

const DEFAULT_NOMINAL_PATH = resolveRoute('Jawaharlal Nehru Port (Mumbai, IN)', 'Port of Yokohama (JP)')
const DEFAULT_BYPASS_PATH = resolveBypassRoute('Jawaharlal Nehru Port (Mumbai, IN)', 'Port of Yokohama (JP)', 'South China Sea / Luzon Strait')

const activeCorridor: RouteDetail = {
  id: 'COR-01',
  name: 'Shanghai Yangshan Port ➔ Port of Kobe ➔ Port of Yokohama',
  vessel: 'FF Horizon (IMO 984210)',
  originName: 'Shanghai Yangshan Port (CN)',
  hubName: 'Port of Kobe (JP)',
  destName: 'Port of Yokohama (JP)',
  originCoords: [30.63, 122.07],
  hubCoords: [34.68, 135.19],
  destCoords: [35.44, 139.64],
  waypoints: resolveRoute('Shanghai Yangshan Port (CN)', 'Port of Yokohama (JP)'),
  bypassWaypoints: resolveBypassRoute('Shanghai Yangshan Port (CN)', 'Port of Yokohama (JP)', 'Kobe Diversion'),
  status: 'critical',
  speed: '14.2 kn',
  heading: '065° ENE',
  eta: 'Aug 18, 2026 (+18h)',
  riskFactor: 22.9,
  cargo: 'High-Tech Semiconductors ($24.5M)',
  color: '#d94e28',
}

// Calculate cumulative segment distances and interpolated coordinates with heading angle
function getRoutePathStats(waypoints: [number, number][]) {
  const distances: number[] = [0]
  let total = 0
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p1 = waypoints[i]
    const p2 = waypoints[i + 1]
    const dLat = p2[0] - p1[0]
    const dLng = p2[1] - p1[1]
    const dist = Math.hypot(dLat, dLng)
    total += dist
    distances.push(total)
  }
  return { distances, total }
}

function getInterpolatedVesselPosition(waypoints: [number, number][], t: number) {
  if (!waypoints || waypoints.length === 0) return { lat: 30.63, lng: 122.07, heading: 65 }
  if (waypoints.length === 1) return { lat: waypoints[0][0], lng: waypoints[0][1], heading: 0 }

  const { distances, total } = getRoutePathStats(waypoints)
  if (total === 0) return { lat: waypoints[0][0], lng: waypoints[0][1], heading: 0 }

  const clampedT = Math.max(0, Math.min(1.0, t))
  const targetDist = clampedT * total

  let segIdx = 0
  for (let i = 0; i < distances.length - 1; i++) {
    if (targetDist >= distances[i] && targetDist <= distances[i + 1]) {
      segIdx = i
      break
    }
  }

  const segStartDist = distances[segIdx]
  const segEndDist = distances[segIdx + 1]
  const segLen = segEndDist - segStartDist
  const u = segLen > 0 ? (targetDist - segStartDist) / segLen : 0

  const p1 = waypoints[segIdx]
  const p2 = waypoints[segIdx + 1] || p1

  const lat = p1[0] + u * (p2[0] - p1[0])
  const lng = p1[1] + u * (p2[1] - p1[1])

  const dy = p2[0] - p1[0]
  const dx = (p2[1] - p1[1]) * Math.cos((lat * Math.PI) / 180)
  let angleDeg = (Math.atan2(dx, dy) * 180) / Math.PI
  if (angleDeg < 0) angleDeg += 360

  return { lat, lng, heading: Math.round(angleDeg) }
}

interface GlobalMapProps {
  corridor?: RouteDetail
  originPort?: string
  destinationPort?: string
}

export default function GlobalMap({ corridor: customCorridor, originPort, destinationPort }: GlobalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const layerGroupRef = useRef<any>(null)

  const [showBypass, setShowBypass] = useState(true)
  const [progressT, setProgressT] = useState(0.42)

  // Dynamically derive corridor
  const corridor: RouteDetail = React.useMemo(() => {
    if (customCorridor) return customCorridor

    const orig = originPort || 'Shanghai Yangshan Port (CN)'
    const dest = destinationPort || 'Port of Yokohama (JP)'
    const nominal = resolveRoute(orig, dest)
    const bypass = resolveBypassRoute(orig, dest, 'Weather Disruption')

    return {
      id: 'DYN-01',
      name: `${orig} ➔ ${dest}`,
      vessel: 'FF Horizon (IMO 984210)',
      originName: orig,
      hubName: 'Port of Kobe (JP)',
      destName: dest,
      originCoords: nominal[0] || [30.63, 122.07],
      hubCoords: [34.68, 135.19],
      destCoords: nominal[nominal.length - 1] || [35.44, 139.64],
      waypoints: nominal,
      bypassWaypoints: bypass,
      status: 'critical',
      speed: '14.2 kn',
      heading: '065° ENE',
      eta: 'Aug 18, 2026 (+18h)',
      riskFactor: 22.9,
      cargo: 'High-Tech Cargo',
      color: '#D94E28',
    }
  }, [customCorridor, originPort, destinationPort])

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return

    let isMounted = true

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [25.0, 125.0],
          zoom: 4,
          zoomControl: false,
          attributionControl: false,
          minZoom: 2,
          maxZoom: 18,
        })

        // CartoDB Voyager Map Tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map)

        layerGroupRef.current = L.layerGroup().addTo(map)
        mapInstanceRef.current = map
      }

      // Render Routes and Fit Bounds
      if (layerGroupRef.current && mapInstanceRef.current) {
        layerGroupRef.current.clearLayers()
        const map = mapInstanceRef.current
        const group = layerGroupRef.current

        // 1. Nominal Route (Solid Orange Line)
        if (corridor.waypoints.length > 1) {
          L.polyline(corridor.waypoints, {
            color: '#D94E28',
            weight: 4,
            opacity: 0.85,
          }).addTo(group)
        }

        // 2. Weather Bypass Route (Dashed Green Line)
        if (showBypass && corridor.bypassWaypoints && corridor.bypassWaypoints.length > 1) {
          L.polyline(corridor.bypassWaypoints, {
            color: '#10B981',
            weight: 3.5,
            dashArray: '8, 8',
            opacity: 0.9,
          }).addTo(group)
        }

        // 3. Port Markers
        if (corridor.originCoords) {
          const originMarker = L.circleMarker(corridor.originCoords, {
            radius: 7,
            fillColor: '#1E293B',
            color: '#FFFFFF',
            weight: 2,
            fillOpacity: 1
          }).addTo(group)
          originMarker.bindTooltip(`Origin: ${corridor.originName}`, { permanent: false })
        }

        if (corridor.destCoords) {
          const destMarker = L.circleMarker(corridor.destCoords, {
            radius: 7,
            fillColor: '#10B981',
            color: '#FFFFFF',
            weight: 2,
            fillOpacity: 1
          }).addTo(group)
          destMarker.bindTooltip(`Destination: ${corridor.destName}`, { permanent: false })
        }

        // 4. Movable Vessel Position Marker
        const pos = getInterpolatedVesselPosition(corridor.waypoints, progressT)
        const vesselIcon = L.divIcon({
          className: 'vessel-marker-pin',
          html: `
            <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
              <div style="position:absolute; width:44px; height:44px; border-radius:50%; background:rgba(217,78,40,0.25); animation:pulse 2s infinite;"></div>
              <div style="transform:rotate(${pos.heading}deg); width:28px; height:28px; background:#D94E28; border:2px solid white; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.3); color:white; font-size:12px;">
                🚢
              </div>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        })
        L.marker([pos.lat, pos.lng], { icon: vesselIcon }).addTo(group)

        // 5. Auto Fit Bounds to Entire Voyage
        if (corridor.waypoints.length > 1) {
          const bounds = L.latLngBounds(corridor.waypoints)
          if (corridor.bypassWaypoints) {
            corridor.bypassWaypoints.forEach(pt => bounds.extend(pt))
          }
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 7 })
        }
      }
    })

    return () => {
      isMounted = false
    }
  }, [corridor, showBypass, progressT])

  return (
    <div className="relative w-full h-[520px] bg-stone-900 rounded-2xl overflow-hidden shadow-lg border border-stone-300 font-sans">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating HUD Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-stone-200 shadow-md text-xs font-sans">
        <button
          onClick={() => setShowBypass(!showBypass)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            showBypass
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          {showBypass ? 'Plan B Reroute: Active' : 'Plan B Reroute: Off'}
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border border-stone-200 shadow-md text-xs font-semibold text-stone-800">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#D94E28]" />
          <span>Primary Disrupted Route</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-emerald-500" />
          <span>Alternative Bypass Corridor</span>
        </div>
      </div>
    </div>
  )
}
