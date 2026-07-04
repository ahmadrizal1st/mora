import { Icon } from '@/shared/components/ui/Icon'
import { useBudgetInsights } from '../../hooks/usePlanning'

export function BudgetInsights() {
  const { data: insightsData, isLoading } = useBudgetInsights()

  const defaultInsights = [
    { title: 'Top Kategori', value: '-', subvalue: 'Rp 0', icon: 'shopping-cart', solidColor: '#d95c00', trend: '0%', trendUp: true },
    { title: 'Terhemat', value: '-', subvalue: '0% Limit', icon: 'device-tv', solidColor: '#0f9d58', trend: '0%', trendUp: false },
    { title: 'Overbudget', value: '-', subvalue: '+Rp 0', icon: 'car', solidColor: '#e02424', trend: '0%', trendUp: true },
    { title: 'Savings Goal', value: 'On Target', subvalue: 'Rp 0', icon: 'target', solidColor: '#10b981', trend: '0%', trendUp: false },
    { title: 'Smart Saving', value: 'Subscription', subvalue: 'Rp 0', icon: 'refresh', solidColor: '#3b82f6', trend: '0%', trendUp: false },
    { title: 'Sisa Anggaran', value: '-', subvalue: 'Rp 0', icon: 'wallet', solidColor: '#206bc4', trend: '0%', trendUp: false },
  ]

  const insights = insightsData ? [
    { title: 'Top Kategori', ...(insightsData.top_category || defaultInsights[0]) },
    { title: 'Terhemat', ...(insightsData.terhemat || defaultInsights[1]) },
    { title: 'Overbudget', ...(insightsData.overbudget || defaultInsights[2]) },
    { title: 'Savings Goal', ...(insightsData.savings_goal || defaultInsights[3]) },
    { title: 'Smart Saving', ...(insightsData.smart_saving || defaultInsights[4]) },
    { title: 'Sisa Anggaran', ...(insightsData.sisa_saldo || defaultInsights[5]) },
  ] : defaultInsights

  const isEmpty = !insightsData || (
    (!insightsData.top_category || insightsData.top_category.value === '-') &&
    (!insightsData.terhemat || insightsData.terhemat.value === '-') &&
    (!insightsData.overbudget || insightsData.overbudget.value === '-')
  )

  const today = new Date()
  const currentDay = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const monthProgress = Math.round((currentDay / daysInMonth) * 100)

  return (
    <div className="card shadow-sm border-0 h-100 flex-grow-1" style={{ borderRadius: '24px', overflow: 'hidden' }}>
      <div className="card-body p-3 d-flex flex-column">
        <div className="text-secondary text-uppercase fw-semibold fs-5 mb-3">
          Budget Insights
        </div>

        {isLoading ? (
          <div className="text-center text-secondary py-4 flex-grow-1 d-flex flex-column justify-content-center">Memuat data insights...</div>
        ) : isEmpty ? (
          <div className="text-center py-4 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <div className="mb-3">
              <Icon icon="category-2" size={40} stroke={1.5} style={{ opacity: 0.6 }} />
            </div>
            <div className="fw-bold text-body mb-1">Belum Ada Insights</div>
            <div className="text-muted small mb-3">Tambahkan budget untuk melihat analisis</div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2 flex-grow-1">
            {insights.map((insight: any, idx: number) => (
              <div key={idx} className="border-0">
                <div className="row align-items-center g-2">
                  <div className="col-auto">
                    <div
                      className="d-flex align-items-center justify-content-center text-white shadow-sm"
                      style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: insight.solidColor }}
                    >
                      <Icon icon={insight.icon as any} size="sm" style={{ transform: 'scale(0.8)' }} />
                    </div>
                  </div>
                  <div className="col">
                    <div className="text-body fw-bold" style={{ fontSize: '0.8rem' }}>{insight.value}</div>
                    <div className="text-secondary" style={{ fontSize: '0.7rem' }}>
                      {insight.title} &middot; {insight.trend}
                    </div>
                  </div>
                  <div className="col-auto text-end">
                    <div className="text-body fw-bold font-monospace" style={{ fontSize: '0.8rem' }}>
                      {insight.subvalue}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {!isEmpty && !isLoading && (
          <div className="border-top pt-3 mt-4" style={{ borderColor: 'var(--tblr-border-color)' }}>
            <div className="d-flex align-items-center justify-between mb-2">
              <span className="fw-bold text-secondary text-uppercase" style={{ fontSize: '0.7rem' }}>
                Month Progress
              </span>
              <span className="fw-bold text-body" style={{ fontSize: '0.75rem' }}>{currentDay} / {daysInMonth} Days</span>
            </div>
            <div className="progress progress-xs" style={{ height: '6px' }}>
              <div className="progress-bar bg-primary" style={{ width: `${monthProgress}%` }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
