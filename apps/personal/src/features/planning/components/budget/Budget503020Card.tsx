import { useState, useEffect } from 'react'
import { useBudgets } from '../../hooks/usePlanning'
import { formatCurrency } from '@/shared/utils/currencyUtils'

export function Budget503020Card() {
  const { data: budgetData } = useBudgets()
  const categories = budgetData?.categories || []
  const totalBudget = budgetData?.totalBudget || 0

  const needsCategories = categories.filter((c) => c.type === 'needs')
  const wantsCategories = categories.filter((c) => c.type === 'wants')
  const savingsCategories = categories.filter((c) => c.type === 'savings')

  const spentNeeds = needsCategories.reduce((sum, c) => sum + c.spent, 0)
  const spentWants = wantsCategories.reduce((sum, c) => sum + c.spent, 0)
  const spentSavings = savingsCategories.reduce((sum, c) => sum + c.spent, 0)

  const targetNeeds = totalBudget * 0.5
  const targetWants = totalBudget * 0.3
  const targetSavings = totalBudget * 0.2

  const pctNeeds = Math.min(Math.round((spentNeeds / targetNeeds) * 1000) / 10, 100)
  const pctWants = Math.min(Math.round((spentWants / targetWants) * 1000) / 10, 100)
  const pctSavings = Math.min(Math.round((spentSavings / targetSavings) * 1000) / 10, 100)

  const totalSpent = spentNeeds + spentWants + spentSavings

  const size = 220
  const center = size / 2

  const rings = [
    {
      id: 'needs',
      name: 'Kebutuhan',
      radius: 82,
      strokeWidth: 12,
      color: '#ff6b00',
      bgColor: 'var(--tblr-bg-surface-secondary, #f1f5f9)',
      percentage: pctNeeds,
    },
    {
      id: 'wants',
      name: 'Keinginan',
      radius: 64,
      strokeWidth: 12,
      color: '#066fd1',
      bgColor: 'var(--tblr-bg-surface-secondary, #f1f5f9)',
      percentage: pctWants,
    },
    {
      id: 'savings',
      name: 'Tabungan',
      radius: 46,
      strokeWidth: 12,
      color: '#2fb344',
      bgColor: 'var(--tblr-bg-surface-secondary, #f1f5f9)',
      percentage: pctSavings,
    },
  ]

  const [animatedPct, setAnimatedPct] = useState({ needs: 0, wants: 0, savings: 0 })

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPct({
        needs: pctNeeds,
        wants: pctWants,
        savings: pctSavings,
      })
    }, 100)
    return () => clearTimeout(timer)
  }, [pctNeeds, pctWants, pctSavings])

  return (
    <div className="card shadow-sm border-0 h-100 w-100" style={{ borderRadius: '24px' }}>
      <div className="card-body p-4 d-flex flex-column align-items-center justify-content-between">
        <div className="w-100 mb-1 text-start">
          <h3 className="card-title fw-bold text-body m-0" style={{ fontSize: '1.1rem' }}>
            Budget 50/30/20
          </h3>
        </div>

        <div className="position-relative my-1 d-flex align-items-center justify-content-center w-100">
          <svg className="concentric-chart-svg" viewBox={`0 0 ${size} ${size}`}>
            <defs>
              <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.12" />
              </filter>
            </defs>
            {rings.map((ring) => {
              const circumference = 2 * Math.PI * ring.radius
              const currentPct = animatedPct[ring.id as keyof typeof animatedPct]
              const strokeDashoffset = circumference - (currentPct / 100) * circumference

              const angle = (currentPct / 100) * 360
              const rad = ((180 + angle) * Math.PI) / 180
              const dotX = center + ring.radius * Math.cos(rad)
              const dotY = center + ring.radius * Math.sin(rad)

              return (
                <g key={ring.id}>
                  <circle
                    cx={center}
                    cy={center}
                    r={ring.radius}
                    stroke={ring.bgColor}
                    strokeWidth={ring.strokeWidth}
                    fill="transparent"
                  />

                  <circle
                    cx={center}
                    cy={center}
                    r={ring.radius}
                    stroke={ring.color}
                    strokeWidth={ring.strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(180 ${center} ${center})`}
                    style={{
                      transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />

                  <circle
                    cx={dotX}
                    cy={dotY}
                    r={7.5}
                    fill={ring.color}
                    stroke="#ffffff"
                    strokeWidth={2.5}
                    filter="url(#shadow)"
                    style={{
                      transition:
                        'cx 1.2s cubic-bezier(0.4, 0, 0.2, 1), cy 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </g>
              )
            })}
          </svg>
        </div>

        <div className="text-center w-100 mt-1 mb-2">
          <div
            className="text-secondary small fw-bold text-uppercase mb-0"
            style={{ fontSize: '9px', letterSpacing: '0.8px' }}
          >
            BUDGET BULANAN
          </div>
          <h2
            className="fw-bold text-body mb-0"
            style={{ fontSize: '1.6rem', letterSpacing: '-0.5px' }}
          >
            {formatCurrency(totalSpent)}
          </h2>
        </div>

        <div className="w-100 d-flex flex-column gap-2">
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#ff6b00',
                  }}
                />
                <span className="fw-bold text-body" style={{ fontSize: '13px' }}>
                  Kebutuhan
                </span>
              </div>
              <span
                className="badge fw-bold"
                style={{
                  backgroundColor: '#fff0e6',
                  color: '#ff6b00',
                  borderRadius: '12px',
                  padding: '3px 8px',
                  fontSize: '11px',
                }}
              >
                {pctNeeds.toFixed(1)}%
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-3">
              <div
                className="flex-fill bg-light rounded-pill"
                style={{ height: '5px', backgroundColor: '#e9ecef', overflow: 'hidden' }}
              >
                <div
                  className="rounded-pill"
                  style={{
                    height: '100%',
                    width: `${pctNeeds}%`,
                    backgroundColor: '#ff6b00',
                    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
              <span className="text-muted small text-nowrap" style={{ fontSize: '10px' }}>
                50% target
              </span>
            </div>
          </div>

          <div className="d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#066fd1',
                  }}
                />
                <span className="fw-bold text-body" style={{ fontSize: '13px' }}>
                  Keinginan
                </span>
              </div>
              <span
                className="badge fw-bold"
                style={{
                  backgroundColor: '#e6f0ff',
                  color: '#066fd1',
                  borderRadius: '12px',
                  padding: '3px 8px',
                  fontSize: '11px',
                }}
              >
                {pctWants.toFixed(1)}%
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-3">
              <div
                className="flex-fill bg-light rounded-pill"
                style={{ height: '5px', backgroundColor: '#e9ecef', overflow: 'hidden' }}
              >
                <div
                  className="rounded-pill"
                  style={{
                    height: '100%',
                    width: `${pctWants}%`,
                    backgroundColor: '#066fd1',
                    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
              <span className="text-muted small text-nowrap" style={{ fontSize: '10px' }}>
                30% target
              </span>
            </div>
          </div>

          <div className="d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#2fb344',
                  }}
                />
                <span className="fw-bold text-body" style={{ fontSize: '13px' }}>
                  Tabungan
                </span>
              </div>
              <span
                className="badge fw-bold"
                style={{
                  backgroundColor: '#eaf8eb',
                  color: '#2fb344',
                  borderRadius: '12px',
                  padding: '3px 8px',
                  fontSize: '11px',
                }}
              >
                {pctSavings.toFixed(1)}%
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-3">
              <div
                className="flex-fill bg-light rounded-pill"
                style={{ height: '5px', backgroundColor: '#e9ecef', overflow: 'hidden' }}
              >
                <div
                  className="rounded-pill"
                  style={{
                    height: '100%',
                    width: `${pctSavings}%`,
                    backgroundColor: '#2fb344',
                    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
              <span className="text-muted small text-nowrap" style={{ fontSize: '10px' }}>
                20% target
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
