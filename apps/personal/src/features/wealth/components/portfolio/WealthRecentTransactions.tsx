import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';
import { formatCurrency } from '@/shared/utils/currencyUtils';

const MOCK_RECENT_TRANSACTIONS = [
  { id: '1', type: 'buy', asset: 'BBCA', name: 'Bank Central Asia', amount: 5000000, date: '10 Mei 2026', icon: 'trending-up', color: 'blue' },
  { id: '2', type: 'dividend', asset: 'ASII', name: 'Astra International', amount: 350000, date: '08 Mei 2026', icon: 'cash', color: 'green' },
  { id: '3', type: 'sell', asset: 'GOTO', name: 'GoTo Gojek Tokopedia', amount: 1200000, date: '05 Mei 2026', icon: 'trending-down', color: 'red' },
  { id: '4', type: 'buy', asset: 'SBN', name: 'SBR013', amount: 10000000, date: '01 Mei 2026', icon: 'building-bank', color: 'purple' },
];

export function WealthRecentTransactions() {
  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
      <div className="card-header border-bottom-0 pt-4 pb-0">
        <h3 className="card-title fw-bold">Recent Activities</h3>
      </div>
      <div className="card-body">
        <div className="d-flex flex-column gap-3">
          {MOCK_RECENT_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="d-flex align-items-center">
              <div className={clsx('avatar avatar-sm rounded-circle shadow-none me-3', `bg-${tx.color}-lt text-${tx.color}`)}>
                <Icon icon={tx.icon as string} size="sm" />
              </div>
              <div className="flex-fill">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold text-body">{tx.asset}</span>
                  <span className={clsx('fw-bold', tx.type === 'sell' ? 'text-danger' : tx.type === 'dividend' ? 'text-success' : 'text-body')}>
                    {tx.type === 'sell' ? '-' : '+'}{formatCurrency(tx.amount)}
                  </span>
                </div>
                <div className="d-flex justify-content-between text-secondary" style={{ fontSize: '11px' }}>
                  <span>{tx.name}</span>
                  <span>{tx.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card-footer bg-transparent border-0 pt-0 pb-4">
        <button className="btn btn-ghost-primary btn-sm w-100">View All Transactions</button>
      </div>
    </div>
  );
}
