import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import ApexCharts from 'apexcharts'
import type { ApexOptions } from 'apexcharts'
import { useTheme } from '../../context/ThemeContext'

export interface ChartSparklineProps {
  id: string
  type?: 'bar' | 'area' | 'line' | 'pie' | 'donut'
  color?: string
  data?: number[]
  percentage?: number
  height?: number
  small?: boolean
  wide?: boolean
  className?: string
}

export function ChartSparkline({
  id,
  type = 'bar',
  color = 'primary',
  data = [],
  percentage,
  height: heightProp,
  small,
  wide,
  className,
}: ChartSparklineProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<ApexCharts | null>(null)
  const { themeKey } = useTheme()

  const height = heightProp ?? (small ? 1.5 : 2.5)
  const isSquare = type === 'pie' || type === 'donut'

  const containerClasses = clsx(
    'chart-sparkline',
    isSquare && 'chart-sparkline-square',
    wide && 'chart-sparkline-wide',
    small && 'chart-sparkline-sm',
    className
  )

  const dataString = JSON.stringify(data)

  useEffect(() => {
    if (!chartRef.current) return

    const apexType = type === 'donut' ? 'radialBar' : type
    const parsedData = percentage !== undefined ? [percentage] : data

    const resolvedColor = getComputedStyle(document.documentElement)
      .getPropertyValue(`--tblr-${color}`).trim() || '#206bc4'

    const opts: ApexOptions = {
      chart: {
        type: apexType as any,
        fontFamily: 'inherit',
        height: Math.round(height * 16),
        ...(isSquare ? { width: Math.round(height * 16) } : {}),
        animations: { enabled: false },
        sparkline: { enabled: true },
      },
      tooltip: { enabled: false },
      ...(type === 'donut' && {
        plotOptions: {
          radialBar: {
            hollow: { margin: 0, size: '75%' },
            track: { margin: 0 },
            dataLabels: { show: false },
          },
        },
        colors: [resolvedColor],
        series: parsedData,
      }),
      ...(type !== 'donut' && {
        ...(type === 'area' && {
          fill: { gradient: { opacityFrom: [0.1, 0.1] } },
        }),
        ...((type === 'area' || type === 'line') && {
          stroke: { width: 2, lineCap: 'round' },
        }),
        series: [{ color: resolvedColor, data: parsedData } as any],
      }),
    }

    chartInstance.current = new ApexCharts(chartRef.current, opts)
    chartInstance.current.render()

    return () => {
      chartInstance.current?.destroy()
      chartInstance.current = null
    }
  }, [id, type, color, height, isSquare, percentage, dataString, themeKey])

  return <div ref={chartRef} id={`sparkline-${id}`} className={containerClasses} />
}