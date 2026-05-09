import { Icon } from '@/shared/components/ui/Icon';

export function BudgetInsights() {
  const insights = [
    {
      title: 'Top Kategori',
      value: 'Groceries',
      subvalue: 'Rp 1.500.000',
      icon: 'shopping-cart',
      color: 'primary',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Terhemat',
      value: 'Hiburan',
      subvalue: '30% Limit',
      icon: 'device-tv',
      color: 'success',
      trend: '-5%',
      trendUp: false
    },
    {
      title: 'Overbudget',
      value: 'Transportasi',
      subvalue: '+Rp 200.000',
      icon: 'car',
      color: 'danger',
      trend: '+25%',
      trendUp: true
    },
    {
      title: 'Savings Goal',
      value: 'On Target',
      subvalue: 'Rp 4.500.000',
      icon: 'target',
      color: 'success',
      trend: '+5%',
      trendUp: false
    },
    {
      title: 'Smart Saving',
      value: 'Subscription',
      subvalue: '-Rp 150.000',
      icon: 'refresh',
      color: 'primary',
      trend: '-10%',
      trendUp: false
    }
  ];

  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
      <div className="card-header border-bottom py-3 px-4 bg-surface d-flex align-items-center justify-content-between">
        <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
          <Icon icon="bulb" size="sm" className="text-warning" />
          Budget Insights
        </h4>
        <button className="btn btn-ghost-primary btn-sm">Lihat Semua</button>
      </div>
      <div className="card-body p-0">
        <div className="list-group list-group-flush">
          {insights.map((insight, idx) => (
            <div key={idx} className="list-group-item py-3 px-4 border-0 border-bottom hover-bg-body-tertiary transition-all cursor-pointer">
              <div className="d-flex align-items-center gap-3">
                <div className={`avatar avatar-md rounded-3 bg-${insight.color}-lt text-${insight.color} border border-${insight.color}`}>
                  <Icon icon={insight.icon as any} size="sm" />
                </div>
                <div className="flex-fill">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '10px' }}>{insight.title}</span>
                    <span className={`small fw-bold ${insight.trendUp ? 'text-danger' : 'text-success'} d-flex align-items-center gap-1`}>
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
      <div className="card-footer p-3 bg-body-tertiary border-0 rounded-bottom-16">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="small fw-bold text-secondary text-uppercase" style={{ fontSize: '10px' }}>Month Progress</span>
          <span className="small fw-bold text-body">16 / 31 Days</span>
        </div>
        <div className="progress progress-xs" style={{ height: '6px' }}>
          <div className="progress-bar bg-primary" style={{ width: '51%' }}></div>
        </div>
      </div>
    </div>
  );
}