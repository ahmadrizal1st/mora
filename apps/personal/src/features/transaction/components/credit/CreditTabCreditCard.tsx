import { useState, useMemo } from 'react';
import { Icon, Chart, Button } from '@/shared/components/ui';
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
  const usedPct = credit.limit > 0 ? Math.round((credit.total_amount / credit.limit) * 100) : 0;
  const daysLeft = credit.due_date ? Math.ceil((new Date(credit.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  const { spendHistory, historyLabels } = useMemo(() => {
    if (card.history?.expense && card.history.expense.length > 0) {
      return {
        spendHistory: card.history.expense.slice(-6),
        historyLabels: card.history.labels?.slice(-6) || []
      };
    }
    // Mock data if empty
    return {
      spendHistory: [1200000, 850000, 1500000, 950000, 1100000, 1300000],
      historyLabels: ['Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei']
    };
  }, [card]);

  return (
    <div>
      {/* Card Selector */}
      {/* Horizontal Card Selector */}
      <div className="d-flex flex-nowrap overflow-x-auto gap-2 pb-3 mb-4 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {cards.map(c => {
          const cUsedPct = (c.credit!.limit > 0) ? Math.round((c.credit!.total_amount / c.credit!.limit) * 100) : 0;
          const isActive = activeCardId === c.id;
          const themeColor = c.color || '#206bc4';
          const daysLeft = c.credit?.due_date ? Math.ceil((new Date(c.credit.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

          return (
            <div 
              key={c.id} 
              className="flex-shrink-0 card transition-all cursor-pointer"
              style={{ 
                width: '185px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: isActive ? 'var(--tblr-primary-lt)' : 'var(--tblr-bg-surface)',
                border: isActive ? '1.5px solid var(--tblr-primary)' : '1px solid rgba(32, 107, 196, 0.12)',
                borderRadius: '16px',
                boxShadow: isActive ? '0 4px 12px rgba(32, 107, 196, 0.1)' : 'var(--tblr-shadow-sm)'
              }}
              onClick={() => setSelectedId(c.id)}
            >
              <div className="card-body p-3 d-flex flex-column justify-content-between" style={{ minHeight: '135px' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-bold text-truncate" style={{ fontSize: '11px', color: isActive ? 'var(--tblr-primary)' : 'inherit' }}>
                    {c.provider?.name || 'Bank'}
                  </div>
                  <div 
                    className="d-flex align-items-center justify-content-center shadow-sm" 
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      backgroundColor: themeColor, 
                      color: 'white',
                      borderRadius: '10px' 
                    }}
                  >
                    <Icon icon="credit-card" size={14} />
                  </div>
                </div>

                <div>
                  <div className="text-muted mb-1" style={{ fontSize: '10px' }}>{c.name}</div>
                  <div className="h3 fw-bold mb-0" style={{ fontSize: '18px' }}>
                    {new Intl.NumberFormat('id-ID').format(c.credit!.total_amount).replace('Rp', '')}
                  </div>
                </div>

                <div className="mt-2 d-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                  <Icon 
                    icon={daysLeft !== null && daysLeft <= 5 ? 'alert-triangle' : 'trending-down'} 
                    size={12} 
                    className={daysLeft !== null && daysLeft <= 5 ? 'text-danger' : 'text-success'} 
                  />
                  <span className={daysLeft !== null && daysLeft <= 5 ? 'text-danger' : 'text-success'}>
                    {daysLeft !== null && daysLeft <= 5 ? `${daysLeft} hari lagi` : `${cUsedPct}% dipakai`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Account Placeholder */}
        <div 
          className="flex-shrink-0 card d-flex align-items-center justify-content-center text-muted shadow-none"
          style={{ 
            width: '185px', 
            borderRadius: '16px', 
            backgroundColor: 'transparent', 
            minHeight: '135px',
            border: '1.5px dashed rgba(32, 107, 196, 0.25)',
            color: 'var(--tblr-primary)'
          }}
        >
          <div className="text-center opacity-75">
            <Icon icon="plus" size={20} className="mb-1" />
            <div style={{ fontSize: '11px', fontWeight: 500 }}>Tambah Kartu</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Row 1: Info + Chart */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '20px' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <span className="avatar avatar-md bg-body-tertiary text-primary rounded-3 border">
                  <Icon icon="credit-card" size={24} />
                </span>
                <div>
                  <h3 className="fw-bold mb-0">{card.name}</h3>
                  <div className="text-muted small">{card.provider?.name}</div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="text-secondary small mb-1">TAGIHAN</div>
                  <div className="fw-black h3 mb-0">{fmt(credit.total_amount).replace('Rp ', '')}</div>
                </div>
                <div className="col-6 text-end">
                  <div className="text-secondary small mb-1">MIN. BAYAR</div>
                  <div className="fw-bold text-danger">{fmt(credit.minimum_payment || Math.round(credit.total_amount * 0.1)).replace('Rp ', '')}</div>
                </div>
                <div className="col-6 mt-3">
                  <div className="text-secondary small mb-1">JATUH TEMPO</div>
                  <div className="fw-bold text-dark">{credit.due_date ? new Date(credit.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</div>
                </div>
                <div className="col-6 text-end mt-3">
                  <div className="text-secondary small mb-1">SISA LIMIT</div>
                  <div className="fw-bold text-success">{fmt(credit.limit - credit.total_amount).replace('Rp ', '')}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-secondary small fw-medium">Utilisasi Limit</span>
                  <span className="fw-bold small">{usedPct}%</span>
                </div>
                <div className="progress progress-sm" style={{ height: '6px', borderRadius: '10px' }}>
                  <div 
                    className={`progress-bar bg-${usedPct > 80 ? 'danger' : usedPct > 50 ? 'warning' : 'primary'}`} 
                    style={{ width: `${usedPct}%` }} 
                  />
                </div>
              </div>

              <div className="p-3 bg-body-tertiary rounded-3 mb-4 border border-dashed">
                <div className="d-flex gap-2">
                  <Icon icon="bulb" size={14} className="text-primary mt-1 flex-shrink-0" />
                  <div className="small text-muted" style={{ lineHeight: '1.4' }}>
                    <span className="fw-bold text-dark">Tips AI:</span> Bayar tagihan penuh sebelum <span className="text-primary fw-bold">18 Mei</span> untuk menjaga skor kredit Anda tetap optimal di zona hijau.
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  className="w-100 fw-bold shadow-sm"
                  style={{ 
                    borderRadius: '50px', 
                    height: '42px', 
                    background: card.color || 'var(--tblr-primary)',
                    border: 'none'
                  }}
                >
                  Bayar Sekarang
                </Button>
                
                <button 
                  className="btn btn-white w-100 position-relative overflow-hidden d-flex align-items-center justify-content-center border px-0"
                  style={{ 
                    borderRadius: '50px', 
                    height: '42px', 
                    borderColor: 'rgba(0,0,0,0.08)',
                    backgroundColor: '#fff',
                    color: 'var(--tblr-emphasis-color)',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center gap-2 w-100">
                    <Icon icon="list" size={16} className="opacity-50" />
                    <span>Lihat Transaksi</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '20px' }}>
            <div className="card-header border-0 pb-0 px-4 pt-4">
              <h3 className="card-title fw-bold">Tren Pengeluaran</h3>
              <div className="card-actions">
                <span className="text-muted small">12 bulan terakhir — {card.name}</span>
              </div>
            </div>
            <div className="card-body p-0">
              <Chart
                chartId={`credit-spending-${card.id}`}
                height={26}
                chartData={{
                  type: 'bar',
                  series: [{ 
                    name: 'Pengeluaran', 
                    color: card.color || 'var(--tblr-primary)', 
                    data: [0.8, 1.2, 0.9, 1.1, 1.3, 0.7, 1.2, 0.85, 1.5, 0.95, 1.1, 1.3] 
                  }],
                  categories: ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'],
                  datalabels: false,
                  legend: false,
                  grid: {
                    strokeDashArray: 4,
                    borderColor: 'var(--tblr-border-color)',
                    padding: { top: 10, right: 20, bottom: 0, left: 20 },
                  },
                  xaxis: {
                    axisBorder: { show: false },
                    labels: { style: { colors: 'var(--tblr-secondary)', fontWeight: 500 } },
                  },
                  yaxis: {
                    min: 0,
                    labels: {
                      style: { colors: 'var(--tblr-secondary)', fontWeight: 500 },
                      formatter: (v: number) => v.toFixed(1) + 'jt',
                    },
                  },
                  extend: {
                    plotOptions: {
                      bar: {
                        columnWidth: '70%',
                        borderRadius: 4,
                        distributed: false,
                      }
                    },
                    tooltip: { theme: 'dark', y: { formatter: (v: number) => fmt(v) } },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Full Width Table */}
        <div className="col-12 mt-2">
          <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '20px' }}>
            <div className="card-header border-0 pb-0">
              <h3 className="card-title fw-bold">Transaksi Terbaru</h3>
              <div className="card-actions">
                <button className="btn btn-sm btn-ghost-azure">Lihat semua</button>
              </div>
            </div>
            <div className="card-body p-0 mt-3">
              <div className="table-responsive">
                <table className="table table-vcenter card-table table-hover">
                  <thead>
                    <tr>
                      <th className="text-secondary small fw-bold px-4 py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)', width: '120px' }}>Tanggal</th>
                      <th className="text-secondary small fw-bold py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)' }}>Keterangan</th>
                      <th className="text-secondary small fw-bold py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)', width: '150px' }}>Kategori</th>
                      <th className="text-secondary small fw-bold text-end py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)', width: '150px' }}>Nominal</th>
                      <th className="text-secondary small fw-bold text-center px-4 py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)', width: '120px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Tokopedia', date: '2026-05-12', amount: -450000, category: 'Shopping', color: '#ff922b' },
                      { name: 'Starbucks Coffee', date: '2026-05-11', amount: -55000, category: 'Food & Bev', color: '#51cf66' },
                      { name: 'Grab Transport', date: '2026-05-10', amount: -25000, category: 'Transport', color: '#339af0' },
                    ].map((t, i) => {
                      const txDate = new Date(t.date);
                      const formattedDate = txDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

                      return (
                        <tr key={i}>
                          <td className="px-4 py-3">
                            <div className="fw-medium text-nowrap">{formattedDate}</div>
                          </td>
                          <td className="py-3">
                            <div className="fw-bold text-body">{t.name}</div>
                          </td>
                          <td className="py-3">
                            <span 
                              className="badge badge-outline"
                              style={{ 
                                borderColor: `${t.color}40`, 
                                color: t.color, 
                                backgroundColor: `${t.color}08`,
                                fontSize: '10px',
                                padding: '2px 8px'
                              }}
                            >
                              {t.category}
                            </span>
                          </td>
                          <td className="text-end py-3">
                            <div className="fw-bold text-danger">-{fmt(Math.abs(t.amount)).replace('Rp ', '')}</div>
                          </td>
                          <td className="text-center px-4 py-3">
                            <span className="badge bg-success-lt text-success border-0 px-2 py-1" style={{ fontSize: '10px' }}>Selesai</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .table-responsive {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .table-responsive::-webkit-scrollbar {
          display: none;
        }
        .card-table thead th {
          border-top: 1px solid var(--tblr-border-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .card-table tbody tr {
          transition: background-color 0.2s ease;
        }
        .card-table tbody tr:last-child td {
          border-bottom: none !important;
        }
      `}</style>
    </div>
  );
}
