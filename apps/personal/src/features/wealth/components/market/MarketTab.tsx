import { clsx } from 'clsx';
import { Chart } from '@/shared/components/ui/Chart';
import { MOCK_TOP_MOVERS } from '../../data/mockWealthData';
import { AssetLogo } from '../shared/AssetLogo';

export function MarketTab() {
  const { gainers, losers } = MOCK_TOP_MOVERS;

  const marketIndices = [
    { name: 'IHSG', value: '7,250.45', change: '+0.45%', positive: true, data: [7100, 7150, 7120, 7200, 7230, 7250.45] },
    { name: 'LQ45', value: '985.20', change: '-0.12%', positive: false, data: [995, 990, 992, 988, 986, 985.20] },
    { name: 'USD/IDR', value: '15,845', change: '-0.25%', positive: true, data: [15950, 15920, 15900, 15880, 15860, 15845] },
  ];

  return (
    <div className="row row-cards tab-content-anim">
      {/* Market Indices */}
      {marketIndices.map((index) => (
        <div key={index.name} className="col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-3">
              <div className="row align-items-center">
                <div className="col">
                  <div className="subheader text-secondary text-mobile-xs">{index.name}</div>
                  <div className="h3 mb-0 fw-bold h1-mobile">{index.value}</div>
                </div>
                <div className="col-auto">
                  <span className={clsx('badge', index.positive ? 'bg-green-lt text-green' : 'bg-red-lt text-red')}>
                    {index.change}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <Chart
                  chartId={`market-index-${index.name}`}
                  chartData={{
                    type: 'line',
                    sparkline: true,
                    height: 3,
                    series: [{ name: index.name, data: index.data, color: index.positive ? 'success' : 'danger' }],
                    strokeCurve: 'smooth',
                    strokeWidth: [2],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Top Gainers & Losers */}
      <div className="col-lg-6">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header border-0 pb-0">
            <h3 className="card-title fw-bold">Top Gainers</h3>
          </div>
          <div className="card-body p-0">
            <div className="list-group list-group-flush">
              {gainers.map((g) => (
                <div key={g.ticker} className="list-group-item border-0 py-3">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <AssetLogo ticker={g.ticker} name={g.ticker} logoUrl={g.logo} size="sm" />
                    </div>
                    <div className="col">
                      <div className="font-weight-medium">{g.ticker}</div>
                      <div className="text-secondary small">{g.price.toLocaleString('id-ID')}</div>
                    </div>
                    <div className="col-auto">
                      <div className="text-green fw-bold">+{g.change}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header border-0 pb-0">
            <h3 className="card-title fw-bold">Top Losers</h3>
          </div>
          <div className="card-body p-0">
            <div className="list-group list-group-flush">
              {losers.map((l) => (
                <div key={l.ticker} className="list-group-item border-0 py-3">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <AssetLogo ticker={l.ticker} name={l.ticker} logoUrl={l.logo} size="sm" />
                    </div>
                    <div className="col">
                      <div className="font-weight-medium">{l.ticker}</div>
                      <div className="text-secondary small">{l.price.toLocaleString('id-ID')}</div>
                    </div>
                    <div className="col-auto">
                      <div className="text-red fw-bold">{l.change}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Actions */}
      <div className="col-lg-8">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header border-0 pb-0">
            <h3 className="card-title fw-bold">Aksi Korporasi Mendatang</h3>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th className="ps-4">Emiten</th>
                    <th>Tipe</th>
                    <th>Keterangan</th>
                    <th>Tanggal</th>
                    <th className="text-end pe-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ticker: 'BBCA', type: 'Stock Split', ratio: '1:5', date: '22 Mei 2026', status: 'Approved', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
                    { ticker: 'ASII', type: 'Cum Dividend', amount: 'Rp 550', date: '15 Mei 2026', status: 'Pending', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Astra_International_logo.svg' },
                    { ticker: 'GOTO', type: 'Right Issue', price: 'Rp 80', date: '02 Jun 2026', status: 'Proposed', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/GoTo_logo.svg' },
                    { ticker: 'TLKM', type: 'Public Expose', location: 'Virtual', date: '10 Mei 2026', status: 'Confirmed', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Telkom_Indonesia_2013.svg' },
                  ].map((action, i) => (
                    <tr key={i}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          <AssetLogo ticker={action.ticker} name={action.ticker} logoUrl={action.logoUrl} size="xs" className="me-2" />
                          <span className="font-weight-medium">{action.ticker}</span>
                        </div>
                      </td>
                      <td>{action.type}</td>
                      <td className="text-secondary small">{action.ratio || action.amount || action.location}</td>
                      <td>{action.date}</td>
                      <td className="text-end pe-4">
                        <span className={clsx('badge', 
                          action.status === 'Approved' ? 'bg-green-lt text-green' : 
                          action.status === 'Proposed' ? 'bg-orange-lt text-orange' : 'bg-blue-lt text-blue'
                        )}>
                          {action.status}
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

      <div className="col-lg-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header border-0 pb-0">
            <h3 className="card-title fw-bold">Sektor Teraktif</h3>
          </div>
          <div className="card-body d-flex flex-column justify-content-center">
            {[
              { name: 'Teknologi', change: 2.45, positive: true },
              { name: 'Keuangan', change: 1.12, positive: true },
              { name: 'Kesehatan', change: -0.85, positive: false },
              { name: 'Energi', change: 0.34, positive: true },
            ].map((s) => (
              <div key={s.name} className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="subheader">{s.name}</span>
                  <span className={clsx('fw-bold', s.positive ? 'text-green' : 'text-red')}>
                    {s.positive ? '+' : ''}{s.change}%
                  </span>
                </div>
                <div className="progress progress-sm shadow-none overflow-hidden" style={{ height: '8px', borderRadius: '100px' }}>
                  <div 
                    className={clsx('progress-bar', s.positive ? 'bg-green' : 'bg-red')} 
                    style={{ width: `${Math.min(Math.abs(s.change) * 20, 100)}%`, borderRadius: '100px' }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market News */}
      <div className="col-12">
        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-header border-0 pb-0">
            <h3 className="card-title fw-bold">Berita Pasar</h3>
          </div>
          <div className="list-group list-group-flush">
            {[
              { title: 'Sektor Perbankan Diprediksi Menguat Menjelang Rilis Laporan Keuangan', time: '2 jam yang lalu', source: 'Bisnis.com' },
              { title: 'The Fed Tahan Suku Bunga, IHSG Merespons Positif di Pembukaan Sesi I', time: '4 jam yang lalu', source: 'CNBC Indonesia' },
              { title: 'Harga Emas Antam Naik Rp 15.000, Tembus Rekor Tertinggi Baru', time: '6 jam yang lalu', source: 'Kontan' },
            ].map((news, i) => (
              <a key={i} href="#" className="list-group-item list-group-item-action">
                <div className="row align-items-center">
                  <div className="col text-truncate">
                    <div className="text-body d-block">{news.title}</div>
                    <div className="text-secondary text-truncate mt-n1 small">{news.source} • {news.time}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
