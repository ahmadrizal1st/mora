import React, { useState } from 'react';
import { Icon, Chart } from '@/shared/components/ui';

const fmt = (n: number) =>
  'Rp ' + new Intl.NumberFormat('id-ID').format(n);

const providers = [
  {
    id: 'gopay-later',
    name: 'GoPay Later',
    logo: '🟢',
    color: 'green',
    limit: 5_000_000,
    used: 1_200_000,
    usedPct: 24,
    dueDate: '28 Mei',
    daysLeft: 17,
    minPayment: 120_000,
    status: 'active' as const,
    transactions: [
      { date: '06 Mei', merchant: 'Gojek - GoFood', amount: 89_000 },
      { date: '04 Mei', merchant: 'Gojek - GoCar', amount: 45_000 },
      { date: '02 Mei', merchant: 'Tokopedia via GoPay', amount: 350_000 },
      { date: '01 Mei', merchant: 'Gojek - GoSend', amount: 25_000 },
    ],
    spendHistory: [800_000, 1_100_000, 650_000, 1_400_000, 980_000, 1_200_000],
  },
  {
    id: 'shopee-paylater',
    name: 'Shopee PayLater',
    logo: '🟠',
    color: 'orange',
    limit: 10_000_000,
    used: 2_800_000,
    usedPct: 28,
    dueDate: '5 Jun',
    daysLeft: 25,
    minPayment: 280_000,
    status: 'active' as const,
    transactions: [
      { date: '07 Mei', merchant: 'Shopee - Fashion', amount: 450_000 },
      { date: '05 Mei', merchant: 'Shopee - Elektronik', amount: 1_200_000 },
      { date: '03 Mei', merchant: 'Shopee - Kebutuhan', amount: 310_000 },
      { date: '01 Mei', merchant: 'Shopee - Buku', amount: 95_000 },
    ],
    spendHistory: [1_500_000, 2_100_000, 1_800_000, 3_200_000, 2_400_000, 2_800_000],
  },
  {
    id: 'akulaku',
    name: 'Akulaku',
    logo: '🔵',
    color: 'azure',
    limit: 3_000_000,
    used: 0,
    usedPct: 0,
    dueDate: '-',
    daysLeft: 0,
    minPayment: 0,
    status: 'paid' as const,
    transactions: [],
    spendHistory: [500_000, 300_000, 800_000, 200_000, 0, 0],
  },
];

export function CreditTabPaylater() {
  const [activeProvider, setActiveProvider] = useState(providers[0].id);
  const prov = providers.find(p => p.id === activeProvider)!;
  const totalUsed = providers.reduce((s, p) => s + p.used, 0);
  const totalLimit = providers.reduce((s, p) => s + p.limit, 0);

  return (
    <div>
      {/* Summary strip */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="subheader mb-1">Total Limit</div>
              <div className="h3 fw-bold m-0">{fmt(totalLimit)}</div>
              <div className="text-secondary small mt-1">{providers.length} provider</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="subheader mb-1">Total Dipakai</div>
              <div className="h3 fw-bold m-0">{fmt(totalUsed)}</div>
              <div className="text-secondary small mt-1">{Math.round(totalUsed / totalLimit * 100)}% utilisasi</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="subheader mb-1">Provider Aktif</div>
              <div className="h3 fw-bold m-0">{providers.filter(p => p.status === 'active').length}</div>
              <div className="text-secondary small mt-1">{providers.filter(p => p.status === 'paid').length} lunas</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="subheader mb-1">Tagihan Berikutnya</div>
              <div className="h3 fw-bold m-0">28 Mei</div>
              <div className="text-secondary small mt-1">GoPay Later</div>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Selector */}
      <div className="row g-3 mb-4">
        {providers.map(p => (
          <div key={p.id} className="col-12 col-md-4">
            <button
              className="w-100 text-start border-0 p-0 bg-transparent"
              onClick={() => setActiveProvider(p.id)}
            >
              <div
                className={`card h-100 shadow-sm ${activeProvider === p.id ? `border-2 border-${p.color}` : 'border-0'}`}
                style={{ borderRadius: '1rem', cursor: 'pointer' }}
              >
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: '1.5rem' }}>{p.logo}</span>
                      <div>
                        <div className="fw-bold small">{p.name}</div>
                        {p.status === 'paid' ? (
                          <span className="badge bg-success-lt text-success border-0 rounded-1">Lunas</span>
                        ) : (
                          <span className="badge bg-primary-lt text-primary border-0 rounded-1">Aktif</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="progress progress-sm mb-1">
                    <div className={`progress-bar bg-${p.color}`} style={{ width: `${p.usedPct}%` }} />
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-secondary" style={{ fontSize: '11px' }}>{fmt(p.used)}</span>
                    <span className="text-secondary" style={{ fontSize: '11px' }}>{fmt(p.limit)}</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Detail of selected provider */}
      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <span className="me-3" style={{ fontSize: '2rem' }}>{prov.logo}</span>
                <div>
                  <div className="fw-bold h4 mb-0">{prov.name}</div>
                  {prov.status === 'paid' ? (
                    <span className="badge bg-success-lt text-success border-0 rounded-1">Lunas</span>
                  ) : (
                    <span className="badge bg-primary-lt text-primary border-0 rounded-1">Aktif</span>
                  )}
                </div>
              </div>

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Limit</span>
                  <span className="fw-bold small">{fmt(prov.limit)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Dipakai</span>
                  <span className="fw-bold small text-danger">{fmt(prov.used)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Sisa limit</span>
                  <span className="fw-bold small text-success">{fmt(prov.limit - prov.used)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Utilisasi</span>
                  <span className="fw-bold small">{prov.usedPct}%</span>
                </div>
                {prov.status === 'active' && (
                  <>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary small">Jatuh tempo</span>
                      <div className="text-end">
                        <div className="fw-bold small">{prov.dueDate}</div>
                        <div className="text-secondary small opacity-75">{prov.daysLeft} hari lagi</div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary small">Minimum payment</span>
                      <span className="fw-bold small text-warning">{fmt(prov.minPayment)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="progress mb-2">
                <div className={`progress-bar bg-${prov.color}`} style={{ width: `${prov.usedPct}%` }} />
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="text-secondary small">{prov.usedPct}% used</span>
                <span className="text-secondary small">{100 - prov.usedPct}% available</span>
              </div>

              {prov.status === 'active' && (
                <button className="btn btn-primary w-100 fw-bold">
                  <Icon icon="credit-card" size={16} className="me-2" />
                  Bayar Tagihan
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          {/* Spend Chart */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold mb-1">Tren Penggunaan</h3>
              <div className="text-secondary small mb-3">6 bulan terakhir — {prov.name}</div>
              <Chart
                chartId={`paylater-spend-${prov.id}`}
                height={18}
                chartData={{
                  type: 'bar',
                  stacked: false,
                  series: [{ name: 'Penggunaan', color: `var(--tblr-${prov.color})`, data: prov.spendHistory }],
                  categories: ['Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'],
                  datalabels: false,
                  legend: false,
                  grid: {
                    strokeDashArray: 4,
                    borderColor: 'var(--tblr-border-color)',
                    padding: { top: 10, right: 0, bottom: 0, left: 0 },
                  },
                  xaxis: {
                    tooltip: { enabled: false },
                    axisBorder: { show: false },
                    labels: { style: { colors: 'var(--tblr-secondary)', fontWeight: 500 } },
                  },
                  yaxis: {
                    labels: {
                      style: { colors: 'var(--tblr-secondary)', fontWeight: 500 },
                      formatter: (v: number) => v >= 1_000_000 ? (v / 1_000_000).toFixed(1) + 'jt' : (v / 1000).toFixed(0) + 'rb',
                    },
                  },
                  extend: {
                    plotOptions: { bar: { borderRadius: 4, columnWidth: '40%' } },
                    tooltip: { theme: 'dark', y: { formatter: (v: number) => fmt(v) } },
                  },
                }}
              />
            </div>
          </div>

          {/* Transactions */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="card-title fw-bold m-0">Transaksi Terbaru</h3>
                <button className="btn btn-sm btn-ghost-secondary">Lihat semua</button>
              </div>
              {prov.transactions.length === 0 ? (
                <div className="text-center py-4 text-secondary">
                  <Icon icon="receipt-off" size={32} className="mb-2 opacity-50" />
                  <div className="small">Tidak ada transaksi aktif</div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-vcenter card-table">
                    <tbody>
                      {prov.transactions.map((tx, i) => (
                        <tr key={i}>
                          <td className="w-1">
                            <div className="avatar avatar-sm bg-secondary-lt text-secondary rounded-2">
                              <Icon icon="shopping-cart" size={14} />
                            </div>
                          </td>
                          <td>
                            <div className="fw-bold small">{tx.merchant}</div>
                            <div className="text-secondary small opacity-75">{tx.date}</div>
                          </td>
                          <td className="text-end">
                            <div className="fw-bold small text-danger">-{fmt(tx.amount)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
