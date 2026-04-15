import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import jsVectorMap from 'jsvectormap'

import 'jsvectormap/dist/maps/world.js'
import 'jsvectormap/dist/maps/world-merc.js'

export interface VectorMarker {
  name: string
  coords: [number, number]
}

export interface VectorLine {
  from: string
  to: string
}

export interface MapVectorProps {
  mapId: string
  mapType?: string
  backgroundColor?: string
  regionStyle?: any
  series?: any
  markers?: VectorMarker[]
  lines?: VectorLine[]
  markerStyle?: any
  markerLabelStyle?: any
  lineStyle?: any
  labels?: any
  zoomOnScroll?: boolean
  zoomButtons?: boolean
  className?: string
  ratio?: string
}

export function MapVector({
  mapId,
  mapType = 'world',
  backgroundColor = 'transparent',
  regionStyle,
  series,
  markers,
  lines,
  markerStyle,
  markerLabelStyle,
  lineStyle,
  labels,
  zoomOnScroll = false,
  zoomButtons = false,
  className,
  ratio = '4x3',
}: MapVectorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let timer: NodeJS.Timeout | null = null

    const initMap = () => {
      container.innerHTML = ''

      try {
        const instance = new jsVectorMap({
          selector: container,
          map: mapType,
          backgroundColor,
          regionStyle: regionStyle || {
            initial: {
              fill: 'var(--tblr-bg-surface-secondary)',
              stroke: 'var(--tblr-border-color)',
              strokeWidth: 2,
            },
          },
          zoomOnScroll,
          zoomButtons,
          series,
          markers,
          lines,
          markerStyle,
          markerLabelStyle,
          lineStyle,
          labels,
        })

        mapInstanceRef.current = instance

        if (typeof window !== 'undefined') {
          const win = window as any
          win.tabler_map_vector = win.tabler_map_vector || {}
          win.tabler_map_vector[mapId] = instance
        }
      } catch (err) {
        console.error(`Error initializing Vector Map ${mapId}:`, err)
      }
    }

    timer = setTimeout(initMap, 50)

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current?.updateSize) {
        mapInstanceRef.current.updateSize()
      }
    })

    resizeObserver.observe(container)

    return () => {
      if (timer) clearTimeout(timer)
      resizeObserver.disconnect()
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy?.()
        mapInstanceRef.current = null
      }
      container.innerHTML = ''
      if (typeof window !== 'undefined' && (window as any).tabler_map_vector) {
        delete (window as any).tabler_map_vector[mapId]
      }
    }
  }, [mapId, mapType, backgroundColor, markers, lines, series, regionStyle, zoomOnScroll, zoomButtons])

  return (
    <div className={clsx('ratio', `ratio-${ratio}`, className)}>
      <div>
        <div id={`map-vector-${mapId}`} ref={containerRef} className="w-100 h-100" />
      </div>
    </div>
  )
}
