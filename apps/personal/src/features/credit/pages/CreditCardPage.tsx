import { useState, useMemo } from 'react'
import { Icon, Chart, Button } from '@/shared/components/ui'
import { useCredits } from '../hooks/useCredits'
import { useCreditLayoutContext } from '../context/CreditLayoutContext'

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n)

export function CreditCardPage() {
  const { openFormForType } = useCreditLayoutContext()
  const { data: allCredits = [], isLoading } = useCredits()

  const cards = useMemo(() => {
    return allCredits.filter((acc) => acc.credit?.credit_type === 'credit_card')
  }, [allCredits])

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
      <div className="card border-0 shadow-sm py-5 text-center">
        <div className="card-body">
          <Icon icon="credit-card-off" size={48} className="mb-3 text-muted opacity-50" />
          <h3 className="fw-bold">Belum Ada Kartu Kredit</h3>
          <p className="text-muted mb-3">
            Tambahkan profil kartu kredit Anda melalui menu "Tambah Profil" di atas.
          </p>
          <Button element="button" color="primary" onClick={() => openFormForType('credit_card')}>
            <Icon icon="plus" size={16} className="me-2" />
            Tambah Kartu Kredit
          </Button>
        </div>
      </div>
    )
  }

  const card = activeAccount!
  const credit = card.credit!
  const usedPct = credit.limit > 0 ? Math.round((credit.total_amount / credit.limit) * 100) : 0

  return (
    <div>
      <div className="d-flex flex-nowrap overflow-x-auto gap-2 pb-3 mb-4 scrollbar-hide hide-scrollbar">
        {cards.map((c) => {
          const cUsedPct =
            c.credit!.limit > 0 ? Math.round((c.credit!.total_amount / c.credit!.limit) * 100) : 0
          const isActive = activeCardId === c.id
          const themeColor = c.color || '#206bc4'
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
                    {new Intl.NumberFormat('id-ID')
                      .format(c.credit!.total_amount)
                      .replace('Rp', '')}
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

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100 overflow-hidden credit-kta-card">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <span
                  className="avatar avatar-md text-white rounded-3 shadow-sm border-0"
                  style={{ backgroundColor: card.color || 'var(--tblr-primary)' }}
                >
                  <Icon icon="credit-card" size={24} />
                </span>
                <div>
                  <h3 className="fw-bold mb-0">{card.name}</h3>
                  <div className="text-muted small">{card.provider?.name}</div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="text-secondary small mb-1">TAGIHAN</div>
                  <div className="fw-black h3 mb-0">
                    {fmt(credit.total_amount).replace('Rp ', '')}
                  </div>
                </div>
                <div className="col-6 text-end">
                  <div className="text-secondary small mb-1">MIN. BAYAR</div>
                  <div className="fw-bold text-danger">
                    {fmt(credit.minimum_payment || Math.round(credit.total_amount * 0.1)).replace(
                      'Rp ',
                      ''
                    )}
                  </div>
                </div>
                <div className="col-6 mt-3">
                  <div className="text-secondary small mb-1">JATUH TEMPO</div>
                  <div className="fw-bold text-dark">
                    {credit.due_date
                      ? new Date(credit.due_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })
                      : '-'}
                  </div>
                </div>
                <div className="col-6 text-end mt-3">
                  <div className="text-secondary small mb-1">SISA LIMIT</div>
                  <div className="fw-bold text-success">
                    {fmt(credit.limit - credit.total_amount).replace('Rp ', '')}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-secondary small fw-medium">Utilisasi Limit</span>
                  <span className="fw-bold small">{usedPct}%</span>
                </div>
                <div className="progress progress-sm credit-progress-bar">
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
                    <span className="fw-bold text-dark">Tips AI:</span> Bayar tagihan penuh sebelum{' '}
                    <span className="text-primary fw-bold">18 Mei</span> untuk menjaga skor kredit
                    Anda tetap optimal di zona hijau.
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2">
                <button
                  className="btn text-white w-100 position-relative overflow-hidden d-flex align-items-center justify-content-center border-0 px-0 shadow-sm rounded-pill h-42 text-13 fw-bold"
                  style={{ backgroundColor: card.color || 'var(--tblr-primary)' }}
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
                    fontSize: '13px',
                  }}
                >
                  <span>Lihat Transaksi</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8 d-none d-lg-block">
          <div
            className="card border-0 shadow-sm h-100 overflow-hidden"
            style={{ borderRadius: '20px' }}
          >
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
                    tooltip: { theme: 'dark', y: { formatter: (v: number) => fmt(v) } },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-12 mt-2">
          <div className="card border-0 shadow-sm overflow-hidden credit-kta-card">
            <div className="card-header border-0 pb-0">
              <h3 className="card-title fw-bold">Transaksi Terbaru</h3>
              <div className="card-actions">
                <button className="btn btn-sm btn-ghost-azure">Lihat semua</button>
              </div>
            </div>
            <div className="card-body p-0 m-0">
              <div>
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
                  })
                  
                  return (
                    <div 
                      key={i}
                      className="d-flex justify-content-between align-items-center px-4 py-3"
                      style={{ borderBottom: i < 2 ? '1px solid #fafafa' : undefined }}
                    >
                      <div className="flex-grow-1 overflow-hidden me-2">
                        <div className="fw-semibold text-truncate" style={{ fontSize: '14px', color: '#1a202c' }}>
                          {t.name}
                        </div>
                        <div className="d-flex align-items-center gap-1 flex-wrap mt-1" style={{ fontSize: '11px', color: '#a0aec0' }}>
                          <span className="rounded px-1 fw-semibold" style={{ background: t.color + '22', color: t.color, fontSize: '10px' }}>
                            {t.category}
                          </span>
                          <span>&middot; Selesai</span>
                          <span>&middot; {formattedDate}</span>
                        </div>
                      </div>
                      <div className="fw-bold flex-shrink-0" style={{ color: '#e53e3e', fontSize: '14px' }}>
                        -{fmt(Math.abs(t.amount)).replace('Rp ', '')}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
