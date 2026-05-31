import { Icon } from '@/shared/components/ui/Icon'
import { Chart } from '@/shared/components/ui/Chart'

export function BudgetAnalysisCard() {
  const radialChartData = {
    type: 'radialBar' as const,
    series: [66],
    height: 10,
    colors: ['var(--tblr-warning)'],
    extend: {
      plotOptions: {
        radialBar: {
          startAngle: -110,
          endAngle: 110,
          hollow: { size: '55%' },
          track: {
            background: 'var(--tblr-border-color-light)',
            strokeWidth: '100%',
            margin: 0,
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: '10px',
              color: 'var(--tblr-secondary)',
              offsetY: -8,
            },
            value: {
              show: true,
              fontSize: '15px',
              fontWeight: '700',
              color: 'var(--tblr-dark)',
              offsetY: 4,
              formatter: () => 'Rp 10,0 jt',
            },
          },
        },
      },
    },
    seriesName: 'Spent',
    stroke: {
      lineCap: 'butt',
      dashArray: 4,
    },
  }

  const finalChartData = {
    ...radialChartData,
    series: [{ name: 'Spent', data: [66] }],
  }

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-3 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="avatar avatar-xs rounded bg-warning-lt text-warning">
              <Icon icon="target" size="xs" />
            </div>
            <span className="text-secondary text-uppercase fw-semibold fs-5">Analisis Budget</span>
          </div>
          <a href="#" className="text-primary small fw-medium">
            Edit ›
          </a>
        </div>

        <div className="text-secondary small mb-3">Pengeluaran vs Limit (Mei)</div>

        <div className="mx-auto" style={{ height: '140px', width: '100%', marginTop: '-10px' }}>
          <Chart chartId="budgetRadialGauge" chartData={finalChartData as any} />
        </div>

        <div className="text-center mb-3">
          <div className="text-muted" style={{ fontSize: '10px', marginTop: '-35px' }}>
            Limit Rp 15.0 jt
          </div>
        </div>

        <div className="mt-auto pt-2 border-top">
          <div className="text-secondary small text-center">
            Sisa budget <span className="text-dark fw-bold">Rp 5.0 jt</span> (Aman)
          </div>
        </div>
      </div>
    </div>
  )
}
