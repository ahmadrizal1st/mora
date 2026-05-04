import { Chart } from '@/shared/components/ui/Chart';
import { Icon } from '@/shared/components/ui/Icon';

export function AccountBalanceTrendCard() {
  const chartData = {
    type: 'area' as const,
    sparkline: true,
    height: 4,
    series: [
      {
        name: 'Balance',
        color: 'primary',
        data: [21000, 21500, 21200, 21800, 22500, 23000, 22800, 23500, 24850]
      }
    ],
    strokeWidth: [2],
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="avatar avatar-xs rounded bg-primary-lt text-primary">
              <Icon icon="chart-area-line" size="xs" />
            </div>
            <span className="text-secondary text-uppercase fw-semibold fs-5">Balance Trend</span>
          </div>
          <span className="text-success small fw-bold">+18%</span>
        </div>
        
        <div className="h3 fw-bold mb-1 font-monospace">Rp 24.850.000</div>
        <div className="text-secondary small mb-3">30 hari terakhir</div>
        
        <div style={{ height: '60px', margin: '0 -10px -10px -10px' }}>
          <Chart chartId="balanceTrendChart" chartData={chartData as any} />
        </div>
      </div>
    </div>
  );
}
