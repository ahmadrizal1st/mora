import React, { useState } from 'react';
import { Icon, Chart } from '@/shared/components/ui';

const fmt = (n: number) =>
  'Rp ' + new Intl.NumberFormat('id-ID').format(n);

const MONTHS = ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'];

const providers = [
  {
    id: 'gopay-later',
    name: 'GoPay Later',
    icon: 'device-mobile',
    color: 'green',
    limit: 5_000_000,
    used: 1_200_000,
    usedPct: 24,
    dueDate: '28 Mei',
    daysLeft: 17,
    minPayment: 120_000,
    status: 'active' as const,
    transactions: [
      { date: '06 Mei', merchant: 'Gojek - GoFood',       amount: 89_000 },
      { date: '04 Mei', merchant: 'Gojek - GoCar',        amount: 45_000 },
      { date: '02 Mei', merchant: 'Tokopedia via GoPay',  amount: 350_000 },
      { date: '01 Mei', merchant: 'Gojek - GoSend',       amount: 25_000 },
    ],
    spendHistory: [800_000, 1_100_000, 650_000, 1_400_000, 980_000, 1_200_000],
  },
  {
    id: 'shopee-paylater',
    name: 'Shopee PayLater',
    icon: 'shopping-bag',
    color: 'orange',
    limit: 10_000_000,
    used: 2_800_000,
    usedPct: 28,
    dueDate: '5 Jun',
    daysLeft: 25,
    minPayment: 280_000,
    status: 'active' as const,
    transactions: [
      { date: '07 Mei', merchant: 'Shopee - Fashion',    amount: 450_000 },
      { date: '05 Mei', merchant: 'Shopee - Elektronik', amount: 1_200_000 },
      { date: '03 Mei', merchant: 'Shopee - Kebutuhan',  amount: 310_000 },
      { date: '01 Mei', merchant: 'Shopee - Buku',       amount: 95_000 },
    ],
    spendHistory: [1_500_000, 2_100_000, 1_800_000, 3_200_000, 2_400_000, 2_800_000],
  },
  {
    id: 'akulaku',
    name: 'Akulaku',
    icon: 'wallet',
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
  const totalUsed  = providers.reduce((s, p) => s + p.used,  0);
  const totalLimit = providers.reduce((s, p) => s + p.limit, 0);

  return (
    <div>
      {/* Summary strip */}
      <div className="row g-2 g-lg-3 mb-4">
        {[
          { label: 'Total Limit',       value: fmt(totalLimit), sub: `${providers.length} provider` },
          { label: 'Total Dipakai',     value: fmt(totalUsed),  sub: `${Math.round(totalUsed / totalLimit * 100)}% utilisasi` },
          { label: 'Provider Aktif',    value: String(providers.filter(p => p.status === 'active').length), sub: `${providers.filter(p => p.status === 'paid').length} lunas` },
          { label: 'Tagihan Berikutnya', value: '28 Mei', sub: 'GoPay Later' },
        ].map((item, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="subheader text-muted mb-1">{item.label}</div>
                <div className="h3 fw-bold m-0">{item.value}</div>
                <div className="text-muted small mt-1">{item.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Provider Selector */}
      <div className="row g-3 mb-4">
        {providers.map(p => (
          <div key={p.id} className="col-12 col-md-4">
            <button
              className="w-100 text-start border-0 p-0 bg-transparent"
              onClick={() => setActiveProvider(p.id)}
            >
              <div className={`card shadow-sm h-100 ${activeProvider === p.id ? `border border-${p.color}` : 'border-0'}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className={`avatar avatar-sm bg-${p.color}-lt text-${p.color} rounded-2`}>
                        <Icon icon={p.icon} size={16} />
                      </span>
                      <div>
                        <div className="fw-bold small">{p.name}</div>
                        <span className={`badge bg-${p.status === 'paid' ? 'success' : 'primary'}-lt text-${p.status === 'paid' ? 'success' : 'primary'} border-0 rounded-1`} style={{ fontSize: '10px' }}>
                          {p.status === 'paid' ? 'Lunas' : 'Aktif'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="progress progress-sm mb-1">
                    <div className={`progress-bar bg-${p.color}`} style={{ width: `${p.usedPct}%` }} />
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted" style={{ fontSize: '11px' }}>{fmt(p.used)}</span>
                    <span className="text-muted" style={{ fontSize: '11px' }}>{fmt(p.limit)}</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Detail of selected provider */}
      <div className="row g-3">
        {/* Left: Info */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header">
              <div className="d-flex align-items-center gap-3">
                <span className={`avatar avatar-sm bg-${prov.color}-lt text-${prov.color} rounded-2`}>
                  <Icon icon={prov.icon} size={16} />
                </span>
                <div>
                  <div className="card-title fw-bold mb-0">{prov.name}</div>
                  <span className={`badge bg-${prov.status === 'paid' ? 'success' : 'primary'}-lt text-${prov.status === 'paid' ? 'success' : 'primary'} border-0 rounded-1`} style={{ fontSize: '10px' }}>
                    {prov.status === 'paid' ? 'Lunas' : 'Aktif'}
                  </span>
                </div>
              </div>
              {prov.status === 'active' && (
                <div className="card-actions">
                  <span className="text-muted small">{prov.daysLeft} hari lagi</span>
                </div>
              )}
            </div>

            <div className="card-body">
              <ul className="list-group list-group-flush">
                {[
                  { label: 'Limit',       value: fmt(prov.limit) },
                  { label: 'Dipakai',     value: fmt(prov.used),               cls: prov.used > 0 ? 'text-danger' : '' },
                  { label: 'Sisa limit',  value: fmt(prov.limit - prov.used),  cls: 'text-success' },
                  { label: 'Utilisasi',   value: `${prov.usedPct}%` },
                  ...(prov.status === 'active' ? [
                    { label: 'Jatuh tempo',      value: prov.dueDate },
                    { label: 'Minimum payment',  value: fmt(prov.minPayment), cls: 'text-warning' },
                  ] : []),
                ].map((item, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span className="text-muted small">{item.label}</span>
                    <span className={`fw-bold small ${item.cls ?? ''}`}>{item.value}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">{prov.usedPct}% dipakai</span>
                  <span className="text-muted small">{100 - prov.usedPct}% tersedia</span>
                </div>
                <div className="progress progress-sm">
                  <div className={`progress-bar bg-${prov.color}`} style={{ width: `${prov.usedPct}%` }} />
                </div>
              </div>
            </div>

            {prov.status === 'active' && (
              <div className="mt-3">
                <button className="btn btn-primary w-100 fw-bold">
                  <Icon icon="credit-card" size={16} className="me-2" />
                  Bayar Tagihan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chart + Transactions */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header">
              <h3 className="card-title">Tren Penggunaan</h3>
              <div className="card-actions">
                <span className="text-muted small">6 bulan terakhir — {prov.name}</span>
              </div>
            </div>
            <div className="card-body">
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

          <div className="card border-0 shadow-sm">
            <div className="card-header">
              <h3 className="card-title">Transaksi Terbaru</h3>
              <div className="card-actions">
                <button className="btn btn-sm btn-ghost-secondary">Lihat semua</button>
              </div>
            </div>
            {prov.transactions.length === 0 ? (
              <div className="card-body text-center py-5 text-muted">
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
                          <span className="avatar avatar-sm bg-secondary-lt text-secondary rounded-2">
                            <Icon icon="shopping-cart" size={14} />
                          </span>
                        </td>
                        <td>
                          <div className="fw-bold small">{tx.merchant}</div>
                          <div className="text-muted small">{tx.date}</div>
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
  );
}
