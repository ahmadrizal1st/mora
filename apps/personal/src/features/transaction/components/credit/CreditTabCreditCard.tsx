import { useState, useMemo } from 'react';
import { Icon, Chart } from '@/shared/components/ui';
import { useCredits } from '../../hooks/useCredits';

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

function UtilBadge({ pct }: { pct: number }) {
  if (pct <= 30) return <span className="badge bg-success-lt text-success border-0 rounded-1">Aman ({pct}%)</span>;
  if (pct <= 60) return <span className="badge bg-warning-lt text-warning border-0 rounded-1">Perhatian ({pct}%)</span>;
  return <span className="badge bg-danger-lt text-danger border-0 rounded-1">Tinggi ({pct}%)</span>;
}

export function CreditTabCreditCard() {
  const { data: allCredits = [], isLoading } = useCredits();
  
  const cards = useMemo(() => {
    return allCredits.filter(acc => acc.credit?.credit_type === 'credit_card');
  }, [allCredits]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Derived state: Use the selected ID or default to the first card's ID
  const activeCardId = selectedId ?? cards[0]?.id;

  const activeAccount = useMemo(() => {
    return cards.find(c => c.id === activeCardId) || cards[0];
  }, [cards, activeCardId]);

  if (isLoading) {
    return <div className="py-5 text-center text-muted">Memuat data kartu kredit...</div>;
  }

  if (cards.length === 0) {
    return (
      <div className="card border-0 shadow-sm py-5 text-center">
        <div className="card-body">
          <Icon icon="credit-card-off" size={48} className="mb-3 text-muted opacity-50" />
          <h3 className="fw-bold">Belum Ada Kartu Kredit</h3>
          <p className="text-muted">Tambahkan profil kartu kredit Anda melalui menu "Tambah Profil" di atas.</p>
        </div>
      </div>
    );
  }

  const card = activeAccount!;
  const credit = card.credit!;
  const daysLeft = credit.due_date ? Math.ceil((new Date(credit.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  // Placeholder history if not available
  const spendHistory = card.history?.expense?.slice(-6) || [0, 0, 0, 0, 0, 0];
  const historyLabels = card.history?.labels?.slice(-6) || ['-', '-', '-', '-', '-', '-'];

  return (
    <div>
      {/* Card Selector */}
      <div className="row g-3 mb-4">
        {cards.map(c => {
          const cUsedPct = (c.credit!.limit > 0) ? Math.round((c.credit!.total_amount / c.credit!.limit) * 100) : 0;
          return (
            <div key={c.id} className="col-12 col-md-6">
              <button
                className="w-100 text-start border-0 p-0 bg-transparent"
                onClick={() => setSelectedId(c.id)}
              >
                <div className={`card shadow-sm h-100 ${activeCardId === c.id ? `border border-primary` : 'border-0'}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className={`avatar avatar-sm bg-primary-lt text-primary rounded-2`} style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                          <Icon icon="credit-card" size={16} />
                        </span>
                        <div>
                          <div className="fw-bold small">{c.name}</div>
                          <div className="text-muted" style={{ fontSize: '11px' }}>{c.provider?.name || 'Bank'}</div>
                        </div>
                      </div>
                      <UtilBadge pct={cUsedPct} />
                    </div>
                    <div className="progress progress-sm mb-2">
                      <div className={`progress-bar`} style={{ width: `${cUsedPct}%`, backgroundColor: c.color }} />
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">{fmt(c.credit!.total_amount)} dipakai</span>
                      <span className="text-muted small">Limit {fmt(c.credit!.limit)}</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Detail of selected card */}
      <div className="row g-3">
        {/* Billing Info */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header">
              <div className="d-flex align-items-center gap-3">
                <span className={`avatar avatar-sm rounded-2`} style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                  <Icon icon="credit-card" size={16} />
                </span>
                <div>
                  <div className="card-title fw-bold mb-0">{card.name}</div>
                  <div className="text-muted small">{card.provider?.name || 'Bank'}</div>
                </div>
              </div>
              {daysLeft !== null && (
                <div className="card-actions">
                  <span className={`badge bg-${daysLeft <= 5 ? 'danger' : 'warning'}-lt text-${daysLeft <= 5 ? 'danger' : 'warning'} border-0`}>
                    {daysLeft}h lagi
                  </span>
                </div>
              )}
            </div>

            <div className="card-body">
              <ul className="list-group list-group-flush">
                {[
                  { label: 'Tagihan saat ini',  value: fmt(credit.total_amount) },
                  { label: 'Minimum payment',    value: fmt(credit.minimum_payment || Math.round(credit.total_amount * 0.1)), cls: 'text-danger' },
                  { label: 'Jatuh tempo',        value: credit.due_date ? new Date(credit.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' },
                  { label: 'Sisa limit',         value: fmt(credit.limit - credit.total_amount), cls: 'text-success' },
                ].map((item, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span className="text-muted small">{item.label}</span>
                    <span className={`fw-bold small ${item.cls ?? ''}`}>{item.value}</span>
                  </li>
                ))}
              </ul>

              {/* Reward Points - Optional visual */}
              <div className="mt-3 p-3 rounded-2 bg-primary-lt">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="fw-bold small text-primary">Reward Points</div>
                    <div className="text-muted small">Update otomatis dari mutasi</div>
                  </div>
                  <div className="h4 fw-bold text-primary m-0">- pts</div>
                </div>
              </div>
              {/* Actions */}
              <div className="mt-3 d-flex flex-column gap-2">
                <button className="btn btn-primary w-100 fw-bold">
                  <Icon icon="credit-card" size={16} className="me-2" />
                  Bayar Tagihan
                </button>
                <button className="btn btn-ghost-secondary w-100">
                  Lihat Transaksi
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
                <span className="text-muted small">6 bulan terakhir — {card.name}</span>
              </div>
            </div>
            <div className="card-body">
              <Chart
                chartId={`cc-spend-${card.id}`}
                height={20}
                chartData={{
                  type: 'bar',
                  stacked: false,
                  series: [{ name: 'Pengeluaran', color: card.color, data: spendHistory }],
                  categories: historyLabels,
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
            <div className="card-body py-5 text-center text-muted">
               <Icon icon="receipt-off" size={32} className="mb-2 opacity-50" />
               <div className="small">Transaksi terbaru akan muncul di sini</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
