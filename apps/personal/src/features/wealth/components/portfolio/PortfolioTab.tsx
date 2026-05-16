import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';
import { Chart } from '@/shared/components/ui/Chart';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import { WealthRiskAnalysis } from './WealthRiskAnalysis';
import { WealthGoalProgress } from './WealthGoalProgress';
import { WealthRecentTransactions } from './WealthRecentTransactions';
import { WealthAssetClassPerformance } from './WealthAssetClassPerformance';
import { AssetLogo } from '../shared/AssetLogo';
import {
  MOCK_PORTFOLIO_DATA,
  MOCK_ALLOCATION_DATA,
  MOCK_PERFORMANCE_SERIES,
} from '../../data/mockWealthData';

export function PortfolioTab() {
  const { totalValue, totalGain, gainPercent, holdings } = MOCK_PORTFOLIO_DATA;

  const performanceChartData = {
    type: 'area' as const,
    height: 24,
    series: [
      {
        name: 'Portfolio',
        data: MOCK_PERFORMANCE_SERIES.portfolio,
        color: '#f76707',
      },
      {
        name: 'Benchmark',
        data: MOCK_PERFORMANCE_SERIES.benchmark,
        color: '#94a3b8',
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
      {/* AI Wealth Advisor Banner */}
      <div className="col-12 mb-2">
        <div className="card border-0 bg-primary-lt shadow-sm overflow-hidden">
          <div className="card-body p-3 position-relative">
            <div className="d-flex align-items-start gap-3 position-relative z-1">
              <div className="avatar avatar-md bg-primary text-white rounded-circle border-0 flex-shrink-0">
                <Icon icon="robot" size="md" />
              </div>
              <div className="flex-fill">
                <div className="d-flex align-items-center mb-1">
                  <h3 className="card-title mb-0 me-2 text-primary fw-bold">AI Wealth Advisor</h3>
                  <span className="badge bg-primary text-white px-2 py-1 border-0" style={{ fontSize: '10px' }}>Beta</span>
                </div>
                <p className="text-secondary mb-2 small" style={{ maxWidth: '800px' }}>
                  Saya telah menganalisis portofolio Anda. Alokasi Anda cukup agresif dengan porsi Kripto yang signifikan (20%). Untuk mencapai target dana darurat dalam 6 bulan, pertimbangkan memindahkan sebagian keuntungan ke instrumen rendah risiko.
                </p>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary btn-sm rounded-pill px-3 fw-medium">Lihat Analisis Detail</button>
                  <button className="btn btn-outline-primary bg-white btn-sm rounded-pill px-3 fw-medium">Simulasi Rebalancing</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 1: Performance & Market */}
      <div className="col-lg-8">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header border-0 pb-0">
            <h3 className="card-title fw-bold">Portfolio Performance</h3>
            <div className="card-actions">
              <div className="d-flex gap-1">
                {['1M', '3M', '6M', '1Y', 'ALL'].map((range, i) => (
                  <button key={range} className={clsx('btn btn-sm px-2', i === 3 ? 'btn-primary' : 'btn-ghost-secondary border-0')}>
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="card-body d-flex flex-column gap-3">
            <div className="d-flex align-items-end justify-content-between">
              <div>
                <div className="h1 mb-0 fw-black tracking-tight h1-mobile">{formatCurrency(totalValue)}</div>
              </div>
              <div className="text-end">
                <div className={clsx('fw-bold', totalGain >= 0 ? 'text-success' : 'text-danger')}>
                  {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)}
                </div>
                <div className={clsx('small', totalGain >= 0 ? 'text-success' : 'text-danger')} style={{ fontSize: '10px' }}>
                  {totalGain >= 0 ? '+' : ''}{gainPercent}% vs modal
                </div>
              </div>
            </div>
            <div className="flex-fill">
              <Chart chartId="portfolio-perf" chartData={performanceChartData} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <WealthAssetClassPerformance />
      </div>

      {/* ROW 2: Allocation, Goals & Risk */}
      <div className="col-lg-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header border-0 pb-0">
            <h3 className="card-title fw-bold">Asset Allocation</h3>
          </div>
          <div className="card-body d-flex flex-column justify-content-center">
            <Chart chartId="portfolio-alloc" chartData={allocationChartData} />
            <div className="mt-3">
              <div className="row g-2">
                {MOCK_ALLOCATION_DATA.map((a) => (
                  <div key={a.name} className="col-6">
                    <div className="d-flex align-items-center gap-2 p-2 rounded bg-body-tertiary h-100">
                      <span className="badge badge-dot" style={{ backgroundColor: a.color }} />
                      <div className="flex-fill overflow-hidden">
                        <div className="text-body fw-bold small text-truncate" style={{ fontSize: '11px' }}>{a.name}</div>
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
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header border-0 pb-0">
            <h3 className="card-title fw-bold">Holdings Portfolio</h3>
            <div className="card-actions">
              <button className="btn btn-primary btn-sm rounded-pill px-3">
                <Icon icon="plus" size="xs" className="me-1" />
                Add Asset
              </button>
            </div>
          </div>
          <div className="card-body p-0">
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
                          <AssetLogo ticker={h.ticker} name={h.name} type={h.type} color={h.color} logoUrl={h.logo} size="sm" className="me-3" />
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
                      <td className="text-end pe-4">
                        <div className={clsx('fw-bold', h.gain >= 0 ? 'text-success' : 'text-danger')}>
                          {h.gain >= 0 ? '+' : ''}{formatCurrency(h.gain)}
                        </div>
                        <div className={clsx('small', h.gain >= 0 ? 'text-success' : 'text-danger')} style={{ fontSize: '10px' }}>
                          {h.gain >= 0 ? '+' : ''}{h.gainPercent.toFixed(1)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <WealthRecentTransactions />
      </div>
    </div>
  );
}