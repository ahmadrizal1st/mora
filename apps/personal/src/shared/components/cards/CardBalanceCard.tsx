import { Icon } from '@/shared/components/ui/Icon';

const holdings = [
  { name: 'Apple Inc.', ticker: 'AAPL', value: '$44,200', pct: '+5.2%', positive: true, icon: 'brand-apple', bg: '#111827' },
  { name: 'Bitcoin', ticker: 'BTC', value: '$5,580', pct: '+12.4%', positive: true, icon: 'currency-bitcoin', bg: '#f59e0b' },
  { name: 'S&P 500 ETF', ticker: 'VOO', value: '$32,000', pct: '+2.1%', positive: true, icon: 'trending-up', bg: '#22c55e' },
  { name: 'Real Estate', ticker: 'REITs', value: '$357,000', pct: '0.0%', positive: false, icon: 'home', bg: '#6366f1' },
];

export function CardBalanceCard() {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-header border-0 pb-0 pt-4 px-4">
        <h3 className="card-title fw-bold">Top Holdings</h3>
        <div className="card-actions">
          <a
            href="#"
            className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
          >
            <span className="text-decoration-underline-hover">View All</span>
            <Icon icon="chevron-right" size="xs" />
          </a>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="subheader px-3 pt-3 pb-1">Total Portfolio</div>
        <div className="px-3 pb-3">
          <span className="h2 mb-0">$1,377,000</span>
        </div>

        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <tbody>
              {holdings.map((h) => (
                <tr key={h.ticker}>
                  <td className="w-1">
                    <div
                      className="d-flex align-items-center justify-content-center text-white"
                      style={{ width: '38px', height: '38px', borderRadius: '10px', background: h.bg, flexShrink: 0 }}
                    >
                      <Icon icon={h.icon} size="sm" />
                    </div>
                  </td>
                  <td>
                    <div className="fw-medium">{h.name}</div>
                    <div className="text-secondary small">{h.ticker}</div>
                  </td>
                  <td className="text-end">
                    <div className="fw-medium">{h.value}</div>
                    <div className={`small ${h.positive ? 'text-success' : 'text-secondary'}`}>
                      {h.positive ? <Icon icon="trending-up" size="xs" className="me-1" /> : <Icon icon="minus" size="xs" className="me-1" />}
                      {h.pct}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
