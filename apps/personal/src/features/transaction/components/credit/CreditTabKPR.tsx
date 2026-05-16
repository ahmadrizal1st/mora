import { useState, useMemo } from 'react';
import { Icon, Chart } from '@/shared/components/ui';
import { useCredits } from '../../hooks/useCredits';

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

const MONTHS = ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'];

export function CreditTabKPR() {
  const { data: allCredits = [], isLoading } = useCredits();
  
  const loans = useMemo(() => {
    return allCredits.filter(acc => acc.credit?.credit_type === 'kpr');
  }, [allCredits]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Derived state: Use selected ID or default to the first loan ID
  const activeLoanId = selectedId ?? loans[0]?.id;

  const activeAccount = useMemo(() => {
    return loans.find(l => l.id === activeLoanId) || loans[0];
  }, [loans, activeLoanId]);

  if (isLoading) {
    return <div className="py-5 text-center text-muted">Memuat data KPR...</div>;
  }

  if (loans.length === 0) {
    return (
      <div className="card border-0 shadow-sm py-5 text-center">
        <div className="card-body">
          <Icon icon="home-off" size={48} className="mb-3 text-muted opacity-50" />
          <h3 className="fw-bold">Belum Ada Pinjaman KPR</h3>
          <p className="text-muted">Tambahkan profil KPR Anda melalui menu "Tambah Profil" di atas.</p>
        </div>
      </div>
    );
  }

  const loan = activeAccount!;
  const credit = loan.credit!;
  const paidAmount = Math.max(0, credit.limit - credit.total_amount);
  const paidPct = credit.limit > 0 ? Math.round((paidAmount / credit.limit) * 100) : 0;
  const daysLeft = credit.due_date ? Math.ceil((new Date(credit.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
  const urgentColor = (daysLeft !== null && daysLeft <= 7) ? 'danger' : 'warning';

  // Placeholder history
  const paymentHistory = [true, true, true, true, true, true, true, true, true, true, true, true];
  const principalHistory = [paidAmount * 0.9, paidAmount * 0.92, paidAmount * 0.94, paidAmount * 0.96, paidAmount * 0.98, paidAmount];
  const amortization = [
    { bulan: 'Segera', pokok: credit.installment_amount * 0.4, bunga: credit.installment_amount * 0.6, total: credit.installment_amount },
  ];

  return (
    <div>
      {/* Property Hero (Mocked details, real financial data) */}
      <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, var(--tblr-warning) 0%, #e67e00 100%)' }}>
        <div className="card-body p-4 text-white">
          <div className="row align-items-center">
            <div className="col-12 col-md-8">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="avatar avatar-sm bg-white text-warning rounded-2">
                  <Icon icon="home" size={16} />
                </span>
                <div>
                  <div className="fw-bold">{loan.name}</div>
                  <div className="small opacity-75">{loan.provider?.name || 'Bank KPR'}</div>
                </div>
              </div>
              <div className="row g-3">
                {[
                  { label: 'Plafon Pinjaman',  value: fmt(credit.limit) },
                  { label: 'Suku Bunga',       value: `${credit.interest_rate || 0}% p.a.` },
                  { label: 'Tenor Total',      value: `${credit.tenor_months || 0} bln` },
                  { label: 'Sudah Berjalan',   value: `${Math.round((paidAmount / credit.installment_amount))} bln (est.)` },
                ].map((item, i) => (
                  <div key={i} className="col-6 col-md-3">
                    <div className="small opacity-75 mb-1">{item.label}</div>
                    <div className="fw-bold small">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12 col-md-4 mt-3 mt-md-0 text-md-end">
              <div className="small opacity-75 mb-1">Sisa Pokok Pinjaman</div>
              <div className="display-6 fw-bold">{fmt(credit.total_amount)}</div>
              <div className="small opacity-75 mt-1">pelunasan {paidPct}%</div>
            </div>
          </div>
        </div>
      </div>

      {loans.length > 1 && (
        <div className="mb-4 d-flex gap-2 overflow-x-auto pb-2">
          {loans.map(l => (
            <button
              key={l.id}
              className={`btn btn-sm ${activeLoanId === l.id ? 'btn-warning text-white' : 'btn-ghost-warning'}`}
              onClick={() => setSelectedId(l.id)}
            >
              {l.name}
            </button>
          ))}
        </div>
      )}

      <div className="row g-3">
        {/* Left: Detail */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header">
              <div className="d-flex align-items-center gap-3">
                <span className="avatar avatar-sm bg-warning text-white rounded-2">
                  <Icon icon="home" size={16} />
                </span>
                <div>
                  <div className="card-title fw-bold mb-0">{loan.name}</div>
                  <div className="text-muted small">{loan.provider?.name}</div>
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
              <ul className="list-group list-group-flush">
                {[
                  { label: 'Total Pinjaman', value: fmt(credit.limit) },
                  { label: 'Sudah dilunasi', value: fmt(paidAmount),               cls: 'text-success' },
                  { label: 'Cicilan per bln',    value: fmt(credit.installment_amount) },
                  { label: 'Suku bunga',     value: `${credit.interest_rate || 0}% p.a.`,
                    extra: <span className="badge bg-warning-lt text-warning border-0 rounded-1 ms-1" style={{ fontSize: '10px' }}>Floating</span> },
                  { label: 'Tenor',          value: `${credit.tenor_months || 0} bulan` },
                  { label: 'Jatuh tempo',    value: credit.due_date ? new Date(credit.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' }) : '-' },
                ].map((item, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span className="text-muted small">{item.label}</span>
                    <span className={`fw-bold small text-end ${item.cls ?? ''}`}>
                      {item.value}{item.extra}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">{paidPct}% terlunasi</span>
                </div>
                <div className="progress progress-sm">
                  <div className="progress-bar bg-warning" style={{ width: `${paidPct}%` }} />
                </div>
              </div>

              {daysLeft !== null && (
                <div className={`alert alert-${urgentColor} d-flex align-items-center gap-2 mt-3 mb-0`} role="alert">
                  <Icon icon="calendar-event" size={16} />
                  <div>
                    <div className="fw-bold small">Tagihan Berikutnya</div>
                    <div className="small opacity-75">{daysLeft} hari lagi • {fmt(credit.installment_amount)}</div>
                  </div>
                </div>
              )}

              <div className="mt-3">
                <button className="btn btn-warning w-100 fw-bold text-white">
                  <Icon icon="credit-card" size={16} className="me-2" />
                  Bayar Angsuran
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right: Charts + Schedule */}
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

          {/* Principal Reduction Chart */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header">
              <h3 className="card-title">Pengurangan Pokok</h3>
              <div className="card-actions">
                <span className="text-muted small">Simulasi Akumulasi</span>
              </div>
            </div>
            <div className="card-body">
              <Chart
                chartId={`kpr-principal-${loan.id}`}
                height={18}
                chartData={{
                  type: 'line',
                  stacked: false,
                  series: [{ name: 'Pokok Terlunasi', color: 'var(--tblr-warning)', data: principalHistory }],
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
                      formatter: (v: number) => (v * 0.000001).toFixed(0) + ' jt',
                    },
                  },
                  extend: {
                    stroke: { curve: 'smooth', width: 3 },
                    markers: { size: 0, hover: { size: 5 } },
                    tooltip: { theme: 'dark', y: { formatter: (v: number) => fmt(v) } },
                  },
                }}
              />
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
                    {amortization.map((row, i) => (
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
                    {/* Add more mock rows for density if needed */}
                    {[1, 2, 3].map((_, i) => (
                      <tr key={`mock-${i}`} style={{ opacity: 0.5 }}>
                        <td className="px-4 py-3 text-muted small">Bulan {i + 1}</td>
                        <td className="text-end py-3 text-muted small">{fmt(credit.installment_amount * 0.42).replace('Rp ', '')}</td>
                        <td className="text-end py-3 text-muted small">{fmt(credit.installment_amount * 0.58).replace('Rp ', '')}</td>
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
