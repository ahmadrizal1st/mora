import React, { useState } from 'react';
import { Icon } from '@/shared/components/ui';

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

const MONTHS = ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'];

const fmt = (n: number) =>
  'Rp ' + new Intl.NumberFormat('id-ID').format(n);

export function CreditTabKTA() {
  const [activeLoan, setActiveLoan] = useState(loans[0].id);
  const loan = loans.find(l => l.id === activeLoan)!;
  const urgentColor = loan.daysLeft <= 5 ? 'danger' : 'warning';

  const scheduleMonths = [
    { bulan: 'Mei 2026', pokok: 1_050_000, bunga: 350_000, total: 1_400_000 },
    { bulan: 'Jun 2026', pokok: 1_060_000, bunga: 340_000, total: 1_400_000 },
    { bulan: 'Jul 2026', pokok: 1_069_000, bunga: 331_000, total: 1_400_000 },
    { bulan: 'Agu 2026', pokok: 1_079_000, bunga: 321_000, total: 1_400_000 },
    { bulan: 'Sep 2026', pokok: 1_089_000, bunga: 311_000, total: 1_400_000 },
  ];

  return (
    <div>
      {/* Loan Selector */}
      {loans.length > 1 && (
        <div className="row g-3 mb-4">
          {loans.map(l => (
            <div key={l.id} className="col-12 col-md-6">
              <button
                className="w-100 text-start border-0 p-0 bg-transparent"
                onClick={() => setActiveLoan(l.id)}
              >
                <div className={`card shadow-sm ${activeLoan === l.id ? 'border border-primary' : 'border-0'}`}>
                  <div className="card-body">
                    <div className="fw-bold">{l.name}</div>
                    <div className="text-secondary small mb-2">{l.bank}</div>
                    <div className="progress progress-sm mb-1">
                      <div className="progress-bar bg-primary" style={{ width: `${l.paidPct}%` }} />
                    </div>
                    <div className="text-muted small">{l.paidPct}% terlunasi</div>
                  </div>
                </div>
              </button>
            </div>
          ))}
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
                  <div className="text-muted small">{loan.type}</div>
                </div>
              </div>
              <div className="card-actions">
                <span className={`badge bg-${urgentColor}-lt text-${urgentColor} border-0`}>
                  {loan.daysLeft} hari lagi
                </span>
              </div>
            </div>

            <div className="card-body">
              {/* Key-value list */}
              <ul className="list-group list-group-flush">
                {[
                  { label: 'Plafon',         value: fmt(loan.totalAmount) },
                  { label: 'Sudah dibayar',  value: fmt(loan.paid),             cls: 'text-success' },
                  { label: 'Sisa pokok',     value: fmt(loan.remaining),        cls: 'text-danger' },
                  { label: 'Cicilan/bln',    value: fmt(loan.monthlyInstallment) },
                  { label: 'Suku bunga',     value: `${loan.interestRate}% p.a.` },
                  { label: 'Tenor',          value: `${loan.tenor} bulan` },
                  { label: 'Sisa tenor',     value: `${loan.remaining_months} bulan` },
                  { label: 'Periode',        value: `${loan.startDate} — ${loan.endDate}` },
                  { label: 'Tujuan',         value: loan.purpose },
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
                  <span className="text-muted small">{loan.paidPct}% terlunasi</span>
                  <span className="text-muted small">{100 - loan.paidPct}% tersisa</span>
                </div>
                <div className="progress progress-sm">
                  <div className="progress-bar bg-primary" style={{ width: `${loan.paidPct}%` }} />
                </div>
              </div>

              {/* Due Date Alert */}
              <div className={`alert alert-${urgentColor} d-flex align-items-center gap-2 mt-3 mb-0`} role="alert">
                <Icon icon="calendar-event" size={16} />
                <div>
                  <div className="fw-bold small">Jatuh tempo: {loan.dueDate}</div>
                  <div className="small opacity-75">{loan.daysLeft} hari lagi • {fmt(loan.monthlyInstallment)}</div>
                </div>
              </div>

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
                    <span className={`avatar avatar-sm rounded-circle mb-1 ${loan.paymentHistory[i] ? 'bg-success' : 'bg-danger'} text-white`}>
                      <Icon icon={loan.paymentHistory[i] ? 'check' : 'x'} size={14} />
                    </span>
                    <div className="text-muted" style={{ fontSize: '10px' }}>{m}</div>
                  </div>
                ))}
              </div>
              <div className="d-flex gap-3 mt-3">
                <span className="d-flex align-items-center gap-1 text-muted small">
                  <span className="badge bg-success d-inline-block rounded-circle p-1" />
                  Tepat waktu
                </span>
                <span className="d-flex align-items-center gap-1 text-muted small">
                  <span className="badge bg-danger d-inline-block rounded-circle p-1" />
                  Terlambat
                </span>
              </div>
            </div>
          </div>

          {/* Amortization Schedule */}
          <div className="card border-0 shadow-sm">
            <div className="card-header">
              <h3 className="card-title">Jadwal Angsuran</h3>
              <div className="card-actions">
                <span className="badge bg-blue-lt text-blue border-0">5 Bulan ke Depan</span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Bulan</th>
                    <th className="text-end">Pokok</th>
                    <th className="text-end">Bunga</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleMonths.map((row, i) => (
                    <tr key={i}>
                      <td>
                        <div className="fw-bold small">{row.bulan}</div>
                        {i === 0 && <div className="text-danger small">Segera</div>}
                      </td>
                      <td className="text-end small">{fmt(row.pokok)}</td>
                      <td className="text-end small text-warning">{fmt(row.bunga)}</td>
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
  );
}
