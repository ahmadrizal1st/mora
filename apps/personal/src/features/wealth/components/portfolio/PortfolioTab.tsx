import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';
import { Chart } from '@/shared/components/ui/Chart';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import { WealthRiskAnalysis } from './WealthRiskAnalysis';
import { WealthGoalProgress } from './WealthGoalProgress';
import { WealthRecentTransactions } from './WealthRecentTransactions';
import { WealthAssetClassPerformance } from './WealthAssetClassPerformance';
import {
  MOCK_PORTFOLIO_DATA,
  MOCK_ALLOCATION_DATA,
  MOCK_PERFORMANCE_SERIES,
} from '../../data/mockWealthData';

export function PortfolioTab() {
  const { totalValue, totalGain, gainPercent, holdings } = MOCK_PORTFOLIO_DATA;

  const performanceChartData = {
    type: 'area' as const,
    height: 18,
    series: [
      {
        name: 'Portfolio',
        data: MOCK_PERFORMANCE_SERIES.portfolio,
        color: 'primary',
      },
      {
        name: 'Benchmark',
        data: MOCK_PERFORMANCE_SERIES.benchmark,
        color: 'secondary',
      },
    ],
    categories: MOCK_PERFORMANCE_SERIES.months,
    strokeCurve: 'smooth',
    strokeWidth: [3, 2],
    hideGrid: false,
    legend: true,
  };

  const allocationChartData = {
    type: 'donut' as const,
    height: 18,
    series: MOCK_ALLOCATION_DATA.map((a) => ({
      name: a.name,
      data: [a.value],
      color: a.color,
    })),
    donutLabel: 'Total',
    donutValue: formatCurrency(totalValue).replace('Rp', 'Rp '),
    legend: true,
  };

  return (
    <div className="row g-3 tab-content-anim">
      {/* ROW 1: Performance & Market */}
      <div className="col-lg-8">
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-4">
              <div>
                <div className="subheader text-secondary">Portfolio Performance</div>
                <div className="h1 mb-0 fw-black">{formatCurrency(totalValue)}</div>
              </div>
              <div className="ms-auto text-end">
                <div className={clsx('h3 mb-0 fw-bold', totalGain >= 0 ? 'text-success' : 'text-danger')}>
                  {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)}
                </div>
                <div className={clsx('small fw-medium', totalGain >= 0 ? 'text-success' : 'text-danger')}>
                  {totalGain >= 0 ? '+' : ''}{gainPercent}% vs modal
                </div>
              </div>
            </div>
            <Chart chartId="portfolio-perf" chartData={performanceChartData} />
            <div className="mt-4">
              <div className="row g-2 justify-content-center">
                {['1M', '3M', '6M', '1Y', 'ALL'].map((range, i) => (
                  <div key={range} className="col-auto">
                    <button className={clsx('btn btn-sm px-3 rounded-pill', i === 3 ? 'btn-primary' : 'btn-ghost-secondary border-0')}>
                      {range}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <WealthAssetClassPerformance />
      </div>

      {/* ROW 2: Allocation, Goals & Risk */}
      <div className="col-lg-4">
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
          <div className="card-header border-bottom-0 pt-4 pb-0">
            <h3 className="card-title fw-bold">Asset Allocation</h3>
          </div>
          <div className="card-body">
            <Chart chartId="portfolio-alloc" chartData={allocationChartData} />
            <div className="mt-4">
              <div className="row g-2">
                {MOCK_ALLOCATION_DATA.map((a) => (
                  <div key={a.name} className="col-6">
                    <div className="d-flex align-items-center gap-2 p-2 rounded-2 bg-body-tertiary">
                      <span className="badge badge-dot" style={{ backgroundColor: a.color }} />
                      <div className="flex-fill overflow-hidden">
                        <div className="text-body fw-bold small text-truncate">{a.name}</div>
                        <div className="text-secondary" style={{ fontSize: '10px' }}>{a.percent}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <WealthGoalProgress />
      </div>

      <div className="col-lg-4">
        <WealthRiskAnalysis />
      </div>

      {/* ROW 3: Holdings & Recent Transactions */}
      <div className="col-lg-8">
        <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
          <div className="card-header border-bottom-0 pt-4">
            <h3 className="card-title fw-bold">Holdings Portfolio</h3>
            <div className="card-actions">
              <button className="btn btn-primary btn-sm rounded-pill px-3">
                <Icon icon="plus" size="xs" className="me-2" />
                Add Asset
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-vcenter card-table table-hover">
              <thead>
                <tr>
                  <th className="ps-4">Asset</th>
                  <th>Price</th>
                  <th>Value</th>
                  <th>Return</th>
                  <th className="text-end pe-4">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-sm me-3 rounded" style={{ backgroundColor: h.color, color: '#fff' }}>{h.logo}</span>
                        <div>
                          <div className="font-weight-bold">{h.ticker}</div>
                          <div className="text-secondary small">{h.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary small">{formatCurrency(h.currentPrice)}</td>
                    <td className="fw-bold">{formatCurrency(h.value)}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress progress-xs w-100" style={{ maxWidth: '60px' }}>
                          <div 
                            className={clsx('progress-bar', h.gain >= 0 ? 'bg-success' : 'bg-danger')} 
                            style={{ width: `${Math.min(Math.abs(h.gainPercent) * 2, 100)}%` }} 
                          />
                        </div>
                        <span className={clsx('fw-bold small', h.gain >= 0 ? 'text-success' : 'text-danger')}>
                          {h.gain >= 0 ? '+' : ''}{h.gainPercent.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className={clsx('text-end fw-bold pe-4', h.gain >= 0 ? 'text-success' : 'text-danger')}>
                      {h.gain >= 0 ? '+' : ''}{formatCurrency(h.gain)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <WealthRecentTransactions />
      </div>
    </div>
  );
}