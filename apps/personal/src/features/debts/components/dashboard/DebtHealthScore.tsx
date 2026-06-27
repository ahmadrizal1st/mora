import { useMemo } from 'react'
import { Chart } from '@/shared/components/ui/Chart'

export function DebtHealthScore() {
  const chartData = useMemo(
    () => ({
      type: 'donut' as const,
      height: 10,
      series: [
        { name: 'Belum Lunas', data: [59.1], color: '#f59f00' },
        { name: 'Jatuh Tempo', data: [30.7], color: '#d63939' },
        { name: 'Lunas', data: [10.2], color: '#2fb344' }
      ],
      labels: ['Belum Lunas', 'Jatuh Tempo', 'Lunas'],
      colors: ['#f59f00', '#d63939', '#2fb344'],
      sparkline: true,
      donutValue: '3,1JT',
      donutLabel: 'Total',
      extend: {
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        stroke: {
          width: 3,
          colors: ['var(--tblr-bg-surface)'],
        },
        tooltip: {
          enabled: false,
        },
      },
    }),
    []
  )

  const items = [
    { label: 'Belum Lunas', amount: '1.850.000', pct: 59.1, color: '#f59f00' },
    { label: 'Jatuh Tempo', amount: '960.000', pct: 30.7, color: '#d63939' },
    { label: 'Lunas', amount: '320.000', pct: 10.2, color: '#2fb344' },
  ]

  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
      <div className="card-header border-bottom-0 bg-transparent p-3 pb-0">
        <h4 className="card-title text-muted fw-bold text-uppercase m-0" style={{ fontSize: '11px', letterSpacing: '1px' }}>
          Komposisi
        </h4>
      </div>
      <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center">
        {/* Donut Chart */}
        <div className="mb-4 w-100 d-flex justify-content-center" style={{ minHeight: '160px' }}>
          <Chart chartId="debtCompositionDonut" chartData={chartData as any} />
        </div>

        {/* Legends with Progress Bars */}
        <div className="w-100 mt-2">
          <div className="d-flex flex-column gap-3">
            {items.map((item, idx) => (
              <div key={idx}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: item.color,
                        borderRadius: '2px',
                      }}
                    ></span>
                    <span className="fw-medium text-secondary" style={{ fontSize: '13px' }}>
                      {item.label}
                    </span>
                  </div>
                  <div>
                    <span className="fw-bold text-dark me-1" style={{ fontSize: '13px' }}>
                      {item.amount}
                    </span>
                    <span className="text-muted" style={{ fontSize: '11px' }}>
                      {item.pct}%
                    </span>
                  </div>
                </div>
                <div className="progress" style={{ height: '5px', backgroundColor: 'var(--tblr-border-color-light, #f1f5f9)' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${item.pct}%`,
                      backgroundColor: item.color,
                      borderRadius: '4px',
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
