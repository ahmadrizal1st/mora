import { Chart } from '@/shared/components/ui/Chart'
import { useMemo, useState, useEffect } from 'react'

interface Props {
  score: number
}

const lerpColor = (color1: number[], color2: number[], t: number) => {
  const r = Math.round(color1[0] + (color2[0] - color1[0]) * t)
  const g = Math.round(color1[1] + (color2[1] - color1[1]) * t)
  const b = Math.round(color1[2] + (color2[2] - color1[2]) * t)
  return `rgb(${r},${g},${b})`
}

export const getCreditScoreColor = (score: number) => {
  const min = 300
  const max = 850
  const clampedScore = Math.max(min, Math.min(score, max))
  const pct = (clampedScore - min) / (max - min)
  
  const red = [226, 75, 74]
  const yellow = [239, 159, 39]
  const green = [43, 138, 62] // #2b8a3e
  
  if (pct <= 0.5) {
    const t = pct / 0.5
    return lerpColor(red, yellow, t)
  } else {
    const t = (pct - 0.5) / 0.5
    return lerpColor(yellow, green, t)
  }
}

export const getCreditScoreLabel = (sc: number) => {
  if (sc < 580) return 'Poor'
  if (sc < 670) return 'Fair'
  if (sc < 740) return 'Good'
  if (sc < 800) return 'Very Good'
  return 'Excellent'
}

export function CreditScoreGauge({ score }: Props) {
  const [showBubble, setShowBubble] = useState(false)
  const min = 300
  const max = 850
  const clampedScore = Math.max(min, Math.min(score, max))
  const range = max - min
  const percentage = ((clampedScore - min) / range) * 100
  const pct = (clampedScore - min) / range

  const activeColor = useMemo(() => getCreditScoreColor(score), [score])

  const gradientStops = useMemo(() => {
    if (pct <= 0.5) {
      return [
        { offset: 0, color: '#E24B4A', opacity: 1 },
        { offset: 100, color: activeColor, opacity: 1 },
      ]
    } else {
      return [
        { offset: 0, color: '#E24B4A', opacity: 1 },
        { offset: 50, color: '#EF9F27', opacity: 1 },
        { offset: 100, color: activeColor, opacity: 1 },
      ]
    }
  }, [pct, activeColor])

  const rotation = useMemo(() => -90 + (percentage / 100) * 180 - 1, [percentage])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true)
    }, 1100)
    return () => clearTimeout(timer)
  }, [])

  const label = getCreditScoreLabel(clampedScore)

  const chartData = useMemo(
    () => ({
      type: 'radialBar' as const,
      height: 42,
      series: [{ name: 'Credit Score', data: [percentage] }],
      sparkline: true,
      animations: true,
      extend: {
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            hollow: { size: '70%' },
            track: {
              background: 'var(--tblr-bg-surface-secondary, #f1f5f9)',
              strokeWidth: '100%',
            },
            dataLabels: {
              show: false,
            },
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 1,
            opacityFrom: 1,
            opacityTo: 1,
            colorStops: gradientStops,
          },
        },
        stroke: {
          lineCap: 'round',
        },
      },
    }),
    [percentage, gradientStops]
  )

  return (
    <div
      className="position-relative mx-auto"
      style={{ width: '200px', height: '200px', marginBottom: '-60px' }}
    >
      <Chart chartId="creditScoreGauge" chartData={chartData as any} />

      <div
        className="position-absolute start-0 w-100 text-center"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <div
          className="display-5 fw-bold lh-1"
          style={{
            color: activeColor,
            fontFeatureSettings: '"tnum" 1',
            letterSpacing: '-0.02em',
          }}
        >
          {clampedScore}
        </div>
        <div className="text-muted fw-semibold small mt-1">{label}</div>
      </div>

      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          transform: `rotate(${rotation}deg)`,
          pointerEvents: 'none',
          zIndex: 10,
          opacity: showBubble ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '22px',
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            width: '20px',
            height: '20px',
            backgroundColor: 'var(--tblr-bg-surface, #fff)',
            borderRadius: '50%',
            border: `4px solid ${activeColor}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        />
      </div>

      <div
        className="d-flex justify-content-between px-3 position-absolute start-0 w-100"
        style={{ bottom: '40%' }}
      >
        <span className="small text-muted fw-bold">{min}</span>
        <span className="small text-muted fw-bold">{max}</span>
      </div>
    </div>
  )
}
