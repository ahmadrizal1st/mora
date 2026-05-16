import { Icon } from '@/shared/components/ui/Icon';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import { Chart } from '@/shared/components/ui/Chart';
import { MOCK_DIVIDENDS, MOCK_INCOME_PROJECTION } from '../../data/mockWealthData';
import { clsx } from 'clsx';
import { AssetLogo } from '../shared/AssetLogo';

export function DividendsTab() {
  const totalUpcoming = MOCK_DIVIDENDS
    .filter(d => d.status === 'upcoming')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const incomeChartData = {
    type: 'area' as const,
    height: 8,
    animations: true,
    series: [
      {
        name: 'Estimasi Dividen',
        data: MOCK_INCOME_PROJECTION.map(d => d.amount),
        color: '#ffffff',
      }
    ],
    categories: MOCK_INCOME_PROJECTION.map(d => d.month),
    strokeCurve: 'smooth',
    strokeWidth: [3],
    sparkline: true,
  };

  return (
    <div className="row row-cards tab-content-anim">
      {/* Dividend Stats & Projection */}
      <div className="col-lg-5">
        <div className="card bg-primary text-primary-fg h-100 shadow-sm border-0">
          <div className="card-body d-flex flex-column justify-content-between">
            <div>
              <div className="subheader text-primary-fg opacity-50 mb-3 text-mobile-xs">Estimasi Dividen Mendatang</div>
              <div className="d-flex align-items-baseline gap-2 mb-4">
                <div className="h1 mb-0 h1-mobile">{formatCurrency(totalUpcoming)}</div>
                <div className="badge bg-white-10 text-white border-0">+18% YoY</div>
              </div>
            </div>
            <div>
              <div className="subheader text-primary-fg opacity-50 mb-2 text-mobile-xs">Proyeksi Pendapatan Pasif</div>
              <Chart chartId="dividend-projection" chartData={incomeChartData} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-7">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header border-0 pb-0">
            <h3 className="card-title fw-bold">Insight Dividen</h3>
          </div>
          <div className="card-body d-flex flex-column justify-content-center">
            <div className="row g-3">
              <div className="col-6">
                <div className="border border-dashed p-3 rounded h-100">
                  <div className="subheader mb-1 text-mobile-xs">Yield Rata-rata</div>
                  <div className="h2 mb-0 h1-mobile">4.2%</div>
                </div>
              </div>
              <div className="col-6">
                <div className="border border-dashed p-3 rounded h-100">
                  <div className="subheader mb-1 text-mobile-xs">Total Cair (YTD)</div>
                  <div className="h2 mb-0 h1-mobile">{formatCurrency(2450000)}</div>
                </div>
              </div>
              <div className="col-12 mt-4">
                <div className="card bg-primary-lt border-0 shadow-none mb-0">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="font-weight-bold d-flex align-items-center gap-2">
                        <Icon icon="flame" size="sm" className="text-orange" />
                        Financial Independence
                      </div>
                      <div className="text-primary fw-bold">15%</div>
                    </div>
                    <div className="progress progress-sm rounded-pill bg-white shadow-none mb-2">
                      <div className="progress-bar bg-primary rounded-pill" style={{ width: '15%' }} />
                    </div>
                    <div className="text-secondary small">
                      Dividen menutupi <b>15%</b> dari rata-rata pengeluaran bulanan Anda.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dividend List */}
      <div className="col-lg-8">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header border-0 pb-0">
            <h3 className="card-title fw-bold">Kalender Dividen</h3>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th className="ps-4">Efek</th>
                    <th>Tanggal Estimasi</th>
                    <th>Jumlah</th>
                    <th className="text-end pe-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_DIVIDENDS.map((d, i) => (
                    <tr key={i}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          <AssetLogo ticker={d.ticker} name={d.ticker} logoUrl={d.logo} size="xs" className="me-2" />
                          <span className="font-weight-medium">{d.ticker}</span>
                        </div>
                      </td>
                      <td className="text-secondary small">{d.date}</td>
                      <td className="fw-bold">{formatCurrency(d.amount)}</td>
                      <td className="text-end pe-4">
                        <span className={clsx('badge', d.status === 'paid' ? 'bg-green-lt text-green' : 'bg-blue-lt text-blue')}>
                          {d.status === 'paid' ? 'Sudah Cair' : 'Mendatang'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="col-lg-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header border-0 pb-0">
            <h3 className="card-title fw-bold">Tips Wealth</h3>
          </div>
          <div className="card-body d-flex flex-column justify-content-center">
            <div className="mb-4">
              <div className="font-weight-bold mb-1">Reinvestasi Dividen</div>
              <p className="text-secondary small mb-0">Gunakan dividen untuk membeli kembali saham agar tercipta efek <i>compounding interest</i>.</p>
            </div>
            <div className="mb-4">
              <div className="font-weight-bold mb-1">Diversifikasi Sektor</div>
              <p className="text-secondary small mb-0">Pastikan portfolio anda tersebar di berbagai sektor untuk meminimalisir risiko.</p>
            </div>
            <button className="btn btn-primary w-100 mt-2">Pelajari Lebih Lanjut</button>
          </div>
        </div>
      </div>
    </div>
  );
}
