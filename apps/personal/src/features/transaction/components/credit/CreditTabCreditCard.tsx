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
      { date: '05 Mei', merchant: 'Tokopedia',  amount: 450_000, category: 'Belanja' },
      { date: '04 Mei', merchant: 'Grab Food',  amount: 89_000,  category: 'Makan' },
      { date: '03 Mei', merchant: 'Netflix',    amount: 54_000,  category: 'Hiburan' },
      { date: '01 Mei', merchant: 'Indomaret',  amount: 210_000, category: 'Kebutuhan' },
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
      { date: '06 Mei', merchant: 'SPBU Pertamina', amount: 600_000,   category: 'Transport' },
      { date: '05 Mei', merchant: 'Hypermart',      amount: 1_200_000, category: 'Kebutuhan' },
      { date: '03 Mei', merchant: 'PLN Mobile',     amount: 350_000,   category: 'Tagihan' },
      { date: '02 Mei', merchant: 'Shopee',         amount: 890_000,   category: 'Belanja' },
    ],
    spendHistory: [4_200_000, 6_800_000, 5_100_000, 7_300_000, 6_500_000, 8_500_000],
  },
];

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

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
              className="w-100 text-start border-0 p-0 bg-transparent"
              onClick={() => setActiveCard(c.id)}
            >
              <div className={`card shadow-sm h-100 ${activeCard === c.id ? `border border-${c.color}` : 'border-0'}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className={`avatar avatar-sm bg-${c.color}-lt text-${c.color} rounded-2`}>
                        <Icon icon="credit-card" size={16} />
                      </span>
                      <div>
                        <div className="fw-bold small">{c.name}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>{c.bank} •••• {c.last4}</div>
                      </div>
                    </div>
                    <UtilBadge pct={c.usedPct} />
                  </div>
                  <div className="progress progress-sm mb-2">
                    <div className={`progress-bar bg-${c.color}`} style={{ width: `${c.usedPct}%` }} />
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">{fmt(c.used)} dipakai</span>
                    <span className="text-muted small">Limit {fmt(c.limit)}</span>
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
          <div className="card border-0 shadow-sm">
            <div className="card-header">
              <div className="d-flex align-items-center gap-3">
                <span className={`avatar avatar-sm bg-${card.color}-lt text-${card.color} rounded-2`}>
                  <Icon icon="credit-card" size={16} />
                </span>
                <div>
                  <div className="card-title fw-bold mb-0">{card.name}</div>
                  <div className="text-muted small">{card.bank} •••• {card.last4}</div>
                </div>
              </div>
              <div className="card-actions">
                <span className={`badge bg-${card.daysLeft <= 5 ? 'danger' : 'warning'}-lt text-${card.daysLeft <= 5 ? 'danger' : 'warning'} border-0`}>
                  {card.daysLeft}h lagi
                </span>
              </div>
            </div>

            <div className="card-body">
              <ul className="list-group list-group-flush">
                {[
                  { label: 'Tagihan bulan ini',  value: fmt(card.used) },
                  { label: 'Minimum payment',    value: fmt(Math.round(card.used * 0.1)), cls: 'text-danger' },
                  { label: 'Jatuh tempo',        value: card.dueDate },
                  { label: 'Sisa limit',         value: fmt(card.limit - card.used), cls: 'text-success' },
                ].map((item, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span className="text-muted small">{item.label}</span>
                    <span className={`fw-bold small ${item.cls ?? ''}`}>{item.value}</span>
                  </li>
                ))}
              </ul>

              {/* Reward Points */}
              <div className="mt-3 p-3 rounded-2 bg-primary-lt">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="fw-bold small text-primary">Reward Points</div>
                    <div className="text-muted small">Tukar hadiah kapan saja</div>
                  </div>
                  <div className="h4 fw-bold text-primary m-0">
                    {new Intl.NumberFormat('id-ID').format(card.rewards)} pts
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="mt-3 d-flex flex-column gap-2">
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

        {/* Right: Chart + Transactions */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header">
              <h3 className="card-title">Tren Pengeluaran</h3>
              <div className="card-actions">
                <span className="text-muted small">6 bulan — {card.name}</span>
              </div>
            </div>
            <div className="card-body">
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

          <div className="card border-0 shadow-sm mt-3">
            <div className="card-header">
              <h3 className="card-title">Transaksi Terbaru</h3>
              <div className="card-actions">
                <button className="btn btn-sm btn-ghost-secondary">Lihat semua</button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <tbody>
                  {card.transactions.map((tx, i) => (
                    <tr key={i}>
                      <td className="w-1">
                        <span className="avatar avatar-sm bg-secondary-lt text-secondary rounded-2">
                          <Icon icon="shopping-cart" size={14} />
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold small">{tx.merchant}</div>
                        <div className="text-muted small">{tx.date} • {tx.category}</div>
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
  );
}
