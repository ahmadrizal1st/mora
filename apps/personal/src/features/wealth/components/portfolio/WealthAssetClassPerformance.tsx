import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';

const ASSET_PERF = [
  { name: 'Equities', change: 1.2, color: 'blue', icon: 'trending-up' },
  { name: 'Crypto', change: -3.4, color: 'orange', icon: 'trending-down' },
  { name: 'Bonds', change: 0.1, color: 'purple', icon: 'building-bank' },
  { name: 'Commodities', change: 0.8, color: 'yellow', icon: 'leaf' },
];

export function WealthAssetClassPerformance() {
  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
      <div className="card-header border-bottom-0 pt-4">
        <h3 className="card-title fw-bold">Market Performance</h3>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {ASSET_PERF.map((asset) => (
            <div key={asset.name} className="col-6">
              <div className="p-3 rounded-3 bg-body-tertiary border border-dashed h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className={clsx('avatar avatar-xs rounded shadow-none', `bg-${asset.color}-lt text-${asset.color}`)}>
                    <Icon icon={asset.icon as string} size="xs" />
                  </div>
                  <span className="text-secondary fw-bold" style={{ fontSize: '10px' }}>{asset.name}</span>
                </div>
                <div className={clsx('h3 mb-0 fw-bold', asset.change >= 0 ? 'text-success' : 'text-danger')}>
                  {asset.change >= 0 ? '+' : ''}{asset.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card-footer bg-transparent border-0 pt-0 pb-4">
        <div className="d-flex align-items-center gap-2 text-secondary small">
          <Icon icon="clock" size="xs" />
          <span>Last updated: Just now</span>
        </div>
      </div>
    </div>
  );
}
