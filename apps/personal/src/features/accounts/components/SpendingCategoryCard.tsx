import React from 'react'
import { Chart } from '@/shared/components/ui/Chart'
import { Icon } from '@/shared/components/ui/Icon'
import { Link } from '@tanstack/react-router'

interface Category {
  ico: string
  color: string
  n: string
  pct: number
  v: string
}

interface SpendingCategoryCardProps {
  categories: Category[]
}

export function SpendingCategoryCard({ categories }: SpendingCategoryCardProps) {
  const donutChartData = {
    type: 'donut' as const,
    height: 6,
    series: categories.map((c) => ({ name: c.n, data: [c.pct], color: c.color.startsWith('#') ? c.color : `var(--tblr-${c.color})` })),
    hollowSize: '75%',
    hideTooltip: true,
    legend: false,
    sparkline: true,
  }

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-3 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <span className="text-secondary text-uppercase fw-semibold fs-5">Pengeluaran</span>
          <span className="text-secondary small">Bulan Ini</span>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex justify-content-center text-secondary mb-3">
              <Icon icon="chart-pie" size={40} stroke={1.5} style={{ opacity: 0.6 }} />
            </div>
            <div className="fw-bold text-body mb-1">Belum Ada Pengeluaran</div>
            <div className="text-muted small">Mulai catat pengeluaran Anda.</div>
            <Link to="/tracker/" className="btn btn-primary btn-sm d-flex align-items-center gap-2">
              <Icon icon="plus" size={16} stroke={2} />
              Catat Transaksi
            </Link>
          </div>
        ) : (
          <>
            <div className="row g-2 align-items-center mb-4">
              <div className="col-5">
                <div style={{ height: '100px' }}>
                  <Chart chartId="spendingDonut" chartData={donutChartData as any} />
                </div>
              </div>
              <div className="col-7">
                <div className="row g-2">
                  {categories.slice(0, 4).map((c, i) => (
                    <div key={i} className="col-6">
                      <div className="d-flex align-items-center gap-1">
                        <span
                          className="badge badge-dot"
                          style={{ width: '6px', height: '6px', backgroundColor: c.color }}
                        ></span>
                        <span className="text-secondary text-truncate" style={{ fontSize: '0.65rem' }}>
                          {c.n}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="d-flex flex-column gap-2" style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '5px' }}>
              {[...categories].sort((a, b) => {
                if (a.n === 'Lainnya') return 1;
                if (b.n === 'Lainnya') return -1;
                return 0;
              }).map((c, i) => (
                <div key={i} className="border-0">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="d-flex align-items-center justify-content-center text-white shadow-sm"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          flexShrink: 0,
                          backgroundColor: c.color
                        }}
                      >
                        <Icon icon={c.ico} size="sm" style={{ transform: 'scale(0.8)' }} />
                      </div>
                      <span className="text-body fw-semibold" style={{ fontSize: '0.75rem', lineHeight: 1 }}>{c.n}</span>
                    </div>
                    <span className="text-body fw-bold font-monospace" style={{ fontSize: '0.75rem', lineHeight: 1 }}>{c.v}</span>
                  </div>
                  <div
                    className="progress"
                    style={{ backgroundColor: 'var(--tblr-border-color)', height: '4px' }}
                  >
                    <div className="progress-bar" style={{ width: `${c.pct}%`, backgroundColor: c.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
