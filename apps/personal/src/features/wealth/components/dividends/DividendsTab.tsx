import { Icon } from '@/shared/components/ui/Icon';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import { Chart } from '@/shared/components/ui/Chart';
import { MOCK_DIVIDENDS, MOCK_INCOME_PROJECTION } from '../../data/mockWealthData';
import { clsx } from 'clsx';

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
        color: 'primary',
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
        <div className="card bg-primary text-primary-fg h-100">
          <div className="card-body">
            <div className="subheader text-primary-fg opacity-50 mb-3">Estimasi Dividen Mendatang</div>
            <div className="d-flex align-items-baseline gap-2 mb-4">
              <div className="h1 mb-0">{formatCurrency(totalUpcoming)}</div>
              <div className="badge bg-white-10 text-white border-0">+18% YoY</div>
            </div>
            <div className="subheader text-primary-fg opacity-50 mb-2">Proyeksi Pendapatan Pasif</div>
            <Chart chartId="dividend-projection" chartData={incomeChartData} />
          </div>
        </div>
      </div>

      <div className="col-lg-7">
        <div className="card h-100">
          <div className="card-header">
            <h3 className="card-title">Insight Dividen</h3>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-6">
                <div className="border border-dashed p-3 rounded">
                  <div className="subheader mb-1">Yield Rata-rata</div>
                  <div className="h2 mb-0">4.2%</div>
                </div>
              </div>
              <div className="col-6">
                <div className="border border-dashed p-3 rounded">
                  <div className="subheader mb-1">Total Cair (YTD)</div>
                  <div className="h2 mb-0">{formatCurrency(2450000)}</div>
                </div>
              </div>
              <div className="col-12">
                <div className="alert alert-success mb-0">
                  <div className="d-flex align-items-center gap-3">
                    <Icon icon="check" size="sm" />
                    <div>
                      <div className="font-weight-bold">Pencapaian Baru!</div>
                      <div className="text-secondary small">Dividen bulan ini cukup untuk membayar <b>Tagihan Listrik</b> Anda.</div>
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
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Kalender Dividen</h3>
          </div>
          <div className="table-responsive">
            <table className="table table-vcenter card-table">
              <thead>
                <tr>
                  <th>Efek</th>
                  <th>Tanggal Estimasi</th>
                  <th>Jumlah</th>
                  <th className="text-end">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DIVIDENDS.map((d, i) => (
                  <tr key={i}>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="avatar avatar-xs me-2 rounded bg-body-tertiary">{d.ticker[0]}</span>
                        <span className="font-weight-medium">{d.ticker}</span>
                      </div>
                    </td>
                    <td className="text-secondary small">{d.date}</td>
                    <td className="fw-bold">{formatCurrency(d.amount)}</td>
                    <td className="text-end">
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

      {/* Tips */}
      <div className="col-lg-4">
        <div className="card h-100">
          <div className="card-header">
            <h3 className="card-title">Tips Wealth</h3>
          </div>
          <div className="card-body">
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
