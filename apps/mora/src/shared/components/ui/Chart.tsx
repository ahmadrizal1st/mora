import { useEffect, useRef, useMemo, useCallback } from 'react'
import { clsx } from 'clsx'
import ApexCharts from 'apexcharts'
import type { ApexOptions } from 'apexcharts'
import { useTheme } from '@/shared/context/ThemeContext'
import { resolveCSSColor } from '../../utils/chartUtils'

// Use any for complex ApexCharts types that are not exported top-level
type ApexAnnotations = any
type ApexYAxis = any
type ApexGrid = any
type ApexLegend = any
type ApexXAxis = any
type ApexAxisChartSeries = any
type ApexNonAxisChartSeries = any
type ApexMarkers = any

export interface ChartSerie {
  name: string
  data: (number | null | { x: any, y: any } | [any, any])[]
  color?: string
  colorOpacity?: string
  candlestickData?: { x: number; y: number[] }[]
  'color-opacity'?: string
  'candlestick-data'?: { x: number; y: number[] }[]
}

export interface ChartData {
  type?: 'bar' | 'area' | 'line' | 'pie' | 'donut' | 'radialBar' | 'candlestick' | 'scatter'
  height?: number
  extend?: string
  sparkline?: boolean
  toolbar?: boolean
  animations?: boolean
  stacked?: boolean
  horizontal?: boolean
  datalabels?: boolean
  title?: string
  strokeWidth?: number[]
  strokeDash?: number[]
  strokeCurve?: string
  series?: ChartSerie[]
  categories?: string[]
  datetime?: boolean
  startDate?: string
  legend?: boolean
  hideGrid?: boolean
  showX?: boolean
  hideTooltip?: boolean
  hidePoints?: boolean
  showMarkers?: boolean
  showDataLabels?: boolean
  types?: Record<string, string>
  yMax?: number
  yTitle?: string
  yTooltip?: boolean
  xFormatter?: string
  color?: string
  'stroke-width'?: number[]
  'stroke-dash'?: number[]
  'stroke-curve'?: string
  'start-date'?: string
  'hide-grid'?: boolean
  'show-x'?: boolean
  'hide-tooltip'?: boolean
  'hide-points'?: boolean
  'show-markers'?: boolean
  'show-data-labels'?: boolean
  'y-max'?: number
  'y-title'?: string
  'y-tooltip'?: boolean
  'x-formatter'?: string
  trackMargin?: number
  'track-margin'?: number
  strokeColors?: string[]
  'stroke-colors'?: string[]
  annotations?: ApexAnnotations
  lineCap?: 'round' | 'butt' | 'square'
  startAngle?: number
  endAngle?: number
  // Bar chart specific modifications
  yaxis?: ApexYAxis | ApexYAxis[]
  grid?: ApexGrid
  legendOptions?: ApexLegend
  xaxis?: ApexXAxis
  donutLabel?: string
  donutValue?: string
  hollowSize?: string
}

export interface ChartProps {
  chartId: string
  chartData: ChartData
  id?: string
  height?: number
  className?: string
  class?: string
  size?: 'sm' | 'lg'
}

export function Chart({
  chartId,
  chartData,
  id,
  height,
  className,
  class: legacyClass,
  size,
}: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<ApexCharts | null>(null)
  const { themeKey } = useTheme()

  const resolvedId = id ?? chartId
  const finalClassName = className ?? legacyClass

  const { resolvedHeight, extraClass } = useMemo(() => {
    let h = height ?? chartData.height ?? 10
    const classes = [finalClassName]

    if (size === 'sm') {
      classes.push('chart-sm')
      h = 2.5
    } else if (size === 'lg') {
      classes.push('chart-lg')
      h = 15
    }

    return { resolvedHeight: h, extraClass: clsx(classes) }
  }, [height, chartData.height, finalClassName, size])

  const cssVariables = useMemo(() => {
    const vars: Record<string, string> = {}
    if (chartData.series) {
      chartData.series.forEach((serie, index) => {
        const color = serie.color ?? chartData.color ?? 'primary'
        const opacity = serie.colorOpacity ?? serie['color-opacity'] ?? '100%'

        // Modifikasi bar chart: Support direct hex/rgb/hsl colors
        const isLiteral = color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl') || color.includes('var(')
        const finalColor = isLiteral ? color : `var(--tblr-${color})`

        vars[`--chart-${resolvedId}-color-${index}`] = `color-mix(in srgb, transparent, ${finalColor} ${opacity})`
      })
    }

    if (chartData.type === 'area' && chartData.series) {
      chartData.series.forEach((serie, index) => {
        const color = serie.color ?? chartData.color ?? 'primary'
        const isLiteral = color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl') || color.includes('var(')
        const finalColor = isLiteral ? color : `var(--tblr-${color})`

        vars[`--chart-${resolvedId}-fill-${index}`] = `color-mix(in srgb, transparent, ${finalColor} 16%)`
      })
    }

    return vars
  }, [chartData, resolvedId])

  useEffect(() => {
    Object.entries(cssVariables).forEach(([key, val]) => {
      document.documentElement.style.setProperty(key, val)
    })
  }, [cssVariables])

  const buildSeries = useCallback((type: string) => {
    if (!chartData.series) return []

    if (['pie', 'donut', 'radialBar'].includes(type)) {
      return chartData.series.map((s) => (Array.isArray(s.data) ? s.data[0] : s.data))
    }

    if (type === 'candlestick') {
      return chartData.series.map((s) => ({
        name: s.name,
        data: s.candlestickData || s['candlestick-data'] || s.data || [],
        // Modifikasi bar chart: Ensure color is resolved
        color: resolveCSSColor(s.color ?? chartData.color ?? 'green'),
      }))
    }

    return chartData.series.map((s, index) => ({
      name: s.name,
      data: s.data,
      // Modifikasi bar chart: Ensure color is explicitly passed to series
      color: resolveCSSColor(s.color ?? chartData.color ?? 'primary'),
      ...(chartData.types && chartData.types[String(index)] ? { type: chartData.types[String(index)] } : {}),
    }))
  }, [chartData.series, chartData.color, chartData.types])

  const startDate = chartData['start-date']
  const buildLabels = useCallback((type: string) => {
    if (!chartData.series) return undefined

    if (['pie', 'donut', 'radialBar'].includes(type)) {
      return chartData.series.map((s) => s.name)
    }

    if (chartData.datetime) {
      const startDateStr = chartData.startDate ?? startDate ?? new Date().toISOString().split('T')[0]
      const start = new Date(startDateStr).getTime()
      const firstSeries = chartData.series[0]
      const daysCount = firstSeries?.data?.length ?? (firstSeries?.candlestickData || firstSeries?.['candlestick-data'])?.length ?? 0
      const labels = []
      for (let i = 0; i < daysCount; i++) {
        const date = new Date(start + (i + 1) * 86400000)
        labels.push(date.toISOString().split('T')[0])
      }
      return labels
    }

    return undefined
  }, [chartData.series, chartData.datetime, chartData.startDate, startDate])

  const buildCategories = useCallback(() => {
    if (!chartData.categories) return undefined

    const cats = chartData.categories.map(String)
    let maxDataLen = 0
    if (chartData.series) {
      chartData.series.forEach(s => {
        const len = (s.candlestickData || s['candlestick-data'])?.length || s.data?.length || 0
        if (len > maxDataLen) maxDataLen = len
      })
    }

    if (maxDataLen > cats.length) {
      const stretched = new Array(maxDataLen).fill('')
      const step = (maxDataLen - 1) / (cats.length - 1 || 1)
      cats.forEach((cat, i) => {
        stretched[Math.round(i * step)] = cat
      })
      return stretched
    }
    return cats
  }, [chartData.categories, chartData.series])

  const chartDataString = JSON.stringify(chartData)

  useEffect(() => {
    const container = chartRef.current
    if (!container) return

    const chartType = chartData.type ?? 'bar'
    const chartColors = chartData.series
      ? chartData.series.map((s) => resolveCSSColor(s.color ?? chartData.color ?? 'primary'))
      : [resolveCSSColor('primary')]

    const options: ApexOptions = {
      chart: {
        type: chartType,
        fontFamily: 'inherit',
        height: resolvedHeight * 16,
        sparkline: { enabled: !!chartData.sparkline },
        ...(!chartData.sparkline && {
          parentHeightOffset: 0,
          toolbar: { show: !!chartData.toolbar },
        }),
        animations: { enabled: chartData.animations !== false },
        stacked: !!chartData.stacked,
        selection: { enabled: false },
        accessibility: { enabled: false },
        events: {
          dataPointSelection: () => { },
          click: () => { },
        },
      },
      colors: chartType === 'candlestick' ? [resolveCSSColor('green')] : chartColors,
      ...(chartType === 'bar' && {
        plotOptions: {
          bar: {
            columnWidth: '50%',
            borderRadius: 2,
            ...(chartData.horizontal && {
              barHeight: '50%',
              horizontal: true,
            }),
          },
        },
      }),
      ...((chartType === 'pie' || chartType === 'donut') && {
        plotOptions: {
          pie: {
            donut: {
              size: chartData.hollowSize || '70%',
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '12px',
                  color: 'var(--tblr-secondary)',
                  offsetY: -10,
                },
                value: {
                  show: true,
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--tblr-body-color)',
                  offsetY: 8,
                  formatter: () => chartData.donutValue || '',
                },
                total: {
                  show: true,
                  label: chartData.donutLabel || '',
                  color: 'var(--tblr-secondary)',
                  formatter: () => chartData.donutValue || '',
                },
              },
            },
          },
        },
      }),
      ...(chartType === 'radialBar' && {
        plotOptions: {
          radialBar: {
            startAngle: chartData.startAngle ?? -120,
            endAngle: chartData.endAngle ?? 120,
            hollow: { size: chartData.hollowSize ?? '60%' },
            track: {
              background: 'var(--tblr-bg-surface-secondary, #f1f5f9)',
              strokeWidth: '100%',
              margin: chartData.trackMargin ?? chartData['track-margin'] ?? 5,
            },
            dataLabels: {
              name: {
                show: !!chartData.donutLabel,
                fontSize: '10px',
                color: 'var(--tblr-secondary)',
                offsetY: -5,
              },
              value: {
                offsetY: 10,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                fontFamily: 'inherit',
                color: 'var(--tblr-body-color)',
                formatter: (val) => chartData.donutValue || `${val}%`,
              },
            },
          },
        },
      }),
      dataLabels: {
        enabled: !!(chartData.datalabels || chartData.showDataLabels || chartData['show-data-labels']),
      },
      ...(chartType === 'candlestick' && {
        plotOptions: {
          candlestick: {
            colors: {
              upward: resolveCSSColor('green'),
              downward: resolveCSSColor('red'),
            },
          },
        },
      }),
      ...(chartType === 'area' && {
        fill: {
          type: 'solid',
          opacity: 0.16,
          colors: chartColors,
        },
      }),
      ...(chartData.title && {
        title: {
          text: chartData.title,
          margin: 0,
          floating: true,
          offsetX: 10,
          style: { fontSize: '18px' },
        },
      }),
      stroke: {
        show: true,
        width: chartData.strokeWidth ?? chartData['stroke-width'] ?? (['pie', 'donut'].includes(chartType) ? 2 : (['area', 'line', 'scatter', 'candlestick'].includes(chartType) ? (chartType === 'candlestick' ? 1 : 2) : 0)),
        colors: chartData.strokeColors ?? chartData['stroke-colors'] ?? (['pie', 'donut'].includes(chartType) ? ['var(--tblr-bg-surface)'] : undefined),
        dashArray: chartData.strokeDash ?? chartData['stroke-dash'] ?? 0,
        lineCap: chartData.lineCap ?? 'round',
        curve: (chartData.strokeCurve ?? chartData['stroke-curve'] ?? 'smooth') as 'smooth' | 'straight' | 'stepline',
      },
      ...(chartData.annotations && {
        annotations: chartData.annotations as ApexAnnotations,
      }),
      series: buildSeries(chartType) as ApexAxisChartSeries | ApexNonAxisChartSeries,
      ...( (chartData.datetime || ['pie', 'donut', 'radialBar'].includes(chartType)) && { labels: buildLabels(chartType) }),
      tooltip: {
        theme: 'dark',
        enabled: !(chartData.hideTooltip || chartData['hide-tooltip']),
        ...(['pie', 'donut'].includes(chartType) && { fillSeriesColor: false }),
      },
      states: {
        normal: { filter: { type: 'none', value: 0 } },
        hover: { filter: { type: 'none', value: 0 } },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: (chartType === 'pie' || chartType === 'donut') ? 'none' : 'none',
            value: 0
          }
        },
      },
      grid: {
        strokeDashArray: 4,
        ...(!chartData.sparkline && {
          padding: {
            top: (chartType === 'pie' || chartType === 'donut' || chartType === 'radialBar') ? 20 : -20,
            right: 0,
            left: -4,
            bottom: -4
          },
        }),
        show: chartData.hideGrid || chartData['hide-grid'] || chartData.sparkline ? false : true,
        ...(chartData.showX || chartData['show-x'] ? { xaxis: { lines: { show: true } } } : {}),
        // Modifikasi bar chart: Support custom grid spread
        ...chartData.grid,
      },
      xaxis: {
        labels: {
          padding: 0,
          ...((chartData.xFormatter || chartData['x-formatter']) && {
            formatter: (val: string | number) => {
              const fmt = (chartData.xFormatter || chartData['x-formatter'])!
              try {
                return new Function('val', `return ${fmt}`)(val)
              } catch {
                return String(val)
              }
            },
          }),
        },
        tooltip: { enabled: false },
        crosshairs: { show: false },
        ...(['area', 'bar'].includes(chartType) && { axisBorder: { show: false } }),
        ...(chartData.categories && {
          categories: buildCategories(),
          tickAmount: chartData.categories.length - 1,
        }),
        ...(chartData.datetime && { type: 'datetime' }),
        // Modifikasi bar chart: Support custom xaxis extra
        ...(chartData.xaxis || {}),
      } as ApexXAxis,
      ...(!['pie', 'donut', 'radialBar'].includes(chartType) && {
        yaxis: {
          labels: { padding: 4 },
          max: chartData.yMax ?? chartData['y-max'],
          title: { text: chartData.yTitle ?? chartData['y-title'] },
          tooltip: { enabled: !!(chartData.yTooltip || chartData['y-tooltip']) },
          // Modifikasi bar chart: Support custom yaxis extra
          ...chartData.yaxis,
        },
      }),
      legend: {
        show: !!chartData.legend,
        position: 'bottom',
        offsetY: 12,
        markers: { width: 10, height: 10, radius: 100 } as ApexMarkers,
        itemMargin: { horizontal: 8, vertical: 8 },
        // Modifikasi bar chart: Support custom legend control
        ...chartData.legendOptions,
      },
      markers: {
        size: (chartData.showMarkers || chartData['show-markers'])
          ? 2
          : (chartType === 'scatter' ? 4 : (chartData.hidePoints || chartData['hide-points']) ? 0 : 0),
      },
    }

    const instance = new ApexCharts(container, options)
    chartInstance.current = instance
    instance.render()

    return () => {
      instance.destroy()
      chartInstance.current = null
    }
  }, [resolvedId, resolvedHeight, chartData, chartDataString, themeKey, buildSeries, buildLabels, buildCategories])

  return (
    <div
      ref={chartRef}
      id={`chart-${resolvedId}`}
      className={clsx('position-relative', extraClass)}
      style={{
        outline: 'none',
        boxShadow: 'none',
        minHeight: resolvedHeight ? `${resolvedHeight * 16}px` : undefined,
        ...cssVariables,
      } as React.CSSProperties}
    />
  )
}
