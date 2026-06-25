import { Chart } from '@/shared/components/ui/Chart'
import { Icon } from '@/shared/components/ui/Icon'

const MOCK_DEBT_TREND = {
  categories: ['1 Mei', '6 Mei', '11 Mei', '16 Mei', '21 Mei', '26 Mei', '31 Mei'],
  piutang: [6000000, 11000000, 9000000, 7000000, 11000000, 10000000, 13000000],
  utang: [3000000, 4000000, 5000000, 3000000, 5000000, 7000000, 6000000],
}

export function DebtTrendChart() {
  const chartData = {
    type: 'line' as const,
    height: 20,
    series: [
      { name: 'Piutang', data: MOCK_DEBT_TREND.piutang, color: 'success' },
      { name: 'Utang', data: MOCK_DEBT_TREND.utang, color: 'danger' },
    ],
    sparkline: false,
    strokeWidth: [3, 3],
    strokeCurve: 'smooth',
    extend: {
      xaxis: {
        categories: MOCK_DEBT_TREND.categories,
        labels: {
          show: true,
          style: { fontSize: '12px', fontWeight: 500, cssClass: 'text-muted' },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        show: true,
        labels: {
          style: { fontSize: '12px', fontWeight: 500, cssClass: 'text-muted' },
          formatter: (val: number) => `${val / 1000000}jt`,
        },
      },
      grid: {
        show: true,
        borderColor: 'var(--tblr-border-color)',
        strokeDashArray: 4,
        padding: { top: 0, right: 10, left: 0, bottom: 0 },
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        offsetY: 0,
        fontSize: '13px',
        fontWeight: 600,
        markers: { radius: 12 },
      },
      markers: {
        size: 0,
      },
    },
  }

  return (
    <div className="card shadow-sm border-0 h-100 overflow-hidden" style={{ borderRadius: '16px' }}>
      <div className="card-header border-bottom-0 bg-transparent pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
        <h3 className="card-title fw-bold m-0 d-flex align-items-center gap-2">
          Debt & Receivable Trend
          <Icon icon="info-circle" size={16} className="text-muted ms-1" />
        </h3>
        <div className="d-flex gap-2">
          <div className="btn-group shadow-sm rounded-2 overflow-hidden">
            <button className="btn btn-sm btn-ghost-secondary border-0 bg-surface">Mingguan</button>
            <button className="btn btn-sm btn-primary border-0">Bulanan</button>
            <button className="btn btn-sm btn-ghost-secondary border-0 bg-surface">Tahunan</button>
          </div>
          <button className="btn btn-sm btn-light border-0 shadow-sm d-flex align-items-center gap-2">
            Mei 2026
            <Icon icon="calendar" size={14} />
          </button>
        </div>
      </div>
      <div className="card-body p-4 pt-2">
        <div style={{ margin: '0 -10px' }}>
          <Chart chartId="debtTrendChart" chartData={chartData as any} />
        </div>
      </div>
    </div>
  )
}
