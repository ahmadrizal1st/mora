import React, { useState } from 'react';
import { Icon, Chart } from '@/shared/components/ui';

const cards = [
  {
    id: 'visa-platinum',
    name: 'Visa Platinum',
    bank: 'Bank BCA',
    last4: '4892',
    limit: 20_000_000,
    used: 3_200_000,
    dueDate: '20 Mei 2026',
    daysLeft: 9,
    rewards: 12_450,
    color: 'primary',
    usedPct: 16,
    transactions: [
      { date: '05 Mei', merchant: 'Tokopedia', amount: 450_000, category: 'Belanja' },
      { date: '04 Mei', merchant: 'Grab Food', amount: 89_000, category: 'Makan' },
      { date: '03 Mei', merchant: 'Netflix', amount: 54_000, category: 'Hiburan' },
      { date: '01 Mei', merchant: 'Indomaret', amount: 210_000, category: 'Kebutuhan' },
    ],
    spendHistory: [1_800_000, 2_100_000, 1_500_000, 2_800_000, 1_900_000, 3_200_000],
  },
  {
    id: 'mastercard-gold',
    name: 'Mastercard Gold',
    bank: 'Bank Mandiri',
    last4: '7731',
    limit: 15_000_000,
    used: 8_500_000,
    dueDate: '25 Mei 2026',
    daysLeft: 14,
    rewards: 8_320,
    color: 'warning',
    usedPct: 56,
    transactions: [
      { date: '06 Mei', merchant: 'SPBU Pertamina', amount: 600_000, category: 'Transport' },
      { date: '05 Mei', merchant: 'Hypermart', amount: 1_200_000, category: 'Kebutuhan' },
      { date: '03 Mei', merchant: 'PLN Mobile', amount: 350_000, category: 'Tagihan' },
      { date: '02 Mei', merchant: 'Shopee', amount: 890_000, category: 'Belanja' },
    ],
    spendHistory: [4_200_000, 6_800_000, 5_100_000, 7_300_000, 6_500_000, 8_500_000],
  },
];

const fmt = (n: number) =>
  'Rp ' + new Intl.NumberFormat('id-ID').format(n);

function UtilBadge({ pct }: { pct: number }) {
  if (pct <= 30) return <span className="badge bg-success-lt text-success border-0 rounded-1">Aman ({pct}%)</span>;
  if (pct <= 60) return <span className="badge bg-warning-lt text-warning border-0 rounded-1">Perhatian ({pct}%)</span>;
  return <span className="badge bg-danger-lt text-danger border-0 rounded-1">Tinggi ({pct}%)</span>;
}

export function CreditTabCreditCard() {
  const [activeCard, setActiveCard] = useState(cards[0].id);
  const card = cards.find(c => c.id === activeCard)!;

  return (
    <div>
      {/* Card Selector */}
      <div className="row g-3 mb-4">
        {cards.map(c => (
          <div key={c.id} className="col-12 col-md-6">
            <button
              className={`w-100 text-start border-0 p-0 bg-transparent`}
              onClick={() => setActiveCard(c.id)}
            >
              <div
                className={`card h-100 shadow-sm transition-all ${activeCard === c.id ? `border-2 border-${c.color}` : 'border-0'}`}
                style={{ borderRadius: '1rem', cursor: 'pointer' }}
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <div className="fw-bold">{c.name}</div>
                      <div className="text-secondary small">{c.bank} •••• {c.last4}</div>
                    </div>
                    <UtilBadge pct={c.usedPct} />
                  </div>
                  <div className="progress progress-sm mb-2">
                    <div
                      className={`progress-bar bg-${c.color}`}
                      style={{ width: `${c.usedPct}%` }}
                    />
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-secondary small">{fmt(c.used)} dipakai</span>
                    <span className="text-secondary small">Limit {fmt(c.limit)}</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Detail of selected card */}
      <div className="row g-3">
        {/* Billing Info */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold mb-4">Info Tagihan</h3>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary small">Tagihan bulan ini</span>
                  <span className="fw-bold">{fmt(card.used)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary small">Minimum payment</span>
                  <span className="fw-bold text-danger">{fmt(Math.round(card.used * 0.1))}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary small">Jatuh tempo</span>
                  <div className="text-end">
                    <div className="fw-bold small">{card.dueDate}</div>
                    <div className={`text-${card.daysLeft <= 5 ? 'danger' : 'secondary'} small opacity-75`}>
                      {card.daysLeft} hari lagi
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary small">Sisa limit</span>
                  <span className="fw-bold text-success">{fmt(card.limit - card.used)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary small">Reward points</span>
                  <span className="fw-bold text-primary">{new Intl.NumberFormat('id-ID').format(card.rewards)} pts</span>
                </div>
              </div>
              <div className="mt-4 d-flex flex-column gap-2">
                <button className="btn btn-primary w-100 fw-bold">
                  <Icon icon="credit-card" size={16} className="me-2" />
                  Bayar Tagihan
                </button>
                <button className="btn btn-ghost-secondary w-100">
                  Lihat e-Statement
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Chart */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold mb-1">Tren Pengeluaran</h3>
              <div className="text-secondary small mb-3">6 bulan terakhir — {card.name}</div>
              <Chart
                chartId={`cc-spend-${card.id}`}
                height={20}
                chartData={{
                  type: 'bar',
                  stacked: false,
                  series: [{ name: 'Pengeluaran', color: `var(--tblr-${card.color})`, data: card.spendHistory }],
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
                    tooltip: {
                      theme: 'dark',
                      y: { formatter: (v: number) => fmt(v) },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="card-title fw-bold m-0">Transaksi Terbaru</h3>
                <button className="btn btn-sm btn-ghost-secondary">Lihat semua</button>
              </div>
              <div className="table-responsive">
                <table className="table table-vcenter card-table">
                  <tbody>
                    {card.transactions.map((tx, i) => (
                      <tr key={i}>
                        <td className="w-1">
                          <div className="avatar avatar-sm bg-secondary-lt text-secondary rounded-2">
                            <Icon icon="shopping-cart" size={14} />
                          </div>
                        </td>
                        <td>
                          <div className="fw-bold small">{tx.merchant}</div>
                          <div className="text-secondary small opacity-75">{tx.date} • {tx.category}</div>
                        </td>
                        <td className="text-end">
                          <div className="fw-bold small text-danger">-{fmt(tx.amount)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
