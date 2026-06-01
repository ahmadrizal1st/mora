import { Icon } from '@/shared/components/ui/Icon'

export function DebtAnalyticsWidget() {
  const insights = [
    {
      title: 'Collection Rate',
      value: '85%',
      subvalue: 'Piutang',
      icon: 'coin',
      color: 'success',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Rata-rata Waktu',
      value: '18 Hari',
      subvalue: 'Pembayaran',
      icon: 'clock',
      color: 'blue',
      trend: '-2 hari',
      trendUp: false,
    },
    {
      title: 'Debt Ratio',
      value: '32%',
      subvalue: 'Utang / Aset',
      icon: 'home',
      color: 'danger',
      trend: '-5%',
      trendUp: false,
    },
  ]

  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
      <div className="card-header border-bottom py-3 px-4 bg-surface d-flex align-items-center justify-content-between">
        <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
          <Icon icon="bulb" size="sm" className="text-warning" />
          Analitik Singkat
        </h4>
        <a href="#" className="text-orange text-decoration-none fw-semibold small d-flex align-items-center gap-1">
          Lihat Laporan
        </a>
      </div>
      <div className="card-body p-0">
        <div className="list-group list-group-flush">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="list-group-item py-3 px-4 border-0 border-bottom hover-bg-body-tertiary transition-all cursor-pointer"
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className={`d-flex align-items-center justify-content-center bg-${insight.color}-lt text-${insight.color}`}
                  style={{ width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0 }}
                >
                  <Icon icon={insight.icon as any} size="sm" />
                </div>
                <div className="flex-fill">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span
                      className="text-secondary small fw-bold text-uppercase"
                      style={{ fontSize: '10px' }}
                    >
                      {insight.title}
                    </span>
                    <span
                      className={`small fw-bold ${insight.trendUp ? 'text-success' : 'text-success'} d-flex align-items-center gap-1`}
                    >
                      <Icon icon={insight.trendUp ? 'trending-up' : 'trending-down'} size="xs" />
                      {insight.trend}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold text-body">{insight.value}</span>
                    <span className="text-muted small">{insight.subvalue}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card-footer p-3 bg-body-tertiary border-0 rounded-bottom-16" style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span
            className="small fw-bold text-secondary text-uppercase"
            style={{ fontSize: '10px' }}
          >
            Target Pelunasan
          </span>
          <span className="small fw-bold text-body">3 / 10 Utang</span>
        </div>
        <div className="progress progress-xs" style={{ height: '6px' }}>
          <div className="progress-bar bg-orange" style={{ width: '30%' }}></div>
        </div>
      </div>
    </div>
  )
}
