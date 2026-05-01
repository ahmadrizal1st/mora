import { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import mapboxgl from 'mapbox-gl'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MapInstance = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MapErrorEvent = { error: any }
import site from '../../data/site.json'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY || site.mapboxKey

export interface MapMarker {
  name?: string
  center: [number, number]
}

export interface MapBoxProps {
  id: string
  center?: [number, number]
  zoom?: number
  style?: string
  markers?: MapMarker[]
  className?: string
  card?: boolean
  height?: string
  minHeight?: string
}

export function MapBox({
  id,
  center = [52.518827, 13.4049],
  zoom = 13,
  style = 'streets-v12',
  markers = [],
  className,
  card,
}: MapBoxProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let map: MapInstance | null = null
    let resizeObserver: ResizeObserver | null = null
    let timer: NodeJS.Timeout | null = null

    timer = setTimeout(() => {
      const container = mapContainerRef.current
      if (!container) return

      const styleUrl = style.startsWith('mapbox://') ? style : `mapbox://styles/mapbox/${style}`
      const lngLat: [number, number] = [center[1], center[0]]

      map = new mapboxgl.Map({
        container: container,
        style: styleUrl,
        center: lngLat,
        zoom: zoom,
        trackResize: true,
        renderWorldCopies: true,
      })

      if (typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as unknown as { tabler_map: Record<string, any> }
        win.tabler_map = win.tabler_map || {}
        win.tabler_map[id] = map
      }

      map.on('load', () => {
        map?.resize()
      })

      map.on('error', (e: MapErrorEvent) => {
        console.warn('Mapbox error:', e.error)
        const error = e.error as unknown as { status?: number }
        if (error?.status === 401 || error?.status === 403) {
          setLoadError('Invalid or restricted Access Token.')
        }
      })

      setTimeout(() => map?.resize(), 100)

      resizeObserver = new ResizeObserver(() => {
        map?.resize()
      })
      resizeObserver.observe(container)

      if (markers && Array.isArray(markers)) {
        markers.forEach((marker) => {
          if (marker && marker.center) {
            new mapboxgl.Marker({ color: '#066fd1' })
              .setLngLat([marker.center[1], marker.center[0]])
              .addTo(map!)
          }
        })
      }
    }, 100)

    return () => {
      if (timer) clearTimeout(timer)
      if (resizeObserver) resizeObserver.disconnect()
      if (map) map.remove()
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as unknown as { tabler_map: Record<string, any> }
        if (win.tabler_map) {
          delete win.tabler_map[id]
        }
      }
    }
  }, [id, center, zoom, style, markers])

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      <div
        ref={mapContainerRef}
        id={`map-${id}`}
        className={clsx(card && 'rounded', className)}
        style={{
          backgroundColor: '#f6f7f8',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
      {loadError && (
        <div
          className="d-flex flex-column align-items-center justify-content-center text-muted text-center p-3"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            backgroundColor: 'rgba(248, 249, 250, 0.95)',
          }}
        >
          <div className="mb-2 text-danger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-alert-triangle"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
            </svg>
          </div>
          <div>
            <strong>Map Failed to Load</strong>
          </div>
          <div className="small opacity-75">{loadError}</div>
          <div className="mt-2 small">
            Check your .env <code>VITE_MAPBOX_KEY</code>
          </div>
        </div>
      )}
    </div>
  )
}