import { Icon } from '@/shared/components/ui/Icon'

export function DebtAnalyticsWidget() {
  const insights = [
    {
      title: 'Collection Rate',
      desc: 'Tingkat penagihan piutang Anda bulan ini sebesar 85%.',
      icon: 'coin',
      color: 'warning',
    },
    {
      title: 'Rata-rata Waktu Pembayaran',
      desc: 'Rata-rata pembayaran utang/piutang diselesaikan dalam 18 hari.',
      icon: 'clock',
      color: 'blue',
    },
    {
      title: 'Debt Ratio',
      desc: 'Rasio utang terhadap aset Anda saat ini berada di 32%.',
      icon: 'chart-pie',
      color: 'red',
    },
  ]

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-3">
        <div className="text-secondary text-uppercase fw-semibold fs-5 mb-3">Analitik Singkat</div>

        <div className="d-flex flex-column gap-2">
          {insights.map((insight, idx) => (
            <div key={idx} className="d-flex gap-2 align-items-start">
              <div
                className={`d-flex align-items-center justify-content-center bg-${insight.color} text-white shadow-sm`}
                style={{ width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0 }}
              >
                <Icon icon={insight.icon as any} size="sm" style={{ transform: 'scale(0.75)' }} />
              </div>
              <div>
                <div className="fw-bold text-body" style={{ fontSize: '0.78rem' }}>{insight.title}</div>
                <div className="text-secondary lh-sm" style={{ fontSize: '0.68rem' }}>
                  {insight.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
