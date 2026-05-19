import { useState, useMemo } from 'react';
import { Icon, Chart, Button } from '@/shared/components/ui';
import { useCredits } from '../hooks/useCredits';
import { useCreditLayoutContext } from '../context/CreditLayoutContext';

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

export function CreditPaylaterPage() {
  const { openFormForType } = useCreditLayoutContext();
  const { data: allCredits = [], isLoading } = useCredits();
  
  const providers = useMemo(() => {
    return allCredits.filter(acc => acc.credit?.credit_type === 'paylater');
  }, [allCredits]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Derived state: Use selected ID or default to the first provider ID
  const activeProviderId = selectedId ?? providers[0]?.id;

  const activeAccount = useMemo(() => {
    return providers.find(p => p.id === activeProviderId) || providers[0];
  }, [providers, activeProviderId]);

  if (isLoading) {
    return <div className="py-5 text-center text-muted">Memuat data Paylater...</div>;
  }

  if (providers.length === 0) {
    return (
      <div className="card border-0 shadow-sm py-5 text-center">
        <div className="card-body">
          <Icon icon="clock-dollar" size={48} className="mb-3 text-muted opacity-50" />
          <h3 className="fw-bold">Belum Ada Paylater</h3>
          <p className="text-muted mb-3">Tambahkan profil Paylater Anda melalui menu "Tambah Profil" di atas.</p>
          <Button element="button" color="primary" onClick={() => openFormForType('paylater')}>
            <Icon icon="plus" size={16} className="me-2" />
            Tambah Paylater
          </Button>
        </div>
      </div>
    );
  }

  const prov = activeAccount!;
  const credit = prov.credit!;
  const usedPct = credit.limit > 0 ? Math.round((credit.total_amount / credit.limit) * 100) : 0;

  return (
    <div>

      {/* Provider Selector - Horizontal Tiles */}
      <div className="d-flex flex-nowrap overflow-x-auto gap-3 pb-3 mb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {providers.map(p => {
          const pPct = p.credit!.limit > 0 ? Math.round((p.credit!.total_amount / p.credit!.limit) * 100) : 0;
          const isActive = activeProviderId === p.id;
          const themeColor = p.color || '#206bc4';
          const pDaysLeft = p.credit?.due_date ? Math.ceil((new Date(p.credit.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

          return (
            <div 
              key={p.id} 
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
              onClick={() => setSelectedId(p.id)}
            >
              <div className="card-body p-3 d-flex flex-column justify-content-between" style={{ minHeight: '135px' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-bold text-truncate" style={{ fontSize: '11px', color: isActive ? 'var(--tblr-primary)' : 'inherit' }}>
                    {p.name}
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
                    <Icon icon="device-mobile" size={14} />
                  </div>
                </div>

                <div>
                  <div className="text-muted mb-1" style={{ fontSize: '10px' }}>Saldo terpakai</div>
                  <div className="h3 fw-bold mb-0" style={{ fontSize: '18px' }}>
                    {new Intl.NumberFormat('id-ID').format(p.credit!.total_amount).replace('Rp', '')}
                  </div>
                </div>

                <div className="mt-2 d-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                  <Icon 
                    icon={pDaysLeft !== null && pDaysLeft <= 5 ? 'alert-triangle' : 'trending-down'} 
                    size={12} 
                    className={pDaysLeft !== null && pDaysLeft <= 5 ? 'text-danger' : 'text-success'} 
                  />
                  <span className={pDaysLeft !== null && pDaysLeft <= 5 ? 'text-danger' : 'text-success'}>
                    {pDaysLeft !== null && pDaysLeft <= 5 ? `${pDaysLeft} hari lagi` : `${pPct}% dipakai`}
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
            color: 'var(--tblr-primary)',
            cursor: 'pointer'
          }}
          onClick={() => openFormForType('paylater')}
        >
          <div className="text-center opacity-75">
            <Icon icon="plus" size={20} className="mb-1" />
            <div style={{ fontSize: '11px', fontWeight: 500 }}>Tambah Paylater</div>
          </div>
        </div>
      </div>

      {/* Detail of selected provider */}
      <div className="row g-3">
        {/* Row 1: Info + Chart */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '20px' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <span className="avatar avatar-md text-white rounded-3 shadow-sm" style={{ backgroundColor: prov.color || 'var(--tblr-primary)', border: 'none' }}>
                  <Icon icon="credit-card" size={24} />
                </span>
                <div>
                  <h3 className="fw-bold mb-0">{prov.name}</h3>
                  <div className="text-muted small">Paylater Service</div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="text-secondary small mb-1">TAGIHAN</div>
                  <div className="fw-black h3 mb-0">{fmt(credit.total_amount || 0).replace('Rp ', '')}</div>
                </div>
                <div className="col-6 text-end">
                  <div className="text-secondary small mb-1">MIN. BAYAR</div>
                  <div className="fw-bold text-danger">{fmt(credit.minimum_payment || Math.round((credit.total_amount || 0) * 0.1)).replace('Rp ', '')}</div>
                </div>
                <div className="col-6 mt-3">
                  <div className="text-secondary small mb-1">JATUH TEMPO</div>
                  <div className="fw-bold text-dark">{credit.due_date ? new Date(credit.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</div>
                </div>
                <div className="col-6 text-end mt-3">
                  <div className="text-secondary small mb-1">SISA LIMIT</div>
                  <div className="fw-bold text-success">{fmt(credit.limit - (credit.total_amount || 0)).replace('Rp ', '')}</div>
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
                    <span className="fw-bold text-dark">Tips AI:</span> Gunakan <span className="text-primary fw-bold">Autodebet</span> untuk menghindari denda keterlambatan pada tagihan berikutnya.
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2">
                <button 
                  className="btn text-white w-100 position-relative overflow-hidden d-flex align-items-center justify-content-center border-0 px-0 shadow-sm"
                  style={{ 
                    borderRadius: '50px', 
                    height: '42px', 
                    backgroundColor: prov.color || 'var(--tblr-primary)',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}
                >
                  Bayar Sekarang
                </button>
                
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
                  <span>Lihat Transaksi</span>
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
                <span className="text-muted small">12 bulan terakhir — {prov.name}</span>
              </div>
            </div>
            <div className="card-body p-0">
              <Chart
                chartId={`paylater-spending-${prov.id}`}
                height={26}
                chartData={{
                  type: 'bar',
                  series: [{ 
                    name: 'Pengeluaran', 
                    color: prov.color || 'var(--tblr-primary)', 
                    data: [0.7, 0.9, 1.2, 0.8, 1.1, 1.4, 0.9, 1.1, 0.8, 1.3, 1.0, 1.2] 
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
                      { name: 'Shopee Checkout', date: '2026-05-12', amount: -150000, category: 'Shopping', color: '#ff922b' },
                      { name: 'Lazada Payment', date: '2026-05-11', amount: -225000, category: 'Shopping', color: '#ff922b' },
                      { name: 'Gofood Order', date: '2026-05-10', amount: -85000, category: 'Food & Bev', color: '#51cf66' },
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
