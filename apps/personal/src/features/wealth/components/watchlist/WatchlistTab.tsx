import { useState } from 'react';
import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import { MOCK_WATCHLIST } from '../../data/mockWealthData';
import { AssetLogo } from '../shared/AssetLogo';

export function WatchlistTab() {
  const [searchQ, setSearchQ] = useState('');

  const filtered = MOCK_WATCHLIST.filter(
    (item) =>
      item.ticker.toLowerCase().includes(searchQ.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <div className="row row-cards tab-content-anim">
      {/* Search and Filters */}
      <div className="col-12">
        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-body">
            <div className="row g-2">
              <div className="col">
                <div className="input-icon">
                  <span className="input-icon-addon">
                    <Icon icon="search" size="sm" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari emiten atau kode saham..."
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-auto">
                <button className="btn btn-icon">
                  <Icon icon="filter" size="sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="col-12">
        <div className="card shadow-sm border-0 rounded-3">
          <div className="table-responsive">
            <table className="table table-vcenter card-table">
              <thead>
                <tr>
                  <th>Simbol</th>
                  <th>Harga</th>
                  <th>Perubahan</th>
                  <th>High / Low</th>
                  <th className="w-1 text-end">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.ticker}>
                    <td>
                      <div className="d-flex align-items-center">
                        <AssetLogo ticker={item.ticker} name={item.name} type={item.sector === 'Kripto' ? 'kripto' : 'saham'} logoUrl={item.logo} size="sm" className="me-2" />
                        <div>
                          <div className="font-weight-medium">{item.ticker}</div>
                          <div className="text-secondary small">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold">{formatCurrency(item.price)}</div>
                    </td>
                    <td>
                      <span className={clsx('badge badge-pill border-0', item.change >= 0 ? 'bg-success-lt text-success' : 'bg-danger-lt text-danger')}>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </span>
                    </td>
                    <td className="text-secondary small">
                      {formatCurrency(item.price * 1.05)} / {formatCurrency(item.price * 0.95)}
                    </td>
                    <td className="text-end">
                      <button className="btn btn-ghost-danger btn-icon btn-sm">
                        <Icon icon="trash" size="xs" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-secondary">
                      Tidak ada hasil untuk "{searchQ}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Add Suggestions */}
      <div className="col-lg-8">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header border-0 pb-0">
            <h3 className="card-title fw-bold">Rekomendasi Untuk Kamu</h3>
          </div>
          <div className="card-body">
            <div className="list-group list-group-flush">
              {[
                { ticker: 'BMRI', name: 'Bank Mandiri', reason: 'Dividen tinggi 5.6%', badge: 'Dividen', color: 'orange', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg' },
                { ticker: 'ICBP', name: 'Indofood CBP', reason: 'Fundamental kuat, undervalued', badge: 'Value', color: 'green', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Indofood_logo.svg' },
                { ticker: 'PGAS', name: 'PGN Gas', reason: 'Momentum bullish +18% bulan ini', badge: 'Momentum', color: 'blue', logoUrl: '' },
              ].map((r) => (
                <div key={r.ticker} className="list-group-item border-0 py-3">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <AssetLogo ticker={r.ticker} name={r.name} logoUrl={r.logoUrl} size="sm" />
                    </div>
                    <div className="col">
                      <div className="font-weight-medium">{r.ticker}</div>
                      <div className="text-secondary small">{r.reason}</div>
                    </div>
                    <div className="col-auto">
                      <button className="btn btn-sm btn-white">Add to Watchlist</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card bg-dark text-white shadow-sm border-0 h-100">
          <div className="card-header border-0 pb-0">
            <h3 className="card-title text-white fw-bold">Notifikasi Harga</h3>
          </div>
          <div className="card-body d-flex flex-column justify-content-between">
            <div className="list-group list-group-flush list-group-transparent">
              {[
                { label: 'BBCA > 10.500', active: true },
                { label: 'GOTO < 60', active: true },
                { label: 'BTC > $70k', active: false },
              ].map((alert, i) => (
                <div key={i} className="list-group-item d-flex align-items-center justify-content-between px-0 border-0">
                  <span className="small opacity-80">{alert.label}</span>
                  <div className="form-check form-switch m-0">
                    <input className="form-check-input" type="checkbox" defaultChecked={alert.active} />
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-outline-white btn-sm w-100 mt-4">Kelola Semua Alert</button>
          </div>
        </div>
      </div>
    </div>
  );
}
