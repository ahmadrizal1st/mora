import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import ApexCharts from 'apexcharts'
import type { ApexOptions } from 'apexcharts'
import { useTheme } from '../../context/ThemeContext'

export interface HeatmapSerie {
  name: string
  data: Array<{ x: string | number; y: number }>
}

export interface ChartHeatmapProps {
  id: string
  height?: number
  color?: string
  colors?: number
  labels?: boolean
  legend?: boolean
  scale?: boolean
  noShades?: boolean
  series: HeatmapSerie[]
  className?: string
}

export function ChartHeatmap({
  id,
  height = 25,
  color,
  colors = 1,
  labels,
  legend,
  scale,
  noShades,
  series = [],
  className,
}: ChartHeatmapProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<ApexCharts | null>(null)
  const { themeKey } = useTheme()

  const seriesString = JSON.stringify(series)

  useEffect(() => {
    if (!chartRef.current) return

    const resolveColor = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(`--tblr-${name}`).trim() || '#206bc4'

    const opts: ApexOptions = {
      chart: {
        height: height * 16,
        type: 'heatmap',
        toolbar: { show: false },
      },
      dataLabels: { enabled: !!labels },
      series: series,
      xaxis: { type: 'category' },
      legend: legend
        ? {
            show: true,
            position: 'bottom',
            offsetY: 8,
            markers: { size: 5 },
            itemMargin: { horizontal: 8 },
          }
        : { show: false },
      ...(scale
        ? {
            plotOptions: {
              heatmap: {
                enableShades: !noShades,
                colorScale: {
                  ranges: [
                    { from: 0,  to: 20,  name: 'Low',     color: resolveColor('green')  },
                    { from: 21, to: 50,  name: 'Medium',  color: resolveColor('blue')   },
                    { from: 51, to: 75,  name: 'High',    color: resolveColor('yellow') },
                    { from: 76, to: 100, name: 'Extreme', color: resolveColor('red')    },
                  ],
                },
              },
            },
          }
        : {
            colors: color
              ? [color]
              : Array.from({ length: colors }, (_, i) => `var(--tblr-chart-color-${i + 1})`),
          }),
    }

    chartInstance.current = new ApexCharts(chartRef.current, opts)
    chartInstance.current.render()

    return () => {
      chartInstance.current?.destroy()
      chartInstance.current = null
    }
  }, [id, height, labels, legend, scale, noShades, color, colors, seriesString, themeKey])

  return <div ref={chartRef} id={`chart-${id}`} className={clsx(className)} />
}