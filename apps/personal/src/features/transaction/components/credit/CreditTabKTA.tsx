import React, { useState } from 'react';
import { Icon, Chart } from '@/shared/components/ui';

const loans = [
  {
    id: 'kta-mandiri',
    name: 'KTA Mandiri',
    bank: 'Bank Mandiri',
    type: 'Kredit Tanpa Agunan',
    totalAmount: 50_000_000,
    remaining: 31_250_000,
    paid: 18_750_000,
    paidPct: 37.5,
    monthlyInstallment: 1_400_000,
    interestRate: 8.5,
    tenor: 48,
    remaining_months: 36,
    startDate: 'Jan 2023',
    endDate: 'Jan 2027',
    dueDate: '14 Mei',
    daysLeft: 3,
    purpose: 'Modal Usaha',
    paymentHistory: [true, true, true, true, true, true, true, true, true, true, true, true],
  },
];

const fmt = (n: number) =>
  'Rp ' + new Intl.NumberFormat('id-ID').format(n);

export function CreditTabKTA() {
  const [activeLoan, setActiveLoan] = useState(loans[0].id);
  const loan = loans.find(l => l.id === activeLoan)!;

  const scheduleMonths = [
    { bulan: 'Mei 2026', pokok: 1_050_000, bunga: 350_000, total: 1_400_000, status: 'upcoming' },
    { bulan: 'Jun 2026', pokok: 1_060_000, bunga: 340_000, total: 1_400_000, status: 'upcoming' },
    { bulan: 'Jul 2026', pokok: 1_069_000, bunga: 331_000, total: 1_400_000, status: 'upcoming' },
    { bulan: 'Agu 2026', pokok: 1_079_000, bunga: 321_000, total: 1_400_000, status: 'upcoming' },
    { bulan: 'Sep 2026', pokok: 1_089_000, bunga: 311_000, total: 1_400_000, status: 'upcoming' },
  ];

  return (
    <div>
      {/* Loan Selector (if multiple) */}
      {loans.length > 1 && (
        <div className="row g-3 mb-4">
          {loans.map(l => (
            <div key={l.id} className="col-12 col-md-6">
              <button
                className="w-100 text-start border-0 p-0 bg-transparent"
                onClick={() => setActiveLoan(l.id)}
              >
                <div
                  className={`card h-100 shadow-sm ${activeLoan === l.id ? 'border-2 border-primary' : 'border-0'}`}
                  style={{ borderRadius: '1rem', cursor: 'pointer' }}
                >
                  <div className="card-body p-4">
                    <div className="fw-bold">{l.name}</div>
                    <div className="text-secondary small mb-2">{l.bank}</div>
                    <div className="progress progress-sm mb-1">
                      <div className="progress-bar bg-primary" style={{ width: `${l.paidPct}%` }} />
                    </div>
                    <div className="text-secondary small">{l.paidPct}% terlunasi</div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="row g-3">
        {/* Left: Info */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="avatar avatar-sm bg-primary text-white rounded-2 me-3">
                  <Icon icon="building-bank" size="sm" />
                </div>
                <div>
                  <div className="fw-bold">{loan.name}</div>
                  <div className="text-secondary small">{loan.type}</div>
                </div>
              </div>

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Plafon</span>
                  <span className="fw-bold small">{fmt(loan.totalAmount)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Sudah dibayar</span>
                  <span className="fw-bold small text-success">{fmt(loan.paid)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Sisa pokok</span>
                  <span className="fw-bold small text-danger">{fmt(loan.remaining)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Cicilan/bln</span>
                  <span className="fw-bold small">{fmt(loan.monthlyInstallment)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Suku bunga</span>
                  <span className="fw-bold small">{loan.interestRate}% p.a.</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Tenor</span>
                  <span className="fw-bold small">{loan.tenor} bulan</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Sisa tenor</span>
                  <span className="fw-bold small">{loan.remaining_months} bulan</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Mulai — Selesai</span>
                  <span className="fw-bold small">{loan.startDate} — {loan.endDate}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Tujuan pinjaman</span>
                  <span className="fw-bold small">{loan.purpose}</span>
                </div>
              </div>

              <div className="progress mb-2">
                <div className="progress-bar bg-primary" style={{ width: `${loan.paidPct}%` }} />
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary small">{loan.paidPct}% terlunasi</span>
                <span className="text-secondary small">{100 - loan.paidPct}% tersisa</span>
              </div>

              <div className="mt-4 pt-3 border-top">
                <div className={`d-flex align-items-center gap-2 p-3 rounded-2 bg-${loan.daysLeft <= 5 ? 'danger' : 'warning'}-lt`}>
                  <Icon icon="calendar-event" size={16} className={`text-${loan.daysLeft <= 5 ? 'danger' : 'warning'}`} />
                  <div>
                    <div className={`fw-bold small text-${loan.daysLeft <= 5 ? 'danger' : 'warning'}`}>Jatuh tempo: {loan.dueDate}</div>
                    <div className="text-secondary small">{loan.daysLeft} hari lagi • {fmt(loan.monthlyInstallment)}</div>
                  </div>
                </div>
                <button className="btn btn-primary w-100 fw-bold mt-3">
                  <Icon icon="credit-card" size={16} className="me-2" />
                  Bayar Cicilan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Progress Chart + Schedule */}
        <div className="col-12 col-lg-8">
          {/* Payment History (dots) */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold mb-1">Riwayat Pembayaran</h3>
              <div className="text-secondary small mb-3">12 bulan terakhir — status tepat waktu</div>
              <div className="d-flex flex-wrap gap-2">
                {['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'].map((m, i) => (
                  <div key={i} className="text-center">
                    <div
                      className={`rounded-circle mb-1 ${loan.paymentHistory[i] ? 'bg-success' : 'bg-danger'}`}
                      style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Icon icon={loan.paymentHistory[i] ? 'check' : 'x'} size={14} className="text-white" />
                    </div>
                    <div className="text-secondary" style={{ fontSize: '10px' }}>{m}</div>
                  </div>
                ))}
              </div>
              <div className="d-flex gap-3 mt-3">
                <div className="d-flex align-items-center gap-1">
                  <span className="rounded-circle bg-success d-inline-block" style={{ width: 8, height: 8 }} />
                  <span className="text-secondary small">Tepat waktu</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <span className="rounded-circle bg-danger d-inline-block" style={{ width: 8, height: 8 }} />
                  <span className="text-secondary small">Terlambat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amortization Schedule */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="card-title fw-bold m-0">Jadwal Angsuran</h3>
                <span className="badge bg-blue-lt">5 Bulan ke Depan</span>
              </div>
              <div className="table-responsive">
                <table className="table table-vcenter card-table">
                  <thead>
                    <tr>
                      <th className="subheader text-secondary">Bulan</th>
                      <th className="subheader text-secondary text-end">Pokok</th>
                      <th className="subheader text-secondary text-end">Bunga</th>
                      <th className="subheader text-secondary text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleMonths.map((row, i) => (
                      <tr key={i}>
                        <td>
                          <div className="fw-bold small">{row.bulan}</div>
                          {i === 0 && <div className="text-danger small opacity-75">Segera</div>}
                        </td>
                        <td className="text-end">
                          <span className="small">{fmt(row.pokok)}</span>
                        </td>
                        <td className="text-end">
                          <span className="small text-warning">{fmt(row.bunga)}</span>
                        </td>
                        <td className="text-end">
                          <span className="fw-bold small">{fmt(row.total)}</span>
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
