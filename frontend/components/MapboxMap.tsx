'use client'

/**
 * MapboxMap.tsx — FlowForge Maritime Intelligence Map
 *
 * Layers (all toggleable):
 *   1. Ship position        — animated pulsing vessel marker
 *   2. Recommended route    — primary bathymetric corridor (green)
 *   3. Alternative routes   — ALT-B (amber) + ALT-C (blue)
 *   4. Sea lanes            — major global TSS / shipping corridors
 *   5. Ports                — commercial port pins with tooltips
 *   6. Weather zones        — cyclone / storm polygon overlays
 *   7. Risk zones           — geopolitical high-risk area polygons
 *   8. Pirate zones         — IMB-reported piracy hotspot polygons
 *   9. Congestion zones     — port / strait congestion heatmap polygons
 *
 * Technology: Mapbox GL JS v3 + Deck.gl v9 (MapboxLayer interop)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { computeDynamicReroutes, PORT_COORDS, findPortKey } from '@/lib/routeEngine'

// ─── Layer Visibility State ────────────────────────────────────────────────
type LayerKey =
  | 'ship'
  | 'recommended'
  | 'alternatives'
  | 'sealanes'
  | 'ports'
  | 'weather'
  | 'risk'
  | 'piracy'
  | 'congestion'

const DEFAULT_LAYERS: Record<LayerKey, boolean> = {
  ship: true,
  recommended: true,
  alternatives: true,
  sealanes: true,
  ports: true,
  weather: true,
  risk: true,
  piracy: true,
  congestion: true,
}

// ─── Static Maritime Layer Data ───────────────────────────────────────────

/** Major global sea lane corridors (TSS / VLCC highways) */
const SEA_LANE_LINES = [
  // Trans-Pacific VLCC Highway
  [[35.4, 139.6], [30.0, 160.0], [25.0, 180.0], [20.0, -160.0], [33.7, -118.3]],
  // Europe–Asia (Suez route)
  [[51.9, 4.5], [49.5, -5.0], [36.1, -5.4], [33.0, 12.0], [32.5, 32.5], [30.0, 38.0], [12.5, 43.5], [11.8, 51.0], [5.2, 80.5], [1.29, 103.85]],
  // Indian Ocean VLCC corridor
  [[-34.0, 18.5], [-20.0, 40.0], [-8.0, 55.0], [5.2, 80.5], [12.0, 51.0]],
  // North Atlantic shipping lane
  [[51.9, 4.5], [50.0, -10.0], [45.0, -30.0], [40.0, -50.0], [40.7, -74.0]],
  // Malacca–South China Sea
  [[1.29, 103.85], [5.0, 106.0], [10.0, 111.0], [14.0, 117.0], [22.3, 114.2]],
]

/** IMB-reported piracy hotspot polygons (2024 data) */
const PIRACY_ZONES = [
  // Gulf of Aden / Somalia
  { name: 'Gulf of Aden', color: [220, 30, 30, 80], coords: [[40.0, 11.0], [50.0, 11.0], [55.0, 12.5], [55.0, 15.0], [45.0, 15.0], [40.0, 14.0], [40.0, 11.0]] },
  // Gulf of Guinea / West Africa
  { name: 'Gulf of Guinea', color: [220, 30, 30, 70], coords: [[0.0, 4.0], [8.0, 4.0], [8.0, -3.0], [0.0, -3.0], [0.0, 4.0]] },
  // Strait of Malacca
  { name: 'Malacca Strait', color: [220, 30, 30, 55], coords: [[99.0, 5.0], [104.0, 5.0], [105.0, 1.5], [100.0, 1.5], [99.0, 5.0]] },
]

/** Geopolitical risk zone polygons */
const RISK_ZONES = [
  // Red Sea / Houthi threat zone
  { name: 'Red Sea — Houthi Risk Zone', color: [255, 100, 0, 75], coords: [[32.0, 12.0], [44.0, 12.0], [44.0, 28.0], [32.0, 28.0], [32.0, 12.0]] },
  // Taiwan Strait tension zone
  { name: 'Taiwan Strait — Tension Zone', color: [255, 100, 0, 60], coords: [[118.5, 21.0], [122.5, 21.0], [122.5, 27.0], [118.5, 27.0], [118.5, 21.0]] },
  // South China Sea disputed waters
  { name: 'South China Sea — Disputed Waters', color: [255, 100, 0, 45], coords: [[109.0, 3.0], [121.0, 3.0], [121.0, 21.0], [109.0, 21.0], [109.0, 3.0]] },
  // Black Sea exclusion zone
  { name: 'Black Sea — War Risk Zone', color: [255, 60, 60, 70], coords: [[28.0, 41.5], [41.0, 41.5], [41.0, 46.5], [28.0, 46.5], [28.0, 41.5]] },
]

/** Tropical cyclone / storm system weather zones */
const WEATHER_ZONES = [
  // Bay of Bengal cyclone activity
  { name: 'Cyclone Activity — Bay of Bengal', color: [100, 60, 200, 60], coords: [[80.0, 5.0], [95.0, 5.0], [95.0, 22.0], [80.0, 22.0], [80.0, 5.0]] },
  // North Pacific typhoon corridor
  { name: 'Typhoon Corridor — NW Pacific', color: [100, 60, 200, 55], coords: [[125.0, 15.0], [150.0, 15.0], [155.0, 35.0], [130.0, 35.0], [125.0, 15.0]] },
  // Southern Ocean storm belt
  { name: 'Storm Belt — Southern Ocean', color: [80, 80, 220, 50], coords: [[-180.0, -55.0], [180.0, -55.0], [180.0, -65.0], [-180.0, -65.0], [-180.0, -55.0]] },
]

/** Port / strait congestion heatmap zones */
const CONGESTION_ZONES = [
  { name: 'Port of Singapore — Congestion', color: [255, 200, 0, 70], coords: [[103.5, 0.9], [104.2, 0.9], [104.2, 1.5], [103.5, 1.5], [103.5, 0.9]] },
  { name: 'Suez Canal — Transit Congestion', color: [255, 200, 0, 65], coords: [[32.0, 29.5], [33.0, 29.5], [33.0, 31.5], [32.0, 31.5], [32.0, 29.5]] },
  { name: 'Port of Shanghai — Congestion', color: [255, 200, 0, 60], coords: [[121.5, 30.4], [122.4, 30.4], [122.4, 31.2], [121.5, 31.2], [121.5, 30.4]] },
  { name: 'Rotterdam — Congestion', color: [255, 200, 0, 55], coords: [[4.0, 51.7], [4.8, 51.7], [4.8, 52.1], [4.0, 52.1], [4.0, 51.7]] },
  { name: 'Strait of Hormuz — Congestion', color: [255, 180, 0, 65], coords: [[56.0, 25.5], [58.5, 25.5], [58.5, 27.0], [56.0, 27.0], [56.0, 25.5]] },
]

// ─── Selected ports to render as pins ────────────────────────────────────
const PORT_PINS = Object.entries(PORT_COORDS).slice(0, 40).map(([name, [lat, lng]]) => ({
  name,
  coordinates: [lng, lat] as [number, number],
}))

// ─── Layer Config for Legend ──────────────────────────────────────────────
const LAYER_CONFIG: { key: LayerKey; label: string; color: string; icon: string }[] = [
  { key: 'ship',         label: 'Ship Position',     color: '#D94E28', icon: '🚢' },
  { key: 'recommended',  label: 'Recommended Route', color: '#10B981', icon: '—' },
  { key: 'alternatives', label: 'Alternative Routes', color: '#F59E0B', icon: '- -' },
  { key: 'sealanes',    label: 'Sea Lanes',          color: '#6366F1', icon: '···' },
  { key: 'ports',       label: 'Ports',              color: '#0EA5E9', icon: '●' },
  { key: 'weather',     label: 'Weather Zones',      color: '#8B5CF6', icon: '▓' },
  { key: 'risk',        label: 'Risk Zones',         color: '#F97316', icon: '▓' },
  { key: 'piracy',      label: 'Pirate Zones',       color: '#EF4444', icon: '▓' },
  { key: 'congestion',  label: 'Congestion Zones',   color: '#EAB308', icon: '▓' },
]

// ─── Props ────────────────────────────────────────────────────────────────
interface MapboxMapProps {
  originPort?: string
  destinationPort?: string
  activeReroute?: string
  onRerouteChange?: (id: string) => void
}

export default function MapboxMap({
  originPort,
  destinationPort,
  activeReroute = 'A',
  onRerouteChange,
}: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const deckRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const popupRef = useRef<any>(null)
  const animFrameRef = useRef<number>(0)
  const vesselTRef = useRef<number>(0)

  const [layers, setLayers] = useState<Record<LayerKey, boolean>>(DEFAULT_LAYERS)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const toggleLayer = useCallback((key: LayerKey) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  // Compute routes from routeEngine
  const { primaryWaypoints, reroutes } = computeDynamicReroutes(originPort, destinationPort)

  useEffect(() => {
    if (!mapContainerRef.current || typeof window === 'undefined') return
    let mounted = true

    const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

    Promise.all([
      import('mapbox-gl'),
      import('@deck.gl/core'),
      import('@deck.gl/layers'),
      import('@deck.gl/mapbox'),
    ]).then(([mapboxModule, deckCoreModule, deckLayersModule, deckMapboxModule]) => {
      if (!mounted || !mapContainerRef.current) return

      const mapboxgl = mapboxModule.default
      const { Deck } = deckCoreModule
      const {
        ScatterplotLayer,
        LineLayer,
        PathLayer,
        PolygonLayer,
        IconLayer,
        TextLayer,
      } = deckLayersModule
      const { MapboxLayer } = deckMapboxModule

      mapboxgl.accessToken = MAPBOX_TOKEN

      // Initialize Mapbox map
      const map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [90, 15],
        zoom: 3.2,
        projection: 'mercator', // flat map, no globe
        antialias: true,
      })

      mapRef.current = map

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right')
      map.addControl(new mapboxgl.ScaleControl({ maxWidth: 120, unit: 'nautical' }), 'bottom-right')

      map.on('load', () => {
        if (!mounted) return
        setMapLoaded(true)

        // ── 1. SEA LANES ─────────────────────────────────────────────────
        SEA_LANE_LINES.forEach((coords, i) => {
          const geojson: GeoJSON.Feature = {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: coords.map(([lat, lng]) => [lng, lat])
            },
            properties: {}
          }
          map.addSource(`sealane-${i}`, { type: 'geojson', data: geojson })
          map.addLayer({
            id: `sealane-${i}`,
            type: 'line',
            source: `sealane-${i}`,
            layout: { 'line-join': 'round', 'line-cap': 'round', visibility: 'visible' },
            paint: {
              'line-color': '#6366F1',
              'line-width': 0.8,
              'line-opacity': 0.35,
              'line-dasharray': [4, 6],
            }
          })
        })

        // ── 2. WEATHER ZONES ─────────────────────────────────────────────
        WEATHER_ZONES.forEach((zone, i) => {
          const geojson: GeoJSON.Feature = {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [zone.coords.map(([lng, lat]) => [lng, lat])] },
            properties: { name: zone.name }
          }
          map.addSource(`weather-${i}`, { type: 'geojson', data: geojson })
          map.addLayer({
            id: `weather-fill-${i}`,
            type: 'fill',
            source: `weather-${i}`,
            layout: { visibility: 'visible' },
            paint: { 'fill-color': `rgba(${zone.color[0]},${zone.color[1]},${zone.color[2]},0.22)` }
          })
          map.addLayer({
            id: `weather-border-${i}`,
            type: 'line',
            source: `weather-${i}`,
            layout: { visibility: 'visible' },
            paint: { 'line-color': `rgba(${zone.color[0]},${zone.color[1]},${zone.color[2]},0.7)`, 'line-width': 1, 'line-dasharray': [3, 3] }
          })

          // Tooltip on hover
          map.on('mouseenter', `weather-fill-${i}`, (e) => {
            map.getCanvas().style.cursor = 'pointer'
          })
          map.on('mouseleave', `weather-fill-${i}`, () => {
            map.getCanvas().style.cursor = ''
          })
        })

        // ── 3. RISK ZONES ─────────────────────────────────────────────────
        RISK_ZONES.forEach((zone, i) => {
          const geojson: GeoJSON.Feature = {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [zone.coords.map(([lng, lat]) => [lng, lat])] },
            properties: { name: zone.name }
          }
          map.addSource(`risk-${i}`, { type: 'geojson', data: geojson })
          map.addLayer({
            id: `risk-fill-${i}`,
            type: 'fill',
            source: `risk-${i}`,
            layout: { visibility: 'visible' },
            paint: { 'fill-color': `rgba(${zone.color[0]},${zone.color[1]},${zone.color[2]},0.22)` }
          })
          map.addLayer({
            id: `risk-border-${i}`,
            type: 'line',
            source: `risk-${i}`,
            layout: { visibility: 'visible' },
            paint: { 'line-color': `rgba(${zone.color[0]},${zone.color[1]},${zone.color[2]},0.75)`, 'line-width': 1.5 }
          })
        })

        // ── 4. PIRACY ZONES ───────────────────────────────────────────────
        PIRACY_ZONES.forEach((zone, i) => {
          const geojson: GeoJSON.Feature = {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [zone.coords.map(([lng, lat]) => [lng, lat])] },
            properties: { name: zone.name }
          }
          map.addSource(`piracy-${i}`, { type: 'geojson', data: geojson })
          map.addLayer({
            id: `piracy-fill-${i}`,
            type: 'fill',
            source: `piracy-${i}`,
            layout: { visibility: 'visible' },
            paint: { 'fill-color': 'rgba(220,30,30,0.22)', 'fill-pattern': undefined }
          })
          map.addLayer({
            id: `piracy-border-${i}`,
            type: 'line',
            source: `piracy-${i}`,
            layout: { visibility: 'visible' },
            paint: { 'line-color': 'rgba(220,30,30,0.85)', 'line-width': 1.5, 'line-dasharray': [2, 2] }
          })
          // Skull label
          map.addLayer({
            id: `piracy-label-${i}`,
            type: 'symbol',
            source: `piracy-${i}`,
            layout: {
              'text-field': `☠ ${zone.name}`,
              'text-size': 9.5,
              'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
              'text-anchor': 'center',
            },
            paint: { 'text-color': '#ff6060', 'text-halo-color': '#000', 'text-halo-width': 1 }
          })
        })

        // ── 5. CONGESTION ZONES ───────────────────────────────────────────
        CONGESTION_ZONES.forEach((zone, i) => {
          const geojson: GeoJSON.Feature = {
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [zone.coords.map(([lng, lat]) => [lng, lat])] },
            properties: { name: zone.name }
          }
          map.addSource(`congestion-${i}`, { type: 'geojson', data: geojson })
          map.addLayer({
            id: `congestion-fill-${i}`,
            type: 'fill',
            source: `congestion-${i}`,
            layout: { visibility: 'visible' },
            paint: { 'fill-color': 'rgba(234,179,8,0.28)' }
          })
          map.addLayer({
            id: `congestion-border-${i}`,
            type: 'line',
            source: `congestion-${i}`,
            layout: { visibility: 'visible' },
            paint: { 'line-color': 'rgba(234,179,8,0.85)', 'line-width': 1 }
          })
        })

        // ── 6. PORTS ──────────────────────────────────────────────────────
        const portGeoJSON: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: PORT_PINS.map(p => ({
            type: 'Feature' as const,
            geometry: { type: 'Point' as const, coordinates: p.coordinates },
            properties: { name: p.name }
          }))
        }
        map.addSource('ports', { type: 'geojson', data: portGeoJSON })
        map.addLayer({
          id: 'ports-circle',
          type: 'circle',
          source: 'ports',
          layout: { visibility: 'visible' },
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 2.5, 6, 5, 10, 9],
            'circle-color': '#0EA5E9',
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 1.2,
            'circle-opacity': 0.85,
          }
        })
        map.addLayer({
          id: 'ports-label',
          type: 'symbol',
          source: 'ports',
          minzoom: 4.5,
          layout: {
            'text-field': ['get', 'name'],
            'text-size': 9,
            'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 1.2],
            'text-anchor': 'top',
          },
          paint: { 'text-color': '#93C5FD', 'text-halo-color': '#000000', 'text-halo-width': 1 }
        })
        map.on('click', 'ports-circle', (e) => {
          if (!e.features?.[0]) return
          const coords = (e.features[0].geometry as GeoJSON.Point).coordinates as [number, number]
          const name = e.features[0].properties?.name || 'Port'
          if (popupRef.current) popupRef.current.remove()
          popupRef.current = new mapboxgl.Popup({ offset: 8, className: 'ff-popup' })
            .setLngLat(coords)
            .setHTML(`<div style="font-family:monospace;font-size:11px;font-weight:700;color:#0EA5E9;padding:2px 4px">⚓ ${name}</div>`)
            .addTo(map)
        })
        map.on('mouseenter', 'ports-circle', () => { map.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', 'ports-circle', () => { map.getCanvas().style.cursor = '' })

        // ── 7. ROUTES (Primary + Alternates) ─────────────────────────────
        // Primary (disrupted — dashed red-orange)
        const primaryCoords = primaryWaypoints.map(([lat, lng]) => [lng, lat])
        if (primaryCoords.length > 1) {
          map.addSource('route-primary', {
            type: 'geojson',
            data: { type: 'Feature', geometry: { type: 'LineString', coordinates: primaryCoords }, properties: {} }
          })
          map.addLayer({
            id: 'route-primary',
            type: 'line',
            source: 'route-primary',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#D94E28', 'line-width': 2, 'line-opacity': 0.55, 'line-dasharray': [6, 4] }
          })
        }

        // Alternate routes
        const routeColors: Record<string, string> = { A: '#10B981', B: '#F59E0B', C: '#3B82F6' }
        reroutes.forEach((r) => {
          if (!r.waypoints || r.waypoints.length < 2) return
          const coords = r.waypoints.map(([lat, lng]: [number, number]) => [lng, lat])
          const isSelected = r.id === activeReroute
          const color = routeColors[r.id] || '#10B981'

          map.addSource(`route-alt-${r.id}`, {
            type: 'geojson',
            data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords }, properties: { id: r.id, label: r.label } }
          })
          // Glow
          map.addLayer({
            id: `route-alt-glow-${r.id}`,
            type: 'line',
            source: `route-alt-${r.id}`,
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': color, 'line-width': isSelected ? 14 : 8, 'line-opacity': 0.06, 'line-blur': 6 }
          })
          // Main line
          map.addLayer({
            id: `route-alt-${r.id}`,
            type: 'line',
            source: `route-alt-${r.id}`,
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': color,
              'line-width': isSelected ? 4 : 2,
              'line-opacity': isSelected ? 0.95 : 0.6,
              'line-dasharray': isSelected ? [1] : [6, 4],
            }
          })
        })

        // ── 8. ANIMATED VESSEL MARKER ─────────────────────────────────────
        const vesselWaypoints = reroutes[0]?.waypoints || primaryWaypoints
        const totalPts = vesselWaypoints.length

        const vesselEl = document.createElement('div')
        vesselEl.style.cssText = `
          position:relative; width:36px; height:36px;
          display:flex; align-items:center; justify-content:center;
        `
        vesselEl.innerHTML = `
          <div style="
            position:absolute; width:36px; height:36px; border-radius:50%;
            background:rgba(217,78,40,0.2); animation:ff-pulse 2s infinite;
          "></div>
          <div id="vessel-icon" style="
            width:22px; height:22px; background:#D94E28;
            border:2px solid #fff; border-radius:50%;
            display:flex; align-items:center; justify-content:center;
            font-size:11px; box-shadow:0 2px 8px rgba(0,0,0,0.5);
            transition:transform 0.3s;
          ">🚢</div>
        `

        if (!document.getElementById('ff-vessel-style')) {
          const style = document.createElement('style')
          style.id = 'ff-vessel-style'
          style.textContent = `
            @keyframes ff-pulse {
              0%,100%{transform:scale(1);opacity:0.6}
              50%{transform:scale(1.5);opacity:0.2}
            }
            .ff-popup .mapboxgl-popup-content {
              background:#111; border:1px solid #333; border-radius:6px; padding:4px 8px;
            }
            .ff-popup .mapboxgl-popup-tip { border-top-color:#111; }
            .mapboxgl-ctrl-attrib { display:none !important; }
          `
          document.head.appendChild(style)
        }

        const vesselMarker = new mapboxgl.Marker({ element: vesselEl, anchor: 'center' })

        const animateVessel = () => {
          if (!mounted) return
          vesselTRef.current = (vesselTRef.current + 0.0002) % 1
          const t = vesselTRef.current
          const idx = Math.floor(t * (totalPts - 1))
          const frac = t * (totalPts - 1) - idx
          const p1 = vesselWaypoints[Math.min(idx, totalPts - 1)]
          const p2 = vesselWaypoints[Math.min(idx + 1, totalPts - 1)]
          if (p1 && p2) {
            const lat = p1[0] + frac * (p2[0] - p1[0])
            const lng = p1[1] + frac * (p2[1] - p1[1])
            const heading = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * (180 / Math.PI)
            vesselMarker.setLngLat([lng, lat]).addTo(map)
            const icon = vesselEl.querySelector('#vessel-icon') as HTMLElement
            if (icon) icon.style.transform = `rotate(${heading}deg)`
          }
          animFrameRef.current = requestAnimationFrame(animateVessel)
        }
        animateVessel()
        markersRef.current.push(vesselMarker)

        // ── Fit bounds to primary route ───────────────────────────────────
        if (primaryCoords.length > 1) {
          const bounds = primaryCoords.reduce(
            (b, [lng, lat]) => b.extend([lng, lat] as [number, number]),
            new mapboxgl.LngLatBounds(primaryCoords[0] as [number, number], primaryCoords[0] as [number, number])
          )
          map.fitBounds(bounds, { padding: 80, maxZoom: 7, duration: 1200 })
        }
      })
    })

    return () => {
      mounted = false
      cancelAnimationFrame(animFrameRef.current)
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      if (popupRef.current) popupRef.current.remove()
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, []) // Only run once on mount

  // ── Sync layer visibility when toggle state changes ───────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoaded) return

    const setVis = (id: string, visible: boolean) => {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none')
    }

    // Sea lanes
    SEA_LANE_LINES.forEach((_, i) => setVis(`sealane-${i}`, layers.sealanes))

    // Weather
    WEATHER_ZONES.forEach((_, i) => {
      setVis(`weather-fill-${i}`, layers.weather)
      setVis(`weather-border-${i}`, layers.weather)
    })

    // Risk
    RISK_ZONES.forEach((_, i) => {
      setVis(`risk-fill-${i}`, layers.risk)
      setVis(`risk-border-${i}`, layers.risk)
    })

    // Piracy
    PIRACY_ZONES.forEach((_, i) => {
      setVis(`piracy-fill-${i}`, layers.piracy)
      setVis(`piracy-border-${i}`, layers.piracy)
      setVis(`piracy-label-${i}`, layers.piracy)
    })

    // Congestion
    CONGESTION_ZONES.forEach((_, i) => {
      setVis(`congestion-fill-${i}`, layers.congestion)
      setVis(`congestion-border-${i}`, layers.congestion)
    })

    // Ports
    setVis('ports-circle', layers.ports)
    setVis('ports-label', layers.ports)

    // Routes
    setVis('route-primary', layers.recommended)
    reroutes.forEach(r => {
      setVis(`route-alt-${r.id}`, layers.alternatives || (r.id === 'A' && layers.recommended))
      setVis(`route-alt-glow-${r.id}`, layers.alternatives || (r.id === 'A' && layers.recommended))
    })
  }, [layers, mapLoaded, reroutes])

  return (
    <div className="relative w-full h-[540px] rounded-lg overflow-hidden border border-stone-700 bg-[#111]">
      {/* Mapbox Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* ── Layer Toggle Panel (top-left) ─────────────────────────── */}
      <div className="absolute top-3 left-3 z-[100] bg-[#111]/90 backdrop-blur-sm border border-stone-700 rounded-lg p-3 space-y-1.5 min-w-[172px]">
        <p className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest pb-1 border-b border-stone-700">
          MAP LAYERS
        </p>
        {LAYER_CONFIG.map(({ key, label, color, icon }) => (
          <button
            key={key}
            onClick={() => toggleLayer(key)}
            className={`flex items-center gap-2 w-full text-left transition-all rounded px-1 py-0.5 ${
              layers[key] ? 'opacity-100' : 'opacity-35'
            }`}
          >
            <span
              className="text-[10px] font-mono font-black w-4 text-center shrink-0"
              style={{ color }}
            >
              {icon}
            </span>
            <span className={`text-[10px] font-mono font-bold ${layers[key] ? 'text-stone-200' : 'text-stone-600'}`}>
              {label}
            </span>
            <span className={`ml-auto size-2 rounded-full shrink-0 ${layers[key] ? 'bg-[#10B981]' : 'bg-stone-700'}`} />
          </button>
        ))}
      </div>

      {/* ── Route Selector Strip (bottom) ────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-[100] bg-[#0D0D0D]/92 backdrop-blur-md border-t border-stone-700 px-4 py-2.5 flex flex-wrap items-center gap-2.5">
        <span className="text-[9px] font-mono font-black text-stone-500 uppercase tracking-widest shrink-0">
          ROUTE SELECTOR:
        </span>
        {reroutes.map((r) => {
          const color = r.id === 'A' ? '#10B981' : r.id === 'B' ? '#F59E0B' : '#3B82F6'
          const isActive = activeReroute === r.id
          return (
            <button
              key={r.id}
              onClick={() => onRerouteChange?.(r.id)}
              style={{ borderColor: isActive ? color : '#3F3F46' }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-mono font-black transition-all ${
                isActive ? 'text-white' : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              <span className="size-1.5 rounded-full shrink-0" style={{ background: color }} />
              {r.label}
              {r.recommended && (
                <span className="text-[8px] font-mono font-black text-emerald-300 bg-emerald-900/60 px-1.5 py-0.5 rounded">
                  BEST ROI
                </span>
              )}
            </button>
          )
        })}

        {/* Legend */}
        <div className="ml-auto flex items-center gap-4 text-[9px] font-mono font-bold text-stone-500">
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#D94E28] opacity-55" /> Disrupted</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" /> Optimal</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500 opacity-70" /> Piracy ☠</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-orange-500 opacity-70" /> Risk</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-yellow-500 opacity-70" /> Congestion</span>
        </div>
      </div>

      {/* ── Loading overlay ────────────────────────────────────────── */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0D0D0D] flex-col gap-3">
          <div className="size-10 border-2 border-[#D94E28] border-t-transparent rounded-full animate-spin" />
          <p className="text-[11px] font-mono font-black text-stone-400 animate-pulse">
            INITIALIZING MAPBOX GL + DECK.GL…
          </p>
        </div>
      )}
    </div>
  )
}
