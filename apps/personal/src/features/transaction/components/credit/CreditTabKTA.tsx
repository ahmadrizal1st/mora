import { useState, useMemo } from 'react';
import { Icon } from '@/shared/components/ui';
import { useCredits } from '../../hooks/useCredits';

const MONTHS = ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'];

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

export function CreditTabKTA() {
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
          <p className="text-muted">Tambahkan profil pinjaman Anda melalui menu "Tambah Profil" di atas.</p>
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

  // Placeholder for history/schedule
  const paymentHistory = [true, true, true, true, true, true, true, true, true, true, true, true];
  const scheduleMonths = [
    { bulan: 'Segera', pokok: credit.installment_amount * 0.7, bunga: credit.installment_amount * 0.3, total: credit.installment_amount },
  ];

  return (
    <div>
      {/* Loan Selector */}
      {loans.length > 1 && (
        <div className="row g-3 mb-4">
          {loans.map(l => {
            const lPaidPct = l.credit!.limit > 0 ? Math.round(((l.credit!.limit - l.credit!.total_amount) / l.credit!.limit) * 100) : 0;
            return (
              <div key={l.id} className="col-12 col-md-6">
                <button
                  className="w-100 text-start border-0 p-0 bg-transparent"
                  onClick={() => setSelectedId(l.id)}
                >
                  <div className={`card shadow-sm ${activeLoanId === l.id ? 'border border-primary' : 'border-0'}`}>
                    <div className="card-body">
                      <div className="fw-bold">{l.name}</div>
                      <div className="text-secondary small mb-2">{l.provider?.name || 'Bank'}</div>
                      <div className="progress progress-sm mb-1">
                        <div className="progress-bar bg-primary" style={{ width: `${lPaidPct}%` }} />
                      </div>
                      <div className="text-muted small">{lPaidPct}% terlunasi</div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="row g-3">
        {/* Left: Detail */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header">
              <div className="d-flex align-items-center gap-3">
                <span className={`avatar avatar-sm bg-primary text-white rounded-2`}>
                  <Icon icon="building-bank" size={16} />
                </span>
                <div>
                  <div className="card-title fw-bold mb-0">{loan.name}</div>
                  <div className="text-muted small">Kredit Tanpa Agunan</div>
                </div>
              </div>
              {daysLeft !== null && (
                <div className="card-actions">
                  <span className={`badge bg-${urgentColor}-lt text-${urgentColor} border-0`}>
                    {daysLeft} hari lagi
                  </span>
                </div>
              )}
            </div>

            <div className="card-body">
              {/* Key-value list */}
              <ul className="list-group list-group-flush">
                {[
                  { label: 'Plafon',         value: fmt(credit.limit) },
                  { label: 'Sudah dibayar',  value: fmt(paidAmount),             cls: 'text-success' },
                  { label: 'Sisa pokok',     value: fmt(credit.total_amount),        cls: 'text-danger' },
                  { label: 'Cicilan/bln',    value: fmt(credit.installment_amount) },
                  { label: 'Suku bunga',     value: `${credit.interest_rate || 0}% p.a.` },
                  { label: 'Tenor',          value: `${credit.tenor_months || 0} bulan` },
                  { label: 'Jatuh tempo',    value: credit.due_date ? new Date(credit.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-' },
                ].map((item, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span className="text-muted small">{item.label}</span>
                    <span className={`fw-bold small text-end ${item.cls ?? ''}`}>{item.value}</span>
                  </li>
                ))}
              </ul>

              {/* Progress */}
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">{paidPct}% terlunasi</span>
                  <span className="text-muted small">{100 - paidPct}% tersisa</span>
                </div>
                <div className="progress progress-sm">
                  <div className="progress-bar bg-primary" style={{ width: `${paidPct}%` }} />
                </div>
              </div>

              {/* Due Date Alert */}
              {daysLeft !== null && (
                <div className={`alert alert-${urgentColor} d-flex align-items-center gap-2 mt-3 mb-0`} role="alert">
                  <Icon icon="calendar-event" size={16} />
                  <div>
                    <div className="fw-bold small">Jatuh tempo: {new Date(credit.due_date!).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</div>
                    <div className="small opacity-75">{daysLeft} hari lagi • {fmt(credit.installment_amount)}</div>
                  </div>
                </div>
              )}

              <div className="mt-3">
                <button className="btn btn-primary w-100 fw-bold">
                  <Icon icon="credit-card" size={16} className="me-2" />
                  Bayar Cicilan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: History + Schedule */}
        <div className="col-12 col-lg-8">
          {/* Payment History */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header">
              <h3 className="card-title">Riwayat Pembayaran</h3>
              <div className="card-actions">
                <span className="text-muted small">12 bulan terakhir</span>
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {MONTHS.map((m, i) => (
                  <div key={i} className="text-center">
                    <span className={`avatar avatar-sm rounded-circle mb-1 ${paymentHistory[i] ? 'bg-success' : 'bg-danger'} text-white`}>
                      <Icon icon={paymentHistory[i] ? 'check' : 'x'} size={14} />
                    </span>
                    <div className="text-muted" style={{ fontSize: '10px' }}>{m}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Amortization Schedule */}
          <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '20px' }}>
            <div className="card-header border-0 pb-0">
              <h3 className="card-title fw-bold">Jadwal Angsuran</h3>
              <div className="card-actions">
                <span className="badge bg-blue-lt text-blue border-0">Simulasi</span>
              </div>
            </div>
            <div className="card-body p-0 mt-3">
              <div className="table-responsive">
                <table className="table table-vcenter card-table table-hover">
                  <thead>
                    <tr>
                      <th className="text-secondary small fw-bold px-4 py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)' }}>Bulan</th>
                      <th className="text-secondary small fw-bold text-end py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)' }}>Pokok</th>
                      <th className="text-secondary small fw-bold text-end py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)' }}>Bunga</th>
                      <th className="text-secondary small fw-bold text-end px-4 py-2" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary)' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleMonths.map((row, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3">
                          <div className="fw-bold text-body">{row.bulan}</div>
                        </td>
                        <td className="text-end py-3 text-muted small">
                          {fmt(row.pokok).replace('Rp ', '')}
                        </td>
                        <td className="text-end py-3 text-warning small">
                          {fmt(row.bunga).replace('Rp ', '')}
                        </td>
                        <td className="text-end px-4 py-3">
                          <span className="fw-bold text-dark">{fmt(row.total).replace('Rp ', '')}</span>
                        </td>
                      </tr>
                    ))}
                    {[1, 2, 3].map((_, i) => (
                      <tr key={`mock-${i}`} style={{ opacity: 0.5 }}>
                        <td className="px-4 py-3 text-muted small">Bulan {i + 1}</td>
                        <td className="text-end py-3 text-muted small">{fmt(credit.installment_amount * 0.75).replace('Rp ', '')}</td>
                        <td className="text-end py-3 text-muted small">{fmt(credit.installment_amount * 0.25).replace('Rp ', '')}</td>
                        <td className="text-end px-4 py-3 text-muted small">{fmt(credit.installment_amount).replace('Rp ', '')}</td>
                      </tr>
                    ))}
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
        .card-table tbody tr:last-child td {
          border-bottom: none !important;
        }
      `}</style>
    </div>
  );
}
