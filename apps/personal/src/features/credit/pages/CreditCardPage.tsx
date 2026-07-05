import { useState, useMemo } from 'react'
import { Icon, Chart, Button } from '@/shared/components/ui'
import { useCredits } from '../hooks/useCredits'
import { useCreditLayoutContext } from '../context/CreditLayoutContext'
import { formatCurrency } from '@/shared/utils/currencyUtils'

export function CreditCardPage() {
  const { openFormForType, openForm } = useCreditLayoutContext()
  const { data: cards = [], isLoading } = useCredits('credit_card')

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const activeCardId = selectedId ?? cards[0]?.id

  const activeAccount = useMemo(() => {
    return cards.find((c) => c.id === activeCardId) || cards[0]
  }, [cards, activeCardId])

  if (isLoading) {
    return <div className="py-5 text-center text-muted">Memuat data kartu kredit...</div>
  }

  if (cards.length === 0) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="text-center py-5 d-flex flex-column justify-content-center align-items-center flex-grow-1">
            <Icon icon="credit-card-off" size={32} stroke={1.5} className="text-secondary opacity-50 mb-3" />
            <div className="fw-bold text-body mb-1" style={{ fontSize: '14px' }}>Belum Ada Kartu Kredit</div>
            <div className="text-secondary mb-3" style={{ fontSize: '12px', lineHeight: '1.5' }}>Tambahkan profil kartu kredit Anda melalui menu "Tambah Profil" di atas.</div>
            <Button size="sm" color="primary" onClick={() => openFormForType('credit_card')}>
              <Icon icon="plus" size={14} className="me-1" />
              Tambah Kartu Kredit
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const card = activeAccount!
  const credit = card.credit!
  const usedPct = credit.limit > 0 ? Math.round((credit.total_amount / credit.limit) * 100) : 0

  return (
    <div className="d-flex flex-column gap-3">
      <div
        className="d-flex flex-nowrap overflow-x-auto gap-3 scrollbar-hide hide-scrollbar"
        style={{
          paddingTop: '8px',
          paddingBottom: '8px',
          marginTop: '-8px',
          marginBottom: '-8px'
        }}
      >
        {cards.map((c) => {
          const cUsedPct =
            c.credit!.limit > 0 ? Math.round((c.credit!.total_amount / c.credit!.limit) * 100) : 0
          const isActive = activeCardId === c.id
          const daysLeft = c.credit?.due_date
            ? Math.ceil(
                (new Date(c.credit.due_date).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : null

          return (
            <div
              key={c.id}
              className={`flex-shrink-0 card credit-loan-card ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedId(c.id)}
            >
              <div className="card-body p-3 d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div
                    className={`fw-bold text-truncate text-11 ${isActive ? 'text-primary' : ''}`}
                  >
                    {c.provider?.name || 'Bank'}
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-center shadow-sm w-28 text-white"
                    style={{
                      backgroundColor: c.color || 'var(--tblr-primary)',
                      borderRadius: '10px',
                    }}
                  >
                    <Icon icon="credit-card" size={14} />
                  </div>
                </div>

                <div>
                  <div className="text-muted mb-1 text-10">{c.name}</div>
                  <div className="h3 fw-bold mb-0 text-18">
                    {formatCurrency(c.credit!.total_amount).replace('Rp', '').trim()}
                  </div>
                </div>

                <div className="mt-2 d-flex align-items-center gap-1 text-10">
                  <Icon
                    icon={daysLeft !== null && daysLeft <= 5 ? 'alert-triangle' : 'trending-down'}
                    size={12}
                    className={daysLeft !== null && daysLeft <= 5 ? 'text-danger' : 'text-success'}
                  />
                  <span
                    className={daysLeft !== null && daysLeft <= 5 ? 'text-danger' : 'text-success'}
                  >
                    {daysLeft !== null && daysLeft <= 5
                      ? `${daysLeft} hari lagi`
                      : `${cUsedPct}% dipakai`}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        <div
          className="flex-shrink-0 card d-flex align-items-center justify-content-center text-muted shadow-none credit-loan-card-add"
          onClick={() => openFormForType('credit_card')}
        >
          <div className="text-center opacity-75">
            <Icon icon="plus" size={20} className="mb-1" />
            <div className="text-11 fw-medium">Tambah Kartu</div>
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
                    className="avatar avatar-md text-white rounded-4 border-0"
                    style={{ backgroundColor: card.color || 'var(--tblr-primary)' }}
                  >
                    <Icon icon="credit-card" size={24} />
                  </span>
                  <div>
                    <h3 className="fw-bold mb-0 text-dark">{card.name}</h3>
                    <div className="text-secondary small fw-medium">{card.provider?.name}</div>
                  </div>
                </div>
                <button
                  className="btn btn-icon btn-light bg-surface border shadow-none"
                  style={{ borderRadius: '8px', width: '32px', height: '32px' }}
                  onClick={() => openForm(card)}
                  title="Edit Profil"
                >
                  <Icon icon="pencil" size={14} className="text-secondary" />
                </button>
              </div>

              <div className="modern-glass-panel p-3 mb-3">
                <div className="row g-2">
                  <div className="col-6">
                    <div className="text-secondary small mb-1 fw-medium">TAGIHAN</div>
                    <div className="fw-black h3 mb-0 text-dark">
                      {formatCurrency(credit.total_amount).replace('Rp', '').trim()}
                    </div>
                  </div>
                  <div className="col-6 text-end">
                    <div className="text-secondary small mb-1 fw-medium">MIN. BAYAR</div>
                    <div className="fw-bold text-danger">
                      {formatCurrency(credit.minimum_payment || Math.round(credit.total_amount * 0.1)).replace('Rp', '').trim()}
                    </div>
                  </div>
                  <div className="col-12 m-0 p-0 py-1">
                    <hr className="m-0" style={{ opacity: 0.1 }} />
                  </div>
                  <div className="col-6">
                    <div className="text-secondary small mb-1 fw-medium">JATUH TEMPO</div>
                    <div className="fw-bold text-dark">
                      {credit.due_date
                        ? new Date(credit.due_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : '-'}
                    </div>
                  </div>
                  <div className="col-6 text-end">
                    <div className="text-secondary small mb-1 fw-medium">SISA LIMIT</div>
                    <div className="fw-bold text-success">
                      {formatCurrency(credit.limit - credit.total_amount).replace('Rp', '').trim()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary small fw-medium">Utilisasi Limit</span>
                  <span className="fw-bold text-dark small">{usedPct}%</span>
                </div>
                <div className="progress progress-sm" style={{ height: '6px', borderRadius: '10px', backgroundColor: '#f1f5f9' }}>
                  <div
                    className={`progress-bar bg-${usedPct > 80 ? 'danger' : usedPct > 50 ? 'warning' : 'primary'}`}
                    style={{ width: `${usedPct}%`, borderRadius: '10px' }}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between gap-2 mb-3">
                <div className="col-6">
                  <div className="p-2 rounded-3 text-center" style={{ backgroundColor: '#f8fafc', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <Icon icon="calendar-event" size={16} className="text-primary mb-1" />
                    <div className="text-secondary" style={{ fontSize: '10px', fontWeight: 600 }}>TANGGAL CETAK</div>
                    <div className="fw-bold text-dark small">Tgl 15</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2 rounded-3 text-center" style={{ backgroundColor: '#f8fafc', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <Icon icon="shield-check" size={16} className="text-success mb-1" />
                    <div className="text-secondary" style={{ fontSize: '10px', fontWeight: 600 }}>STATUS KREDIT</div>
                    <div className="fw-bold text-success small">Lancar</div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center p-2 px-3 rounded-3 mb-3" style={{ backgroundColor: '#f8fafc', border: '1px solid rgba(0,0,0,0.04)' }}>
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
                  className="btn text-white w-100 border-0 px-0 rounded-pill h-42 text-13 fw-bold"
                  style={{ 
                    backgroundColor: card.color || 'var(--tblr-primary)' 
                  }}
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
                  series: [
                    {
                      name: 'Pengeluaran',
                      color: card.color || 'var(--tblr-primary)',
                      data: [0.8, 1.2, 0.9, 1.1, 1.3, 0.7, 1.2, 0.85, 1.5, 0.95, 1.1, 1.3],
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
                      },
                    },
                    tooltip: { theme: 'dark', y: { formatter: (v: number) => formatCurrency(v) } },
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
              <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom flex-shrink-0">
                <span className="fw-bold" style={{ fontSize: '13px' }}>Transaksi Terbaru</span>
                <span className="text-secondary" style={{ fontSize: '12px' }}>3 item</span>
              </div>
              <div className="d-flex flex-column flex-grow-1">
                {[
                  {
                    name: 'Tokopedia',
                    date: '2026-05-12',
                    amount: -450000,
                    category: 'Shopping',
                    color: '#ff922b',
                  },
                  {
                    name: 'Starbucks Coffee',
                    date: '2026-05-11',
                    amount: -55000,
                    category: 'Food & Bev',
                    color: '#51cf66',
                  },
                  {
                    name: 'Grab Transport',
                    date: '2026-05-10',
                    amount: -25000,
                    category: 'Transport',
                    color: '#339af0',
                  },
                ].map((t, i) => {
                  const txDate = new Date(t.date)
                  const formattedDate = txDate.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  }) + ', 07:00'
                  
                  const itemsLength = 3
                  return (
                    <div 
                      key={i}
                      className="d-flex justify-content-between align-items-center px-3 py-2"
                      style={{ 
                        borderBottom: i < itemsLength - 1 ? '1px solid #f1f5f9' : undefined,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <div className="flex-grow-1 overflow-hidden me-2">
                        <div className="fw-semibold text-truncate text-body" style={{ fontSize: '13.5px', marginBottom: '2px' }}>
                          {t.name}
                        </div>
                        <div className="d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: '11px', color: 'var(--tblr-gray-500)' }}>
                          <span className="rounded-pill px-2 fw-bold d-inline-flex align-items-center justify-content-center" style={{ background: t.color + '15', color: t.color, fontSize: '9px', height: '18px' }}>
                            {t.category}
                          </span>
                          <span>&middot;</span>
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div className="fw-bold flex-shrink-0" style={{ color: '#e53e3e', fontSize: '13.5px' }}>
                          - {formatCurrency(Math.abs(t.amount))}
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
                <strong>3</strong>&nbsp;dari&nbsp;<strong>3</strong>
                &nbsp;data
              </div>
              <div className="pagination-wrapper">
                <ul className="pagination m-0 pagination-sm">
                  <li className="page-item disabled"><a className="page-link" href="#" tabIndex={-1} aria-disabled="true">‹</a></li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item disabled"><a className="page-link" href="#">›</a></li>
                </ul>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
