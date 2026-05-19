import { useState, useMemo } from 'react';
import { Icon, Chart, Button } from '@/shared/components/ui';
import { useCredits } from '../hooks/useCredits';
import { useCreditLayoutContext } from '../context/CreditLayoutContext';

const MONTHS = ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'];

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

export function CreditKTAPage() {
  const { openFormForType } = useCreditLayoutContext();
  const { data: allCredits = [], isLoading } = useCredits();
  
  const loans = useMemo(() => {
    return allCredits.filter(acc => acc.credit?.credit_type === 'kta');
  }, [allCredits]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Derived state: Use selected ID or default to the first loan ID
  const activeLoanId = selectedId ?? loans[0]?.id;

  const activeAccount = useMemo(() => {
    return loans.find(l => l.id === activeLoanId) || loans[0];
  }, [loans, activeLoanId]);

  if (isLoading) {
    return <div className="py-5 text-center text-muted">Memuat data pinjaman...</div>;
  }

  if (loans.length === 0) {
    return (
      <div className="card border-0 shadow-sm py-5 text-center">
        <div className="card-body">
          <Icon icon="building-bank" size={48} className="mb-3 text-muted opacity-50" />
          <h3 className="fw-bold">Belum Ada Pinjaman KTA</h3>
          <p className="text-muted mb-3">Tambahkan profil pinjaman Anda melalui menu "Tambah Profil" di atas.</p>
          <Button element="button" color="primary" onClick={() => openFormForType('kta')}>
            <Icon icon="plus" size={16} className="me-2" />
            Tambah KTA / Pinjaman
          </Button>
        </div>
      </div>
    );
  }

  const loan = activeAccount!;
  const credit = loan.credit!;
  const paidAmount = Math.max(0, credit.limit - credit.total_amount);
  const paidPct = credit.limit > 0 ? Math.round((paidAmount / credit.limit) * 100) : 0;
  const daysLeft = credit.due_date ? Math.ceil((new Date(credit.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
  const urgentColor = (daysLeft !== null && daysLeft <= 5) ? 'danger' : 'warning';

  return (
    <div>
      {/* Loan Selector - Horizontal Tiles */}
      <div className="d-flex flex-nowrap overflow-x-auto gap-3 pb-3 mb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {loans.map(l => {
          const lPct = l.credit!.limit > 0 ? Math.round((Math.max(0, l.credit!.limit - l.credit!.total_amount) / l.credit!.limit) * 100) : 0;
          const isActive = activeLoanId === l.id;
          const themeColor = l.color || '#206bc4';
          const lDaysLeft = l.credit?.due_date ? Math.ceil((new Date(l.credit.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

          return (
            <div 
              key={l.id} 
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
              onClick={() => setSelectedId(l.id)}
            >
              <div className="card-body p-3 d-flex flex-column justify-content-between" style={{ minHeight: '135px' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-bold text-truncate" style={{ fontSize: '11px', color: isActive ? 'var(--tblr-primary)' : 'inherit' }}>
                    {l.name}
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
                    <Icon icon="building-bank" size={14} />
                  </div>
                </div>

                <div>
                  <div className="text-muted mb-1" style={{ fontSize: '10px' }}>Sisa Saldo</div>
                  <div className="h3 fw-bold mb-0" style={{ fontSize: '18px' }}>
                    {new Intl.NumberFormat('id-ID').format(l.credit!.total_amount).replace('Rp', '')}
                  </div>
                </div>

                <div className="mt-2 d-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                  <Icon 
                    icon={lDaysLeft !== null && lDaysLeft <= 5 ? 'alert-triangle' : 'trending-down'} 
                    size={12} 
                    className={lDaysLeft !== null && lDaysLeft <= 5 ? 'text-danger' : 'text-success'} 
                  />
                  <span className={lDaysLeft !== null && lDaysLeft <= 5 ? 'text-danger' : 'text-success'}>
                    {lDaysLeft !== null && lDaysLeft <= 5 ? `${lDaysLeft} hari lagi` : `Lunas ${lPct}%`}
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
          onClick={() => openFormForType('kta')}
        >
          <div className="text-center opacity-75">
            <Icon icon="plus" size={20} className="mb-1" />
            <div style={{ fontSize: '11px', fontWeight: 500 }}>Tambah Pinjaman</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Row 1: Info + Progress Chart */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '20px' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <span className="avatar avatar-md bg-primary text-white rounded-3 shadow-sm" style={{ border: 'none' }}>
                  <Icon icon="building-bank" size={24} />
                </span>
                <div>
                  <h3 className="fw-bold mb-0">{loan.name}</h3>
                  <div className="text-muted small">KTA — {loan.provider?.name || 'Bank'}</div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="text-secondary small mb-1">ANGSURAN</div>
                  <div className="fw-black h3 mb-0">{fmt(credit.installment_amount).replace('Rp ', '')}</div>
                </div>
                <div className="col-6 text-end">
                  <div className="text-secondary small mb-1">BUNGA</div>
                  <div className="fw-bold text-azure">{credit.interest_rate || 0}% p.a</div>
                </div>
                <div className="col-6 mt-3">
                  <div className="text-secondary small mb-1">SISA TENOR</div>
                  <div className="fw-bold text-dark">{credit.tenor_months || 0} Bulan</div>
                </div>
                <div className="col-6 text-end mt-3">
                  <div className="text-secondary small mb-1">SISA SALDO</div>
                  <div className="fw-bold text-success">{fmt(credit.total_amount).replace('Rp ', '')}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-secondary small fw-medium">Progress Pelunasan</span>
                  <span className="fw-bold small">{paidPct}%</span>
                </div>
                <div className="progress progress-sm" style={{ height: '6px', borderRadius: '10px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${paidPct}%` }} 
                  />
                </div>
              </div>

              <div className="p-3 bg-body-tertiary rounded-3 mb-4 border border-dashed">
                <div className="d-flex gap-2">
                  <Icon icon="info-circle" size={14} className="text-primary mt-1 flex-shrink-0" />
                  <div className="small text-muted" style={{ lineHeight: '1.4' }}>
                    <span className="fw-bold text-dark">Info:</span> Pinjaman KTA tidak memerlukan agunan. Pastikan pembayaran tepat waktu untuk menjaga skor kredit Anda.
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2">
                <button 
                  className="btn text-white w-100 position-relative overflow-hidden d-flex align-items-center justify-content-center border-0 px-0 shadow-sm"
                  style={{ 
                    borderRadius: '50px', 
                    height: '42px', 
                    backgroundColor: 'var(--tblr-primary)',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}
                >
                  Bayar Sekarang
                </button>
                <button 
                  className="btn btn-white w-100 d-flex align-items-center justify-content-center border"
                  style={{ borderRadius: '50px', height: '42px', fontWeight: 600, fontSize: '13px' }}
                >
                  <Icon icon="history" size={16} className="me-2 opacity-50" />
                  Riwayat Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '20px' }}>
            <div className="card-header border-0 pb-0 px-4 pt-4">
              <h3 className="card-title fw-bold">Proyeksi Pelunasan</h3>
              <div className="card-actions">
                <span className="text-muted small">Sisa Pokok — {loan.name}</span>
              </div>
            </div>
            <div className="card-body p-0">
              <Chart
                chartId={`kta-principal-${loan.id}`}
                height={26}
                chartData={{
                  type: 'area',
                  series: [
                    { name: 'Sisa Pokok', color: 'var(--tblr-primary)', data: [50, 47, 44, 41, 38, 35, 32, 29, 26, 23, 20, 17] }
                  ],
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
                      formatter: (v: number) => v + 'jt',
                    },
                  },
                  extend: {
                    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05 } },
                    stroke: { width: 3, curve: 'smooth' },
                    tooltip: { theme: 'dark' },
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
              <h3 className="card-title fw-bold">Jadwal Angsuran</h3>
              <div className="card-actions">
                <button className="btn btn-sm btn-ghost-azure">Lihat semua jadwal</button>
              </div>
            </div>
            <div className="card-body p-0 mt-3">
              <div className="table-responsive">
                <table className="table table-vcenter card-table table-hover">
                  <thead>
                    <tr>
                      <th className="text-secondary small fw-bold px-4 py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)', width: '120px' }}>Bulan</th>
                      <th className="text-secondary small fw-bold py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)' }}>Keterangan</th>
                      <th className="text-secondary small fw-bold text-end py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)', width: '150px' }}>Pokok</th>
                      <th className="text-secondary small fw-bold text-end py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)', width: '150px' }}>Bunga</th>
                      <th className="text-secondary small fw-bold text-end px-4 py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)', width: '150px' }}>Total Tagihan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(6)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3 text-nowrap">Mei 2026</td>
                        <td className="py-3">
                          <div className="fw-bold">Angsuran Ke-{8 + i}</div>
                          <div className="text-muted small">Status: Terjadwal</div>
                        </td>
                        <td className="text-end py-3 text-secondary">{fmt(credit.installment_amount * 0.75).replace('Rp ', '')}</td>
                        <td className="text-end py-3 text-secondary">{fmt(credit.installment_amount * 0.25).replace('Rp ', '')}</td>
                        <td className="text-end px-4 py-3">
                          <div className="fw-bold text-dark">{fmt(credit.installment_amount).replace('Rp ', '')}</div>
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
