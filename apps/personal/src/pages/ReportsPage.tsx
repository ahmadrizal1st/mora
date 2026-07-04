import { useState, useMemo } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { PeriodCard } from '@/features/reports/components/PeriodCard'
import { useTransactionSummary, useTransactionChartData, useTransactions } from '@/features/transaction/hooks/useTransactions'
import { Button } from '@/shared/components/ui'
import { Modal, ModalHeader } from '@/shared/components/ui/Modal'
import { Datepicker } from '@/shared/components/ui/Datepicker'
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
  const navigate = useNavigate()
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
  const savingRate = income > 0 ? ((income - expense) / income) * 100 : 0
  const healthScore = income === 0 && expense === 0 ? 0 : Math.min(100, Math.max(10, Math.round(50 + (savingRate * 1.2))))
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--tblr-success)'
    if (score >= 50) return 'var(--tblr-primary)'
    if (score >= 30) return 'var(--tblr-warning)'
    return 'var(--tblr-danger)'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Sangat Sehat'
    if (score >= 50) return 'Cukup Baik'
    if (score >= 30) return 'Perlu Perhatian'
    if (score > 0) return 'Kritis'
    return 'Belum Ada Data'
  }

  const scoreColor = getScoreColor(healthScore)
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (healthScore / 100) * circumference
  const filteredTxs = (txData?.data || []).filter(t => t.type === txFilter)
  const totalTransactions = filteredTxs.length
  const maxTx = filteredTxs.length > 0 ? Math.max(...filteredTxs.map(t => t.amount)) : 0
  const avgTx = filteredTxs.length > 0 ? Math.round(filteredTxs.reduce((acc, t) => acc + t.amount, 0) / filteredTxs.length) : 0

  const cashFlowRatio = expense > 0 ? (income / expense) : income > 0 ? 10 : 0
  const getRatioLabel = (ratio: number) => {
    if (ratio >= 1.5) return 'Surplus Besar'
    if (ratio >= 1.0) return 'Surplus Seimbang'
    if (ratio >= 0.8) return 'Defisit Ringan'
    return 'Defisit Berat'
  }
  const getRatioColor = (ratio: number) => {
    if (ratio >= 1.5) return 'var(--tblr-success)'
    if (ratio >= 1.0) return 'var(--tblr-primary)'
    if (ratio >= 0.8) return 'var(--tblr-warning)'
    return 'var(--tblr-danger)'
  }
  const ratioColor = getRatioColor(cashFlowRatio)

  return (
    <div className="d-flex flex-column gap-4">
      <div className="text-center mb-1 text-secondary" style={{ fontSize: '13px' }}>
        Periode: {dateStr}
      </div>

      {/* Morapi Rewind Banner */}
      <div 
        className="card border rounded-4 shadow-sm" 
        style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', cursor: 'pointer' }}
        onClick={() => {
          navigate({ to: `/reports/recap/${dateFrom.substring(0, 7)}` })
        }}
      >
        <div className="card-body py-3 px-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }}>
              <div 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  backgroundColor: 'var(--tblr-primary)',
                  WebkitMaskImage: 'url("/logo/logo-nobg-fill.png")',
                  maskImage: 'url("/logo/logo-nobg-fill.png")',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }} 
              />
            </div>
            <div>
              <div className="fw-bold text-dark" style={{ fontSize: '15px' }}>Morapi Rewind {new Date(dateFrom).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} siap dibuka</div>
              <div className="text-secondary" style={{ fontSize: '12px' }}>Putar sekarang, lihat rangkuman performa bulan ini</div>
            </div>
          </div>
          <div style={{ color: '#64748b' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none">
               <path d="M9 6l6 6l-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Row 1: Score & Insights */}
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '20px', background: 'linear-gradient(145deg, #ffffff, #f8fafc)' }}>
            <div className="card-body p-4 d-flex flex-column justify-content-center">
              <div className="d-flex align-items-center gap-3">
                <div className="position-relative" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
                  <svg width="60" height="60" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="45" cy="45" r={radius} stroke="var(--tblr-border-color)" strokeWidth="8" fill="none" />
                    <circle 
                      cx="45" cy="45" r={radius} 
                      stroke={scoreColor} 
                      strokeWidth="8" 
                      fill="none" 
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                  </svg>
                  <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <div className="fw-bold" style={{ fontSize: '16px', color: scoreColor, lineHeight: 1 }}>{healthScore}</div>
                  </div>
                </div>
                <div>
                  <div className="fw-bold text-secondary mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>SKOR FINANSIAL</div>
                  <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '15px' }}>{getScoreLabel(healthScore)}</h4>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>
                    Saving rate: {savingRate.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '20px', background: 'linear-gradient(145deg, #ffffff, #f8fafc)' }}>
            <div className="card-body p-4 d-flex flex-column justify-content-center">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px', backgroundColor: 'rgba(var(--tblr-primary-rgb), 0.1)', color: 'var(--tblr-primary)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke={ratioColor} fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 20l10 0" /><path d="M6 6l6 -1l6 1" /><path d="M12 3l0 17" /><path d="M9 12l-3 -6l-3 6a3 3 0 0 0 6 0" /><path d="M21 12l-3 -6l-3 6a3 3 0 0 0 6 0" /></svg>
                </div>
                <div>
                  <div className="fw-bold text-secondary mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>RASIO ARUS KAS</div>
                  <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '15px' }}>{cashFlowRatio.toFixed(1)}x ({getRatioLabel(cashFlowRatio)})</h4>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>
                    Pemasukan vs Pengeluaran
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '20px', backgroundColor: 'var(--tblr-primary-lt)' }}>
            <div className="card-body p-4 d-flex flex-column justify-content-center">
              <div className="d-flex gap-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '36px', height: '36px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 9h.01" /><path d="M11 12h1v4h1" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /></svg>
                </div>
                <div>
                  <div className="fw-bold text-primary mb-1" style={{ fontSize: '12px' }}>Insight Finansial</div>
                  <p className="mb-0 text-dark opacity-75 leading-tight" style={{ fontSize: '11px' }}>
                    {savingRate >= 20 
                      ? "Disiplin menabung Anda sangat baik!" 
                      : savingRate > 0 
                      ? "Bagus, tapi usahakan naikkan tabungan Anda." 
                      : "Awas! Pengeluaran melebihi pemasukan."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
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
                  borderBottom: isActive ? '3px solid var(--tblr-primary)' : '3px solid transparent',
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

      {/* Row 2: Category Breakdown */}
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <CategoryBreakdownCard title="Dompet" dateFrom={dateFrom} dateTo={dateTo} type={txFilter === 'income' ? 'income' : 'expense'} />
        </div>
        <div className="col-12 col-md-6">
          <CategoryBreakdownCard title="Kategori" dateFrom={dateFrom} dateTo={dateTo} type={txFilter === 'income' ? 'income' : 'expense'} />
        </div>
      </div>

      {/* Ringkasan Statistik Dinamis */}
      <div className="card border-0 rounded-4 shadow-sm">
        <div className="card-body p-4">
          <h4 className="fw-bold mb-3 text-secondary text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Statistik {txFilter === 'expense' ? 'Pengeluaran' : 'Pemasukan'}</h4>
          <div className="row g-3 text-center">
            <div className="col-4 border-end">
              <div className="text-secondary mb-1" style={{ fontSize: '11px' }}>Rata-rata / Transaksi</div>
              <div className="fw-bold text-dark font-monospace" style={{ fontSize: '15px' }}>Rp {fmt(avgTx)}</div>
            </div>
            <div className="col-4 border-end">
              <div className="text-secondary mb-1" style={{ fontSize: '11px' }}>Transaksi Terbesar</div>
              <div className="fw-bold text-dark font-monospace" style={{ fontSize: '15px' }}>Rp {fmt(maxTx)}</div>
            </div>
            <div className="col-4">
              <div className="text-secondary mb-1" style={{ fontSize: '11px' }}>Frekuensi</div>
              <div className="fw-bold text-dark font-monospace" style={{ fontSize: '15px' }}>{totalTransactions} kali</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Daily Calendar */}
      <div className="w-100">
        <DailyHeatmapCard dateFrom={dateFrom} dateTo={dateTo} type={txFilter === 'income' ? 'income' : 'expense'} />
      </div>

      {/* Row 4: Latest Transactions */}
      <div className="w-100">
        <div className="card border-0 rounded-4 shadow-sm">
          <div className="card-body p-0">
            <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
              <span className="fw-bold" style={{ fontSize: '14px' }}>Transaksi Terbaru</span>
              <Link to={`/reports/${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`} className="text-primary text-decoration-none" style={{ fontSize: '13px' }}>
                Lihat Semua
              </Link>
            </div>
            <div>
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
                    className="d-flex justify-content-between align-items-center px-4 py-3 hover-bg-surface transition-all"
                    style={{ borderBottom: i < txData.data.length - 1 ? '1px solid #fafafa' : undefined }}
                  >
                    <div className="flex-grow-1 overflow-hidden me-2">
                      <div className="fw-semibold text-truncate" style={{ fontSize: '14px', color: '#1a202c' }}>
                        {tx.merchant || tx.category?.name || (isInc ? 'Pemasukan' : isExp ? 'Pengeluaran' : 'Transfer')}
                      </div>
                      <div className="d-flex align-items-center gap-1 flex-wrap mt-1" style={{ fontSize: '11px', color: '#a0aec0' }}>
                        {tx.account?.name && (
                          <span className="rounded px-1.5 py-0.5 fw-semibold" style={{ background: acctColor + '1a', color: acctColor, fontSize: '9px' }}>
                            {tx.account.name}
                          </span>
                        )}
                        {tx.category?.name && <span>{tx.category.name}</span>}
                        <span>&middot; {d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
                      </div>
                    </div>
                    <div className="fw-bold flex-shrink-0 font-monospace" style={{ color, fontSize: '14px' }}>
                      {prefix}{fmt(tx.amount)}
                    </div>
                  </div>
                )
              })}
              {txData?.data && txData.data.length === 0 && (
                <div className="text-center py-5 text-secondary small">Belum ada transaksi bulan ini.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ReportsPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<PeriodMode>('sekarang')
  const [isAddingCustom, setIsAddingCustom] = useState(false)

  // Custom Report Form State
  const [customName, setCustomName] = useState('')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  
  // Custom Reports List (Mock state for now)
  const [customReports, setCustomReports] = useState<{title: string, from: string, to: string}[]>([])

  const chartMonths = useMemo(() => getLastMonths(6), [])
  const months = useMemo(() => getLastMonths(10), [])

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

  // Modal for adding custom report is rendered at the bottom

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

          <div className="d-flex justify-content-between align-items-center mb-3 btn-print-hidden">
            <span className="text-secondary" style={{ fontSize: '13px' }}>
              Analisis laporan keuangan Anda
            </span>
            <Button
              onClick={() => window.print()}
              ghost
              size="sm"
              icon="printer"
              text="Ekspor PDF"
              className="fw-medium text-body px-2"
            />
          </div>

          {mode === 'monthly' && (
            <div className="d-flex flex-column gap-4">
              {/* Top Section: Kilas Balik & Charts */}
              <div className="row g-3">
                <div className="col-12">
                  <div 
                    className="card border rounded-4 shadow-sm" 
                    style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', cursor: 'pointer' }}
                    onClick={() => {
                      if (months[0]) {
                        navigate({ to: `/reports/recap/${months[0].from.substring(0, 7)}` })
                      }
                    }}
                  >
                    <div className="card-body py-3 px-4 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }}>
                          <div 
                            style={{ 
                              width: '24px', 
                              height: '24px', 
                              backgroundColor: 'var(--tblr-primary)',
                              WebkitMaskImage: 'url("/logo/logo-nobg-fill.png")',
                              maskImage: 'url("/logo/logo-nobg-fill.png")',
                              WebkitMaskSize: 'contain',
                              maskSize: 'contain',
                              WebkitMaskRepeat: 'no-repeat',
                              maskRepeat: 'no-repeat',
                              WebkitMaskPosition: 'center',
                              maskPosition: 'center',
                            }} 
                          />
                        </div>
                        <div>
                          <div className="fw-bold text-dark" style={{ fontSize: '15px' }}>Morapi Rewind {months[0] ? new Date(months[0].from + 'T00:00:00').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : ''} siap dibuka</div>
                          <div className="text-secondary" style={{ fontSize: '12px' }}>Putar sekarang, cuma butuh 1 menit</div>
                        </div>
                      </div>
                      <div style={{ color: '#000000' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none">
                          <path d="M9 6l6 6l-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="card border-0 rounded-4 shadow-sm h-100">
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
                          categories: chartMonths.map(m => {
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
                </div>

                <div className="col-12 col-md-6">
                  <div className="card border-0 rounded-4 shadow-sm h-100">
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
                </div>
              </div>

              {/* Bottom Section: Daftar Periode in 2 columns */}
              <div>
                <h4 className="fw-bold mb-3 text-secondary" style={{ fontSize: '11px', letterSpacing: '1px' }}>DAFTAR PERIODE</h4>
                <div className="row g-3">
                  {months.map(({ from, to }) => (
                    <div key={from} className="col-12 col-md-6">
                      <MonthPeriodCard from={from} to={to} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mode === 'sekarang' && <TodayDashboard />}

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
            className="btn btn-primary rounded-3 shadow-lg position-fixed d-flex align-items-center justify-content-center"
            style={{ width: '48px', height: '48px', bottom: '24px', right: '24px', zIndex: 1000 }}
            onClick={() => setIsAddingCustom(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
            </svg>
          </button>
        )}
        
      <Modal show={isAddingCustom} onClose={() => setIsAddingCustom(false)} size="md">
        <ModalHeader title="Tambah Laporan" onClose={() => setIsAddingCustom(false)} />
        <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label">Nama Laporan <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="Masukkan nama laporan"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Tanggal Mulai <span className="text-danger">*</span></label>
                <Datepicker
                  layout="icon"
                  value={customFrom}
                  onChange={setCustomFrom}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Tanggal Selesai <span className="text-danger">*</span></label>
                <Datepicker
                  layout="icon"
                  value={customTo}
                  onChange={setCustomTo}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button element="button" type="button" link className="text-muted" onClick={() => setIsAddingCustom(false)}>Batal</Button>
              <Button 
                element="button" 
                type="button" 
                color="primary" 
                icon="check" 
                disabled={!customName || !customFrom || !customTo}
                onClick={handleSaveCustom}
              >
                Simpan
              </Button>
            </div>
        </div>
      </Modal>

    </BaseLayout>
  )
}
