import { useState, useMemo } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { PeriodCard } from '@/features/reports/components/PeriodCard'
import { useTransactionSummary, useTransactionChartData, useTransactions } from '@/features/transaction/hooks/useTransactions'
import { Chart } from '@/shared/components/ui/Chart'
import { CategoryBreakdownCard } from '@/features/reports/components/CategoryBreakdownCard'
import { DailyHeatmapCard } from '@/features/reports/components/DailyHeatmapCard'

type PeriodMode = 'sekarang' | 'monthly' | 'custom'

function getMonthRange(year: number, month: number) {
  const from = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const lastDay = new Date(year, month + 1, 0).getDate()
  const to = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return { from, to }
}

function getLastMonths(n: number) {
  const result: { from: string; to: string }[] = []
  const now = new Date()
  for (let i = 0; i < n; i++) {
    const r = getMonthRange(now.getFullYear(), now.getMonth() - i)
    result.push(r)
  }
  return result
}

function fmt(val: number) { return Math.abs(val).toLocaleString('id-ID') }

function MonthPeriodCard({ from, to }: { from: string; to: string }) {
  const { data, isLoading } = useTransactionSummary({ date_from: from, date_to: to })
  if (isLoading) {
    return (
      <div className="card border-0 rounded-4 mb-3 p-4 text-center shadow-sm">
        <div className="spinner-border spinner-border-sm text-secondary mx-auto" />
      </div>
    )
  }
  return (
    <PeriodCard
      dateFrom={from}
      dateTo={to}
      income={data?.total_income || 0}
      expense={data?.total_expense || 0}
    />
  )
}

function CustomPeriodCard({ title, from, to }: { title: string; from: string; to: string }) {
  const { data, isLoading } = useTransactionSummary({ date_from: from, date_to: to })
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="card border-0 rounded-4 mb-3 p-4 text-center shadow-sm">
        <div className="spinner-border spinner-border-sm text-secondary mx-auto" />
      </div>
    )
  }

  const income = data?.total_income || 0
  const expense = data?.total_expense || 0
  const saldo = income - expense

  return (
    <div
      className="card shadow-sm border-0 rounded-4 mb-3 overflow-hidden"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate({ to: `/reports/${from}_${to}` })}
    >
      <div
        className="position-relative d-flex align-items-center justify-content-center py-3 px-4"
        style={{ borderBottom: '1px solid #f0f0f0', minHeight: '52px' }}
      >
        <span className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
          {title}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18" height="18"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="#aaa"
          fill="none"
          className="position-absolute end-0 me-3"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </div>
      <div>
        <div className="d-flex justify-content-between align-items-center px-4" style={{ padding: '10px 24px', borderBottom: '1px solid #fafafa', fontSize: '14px' }}>
          <span style={{ color: '#718096' }}>Pengeluaran</span>
          <span style={{ color: '#e53e3e', fontWeight: 500 }}>- {fmt(expense)}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center px-4" style={{ padding: '10px 24px', borderBottom: '1px solid #fafafa', fontSize: '14px' }}>
          <span style={{ color: '#718096' }}>Pemasukan</span>
          <span style={{ color: '#38a169', fontWeight: 500 }}>+ {fmt(income)}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center px-4" style={{ padding: '10px 24px', borderBottom: '1px solid #fafafa', fontSize: '14px' }}>
          <span style={{ color: '#718096' }}>Saldo</span>
          <span style={{ color: saldo >= 0 ? '#38a169' : '#e53e3e', fontWeight: 500 }}>{saldo >= 0 ? '+' : '-'} {fmt(saldo)}</span>
        </div>
      </div>
    </div>
  )
}

function TodayDashboard() {
  const today = new Date()
  const dateFrom = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`
  const dateTo = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()).padStart(2, '0')}`
  const dateStr = `${new Date(dateFrom).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} - ${new Date(dateTo).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`

  const { data: summary, isLoading } = useTransactionSummary({ date_from: dateFrom, date_to: dateTo })
  const [txFilter, setTxFilter] = useState<'all' | 'expense' | 'income'>('expense')

  const { data: txData } = useTransactions({ date_from: dateFrom, date_to: dateTo, per_page: 15, sort_by: 'tx_date', sort_dir: 'desc' })

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    )
  }

  const income = summary?.total_income || 0
  const expense = summary?.total_expense || 0
  const savingRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0
  const avgDaily = expense > 0 ? Math.round(expense / today.getDate()) : 0

  return (
    <div>
      <div className="text-center mb-4 text-secondary" style={{ fontSize: '13px' }}>
        {dateStr}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="card border-0 rounded-4 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold text-secondary" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>TINGKAT MENABUNG</span>
                <span className="fw-bold fs-5 text-success">{savingRate}%</span>
              </div>
              <div className="progress mb-2" style={{ height: '6px' }}>
                <div className="progress-bar bg-success" style={{ width: `${Math.min(100, Math.max(0, savingRate))}%` }} />
              </div>
              <div className="text-secondary mb-3" style={{ fontSize: '12px' }}>Target ideal: tabung ≥ 20% penghasilan</div>
              <div className="d-flex justify-content-between" style={{ fontSize: '13px' }}>
                <span className="text-secondary">Pemasukan {fmt(income)}</span>
              </div>
              <div className="d-flex justify-content-between" style={{ fontSize: '13px' }}>
                <span className="text-secondary">Tersimpan <span className="text-success fw-semibold">+{fmt(income - expense)}</span></span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card border-0 rounded-4 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="fw-bold text-secondary mb-3" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>RATA-RATA PENGELUARAN HARIAN</div>
              <div className="d-flex align-items-baseline gap-2 mb-3">
                <span className="fw-bold fs-3">{fmt(avgDaily)}</span>
                <span className="text-secondary" style={{ fontSize: '12px' }}>per hari &middot; {today.getDate()} hari berjalan</span>
              </div>
              <div className="text-danger fw-semibold" style={{ fontSize: '12px' }}>
                ↑ 10% lebih boros dari bulan lalu
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 rounded-4 shadow-sm mb-4">
        <div className="card-body p-0">
          <div className="px-4 pt-3 pb-2 fw-bold" style={{ fontSize: '14px' }}>Belum Lunas</div>
          <div className="d-flex justify-content-between px-4 py-3 border-top" style={{ fontSize: '14px' }}>
            <span className="text-secondary">Piutang</span>
            <span className="text-success fw-bold">+0</span>
          </div>
        </div>
      </div>


      <div className="w-100 mb-2">
        <div className="d-flex w-100" style={{ borderBottom: '1px solid #e6e8eb' }} role="tablist">
          {[
            { key: 'expense', label: 'Pengeluaran' },
            { key: 'income', label: 'Pemasukan' },
          ].map(tab => {
            const isActive = txFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setTxFilter(tab.key as 'income' | 'expense')}
                className="d-flex align-items-center justify-content-center py-3 transition-all text-decoration-none"
                style={{
                  flex: 1,
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  outline: 'none',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: isActive ? '#1e293b' : '#64748b',
                  fontWeight: isActive ? '800' : '600',
                  borderBottom: isActive ? '3px solid #ff6b00' : '3px solid transparent',
                  marginBottom: '-1px',
                }}
                role="tab"
                aria-selected={isActive}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>


      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <CategoryBreakdownCard title="Dompet" dateFrom={dateFrom} dateTo={dateTo} type={txFilter === 'income' ? 'income' : 'expense'} />
        </div>
        <div className="col-md-6">
          <CategoryBreakdownCard title="Kategori" dateFrom={dateFrom} dateTo={dateTo} type={txFilter === 'income' ? 'income' : 'expense'} />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <DailyHeatmapCard dateFrom={dateFrom} dateTo={dateTo} type={txFilter === 'income' ? 'income' : 'expense'} />

          <div className="card border-0 rounded-4 shadow-sm mt-3">
        <div className="card-body p-0">
          <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
            <span className="fw-bold" style={{ fontSize: '14px' }}>Transaksi Terbaru</span>
            <Link to={`/reports/${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`} className="text-primary text-decoration-none" style={{ fontSize: '13px' }}>
              Lihat Semua
            </Link>
          </div>
          {txData?.data && txData.data.map((tx, i) => {
            const isExp = tx.type === 'expense'
            const isInc = tx.type === 'income'
            const prefix = isExp ? '-' : isInc ? '+' : '↔'
            const color = isExp ? '#e53e3e' : isInc ? '#38a169' : 'var(--tblr-primary)'
            const acctColor = tx.account?.color || '#ccc'
            const d = new Date(tx.tx_date + 'T00:00:00')
            return (
              <div
                key={tx.id}
                className="d-flex justify-content-between align-items-center px-4 py-3"
                style={{ borderBottom: i < txData.data.length - 1 ? '1px solid #fafafa' : undefined }}
              >
                <div className="flex-grow-1 overflow-hidden me-2">
                  <div className="fw-semibold text-truncate" style={{ fontSize: '14px', color: '#1a202c' }}>
                    {tx.merchant || tx.category?.name || (isInc ? 'Pemasukan' : isExp ? 'Pengeluaran' : 'Transfer')}
                  </div>
                  <div className="d-flex align-items-center gap-1 flex-wrap mt-1" style={{ fontSize: '11px', color: '#a0aec0' }}>
                    {tx.account?.name && (
                      <span className="rounded px-1 fw-semibold" style={{ background: acctColor + '22', color: acctColor, fontSize: '10px' }}>
                        {tx.account.name}
                      </span>
                    )}
                    {tx.category?.name && <span>{tx.category.name}</span>}
                    <span>&middot; {d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
                  </div>
                </div>
                <div className="fw-bold flex-shrink-0" style={{ color, fontSize: '14px' }}>
                  {prefix}{fmt(tx.amount)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export function ReportsPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<PeriodMode>('monthly')
  const [isAddingCustom, setIsAddingCustom] = useState(false)

  // Custom Report Form State
  const [customName, setCustomName] = useState('')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  
  // Custom Reports List (Mock state for now)
  const [customReports, setCustomReports] = useState<{title: string, from: string, to: string}[]>([])

  const months = useMemo(() => getLastMonths(6), [])

  const handleSaveCustom = () => {
    if (customName && customFrom && customTo) {
      setCustomReports(prev => [{ title: customName, from: customFrom, to: customTo }, ...prev])
      setIsAddingCustom(false)
      setCustomName('')
      setCustomFrom('')
      setCustomTo('')
    }
  }

  const renderDateLabel = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
  }

  // --- ADD CUSTOM REPORT VIEW ---
  if (isAddingCustom) {
    return (
      <BaseLayout>
        <div className="page-body pb-5">
          <div className="container-xl" style={{ maxWidth: '800px' }}>
            <div className="d-flex align-items-center gap-2 mb-4 pt-1 border-bottom pb-3">
              <button 
                onClick={() => setIsAddingCustom(false)} 
                className="btn btn-icon btn-ghost-secondary rounded-circle flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M15 6l-6 6l6 6" />
                </svg>
              </button>
              <div className="flex-grow-1 text-center pe-5">
                <h2 className="page-title m-0 fw-semibold" style={{ fontSize: '16px' }}>
                  Tambah Laporan
                </h2>
              </div>
            </div>

            {/* Banner */}
            <div className="w-100 d-flex justify-content-between align-items-center px-3 py-2 mb-3" style={{ backgroundColor: '#5c80d1', color: 'white', fontSize: '13px' }}>
              <div className="d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275l5.813 1.912l-5.813 1.912a2 2 0 0 0 -1.275 1.275l-1.912 5.813l-1.912 -5.813a2 2 0 0 0 -1.275 -1.275l-5.813 -1.912l5.813 -1.912a2 2 0 0 0 1.275 -1.275l1.912 -5.813z" />
                </svg>
                <span>Kamu lagi lihat data contoh.</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-sm text-white rounded-pill px-3 py-1" style={{ backgroundColor: 'rgba(255,255,255,0.2)', fontSize: '12px', border: 'none' }}>
                  Hapus & Mulai
                </button>
                <button className="btn btn-sm text-white p-0 d-flex align-items-center justify-content-center rounded-circle" style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: '24px', height: '24px', border: 'none' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            <div className="px-3">
              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>Nama Laporan</label>
                <input
                  type="text"
                  className="form-control rounded-3 bg-light border-0 py-3 px-3"
                  placeholder="Masukkan nama laporan"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  style={{ fontSize: '15px' }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>Tanggal Mulai</label>
                <div className="position-relative">
                  <input
                    type="date"
                    className="form-control rounded-3 bg-light border-0 py-3 px-3"
                    value={customFrom}
                    onChange={e => setCustomFrom(e.target.value)}
                    style={{ fontSize: '15px', color: customFrom ? '#1a202c' : '#a0aec0' }}
                  />
                  {!customFrom && (
                    <div className="position-absolute end-0 top-50 translate-middle-y pe-3 pointer-events-none">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#a0aec0" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /></svg>
                    </div>
                  )}
                </div>
                {customFrom && <div className="text-secondary mt-1" style={{ fontSize: '11px' }}>{renderDateLabel(customFrom)}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>Tanggal Selesai</label>
                <div className="position-relative">
                  <input
                    type="date"
                    className="form-control rounded-3 bg-light border-0 py-3 px-3"
                    value={customTo}
                    min={customFrom}
                    onChange={e => setCustomTo(e.target.value)}
                    style={{ fontSize: '15px', color: customTo ? '#1a202c' : '#a0aec0' }}
                  />
                  {!customTo && (
                    <div className="position-absolute end-0 top-50 translate-middle-y pe-3 pointer-events-none">
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#a0aec0" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /></svg>
                    </div>
                  )}
                </div>
                {customTo && <div className="text-secondary mt-1" style={{ fontSize: '11px' }}>{renderDateLabel(customTo)}</div>}
              </div>

              <button
                className="btn btn-primary w-100 rounded-3 py-3 fw-bold shadow-sm"
                disabled={!customName || !customFrom || !customTo}
                onClick={handleSaveCustom}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout
      pageTitle="Laporan Keuangan"
      pagePretitle="INSIGHTS"
      showBackButton={false}
    >

          <div className="w-100 mb-4">
            <div className="w-100">
              <div className="d-flex w-100" style={{ borderBottom: '1px solid #e6e8eb' }} role="tablist">
                  {([
                    { key: 'sekarang', label: 'Sekarang' },
                    { key: 'monthly', label: 'Bulanan' },
                    { key: 'custom', label: 'Kustom' },
                  ] as { key: PeriodMode; label: string }[]).map((tab) => {
                    const isActive = mode === tab.key
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setMode(tab.key)}
                        className="d-flex align-items-center justify-content-center py-3 transition-all text-decoration-none"
                        style={{
                          flex: 1,
                          fontSize: '14px',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                          outline: 'none',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: isActive ? '#1e293b' : '#64748b',
                          fontWeight: isActive ? '800' : '600',
                          borderBottom: isActive ? '3px solid #ff6b00' : '3px solid transparent',
                          marginBottom: '-1px',
                        }}
                        role="tab"
                        aria-selected={isActive}
                      >
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
            </div>
          </div>

          {mode === 'monthly' && (
            <div 
              className="card border-0 rounded-4 mb-4 shadow-sm" 
              style={{ background: 'var(--tblr-primary)', color: 'white', cursor: 'pointer' }}
              onClick={() => {
                if (months[0]) {
                  navigate({ to: `/reports/recap/${months[0].from.substring(0, 7)}` })
                }
              }}
            >
              <div className="card-body p-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex justify-content-center align-items-center bg-white bg-opacity-25 rounded-circle" style={{ width: '40px', height: '40px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M7 4v16l13 -8z" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '15px' }}>Kilas Balik {months[0] ? new Date(months[0].from + 'T00:00:00').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : ''} siap dibuka</div>
                    <div className="text-white text-opacity-75" style={{ fontSize: '12px' }}>Putar sekarang, cuma butuh 1 menit</div>
                  </div>
                </div>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M9 6l6 6l-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {mode === 'monthly' && (
            <div className="card border-0 rounded-4 mb-4 shadow-sm">
              <div className="card-body">
                <div className="fw-bold text-secondary mb-3" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                  6 BULAN TERAKHIR
                </div>
                <Chart
                  chartId="report-6month-bar"
                  chartData={{
                    type: 'bar',
                    height: 14,
                    stacked: false,
                    categories: months.map(m => {
                      const d = new Date(m.from + 'T00:00:00')
                      return d.toLocaleDateString('id-ID', { month: 'short' })
                    }).reverse(),
                    series: [
                      {
                        name: 'Pemasukan',
                        data: [5000000, 6000000, 4000000, 7000000, 9500000, 13650000],
                        color: '#38a169',
                      },
                      {
                        name: 'Pengeluaran',
                        data: [4000000, 4500000, 3000000, 5000000, 2721990, 5931000],
                        color: '#e53e3e',
                      },
                    ],
                    datalabels: false,
                    legend: false,
                    plotOptions: {
                      bar: {
                        borderRadius: 4,
                        columnWidth: '40%',
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}

          {mode === 'monthly' && (
            <div className="card border-0 rounded-4 mb-4 shadow-sm">
              <div className="card-body pb-0">
                <div className="fw-bold text-secondary mb-3" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                  TREN KEKAYAAN BERSIH
                </div>
                <Chart
                  chartId="report-networth-line"
                  chartData={{
                    type: 'area',
                    height: 12,
                    categories: ['Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
                    series: [
                      {
                        name: 'Kekayaan Bersih',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6778010, 70197010],
                        color: 'var(--tblr-primary)',
                      }
                    ],
                    datalabels: false,
                    legend: false,
                    stroke: { curve: 'smooth', width: 2 },
                  }}
                />
              </div>
              <div className="card-footer bg-white border-0 pt-0 pb-3 d-flex justify-content-between text-secondary" style={{ fontSize: '12px' }}>
                <span>Sekarang: 70.197.010</span>
                <span className="fw-semibold" style={{ color: '#1a202c' }}>+70.197.010 <span className="text-secondary fw-normal">dari Jul 2025</span></span>
              </div>
            </div>
          )}

          {mode === 'sekarang' && <TodayDashboard />}

          {mode === 'monthly' && (
            <div>
              {months.map(({ from, to }) => (
                <MonthPeriodCard key={from} from={from} to={to} />
              ))}
            </div>
          )}

          {mode === 'custom' && customReports.length === 0 && (
            <div className="d-flex flex-column align-items-center justify-content-center text-secondary" style={{ minHeight: '40vh' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" className="mb-3 opacity-50">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M4 4h16v16H4z" stroke="none" fill="none"/>
                <path d="M8 8v8" /><path d="M12 12v4" /><path d="M16 10v6" />
              </svg>
              <div className="fw-bold text-dark mb-1" style={{ fontSize: '16px' }}>Belum ada laporan buatanmu</div>
              <div style={{ fontSize: '13px' }}>Ketuk + buat laporan dengan rentang tanggal sendiri.</div>
            </div>
          )}

          {mode === 'custom' && customReports.length > 0 && (
            <div>
              {customReports.map((r, i) => (
                <CustomPeriodCard key={i} title={r.title} from={r.from} to={r.to} />
              ))}
            </div>
          )}

        {/* FAB for Kustom */}
        {mode === 'custom' && (
          <button
            className="btn btn-primary rounded-circle shadow-lg position-fixed d-flex align-items-center justify-content-center"
            style={{ width: '56px', height: '56px', bottom: '24px', right: '24px', zIndex: 1000 }}
            onClick={() => setIsAddingCustom(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
            </svg>
          </button>
        )}
    </BaseLayout>
  )
}
