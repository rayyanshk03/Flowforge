'use client'

import React, { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { ShieldCheck, CheckCircle2 } from 'lucide-react'
import { resolveRoute, resolveBypassRoute } from '@/lib/routeEngine'

// ── Singapore → Yokohama corridor config ──────────────────────────────────────
const ORIGIN_KEY  = 'Singapore Tuas Hub (SG)'
const DEST_KEY    = 'Port of Yokohama (JP)'
const ORIGIN_COORDS: [number, number] = [1.29, 103.85]
const DEST_COORDS:   [number, number] = [35.44, 139.64]

// Primary (disrupted) route
const PRIMARY_WAYPOINTS = resolveRoute(ORIGIN_KEY, DEST_KEY)

// Three reroute alternatives
const REROUTE_A = resolveBypassRoute(ORIGIN_KEY, DEST_KEY, 'South China Sea / Luzon Strait')   // via Philippines east coast
const REROUTE_B = resolveBypassRoute(ORIGIN_KEY, DEST_KEY, 'Weather Disruption')               // standard weather bypass
const REROUTE_C = resolveRoute('Singapore Tuas Hub (SG)', 'Busan New Port (KR)')               // via Busan leg partial

// Vessel position (40% along primary)
function getInterpolatedVesselPosition(waypoints: [number, number][], t: number) {
  if (!waypoints || waypoints.length < 2) return { lat: ORIGIN_COORDS[0], lng: ORIGIN_COORDS[1], heading: 45 }
  let total = 0
  const distances: number[] = [0]
  for (let i = 0; i < waypoints.length - 1; i++) {
    const d = Math.hypot(waypoints[i+1][0] - waypoints[i][0], waypoints[i+1][1] - waypoints[i][1])
    total += d; distances.push(total)
  }
  if (total === 0) return { lat: waypoints[0][0], lng: waypoints[0][1], heading: 0 }
  const td = Math.max(0, Math.min(1, t)) * total
  let si = 0
  for (let i = 0; i < distances.length - 1; i++) { if (td >= distances[i] && td <= distances[i+1]) { si = i; break } }
  const u = distances[si+1] - distances[si] > 0 ? (td - distances[si]) / (distances[si+1] - distances[si]) : 0
  const p1 = waypoints[si], p2 = waypoints[si+1] || p1
  const lat = p1[0] + u * (p2[0] - p1[0])
  const lng = p1[1] + u * (p2[1] - p1[1])
  const dy = p2[0] - p1[0]
  const dx = (p2[1] - p1[1]) * Math.cos((lat * Math.PI) / 180)
  let heading = (Math.atan2(dx, dy) * 180) / Math.PI
  if (heading < 0) heading += 360
  return { lat, lng, heading: Math.round(heading) }
}

export type RouteDetail = {
  id: string; name: string; vessel: string
  originName: string; hubName: string; destName: string
  originCoords: [number, number]; hubCoords: [number, number]; destCoords: [number, number]
  waypoints: [number, number][]; bypassWaypoints?: [number, number][]
  status: 'critical' | 'delayed' | 'optimal'
  speed: string; heading: string; eta: string; riskFactor: number; cargo: string; color: string
}

interface GlobalMapProps {
  corridor?: RouteDetail
  originPort?: string
  destinationPort?: string
  activeReroute?: string
  onRerouteChange?: (id: string) => void
}

// ── Reroute option definitions (shown in side panel) ──────────────────────────
const REROUTE_OPTIONS = [
  {
    id: 'A',
    label: 'Via Port of Kaohsiung (TW)',
    eta: '+4.1h delay',
    cost: '$14,200',
    savings: '+$4,688 vs. baseline',
    risk: '8.2%',
    recommended: true,
    color: '#10B981',
    waypoints: REROUTE_B,
  },
  {
    id: 'B',
    label: 'Via Manila Int\'l Port (PH)',
    eta: '+9.3h delay',
    cost: '$16,880',
    savings: '+$2,008 vs. baseline',
    risk: '14.7%',
    recommended: false,
    color: '#F59E0B',
    waypoints: REROUTE_A,
  },
  {
    id: 'C',
    label: 'Via Busan New Port (KR)',
    eta: '+16.2h delay',
    cost: '$19,440',
    savings: '-$1,552 vs. baseline',
    risk: '6.1%',
    recommended: false,
    color: '#6B7280',
    waypoints: REROUTE_C,
  },
]

export default function GlobalMap({ corridor: customCorridor, originPort, destinationPort, activeReroute = 'A', onRerouteChange }: GlobalMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef  = useRef<any>(null)
  const layerGroupRef   = useRef<any>(null)

  // No internal state — controlled by parent

  const origin = originPort || ORIGIN_KEY
  const dest   = destinationPort || DEST_KEY

  // Which reroute polyline to draw
  const selectedReroute = REROUTE_OPTIONS.find(r => r.id === activeReroute) || REROUTE_OPTIONS[0]

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return
    let mounted = true

    import('leaflet').then((L) => {
      if (!mounted || !mapContainerRef.current) return

      // Init map once
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [15.0, 120.0],
          zoom: 4,
          zoomControl: false,
          attributionControl: false,
          minZoom: 2,
          maxZoom: 18,
        })
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map)
        layerGroupRef.current = L.layerGroup().addTo(map)
        mapInstanceRef.current = map
      }

      const map = mapInstanceRef.current
      const group = layerGroupRef.current
      group.clearLayers()

      const primary = PRIMARY_WAYPOINTS

      // 1. Primary disrupted route — always shown as red-orange dashed
      if (primary.length > 1) {
        L.polyline(primary, {
          color: '#D94E28', weight: 2.5, opacity: 0.5, dashArray: '10, 6',
        }).addTo(group)
      }

      // 2. All 3 alternatives — dotted thin for non-selected, thick solid for selected
      REROUTE_OPTIONS.forEach(r => {
        if (!r.waypoints || r.waypoints.length < 2) return
        const isSelected = r.id === activeReroute
        const color = r.recommended ? '#10B981' : r.id === 'B' ? '#F59E0B' : '#6B7280'
        L.polyline(r.waypoints, {
          color: isSelected ? color : '#94A3B8',
          weight: isSelected ? 4 : 1.5,
          opacity: isSelected ? 0.95 : 0.35,
          dashArray: isSelected ? undefined : '5, 7',
        }).addTo(group)
      })

      // 4. Origin port marker — Singapore
      const originCoords = primary[0] || ORIGIN_COORDS
      const originMarker = L.circleMarker(originCoords, {
        radius: 8, fillColor: '#1E293B', color: '#fff', weight: 2, fillOpacity: 1
      }).addTo(group)
      originMarker.bindTooltip('Origin: Singapore Tuas Hub (SG)', { permanent: false })

      // 5. Destination port marker — Yokohama
      const destCoords = primary[primary.length - 1] || DEST_COORDS
      L.circleMarker(destCoords, {
        radius: 8, fillColor: '#10B981', color: '#fff', weight: 2, fillOpacity: 1
      }).addTo(group).bindTooltip('Destination: Port of Yokohama (JP)', { permanent: false })

      // 6. Intermediate waypoint label on selected reroute
      if (selectedReroute.waypoints.length > 4) {
        const mid = selectedReroute.waypoints[Math.floor(selectedReroute.waypoints.length / 2)]
        const color = selectedReroute.recommended ? '#10B981' : '#F59E0B'
        L.circleMarker(mid, {
          radius: 5, fillColor: color, color: '#fff', weight: 1.5, fillOpacity: 0.9
        }).addTo(group).bindTooltip(selectedReroute.label, { permanent: false })
      }

      // 7. Vessel position on primary route
      const pos = getInterpolatedVesselPosition(primary, 0.38)
      const vesselIcon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;width:40px;height:40px;border-radius:50%;background:rgba(217,78,40,0.2);animation:pulse 2s infinite;"></div>
            <div style="transform:rotate(${pos.heading}deg);width:26px;height:26px;background:#D94E28;border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:11px;">🚢</div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })
      L.marker([pos.lat, pos.lng], { icon: vesselIcon })
        .addTo(group)
        .bindTooltip('FF Horizon — 38% complete', { permanent: false })

      // 8. Fit bounds: primary + all 3 alternatives
      if (primary.length > 1) {
        const bounds = L.latLngBounds(primary)
        REROUTE_OPTIONS.forEach(r => r.waypoints.forEach(pt => bounds.extend(pt)))
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 })
      }
    })

    return () => { mounted = false }
  }, [activeReroute, origin, dest])

  return (
    <div className="relative w-full h-[520px] bg-stone-100 rounded-2xl overflow-hidden shadow-sm border border-stone-200 font-sans">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Reroute bottom bar — shows which is active */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur border-t border-stone-200 px-4 py-3 flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest shrink-0">Click card to highlight route</span>
        {REROUTE_OPTIONS.map(r => (
          <button
            key={r.id}
            onClick={() => onRerouteChange?.(r.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
              activeReroute === r.id
                ? r.recommended
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : r.id === 'B' ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-stone-100 border-stone-400 text-stone-900'
                : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
            }`}
          >
            <span
              className="size-2 rounded-full shrink-0"
              style={{ background: activeReroute === r.id ? (r.recommended ? '#10B981' : r.id === 'B' ? '#F59E0B' : '#6B7280') : '#94A3B8' }}
            />
            {r.label}
            {r.recommended && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">BEST</span>}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-4 text-[11px] font-medium text-stone-500">
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-[#D94E28] opacity-60" /> Disrupted</span>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-emerald-500" /> Best</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 border-t-2 border-dashed border-stone-400" /> Alternatives</span>
        </div>
      </div>
    </div>
  )
}
