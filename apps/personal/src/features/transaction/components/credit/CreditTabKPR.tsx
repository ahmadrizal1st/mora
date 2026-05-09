import { Icon, Chart } from '@/shared/components/ui';

const fmt = (n: number) =>
  'Rp ' + new Intl.NumberFormat('id-ID').format(n);

const MONTHS = ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'];

const kpr = {
  name: 'KPR BTN',
  bank: 'Bank BTN',
  propertyName: 'Rumah Grand Sentosa',
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
  const urgentColor = kpr.daysLeft <= 7 ? 'danger' : 'warning';

  return (
    <div>
      {/* Property Hero */}
      <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, var(--tblr-warning) 0%, #e67e00 100%)' }}>
        <div className="card-body p-4 text-white">
          <div className="row align-items-center">
            <div className="col-12 col-md-8">
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="avatar avatar-sm bg-white text-warning rounded-2">
                  <Icon icon="home" size={16} />
                </span>
                <div>
                  <div className="fw-bold">{kpr.propertyName}</div>
                  <div className="small opacity-75">{kpr.propertyAddress}</div>
                </div>
              </div>
              <div className="row g-3">
                {[
                  { label: 'Nilai Properti',  value: fmt(kpr.propertyValue) },
                  { label: 'Nilai Appraisal', value: fmt(kpr.appraisalValue) },
                  { label: 'Equity Gain',     value: `+${fmt(kpr.equityGain)}` },
                  { label: 'LTV',             value: `${kpr.ltv}%` },
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
              <div className="display-6 fw-bold">{fmt(kpr.remaining)}</div>
              <div className="small opacity-75 mt-1">dari {fmt(kpr.loanAmount)} plafon</div>
            </div>
          </div>
        </div>
      </div>

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
                  <div className="card-title fw-bold mb-0">{kpr.name}</div>
                  <div className="text-muted small">{kpr.bank}</div>
                </div>
              </div>
              <div className="card-actions">
                <span className={`badge bg-${urgentColor}-lt text-${urgentColor} border-0`}>
                  {kpr.daysLeft} hari lagi
                </span>
              </div>
            </div>

            <div className="card-body">
              <ul className="list-group list-group-flush">
                {[
                  { label: 'Plafon',         value: fmt(kpr.loanAmount) },
                  { label: 'Sudah dilunasi', value: fmt(kpr.paid),               cls: 'text-success' },
                  { label: 'Cicilan per bln',    value: fmt(kpr.monthlyInstallment) },
                  { label: 'Suku bunga',     value: `${kpr.interestRate}% p.a.`,
                    extra: <span className="badge bg-warning-lt text-warning border-0 rounded-1 ms-1" style={{ fontSize: '10px' }}>Floating</span> },
                  { label: 'Periode fixed',  value: kpr.fixedPeriod },
                  { label: 'Tenor',          value: `${kpr.tenor} bulan (20 thn)` },
                  { label: 'Sisa tenor',     value: `${kpr.remainingMonths} bulan (12 thn)` },
                  { label: 'Periode',        value: `${kpr.startDate} — ${kpr.endDate}` },
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
                  <span className="text-muted small">{kpr.paidPct}% terlunasi</span>
                  <span className="text-muted small">LTV {kpr.ltv}%</span>
                </div>
                <div className="progress progress-sm">
                  <div className="progress-bar bg-warning" style={{ width: `${kpr.paidPct}%` }} />
                </div>
              </div>


              <div className={`alert alert-${urgentColor} d-flex align-items-center gap-2 mt-3 mb-0`} role="alert">
                <Icon icon="calendar-event" size={16} />
                <div>
                  <div className="fw-bold small">Jatuh tempo: {kpr.dueDate}</div>
                  <div className="small opacity-75">{kpr.daysLeft} hari lagi • {fmt(kpr.monthlyInstallment)}</div>
                </div>
              </div>

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
                    <span className={`avatar avatar-sm rounded-circle mb-1 ${kpr.paymentHistory[i] ? 'bg-success' : 'bg-danger'} text-white`}>
                      <Icon icon={kpr.paymentHistory[i] ? 'check' : 'x'} size={14} />
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
                <span className="text-muted small">6 bulan akumulasi</span>
              </div>
            </div>
            <div className="card-body">
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
                  {kpr.amortization.map((row, i) => (
                    <tr key={i}>
                      <td>
                        <div className="fw-bold small">{row.bulan}</div>
                        {i === 0 && <div className="text-warning small">Segera</div>}
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
