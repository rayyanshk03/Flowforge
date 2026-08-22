'use client'

import React, { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { PORT_COORDS, resolveRoute, resolveBypassRoute } from '@/lib/routeEngine'

// Helper function: Match user input string (e.g. 'Mumbai', 'Rotterdam') to exact PORT_COORDS key
function findPortKey(inputName?: string, fallbackKey: string = 'Shanghai Yangshan Port (CN)'): string {
  if (!inputName) return fallbackKey
  const norm = inputName.toLowerCase().trim()
  const keys = Object.keys(PORT_COORDS)
  for (const key of keys) {
    const kNorm = key.toLowerCase()
    if (kNorm.includes(norm) || norm.includes(kNorm.split(' ')[0])) {
      return key
    }
  }
  // Try partial country / city match
  for (const key of keys) {
    if (norm.slice(0, 4).length >= 3 && key.toLowerCase().includes(norm.slice(0, 4))) {
      return key
    }
  }
  return fallbackKey
}

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

  // Dynamically resolve exact PostGIS NavMesh keys
  const actualOriginKey = findPortKey(originPort, 'Shanghai Yangshan Port (CN)')
  const actualDestKey = findPortKey(destinationPort, 'Port of Yokohama (JP)')

  // Dynamically compute primary route via Dijkstra / A* shortest bathymetric path algorithm
  const primaryWaypoints = resolveRoute(actualOriginKey, actualDestKey)

  // Dynamically compute 3 PostGIS NavMesh alternate routes
  const rerouteA_waypoints = resolveBypassRoute(actualOriginKey, actualDestKey, 'Coastal Channel Diversion')
  const rerouteB_waypoints = resolveBypassRoute(actualOriginKey, actualDestKey, 'Weather Bypass Route')
  const rerouteC_waypoints = resolveBypassRoute(actualOriginKey, actualDestKey, 'Deepwater Ocean Bypass')

  const rerouteOptions = [
    {
      id: 'A',
      label: 'Recommended Reroute (ALT-A)',
      eta: '+4.1h delay',
      cost: '$14,200',
      savings: '+$4,688 vs. baseline',
      risk: '8.2%',
      recommended: true,
      color: '#10B981',
      waypoints: rerouteA_waypoints
    },
    {
      id: 'B',
      label: 'Secondary Bypass (ALT-B)',
      eta: '+9.3h delay',
      cost: '$16,880',
      savings: '+$2,008 vs. baseline',
      risk: '14.7%',
      recommended: false,
      color: '#F59E0B',
      waypoints: rerouteB_waypoints
    },
    {
      id: 'C',
      label: 'Deepwater Safeguard (ALT-C)',
      eta: '+16.2h delay',
      cost: '$19,440',
      savings: '-$1,552 vs. baseline',
      risk: '6.1%',
      recommended: false,
      color: '#6B7280',
      waypoints: rerouteC_waypoints
    }
  ]

  const selectedReroute = rerouteOptions.find((r) => r.id === activeReroute) || rerouteOptions[0]

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

      // 1. Primary Disrupted Route (Red-Orange dashed line)
      if (primary.length > 1) {
        L.polyline(primary, {
          color: '#D94E28',
          weight: 2.5,
          opacity: 0.5,
          dashArray: '10, 6'
        }).addTo(group)
      }

      // 2. Render all 3 PostGIS shortest-distance alternate routes
      rerouteOptions.forEach((r) => {
        if (!r.waypoints || r.waypoints.length < 2) return
        const isSelected = r.id === activeReroute
        const color = r.recommended ? '#10B981' : r.id === 'B' ? '#F59E0B' : '#6B7280'
        L.polyline(r.waypoints, {
          color: isSelected ? color : '#94A3B8',
          weight: isSelected ? 4 : 1.5,
          opacity: isSelected ? 0.95 : 0.35,
          dashArray: isSelected ? undefined : '5, 7'
        }).addTo(group)
      })

      // 3. Origin Port Pin (Dynamic Coordinates)
      const originCoords = primary[0] || PORT_COORDS[actualOriginKey] || [30.63, 122.07]
      const originMarker = L.circleMarker(originCoords, {
        radius: 8,
        fillColor: '#1E293B',
        color: '#FFFFFF',
        weight: 2,
        fillOpacity: 1
      }).addTo(group)
      originMarker.bindTooltip(`Origin: ${actualOriginKey}`, { permanent: false })

      // 4. Destination Port Pin (Dynamic Coordinates)
      const destCoords = primary[primary.length - 1] || PORT_COORDS[actualDestKey] || [35.44, 139.64]
      const destMarker = L.circleMarker(destCoords, {
        radius: 8,
        fillColor: '#10B981',
        color: '#FFFFFF',
        weight: 2,
        fillOpacity: 1
      }).addTo(group)
      destMarker.bindTooltip(`Destination: ${actualDestKey}`, { permanent: false })

      // 5. Waypoint marker on selected reroute
      if (selectedReroute.waypoints.length > 3) {
        const mid = selectedReroute.waypoints[Math.floor(selectedReroute.waypoints.length / 2)]
        const color = selectedReroute.recommended ? '#10B981' : '#F59E0B'
        L.circleMarker(mid, {
          radius: 5,
          fillColor: color,
          color: '#FFFFFF',
          weight: 1.5,
          fillOpacity: 0.9
        }).addTo(group).bindTooltip(`WayPoint: ${selectedReroute.label}`, { permanent: false })
      }

      // 6. Active Movable Vessel Marker
      const pos = getInterpolatedVesselPosition(primary, 0.4)
      const vesselIcon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;width:40px;height:40px;border-radius:50%;background:rgba(217,78,40,0.25);animation:pulse 2s infinite;"></div>
            <div style="transform:rotate(${pos.heading}deg);width:26px;height:26px;background:#D94E28;border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:11px;">🚢</div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      })
      L.marker([pos.lat, pos.lng], { icon: vesselIcon })
        .addTo(group)
        .bindTooltip('FF Horizon — Live AIS Pos', { permanent: false })

      // 7. Auto Fit Bounds to dynamically calculated bathymetric paths
      if (primary.length > 1) {
        const bounds = L.latLngBounds(primary)
        rerouteOptions.forEach((r) => r.waypoints.forEach((pt) => bounds.extend(pt)))
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 7 })
      }
    })

    return () => {
      mounted = false
    }
  }, [activeReroute, actualOriginKey, actualDestKey])

  return (
    <div className="relative w-full h-[520px] bg-[#F6F6F3] rounded-2xl overflow-hidden shadow-xs border border-stone-300 font-sans">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Interactive Bottom Reroute Control Strip */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-t border-stone-300 px-4 py-3 flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest shrink-0">
          POSTGIS A* ROUTE SELECTOR:
        </span>
        {rerouteOptions.map((r) => (
          <button
            key={r.id}
            onClick={() => onRerouteChange?.(r.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded border text-[11px] font-mono font-bold transition-all ${
              activeReroute === r.id
                ? r.recommended
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                  : r.id === 'B'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
                  : 'bg-stone-100 border-stone-400 text-stone-900 shadow-2xs'
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
                      : '#6B7280'
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
