import { useState, useMemo } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { PeriodCard } from '@/features/reports/components/PeriodCard'
import { useTransactionSummary, useTransactions, useTransactionHistory } from '@/features/transaction/hooks/useTransactions'
import { useAccounts } from '@/features/transaction/hooks/useAccounts'
import { Button } from '@/shared/components/ui'
import { Modal, ModalHeader } from '@/shared/components/ui/Modal'
import { Datepicker } from '@/shared/components/ui/Datepicker'
import { Chart } from '@/shared/components/ui/Chart'
import { CategoryBreakdownCard } from '@/features/reports/components/CategoryBreakdownCard'
import { DailyHeatmapCard } from '@/features/reports/components/DailyHeatmapCard'
import { TransactionsListCard } from '@/features/reports/components/TransactionsListCard'
import { Icon } from '@/shared/components/ui/Icon'

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
      <div className="col-12 col-md-6">
        <div className="card border-0 rounded-4 mb-3 p-4 text-center shadow-sm">
          <div className="spinner-border spinner-border-sm text-secondary mx-auto" />
        </div>
      </div>
    )
  }

  const hasTransactions = data && (
    (data.transaction_count !== undefined && data.transaction_count > 0) || 
    data.total_income > 0 || 
    data.total_expense > 0
  )

  if (!hasTransactions) {
    return null
  }

  return (
    <div className="col-12 col-md-6">
      <PeriodCard
        dateFrom={from}
        dateTo={to}
        income={data?.total_income || 0}
        expense={data?.total_expense || 0}
      />
    </div>
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
        className="position-relative d-flex align-items-center justify-content-center py-3 px-4 border-bottom"
        style={{ minHeight: '52px' }}
      >
        <span className="fw-semibold text-body" style={{ fontSize: '14px' }}>
          {title}
        </span>
        <Icon icon="chevron-right" size={18} stroke={2} className="position-absolute end-0 me-3 text-secondary" />
      </div>
      <div>
        <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom text-secondary" style={{ fontSize: '14px' }}>
          <span>Pengeluaran</span>
          <span style={{ color: '#e53e3e', fontWeight: 500 }}>- {fmt(expense)}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom text-secondary" style={{ fontSize: '14px' }}>
          <span>Pemasukan</span>
          <span style={{ color: '#38a169', fontWeight: 500 }}>+ {fmt(income)}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom text-secondary" style={{ fontSize: '14px' }}>
          <span>Saldo</span>
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
        className="card border rounded-4 shadow-sm cursor-pointer" 
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
              <div className="fw-bold text-body" style={{ fontSize: '15px' }}>Morapi Rewind {new Date(dateFrom).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} siap dibuka</div>
              <div className="text-secondary" style={{ fontSize: '12px' }}>Putar sekarang, lihat rangkuman performa bulan ini</div>
            </div>
          </div>
          <div className="text-secondary">
            <Icon icon="chevron-right" size={20} stroke={2.5} />
          </div>
        </div>
      </div>

      {/* Row 1: Score & Insights */}
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100 rounded-4">
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
                  <h4 className="fw-bold mb-0 text-body" style={{ fontSize: '15px' }}>{getScoreLabel(healthScore)}</h4>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>
                    Saving rate: {savingRate.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100 bg-surface rounded-4">
            <div className="card-body p-4 d-flex flex-column justify-content-center">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px', backgroundColor: 'rgba(var(--tblr-primary-rgb), 0.1)', color: 'var(--tblr-primary)' }}>
                  <Icon icon="scale" size={20} stroke={2} style={{ color: ratioColor }} />
                </div>
                <div>
                  <div className="fw-bold text-secondary mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>RASIO ARUS KAS</div>
                  <h4 className="fw-bold mb-0 text-body" style={{ fontSize: '15px' }}>{cashFlowRatio.toFixed(1)}x ({getRatioLabel(cashFlowRatio)})</h4>
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
                  <Icon icon="info-circle" size={20} stroke={2} />
                </div>
                <div>
                  <div className="fw-bold text-primary mb-1" style={{ fontSize: '12px' }}>Insight Finansial</div>
                  <p className="mb-0 text-body opacity-75 leading-tight" style={{ fontSize: '11px' }}>
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
                type="button"
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
              <div className="fw-bold text-body" style={{ fontSize: '15px' }}>Rp {fmt(avgTx)}</div>
            </div>
            <div className="col-4 border-end">
              <div className="text-secondary mb-1" style={{ fontSize: '11px' }}>Transaksi Terbesar</div>
              <div className="fw-bold text-body" style={{ fontSize: '15px' }}>Rp {fmt(maxTx)}</div>
            </div>
            <div className="col-4">
              <div className="text-secondary mb-1" style={{ fontSize: '11px' }}>Frekuensi</div>
              <div className="fw-bold text-body" style={{ fontSize: '15px' }}>{totalTransactions} kali</div>
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
              <Link
                to="/reports/$periodId"
                params={{ periodId: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}` }}
                className="text-primary text-decoration-none"
                style={{ fontSize: '13px' }}
              >
                Lihat Semua
              </Link>
            </div>
            <div className="p-3">
              <TransactionsListCard dateFrom={dateFrom} dateTo={dateTo} hideHeader={true} defaultPerPage={10} />
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

  // 12 Months for Net Worth
  const last12Months = useMemo(() => {
    const result = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const label = d.toLocaleDateString('id-ID', { month: 'short' })
      const key = `${year}-${month}`
      result.push({ 
        key, 
        label, 
        from: `${year}-${month}-01`, 
        to: `${year}-${month}-${new Date(year, d.getMonth() + 1, 0).getDate()}` 
      })
    }
    return result
  }, [])

  const dateFrom12M = last12Months[0].from
  const dateTo12M = last12Months[11].to

  const { data: accounts12MResponse } = useAccounts({
    group_by: 'month',
    date_from: dateFrom12M,
    date_to: dateTo12M,
  })

  // 6 Months for Pemasukan vs Pengeluaran
  const dateFrom6M = chartMonths[chartMonths.length - 1].from
  const dateTo6M = chartMonths[0].to

  const { data: history6M } = useTransactionHistory({
    date_from: dateFrom6M,
    date_to: dateTo6M,
    group_by: 'month'
  })

  const monthlyBarData = useMemo(() => {
    if (!history6M) return { categories: [], incomeData: [], expenseData: [] }
    
    const categories = (history6M.income_labels || []).map(label => {
      const d = new Date(label + '-01T00:00:00')
      return d.toLocaleDateString('id-ID', { month: 'short' })
    })

    return {
      categories,
      incomeData: history6M.income || [],
      expenseData: history6M.expense || [],
    }
  }, [history6M])

  const netWorthData = useMemo(() => {
    const categories = last12Months.map(m => m.label)
    const accounts = accounts12MResponse?.data || []

    const data = last12Months.map(m => {
      let total = 0
      accounts.forEach(acc => {
        if (acc.history?.labels && acc.history?.balance) {
          const idx = acc.history.labels.indexOf(m.key)
          if (idx !== -1) {
            total += acc.history.balance[idx]
          } else {
            // fallback to current balance if it's the current month and label is missing
            const currentMonthKey = new Date().toISOString().substring(0, 7)
            if (m.key === currentMonthKey) {
              total += acc.balance || 0
            }
          }
        } else {
          // If no history is returned (e.g. account has no transactions), use its current balance
          total += acc.balance || 0
        }
      })
      return total
    })

    const currentNetWorth = data[data.length - 1] || 0
    const startNetWorth = data[0] || 0
    const netWorthChange = currentNetWorth - startNetWorth

    return { categories, data, currentNetWorth, netWorthChange }
  }, [accounts12MResponse, last12Months])

  const netWorthChangeSign = netWorthData.netWorthChange >= 0 ? '+' : '-'
  const netWorthChangeText = `${netWorthChangeSign}${fmt(Math.abs(netWorthData.netWorthChange))} dari ${last12Months[0].label} ${last12Months[0].key.split('-')[0]}`

  const handleSaveCustom = () => {
    if (customName && customFrom && customTo) {
      setCustomReports(prev => [{ title: customName, from: customFrom, to: customTo }, ...prev])
      setIsAddingCustom(false)
      setCustomName('')
      setCustomFrom('')
      setCustomTo('')
    }
  }

  // Modal for adding custom report is rendered at the bottom

  return (
    <BaseLayout
      pageTitle="Laporan Keuangan"
      pagePretitle="INSIGHTS"
      showBackButton={false}
    >
      <div className="d-flex flex-column gap-4">
          <div className="w-100">
            <div className="w-100">
              <div className="d-flex w-100" style={{ borderBottom: '1px solid var(--tblr-border-color)' }} role="tablist">
                  {([
                    { key: 'sekarang', label: 'Sekarang' },
                    { key: 'monthly', label: 'Bulanan' },
                    { key: 'custom', label: 'Kustom' },
                  ] as { key: PeriodMode; label: string }[]).map((tab) => {
                    const isActive = mode === tab.key
                    return (
                      <button
                        type="button"
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
                          color: isActive ? 'var(--tblr-body-color)' : 'var(--tblr-secondary-color)',
                          fontWeight: isActive ? '800' : '600',
                          borderBottom: isActive ? '3px solid var(--tblr-primary)' : '3px solid transparent',
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

          <div className="d-flex justify-content-between align-items-center btn-print-hidden">
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
                    className="card border rounded-4 shadow-sm cursor-pointer" 
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
                          <div className="fw-bold text-body" style={{ fontSize: '15px' }}>Morapi Rewind {months[0] ? new Date(months[0].from + 'T00:00:00').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : ''} siap dibuka</div>
                          <div className="text-secondary" style={{ fontSize: '12px' }}>Putar sekarang, cuma butuh 1 menit</div>
                        </div>
                      </div>
                      <div className="text-body">
                        <Icon icon="chevron-right" size={20} stroke={2.5} />
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
                          categories: monthlyBarData.categories,
                          series: [
                            {
                              name: 'Pemasukan',
                              data: monthlyBarData.incomeData,
                              color: '#38a169',
                            },
                            {
                              name: 'Pengeluaran',
                              data: monthlyBarData.expenseData,
                              color: '#e53e3e',
                            },
                          ],
                          datalabels: false,
                          legend: false,
                          extend: {
                            plotOptions: {
                              bar: {
                                borderRadius: 4,
                                columnWidth: '40%',
                              }
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
                          categories: netWorthData.categories,
                          series: [
                            {
                              name: 'Kekayaan Bersih',
                              data: netWorthData.data,
                              color: 'var(--tblr-primary)',
                            }
                          ],
                          datalabels: false,
                          legend: false,
                          strokeCurve: 'smooth',
                          strokeWidth: [2],
                        }}
                      />
                    </div>
                    <div className="card-footer bg-surface border-0 pt-0 pb-3 d-flex justify-content-between text-secondary" style={{ fontSize: '12px' }}>
                      <span>Perubahan Saldo</span>
                      <span className="fw-semibold text-body">{netWorthChangeText}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Daftar Periode in 2 columns */}
              <div>
                <h4 className="fw-bold mb-3 text-secondary" style={{ fontSize: '11px', letterSpacing: '1px' }}>DAFTAR PERIODE</h4>
                <div className="row g-3">
                  {months.map(({ from, to }) => (
                    <MonthPeriodCard key={from} from={from} to={to} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {mode === 'sekarang' && <TodayDashboard />}

          {mode === 'custom' && customReports.length === 0 && (
            <div className="d-flex flex-column align-items-center justify-content-center text-secondary" style={{ minHeight: '40vh' }}>
              <Icon icon="chart-bar" size={48} stroke={1.5} className="mb-3 opacity-50" />
              <div className="fw-bold text-body mb-1" style={{ fontSize: '16px' }}>Belum ada laporan buatanmu</div>
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
            className="btn btn-primary btn-icon rounded-circle shadow-lg position-fixed"
            style={{ width: '48px', height: '48px', bottom: '24px', right: '24px', zIndex: 1000 }}
            onClick={() => setIsAddingCustom(true)}
          >
            <Icon icon="plus" size={24} stroke={2.5} />
          </button>
        )}
        
      <Modal show={isAddingCustom} onClose={() => setIsAddingCustom(false)}>
        <ModalHeader title="Tambah Laporan" onClose={() => setIsAddingCustom(false)} />
        <div className="modal-body p-4">
            <div>
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

            <div className="d-flex justify-content-end gap-2">
              <Button color="light" className="rounded-3" onClick={() => setIsAddingCustom(false)}>Batal</Button>
              <Button 
                color="primary"
                className="rounded-3 d-flex align-items-center gap-1"
                onClick={handleSaveCustom}
                disabled={!customName || !customFrom || !customTo}
              >
                <Icon icon="device-floppy" size={16} /> Simpan
              </Button>
            </div>
          </div>
      </Modal>
    </div>
    </BaseLayout>
  )
}
