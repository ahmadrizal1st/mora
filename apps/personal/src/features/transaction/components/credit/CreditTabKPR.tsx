import React from 'react';
import { Icon, Chart } from '@/shared/components/ui';

const fmt = (n: number) =>
  'Rp ' + new Intl.NumberFormat('id-ID').format(n);

const kpr = {
  name: 'KPR BTN',
  bank: 'Bank BTN',
  propertyName: 'Rumah Perumahan Grand Sentosa',
  propertyAddress: 'Jl. Melati No. 12, Bekasi Utara',
  propertyValue: 1_200_000_000,
  purchasePrice: 900_000_000,
  loanAmount: 720_000_000,
  remaining: 480_000_000,
  paid: 240_000_000,
  paidPct: 60,
  ltv: 40,
  interestType: 'Floating',
  interestRate: 6.75,
  fixedPeriod: '2 tahun pertama (selesai)',
  monthlyInstallment: 4_800_000,
  tenor: 240,
  remainingMonths: 144,
  startDate: 'Jan 2014',
  endDate: 'Jan 2034',
  dueDate: '25 Mei',
  daysLeft: 14,
  appraisalValue: 1_450_000_000,
  equityGain: 250_000_000,
  paymentHistory: [true, true, true, true, true, true, true, true, true, true, true, true],
  amortization: [
    { bulan: 'Mei 2026', pokok: 2_000_000, bunga: 2_800_000, total: 4_800_000 },
    { bulan: 'Jun 2026', pokok: 2_011_000, bunga: 2_789_000, total: 4_800_000 },
    { bulan: 'Jul 2026', pokok: 2_023_000, bunga: 2_777_000, total: 4_800_000 },
    { bulan: 'Agu 2026', pokok: 2_034_000, bunga: 2_766_000, total: 4_800_000 },
    { bulan: 'Sep 2026', pokok: 2_045_000, bunga: 2_755_000, total: 4_800_000 },
  ],
  principalHistory: [226_000_000, 228_000_000, 230_000_000, 232_000_000, 236_000_000, 240_000_000],
};

export function CreditTabKPR() {
  return (
    <div>
      {/* Property Summary Header */}
      <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, var(--tblr-warning) 0%, #e67e00 100%)' }}>
        <div className="card-body p-4 text-white">
          <div className="row align-items-center">
            <div className="col-12 col-md-8">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="avatar avatar-sm bg-white text-warning rounded-2">
                  <Icon icon="home" size="sm" />
                </div>
                <div>
                  <div className="fw-bold">{kpr.propertyName}</div>
                  <div className="small opacity-75">{kpr.propertyAddress}</div>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <div className="small opacity-75 mb-1">Nilai Properti</div>
                  <div className="fw-bold">{fmt(kpr.propertyValue)}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small opacity-75 mb-1">Nilai Appraisal</div>
                  <div className="fw-bold">{fmt(kpr.appraisalValue)}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small opacity-75 mb-1">Equity Gain</div>
                  <div className="fw-bold text-success-lt">+{fmt(kpr.equityGain)}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small opacity-75 mb-1">LTV</div>
                  <div className="fw-bold">{kpr.ltv}%</div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 mt-3 mt-md-0">
              <div className="text-end">
                <div className="small opacity-75 mb-1">Sisa Pokok Pinjaman</div>
                <div className="display-6 fw-bold">{fmt(kpr.remaining)}</div>
                <div className="small opacity-75 mt-1">dari {fmt(kpr.loanAmount)} plafon KPR</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Loan Info Card */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold mb-4">Detail KPR</h3>
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Bank</span>
                  <span className="fw-bold small">{kpr.bank}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Plafon</span>
                  <span className="fw-bold small">{fmt(kpr.loanAmount)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Sudah dilunasi</span>
                  <span className="fw-bold small text-success">{fmt(kpr.paid)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Cicilan/bln</span>
                  <span className="fw-bold small">{fmt(kpr.monthlyInstallment)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Suku bunga</span>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold small">{kpr.interestRate}% p.a.</span>
                    <span className="badge bg-warning-lt text-warning border-0 rounded-1">Floating</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Periode fixed</span>
                  <span className="fw-bold small">{kpr.fixedPeriod}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Tenor</span>
                  <span className="fw-bold small">{kpr.tenor} bulan (20 thn)</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Sisa tenor</span>
                  <span className="fw-bold small">{kpr.remainingMonths} bulan (12 thn)</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Mulai — Lunas</span>
                  <span className="fw-bold small">{kpr.startDate} — {kpr.endDate}</span>
                </div>
              </div>

              <div className="progress mb-2" style={{ height: '8px' }}>
                <div className="progress-bar bg-warning" style={{ width: `${kpr.paidPct}%` }} />
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="text-secondary small">{kpr.paidPct}% terlunasi</span>
                <span className="text-secondary small">LTV {kpr.ltv}%</span>
              </div>

              <div className={`d-flex align-items-center gap-2 p-3 rounded-2 bg-${kpr.daysLeft <= 7 ? 'danger' : 'warning'}-lt mb-3`}>
                <Icon icon="calendar-event" size={16} className={`text-${kpr.daysLeft <= 7 ? 'danger' : 'warning'}`} />
                <div>
                  <div className={`fw-bold small text-${kpr.daysLeft <= 7 ? 'danger' : 'warning'}`}>Jatuh tempo: {kpr.dueDate}</div>
                  <div className="text-secondary small">{kpr.daysLeft} hari lagi • {fmt(kpr.monthlyInstallment)}</div>
                </div>
              </div>
              <button className="btn btn-warning w-100 fw-bold text-white">
                <Icon icon="credit-card" size={16} className="me-2" />
                Bayar Angsuran
              </button>
            </div>
          </div>
        </div>

        {/* Right: Charts + Schedule */}
        <div className="col-12 col-lg-8">
          {/* Payment History */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold mb-1">Riwayat Pembayaran</h3>
              <div className="text-secondary small mb-3">12 bulan terakhir</div>
              <div className="d-flex flex-wrap gap-2">
                {['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'].map((m, i) => (
                  <div key={i} className="text-center">
                    <div
                      className={`rounded-circle mb-1 ${kpr.paymentHistory[i] ? 'bg-success' : 'bg-danger'}`}
                      style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Icon icon={kpr.paymentHistory[i] ? 'check' : 'x'} size={14} className="text-white" />
                    </div>
                    <div className="text-secondary" style={{ fontSize: '10px' }}>{m}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Principal Reduction Chart */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold mb-1">Pengurangan Pokok</h3>
              <div className="text-secondary small mb-3">Akumulasi pokok yang terlunasi (6 bln)</div>
              <Chart
                chartId="kpr-principal"
                height={18}
                chartData={{
                  type: 'line',
                  stacked: false,
                  series: [{ name: 'Pokok Terlunasi', color: 'var(--tblr-warning)', data: kpr.principalHistory }],
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
                      formatter: (v: number) => (v / 1_000_000).toFixed(0) + ' jt',
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
                    {kpr.amortization.map((row, i) => (
                      <tr key={i}>
                        <td>
                          <div className="fw-bold small">{row.bulan}</div>
                          {i === 0 && <div className="text-warning small opacity-75">Segera</div>}
                        </td>
                        <td className="text-end"><span className="small">{fmt(row.pokok)}</span></td>
                        <td className="text-end"><span className="small text-warning">{fmt(row.bunga)}</span></td>
                        <td className="text-end"><span className="fw-bold small">{fmt(row.total)}</span></td>
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
