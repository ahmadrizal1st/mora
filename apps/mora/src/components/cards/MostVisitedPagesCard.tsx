// src/components/cards/MostVisitedPagesCard.tsx
// Matches shared/includes/cards/most-visited-pages.html
// Uses ChartSparkline (line, small) for bounce rate column
import { useEffect, useRef } from 'react'
import { Icon } from '../ui/Icon'
import { useTheme } from '../../context/ThemeContext'

// ── Sparkline (line, small = height 1.5rem) ─────────────────────────────────
function BounceSparkline({ id, data }: { id: string; data: number[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { themeKey } = useTheme()
  useEffect(() => {
    if (!ref.current) return
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--tblr-primary').trim() || '#206bc4'
    const tryInit = () => {
      if (!(window as any).ApexCharts) return
      const height = 1.5 * 16
      const chart = new (window as any).ApexCharts(ref.current, {
        chart: {
          type: 'line',
          fontFamily: 'inherit',
          height,
          animations: { enabled: false },
          sparkline: { enabled: true },
        },
        stroke: { width: 2, lineCap: 'round', curve: 'smooth' },
        tooltip: { enabled: false },
        colors: [primaryColor],
        series: [{ data }],
      })
      chart.render()
      return () => { const c = chart as any; if (typeof c.destroy === 'function') c.destroy() }
    }
    if ((window as any).ApexCharts) return tryInit()
    const t = setTimeout(tryInit, 500)
    return () => clearTimeout(t)
  }, [themeKey])
  return (
    <div
      ref={ref}
      id={`sparkline-bounce-rate-${id}`}
      className="chart-sparkline chart-sparkline-sm"
      style={{ height: `${1.5 * 16}px`, minWidth: '64px' }}
    />
  )
}

// ── Data ─────────────────────────────────────────────────────────────────────
const DEFAULT_URLS = [
  { uri: '/home', visitors: 4235, unique: 3821, bounce: '20.8%', data: [35,41,62,42,13,18,29,37,36,51,32,35] },
  { uri: '/about', visitors: 3823, unique: 2900, bounce: '41.2%', data: [12,25,32,18,29,37,36,51,32,35,41,62] },
  { uri: '/blog', visitors: 2600, unique: 2000, bounce: '52.1%', data: [18,29,37,36,51,32,35,41,62,42,13,25] },
  { uri: '/pricing', visitors: 1953, unique: 1400, bounce: '38.9%', data: [36,51,32,35,41,62,42,13,18,29,37,20] },
  { uri: '/contact', visitors: 1200, unique: 900, bounce: '62.5%', data: [51,32,35,41,62,42,13,18,29,37,36,45] },
  { uri: '/docs', visitors: 870, unique: 620, bounce: '30.4%', data: [32,35,41,62,42,13,18,29,37,36,51,28] },
]

interface UrlItem {
  uri: string
  visitors: number
  unique: number
  bounce: string
  data?: number[]
}

export function MostVisitedPagesCard({ urls = DEFAULT_URLS }: { urls?: UrlItem[] }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Most Visited Pages</h3>
      </div>
      <div className="card-table table-responsive">
        <table className="table table-vcenter">
          <thead>
            <tr>
              <th>Page name</th>
              <th>Visitors</th>
              <th>Unique</th>
              <th colSpan={2}>Bounce rate</th>
            </tr>
          </thead>
          <tbody>
            {urls.slice(0, 6).map((url, index) => (
              <tr key={index}>
                <td>
                  {url.uri}
                  <a href="#" className="ms-1" aria-label="Open website">
                    <Icon icon="link" />
                  </a>
                </td>
                <td className="text-secondary">{url.visitors.toLocaleString()}</td>
                <td className="text-secondary">{url.unique.toLocaleString()}</td>
                <td className="text-secondary">{url.bounce}</td>
                <td className="text-end w-1">
                  <BounceSparkline id={`${index + 1}`} data={url.data ?? []} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
