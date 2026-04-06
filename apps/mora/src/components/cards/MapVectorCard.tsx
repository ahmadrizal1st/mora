import { useEffect, useRef } from 'react'
import jsVectorMap from 'jsvectormap'
import '../../assets/maps/world'
import { useTheme } from '../../context/ThemeContext'

interface MapVectorCardProps {
  title?: string
  mapId?: string
  data?: Record<string, number>
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  const hex = (c: string) => [
    parseInt(c.slice(1, 3), 16),
    parseInt(c.slice(3, 5), 16),
    parseInt(c.slice(5, 7), 16),
  ]
  const [r1, g1, b1] = hex(color1)
  const [r2, g2, b2] = hex(color2)
  const r = Math.round(r1 + (r2 - r1) * factor)
  const g = Math.round(g1 + (g2 - g1) * factor)
  const b = Math.round(b1 + (b2 - b1) * factor)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function WorldMap({ mapId = 'world', data = {} }: { mapId?: string; data?: Record<string, number> }) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const { themeKey } = useTheme()

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    const timer = setTimeout(() => {
      if (el.offsetWidth === 0 || el.offsetHeight === 0) return

      if (mapRef.current) {
        try { mapRef.current.destroy() } catch {}
        mapRef.current = null
      }
      el.innerHTML = ''

      // Derive map colors from the current theme primary
      const primaryHex = getComputedStyle(document.documentElement)
        .getPropertyValue('--tblr-primary').trim() || '#206bc4'

      // Convert primary hex to RGB, create lighter variants
      const hexToRgb = (hex: string) => [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
      ]
      const rgbToHex = (r: number, g: number, b: number) =>
        `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      const [pr, pg, pb] = hexToRgb(primaryHex)
      const lighten = (r: number, g: number, b: number, amt: number) =>
        rgbToHex(
          Math.min(255, Math.round(r + (255 - r) * amt)),
          Math.min(255, Math.round(g + (255 - g) * amt)),
          Math.min(255, Math.round(b + (255 - b) * amt)),
        )

      const COLOR_MIN = lighten(pr, pg, pb, 0.55)  // lighter primary
      const COLOR_MAX = primaryHex                   // full primary
      const COLOR_EMPTY = lighten(pr, pg, pb, 0.8)  // very light primary

      const values = Object.values(data)
      const min = values.length ? Math.min(...values) : 0
      const max = values.length ? Math.max(...values) : 1

      try {
        mapRef.current = new jsVectorMap({
          map: 'world',
          selector: el,
          zoomButtons: false,
          zoomOnScroll: false,
          zoomMax: 1,
          zoomMin: 1,
          draggable: false,
          markersSelectable: false,
          regionStyle: {
            initial: {
              fill: COLOR_EMPTY,
              stroke: '#ffffff',       // border putih antar negara
              strokeWidth: 0.8,
            },
            hover: {
              fillOpacity: 0.85,
              cursor: 'default',
            },
            selected: {
              fill: COLOR_EMPTY,
            },
          },
          regionLabelStyle: {
            initial: { fill: 'transparent' },
          },
          backgroundColor: 'transparent',
          onRegionTooltipShow: function (_event: any, tooltip: any, code: string) {
            const value = data[code]
            if (value !== undefined) {
              tooltip.text(`${tooltip.text()}: ${value}`)
            }
          },
          onLoaded(map: any) {
            if (!values.length) return
            const regions = map.regions
            Object.entries(data).forEach(([code, value]) => {
              const region = regions[code]
              if (!region) return
              const factor = max === min ? 1 : (value - min) / (max - min)
              const color = interpolateColor(COLOR_MIN, COLOR_MAX, factor)
              region.element.setStyle('fill', color)
              region.element.setStyle('stroke', '#ffffff')
              region.element.setStyle('stroke-width', '0.8')
            })
          },
        })
      } catch (err) {
        console.error('Failed to initialize jsVectorMap:', err)
      }
    }, 0)

    return () => {
      clearTimeout(timer)
      if (mapRef.current) {
        try { mapRef.current.destroy() } catch {}
        mapRef.current = null
        if (el) el.innerHTML = ''
      }
    }
  }, [mapId, data, themeKey])

  return (
    <div style={{ width: '100%', aspectRatio: '21/9' }}>
      <div
        ref={ref}
        id={`map-${mapId}`}
        style={{ width: '100%', height: '100%', cursor: 'default' }}
      />
    </div>
  )
}

export function MapVectorCard({ title, mapId = 'world', data }: MapVectorCardProps) {
  const defaultData: Record<string, number> = {
    US: 500, CN: 400, RU: 350, BR: 200, AU: 150,
    IN: 300, DE: 180, FR: 160, GB: 170, PL: 220,
    CA: 190, JP: 260, KR: 140, ID: 130, MX: 110,
    AR: 100, ZA: 90,  NG: 70,  EG: 80,  TR: 160,
    SA: 120, UA: 140, SE: 130, ES: 150,
  }

  return (
    <div className="card">
      <div className="card-body p-3">
        {title && <h3 className="card-title mb-3">{title}</h3>}
        <WorldMap mapId={mapId} data={data ?? defaultData} />
      </div>
    </div>
  )
}