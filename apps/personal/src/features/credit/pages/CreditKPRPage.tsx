import { useState, useMemo } from 'react'
import { Icon, Chart, Button } from '@/shared/components/ui'
import { useCredits } from '../hooks/useCredits'
import { useCreditLayoutContext } from '../context/CreditLayoutContext'
import { formatCurrency } from '@/shared/utils/currencyUtils'

export function CreditKPRPage() {
  const { openFormForType, openForm } = useCreditLayoutContext()
  const { data: loans = [], isLoading } = useCredits('kpr')

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const activeLoanId = selectedId ?? loans[0]?.id

  const activeAccount = useMemo(() => {
    return loans.find((l) => l.id === activeLoanId) || loans[0]
  }, [loans, activeLoanId])

  if (isLoading) {
    return <div className="py-5 text-center text-muted">Memuat data KPR...</div>
  }

  if (loans.length === 0) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="text-center py-5 d-flex flex-column justify-content-center align-items-center flex-grow-1">
            <Icon icon="home-off" size={32} stroke={1.5} className="text-secondary opacity-50 mb-3" />
            <div className="fw-bold text-body mb-1" style={{ fontSize: '14px' }}>Belum Ada Pinjaman KPR</div>
            <div className="text-secondary mb-3" style={{ fontSize: '12px', lineHeight: '1.5' }}>Tambahkan profil KPR Anda melalui menu "Tambah Profil" di atas.</div>
            <Button size="sm" color="primary" onClick={() => openFormForType('kpr')}>
              <Icon icon="plus" size={14} className="me-1" />
              Tambah KPR / Mortgage
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const loan = activeAccount!
  const credit = loan.credit!
  const paidAmount = Math.max(0, credit.limit - credit.total_amount)
  const paidPct = credit.limit > 0 ? Math.round((paidAmount / credit.limit) * 100) : 0

  return (
    <div className="d-flex flex-column gap-3">
      <div
        className="d-flex flex-nowrap overflow-x-auto gap-3 hide-scrollbar"
        style={{
          paddingTop: '8px',
          paddingBottom: '8px',
          marginTop: '-8px',
          marginBottom: '-8px'
        }}
      >
        {loans.map((l) => {
          const lPct =
            l.credit!.limit > 0
              ? Math.round(
                  (Math.max(0, l.credit!.limit - l.credit!.total_amount) / l.credit!.limit) * 100
                )
              : 0
          const isActive = activeLoanId === l.id
          const themeColor = l.color || '#206bc4'
          const lDaysLeft = l.credit?.due_date
            ? Math.ceil(
                (new Date(l.credit.due_date).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : null

          return (
            <div
              key={l.id}
              className={`flex-shrink-0 card credit-loan-card ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedId(l.id)}
            >
              <div className="card-body p-3 d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div
                    className={`fw-bold text-truncate text-11 ${isActive ? 'text-primary' : ''}`}
                  >
                    {l.name}
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-center shadow-sm w-28 text-white"
                    style={{ backgroundColor: themeColor, borderRadius: '10px' }}
                  >
                    <Icon icon="home" size={14} />
                  </div>
                </div>

                <div>
                  <div className="text-muted mb-1 text-10">Sisa Saldo</div>
                  <div className="h3 fw-bold mb-0 text-18">
                    {formatCurrency(l.credit!.total_amount).replace('Rp', '').trim()}
                  </div>
                </div>

                <div className="mt-2 d-flex align-items-center gap-1 text-10">
                  <Icon
                    icon={lDaysLeft !== null && lDaysLeft <= 7 ? 'alert-triangle' : 'trending-down'}
                    size={12}
                    className={
                      lDaysLeft !== null && lDaysLeft <= 7 ? 'text-danger' : 'text-success'
                    }
                  />
                  <span
                    className={
                      lDaysLeft !== null && lDaysLeft <= 7 ? 'text-danger' : 'text-success'
                    }
                  >
                    {lDaysLeft !== null && lDaysLeft <= 7
                      ? `${lDaysLeft} hari lagi`
                      : `Lunas ${lPct}%`}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        <div
          className="flex-shrink-0 card d-flex align-items-center justify-content-center text-muted shadow-none credit-loan-card-add"
          onClick={() => openFormForType('kpr')}
        >
          <div className="text-center opacity-75">
            <Icon icon="plus" size={20} className="mb-1" />
            <div className="text-11 fw-medium">Tambah KPR</div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column flex-lg-row gap-3">
        <div className="w-100" style={{ flex: '1 1 32%', minWidth: 0 }}>
          <div className="card modern-card h-100 overflow-hidden">
            <div className="card-body p-3 d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="avatar avatar-md text-white rounded-4 border-0 bg-primary"
                  >
                    <Icon icon="home" size={24} />
                  </span>
                  <div>
                    <h3 className="fw-bold mb-0 text-dark">{loan.name}</h3>
                    <div className="text-secondary small fw-medium">KPR — {loan.provider?.name}</div>
                  </div>
                </div>
                <button
                  className="btn btn-icon btn-light bg-surface border shadow-none"
                  style={{ borderRadius: '8px', width: '32px', height: '32px' }}
                  onClick={() => openForm(loan)}
                  title="Edit Profil"
                >
                  <Icon icon="pencil" size={14} className="text-secondary" />
                </button>
              </div>

              <div className="modern-glass-panel p-3 mb-3">
                <div className="row g-2">
                  <div className="col-6">
                    <div className="text-secondary small mb-1 fw-medium">ANGSURAN</div>
                    <div className="fw-black h3 mb-0 text-dark">
                      {formatCurrency(credit.installment_amount).replace('Rp', '').trim()}
                    </div>
                  </div>
                  <div className="col-6 text-end">
                    <div className="text-secondary small mb-1 fw-medium">BUNGA</div>
                    <div className="fw-bold text-azure">{credit.interest_rate || 0}% p.a</div>
                  </div>
                  <div className="col-12 m-0 p-0 py-1">
                    <hr className="m-0" style={{ opacity: 0.1 }} />
                  </div>
                  <div className="col-6">
                    <div className="text-secondary small mb-1 fw-medium">SISA TENOR</div>
                    <div className="fw-bold text-dark">{credit.tenor_months || 0} Bulan</div>
                  </div>
                  <div className="col-6 text-end">
                    <div className="text-secondary small mb-1 fw-medium">SISA SALDO</div>
                    <div className="fw-bold text-success">
                      {formatCurrency(credit.total_amount).replace('Rp', '').trim()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary small fw-medium">Progress Pelunasan</span>
                  <span className="fw-bold text-dark small">{paidPct}%</span>
                </div>
                <div className="progress progress-sm" style={{ height: '6px', borderRadius: '10px', backgroundColor: '#f1f5f9' }}>
                  <div className="progress-bar bg-primary" style={{ width: `${paidPct}%`, borderRadius: '10px' }} />
                </div>
              </div>

              <div className="d-flex justify-content-between gap-2 mb-3">
                <div className="col-6">
                  <div className="p-2 rounded-3 text-center" style={{ backgroundColor: '#f8fafc', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <Icon icon="percentage" size={16} className="text-primary mb-1" />
                    <div className="text-secondary" style={{ fontSize: '10px', fontWeight: 600 }}>TIPE BUNGA</div>
                    <div className="fw-bold text-dark small">Fixed 3 Thn</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2 rounded-3 text-center" style={{ backgroundColor: '#f8fafc', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <Icon icon="shield-check" size={16} className="text-success mb-1" />
                    <div className="text-secondary" style={{ fontSize: '10px', fontWeight: 600 }}>STATUS KREDIT</div>
                    <div className="fw-bold text-success small">Lancar</div>
                  </div>
                </div>
              </div>              <div className="d-flex justify-content-between align-items-center p-2 px-3 rounded-3 mb-3" style={{ backgroundColor: '#f8fafc', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="d-flex align-items-center gap-2">
                  <Icon icon="bell" size={16} className="text-secondary" />
                  <span className="text-secondary small fw-medium">Pengingat Tagihan</span>
                </div>
                <div className="form-check form-switch m-0">
                  <input className="form-check-input" type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                </div>
              </div>
              <div className="d-grid gap-2 mt-auto">
                <button
                  className="btn text-white w-100 border-0 px-0 rounded-pill h-42 bg-primary text-13 fw-bold"
                >
                  Bayar Sekarang
                </button>

              </div>
            </div>
          </div>
        </div>

        <div className="w-100 d-none d-lg-block" style={{ flex: '2 1 65%', minWidth: 0 }}>
          <div className="card modern-card h-100 overflow-hidden">
            <div className="card-header border-0 pb-0 px-4 pt-4">
              <h3 className="card-title fw-bold">Proyeksi Pelunasan</h3>
              <div className="card-actions">
                <span className="text-muted small">Distribusi Pokok & Bunga — {loan.name}</span>
              </div>
            </div>
            <div className="card-body p-0">
              <Chart
                chartId={`kpr-principal-${loan.id}`}
                height={26}
                chartData={{
                  type: 'bar',
                  series: [
                    {
                      name: 'Sisa Pokok',
                      color: 'var(--tblr-primary)',
                      data: [1200, 1150, 1100, 1050, 1000, 950, 900, 850, 800, 750, 700, 650],
                    },
                    {
                      name: 'Total Bunga',
                      color: 'var(--tblr-azure)',
                      data: [200, 195, 190, 185, 180, 175, 170, 165, 160, 155, 150, 145],
                    },
                  ],
                  categories: [
                    'Jun',
                    'Jul',
                    'Agu',
                    'Sep',
                    'Okt',
                    'Nov',
                    'Des',
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'Mei',
                  ],
                  datalabels: false,
                  legend: true,
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
                    plotOptions: {
                      bar: {
                        columnWidth: '50%',
                        borderRadius: 4,
                        distributed: false,
                      },
                    },
                    tooltip: { theme: 'dark' },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="card border-0 shadow-sm overflow-hidden credit-kta-card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <ul className="nav gap-3" style={{ borderBottom: 'none' }}>
                {(['Semua', 'Selesai', 'Pending', 'Gagal']).map((tab) => (
                  <li className="nav-item" key={tab}>
                    <button
                      className="bg-transparent border-0 fw-semibold"
                      style={{
                        fontSize: '14px',
                        color: tab === 'Semua' ? 'var(--tblr-body-color)' : 'var(--tblr-secondary)',
                        transition: 'color 0.15s',
                      }}
                    >
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-light bg-surface btn-sm border d-flex align-items-center gap-2 shadow-none px-3" style={{ borderRadius: '8px' }}>
                  <Icon icon="download" size={16} className="text-secondary" />
                  <span className="d-none d-sm-inline text-secondary fw-medium">Ekspor Laporan</span>
                </button>
                <button className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3 shadow-none" style={{ backgroundColor: '#f76707', borderColor: '#f76707', borderRadius: '8px' }}>
                  <Icon icon="plus" size={16} />
                  <span className="d-none d-sm-inline fw-medium">Tambah Baru</span>
                </button>
              </div>
            </div>
            <div className="card-body p-0 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom flex-shrink-0">
                <span className="fw-bold" style={{ fontSize: '14px' }}>Jadwal Angsuran</span>
                <span className="text-secondary" style={{ fontSize: '13px' }}>120 item</span>
              </div>
              <div className="d-flex flex-column flex-grow-1">
                {[...Array(8)].map((_, i) => {
                  const itemsLength = 8
                  return (
                    <div 
                      key={i}
                      className="d-flex justify-content-between align-items-center px-4 py-3"
                      style={{ 
                        borderBottom: i < itemsLength - 1 ? '1px solid #f1f5f9' : undefined,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <div className="flex-grow-1 overflow-hidden me-2">
                      <div className="fw-bold text-truncate text-body" style={{ fontSize: '15px' }}>
                        Angsuran Ke-{12 + i}
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-2" style={{ fontSize: '12px', color: 'var(--tblr-gray-500)' }}>
                        <span className="rounded-pill px-2 fw-bold d-inline-flex align-items-center justify-content-center" style={{ background: '#f6ad5522', color: '#dd6b20', fontSize: '10px', height: '20px' }}>
                          Terjadwal
                        </span>
                        <span>&middot;</span>
                        <span>Mei 2026</span>
                        <span>&middot;</span>
                        <span>P: {formatCurrency(credit.installment_amount * 0.4).replace('Rp', '').trim()} | B: {formatCurrency(credit.installment_amount * 0.6).replace('Rp', '').trim()}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="fw-bold flex-shrink-0" style={{ color: '#e53e3e', fontSize: '15px' }}>
                        - {formatCurrency(Math.abs(credit.installment_amount))}
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
            </div>
            <div className="card-footer d-flex flex-column flex-md-row align-items-center justify-content-between bg-transparent border-top py-2 gap-3">
              <div className="text-secondary small d-flex align-items-center">
                Menampilkan&nbsp;<strong>1</strong>&nbsp;–&nbsp;
                <strong>8</strong>&nbsp;dari&nbsp;<strong>120</strong>
                &nbsp;data
              </div>
              <div className="pagination-wrapper">
                <ul className="pagination m-0 pagination-sm">
                  <li className="page-item disabled"><a className="page-link" href="#" tabIndex={-1} aria-disabled="true">‹</a></li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item"><a className="page-link" href="#">4</a></li>
                  <li className="page-item"><a className="page-link" href="#">›</a></li>
                </ul>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
