import { Chart, type ChartData } from '@/shared/components/ui/Chart'
import { formatCurrency } from '@/shared/utils/currencyUtils'

interface AssetAllocationCardProps {
  data: {
    cash: number
    investment: number
    saving: number
  }
}

export function AssetAllocationCard({ data }: AssetAllocationCardProps) {
  const total = data.cash + data.investment + data.saving

  const kebutuhanPct = total > 0 ? (data.cash / total) * 100 : 0
  const keinginanPct = total > 0 ? (data.saving / total) * 100 : 0
  const tabunganPct = total > 0 ? (data.investment / total) * 100 : 0

  const TARGET = { kebutuhan: 50, keinginan: 30, tabungan: 20 }

  const customRadialData: ChartData = {
    type: 'radialBar',
    series: [
      { name: 'Kebutuhan', color: 'orange', data: [Number(kebutuhanPct.toFixed(1))] },
      { name: 'Keinginan', color: 'azure', data: [Number(keinginanPct.toFixed(1))] },
      { name: 'Tabungan', color: 'green', data: [Number(tabunganPct.toFixed(1))] },
    ],
    hollowSize: '25%',
    startAngle: -90,
    endAngle: 270,
    trackMargin: 5,
    lineCap: 'round',
    legend: false,
  }

  const rows = [
    {
      label: 'Kebutuhan',
      sub: '50% target',
      pct: kebutuhanPct,
      target: TARGET.kebutuhan,
      dotBg: 'var(--tblr-orange)',
      badgeClass: 'text-orange',
      badgeBg: 'var(--tblr-orange-lt)',
    },
    {
      label: 'Keinginan',
      sub: '30% target',
      pct: keinginanPct,
      target: TARGET.keinginan,
      dotBg: 'var(--tblr-azure)',
      badgeClass: 'text-azure',
      badgeBg: 'var(--tblr-azure-lt)',
    },
    {
      label: 'Tabungan',
      sub: '20% target',
      pct: tabunganPct,
      target: TARGET.tabungan,
      dotBg: 'var(--tblr-green)',
      badgeClass: 'text-green',
      badgeBg: 'var(--tblr-green-lt)',
    },
  ]

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header border-0 pb-0 pt-4 px-4">
        <h3 className="card-title fw-bold">Budget 50/30/20</h3>
      </div>

      <div className="card-body p-4 pt-0 d-flex flex-column">
        <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-1">
          <Chart chartId="visual-asset-radial" chartData={{ ...customRadialData, height: 18 }} />
        </div>

        <div className="mt-2">
          <div className="subheader text-muted mb-1 text-uppercase">Budget Bulanan</div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span
              className="h1 fw-bold mb-0 lh-1"
              style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}
            >
              {formatCurrency(total)}
            </span>
          </div>

          <div className="d-flex flex-column gap-2">
            {rows.map((row) => (
              <div key={row.label} className="d-flex align-items-center">
                <div
                  className="rounded-1 flex-shrink-0 me-3"
                  style={{ width: '12px', height: '12px', background: row.dotBg }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-0">
                    <div className="fw-bold">{row.label}</div>
                    <div
                      className={`${row.badgeClass} fw-bold rounded-2 px-2 py-0.5`}
                      style={{ background: row.badgeBg, fontSize: '0.75rem' }}
                    >
                      {row.pct.toFixed(1)}%
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="flex-grow-1 rounded-pill"
                      style={{ height: '4px', background: 'var(--tblr-border-color)' }}
                    >
                      <div
                        className="rounded-pill h-100"
                        style={{
                          width: `${Math.min((row.pct / row.target) * 100, 100)}%`,
                          background: row.dotBg,
                        }}
                      />
                    </div>
                    <div
                      className="text-muted"
                      style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                    >
                      {row.sub}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
