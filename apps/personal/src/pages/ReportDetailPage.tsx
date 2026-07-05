import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { useTransactionSummary, useTransactions } from '@/features/transaction/hooks/useTransactions'
import { CategoryBreakdownCard } from '@/features/reports/components/CategoryBreakdownCard'
import { DailyHeatmapCard } from '@/features/reports/components/DailyHeatmapCard'

function parsePeriodId(periodId: string): { dateFrom: string; dateTo: string } {
  if (/^\d{4}-\d{2}$/.test(periodId)) {
    const [year, month] = periodId.split('-').map(Number)
    const lastDay = new Date(year, month, 0).getDate()
    return {
      dateFrom: `${year}-${String(month).padStart(2, '0')}-01`,
      dateTo: `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
    }
  }
  if (periodId.includes('_')) {
    const [dateFrom, dateTo] = periodId.split('_')
    return { dateFrom, dateTo }
  }
  const now = new Date()
  const y = now.getFullYear(), m = now.getMonth() + 1
  return {
    dateFrom: `${y}-${String(m).padStart(2, '0')}-01`,
    dateTo: `${y}-${String(m).padStart(2, '0')}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`,
  }
}

function fmt(val: number) { return Math.abs(val).toLocaleString('id-ID') }
function fmtDate(s: string) {
  return new Date(s + 'T00:00:00').toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

type TxFilter = 'all' | 'income' | 'expense' | 'transfer' | 'correction'

export function ReportDetailPage() {
  const { periodId } = useParams({ from: '/reports/$periodId' })
  const { dateFrom, dateTo } = parsePeriodId(periodId)
  const [txFilter, setTxFilter] = useState<TxFilter>('all')
  const [globalTxType, setGlobalTxType] = useState<'expense' | 'income'>('expense')

  const { data: summary, isLoading: loadingSummary } = useTransactionSummary({ date_from: dateFrom, date_to: dateTo })

  const txFilters = {
    ...(txFilter !== 'all' && txFilter !== 'correction' ? { type: txFilter as any } : {}),
    date_from: dateFrom,
    date_to: dateTo,
    per_page: 50,
    sort_by: 'tx_date',
    sort_dir: 'desc' as const,
  }
  const { data: txData, isLoading: loadingTx } = useTransactions(txFilters)
  const transactions = txData?.data || []

  const income = summary?.total_income || 0
  const expense = summary?.total_expense || 0
  const saldo = income - expense
  const savingRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0
  const avgDaily = expense > 0 ? Math.round(expense / 30) : 0
  const calcEndBalance = saldo

  const headerLabel = `${fmtDate(dateFrom)} - ${fmtDate(dateTo)}`

  const filterTabs: { key: TxFilter; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'expense', label: 'Pengeluaran' },
    { key: 'income', label: 'Pemasukan' },
    { key: 'transfer', label: 'Transfer' },
    { key: 'correction', label: 'Koreksi Saldo' },
  ]

  return (
    <BaseLayout
      pageTitle="Detail Laporan"
      pagePretitle={headerLabel}
      showBackButton={true}
    >
      <div className="w-100">
        <div className="container-xl pt-4">
          <div className="d-flex justify-content-between align-items-center mb-3 btn-print-hidden">
            <span className="text-secondary" style={{ fontSize: '13px' }}>
              Rincian laporan periode ini
            </span>
            <button 
              className="btn btn-white btn-sm d-flex align-items-center gap-2 fw-medium text-body px-3"
              onClick={() => window.print()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 9l5 -5l5 5" /><path d="M12 4l0 12" /></svg>
              <span>Ekspor PDF</span>
            </button>
          </div>

          {loadingSummary ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {/* Row 1: Ringkasan Periode */}
              <div className="row g-3">
                <div className="col-12">
                  {/* RINGKASAN PERIODE */}
                  <div className="card border-0 rounded-4 shadow-sm h-100">
                    <div className="card-body p-0 d-flex flex-column justify-content-center">
                      <div className="px-4 pt-3 pb-1">
                        <div className="text-secondary fw-bold mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                          RINGKASAN PERIODE
                        </div>
                      </div>
                      <div className="flex-grow-1 d-flex flex-column justify-content-center">
                        {[
                          { label: 'Pengeluaran', value: `- ${fmt(expense)}`, color: '#e53e3e' },
                          { label: 'Pemasukan', value: `+ ${fmt(income)}`, color: '#38a169' },
                          { label: 'Saldo', value: `+ ${fmt(saldo)}`, color: saldo >= 0 ? '#38a169' : '#e53e3e' },
                          { label: 'Pinjaman', value: `- 0`, color: '#e53e3e' },
                          { label: 'Koreksi Saldo', value: `+ 0`, color: '#38a169' },
                          { label: 'Tingkat Menabung', value: `${savingRate}%`, color: undefined },
                          { label: 'Rata-rata Harian', value: `${fmt(avgDaily)}`, color: undefined },
                          { label: 'Saldo Akhir', value: `+ ${fmt(calcEndBalance)}`, color: calcEndBalance >= 0 ? '#38a169' : '#e53e3e', bold: true },
                        ].map((row, i, arr) => (
                          <div
                            key={row.label}
                            className="d-flex justify-content-between align-items-center px-4 py-2"
                            style={{
                              borderBottom: i < arr.length - 1 ? '1px solid #fafafa' : undefined,
                              borderTop: row.label === 'Saldo Akhir' ? '1px solid #f0f0f0' : undefined,
                              marginTop: row.label === 'Saldo Akhir' ? '4px' : undefined,
                              paddingTop: row.label === 'Saldo Akhir' ? '12px' : undefined,
                              fontSize: '14px',
                            }}
                          >
                            <span style={{ color: row.bold ? '#1a202c' : '#718096', fontWeight: row.bold ? 700 : 400 }}>{row.label}</span>
                            <span style={{ color: row.color || '#1a202c', fontWeight: row.bold ? 700 : 600 }}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ height: '12px' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Global TxType Toggle */}
              <div className="w-100 mb-2">
                <div className="d-flex w-100" style={{ borderBottom: '1px solid #e6e8eb' }} role="tablist">
                  {(['expense', 'income'] as const).map((key) => {
                    const label = key === 'expense' ? 'Pengeluaran' : 'Pemasukan';
                    const isActive = globalTxType === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setGlobalTxType(key)}
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
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Donut Charts */}
              <div className="row g-3">
                <div className="col-md-6">
                  <CategoryBreakdownCard title="Dompet" dateFrom={dateFrom} dateTo={dateTo} type={globalTxType} />
                </div>
                <div className="col-md-6">
                  <CategoryBreakdownCard title="Kategori" dateFrom={dateFrom} dateTo={dateTo} type={globalTxType} />
                </div>
              </div>

              {/* Row 3: Heatmap */}
              <div className="row g-3 align-items-stretch">
                <div className="col-12">
                  <DailyHeatmapCard dateFrom={dateFrom} dateTo={dateTo} type={globalTxType} />
                </div>
              </div>

              {/* Main Content Row 2: Transactions */}
              <div className="row g-3 mt-0">
                <div className="col-12">
                  {/* Transactions */}
                  <div className="card border-0 rounded-4 shadow-sm mt-2">
                    <div className="card-body p-0">
                      {/* Filter tabs — scrollable segmented row */}
                      <div className="w-100 mb-2">
                        <div
                          className="d-flex w-100 overflow-auto hide-scrollbar"
                          style={{
                            borderBottom: '1px solid #e6e8eb',
                            scrollbarWidth: 'none',
                            WebkitOverflowScrolling: 'touch',
                          }}
                          role="tablist"
                        >
                          <div className="d-flex px-2">
                            {filterTabs.map((tab) => {
                              const isActive = txFilter === tab.key
                              return (
                                <button
                                  key={tab.key}
                                  onClick={() => setTxFilter(tab.key)}
                                  className="d-flex align-items-center justify-content-center px-3 py-3 transition-all text-decoration-none border-0 bg-transparent"
                                  style={{
                                    fontSize: '14px',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    color: isActive ? '#1e293b' : '#64748b',
                                    fontWeight: isActive ? '800' : '600',
                                    borderBottom: isActive ? '3px solid #ff6b00' : '3px solid transparent',
                                    marginBottom: '-1px',
                                  }}
                                  role="tab"
                                  aria-selected={isActive}
                                >
                                  <span className="d-none d-md-inline">{tab.label}</span>
                                  <span className="d-md-none">{tab.label.split(' ')[0]}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Tx header row */}
                      <div className="d-flex justify-content-between align-items-center px-3 pb-2" style={{ fontSize: '13px' }}>
                        <span className="fw-semibold">Semua Transaksi</span>
                        {txData?.total ? (
                          <span className="text-secondary">{txData.total} item</span>
                        ) : null}
                      </div>

                      {/* Tx list */}
                      {loadingTx ? (
                        <div className="text-center py-4">
                          <div className="spinner-border spinner-border-sm text-secondary" />
                        </div>
                      ) : transactions.length === 0 ? (
                        <div className="text-center text-secondary py-4" style={{ fontSize: '13px' }}>
                          Tidak ada transaksi
                        </div>
                      ) : (
                        <div>
                          {transactions.map((tx, i) => {
                            const isExp = tx.type === 'expense'
                            const isInc = tx.type === 'income'
                            const prefix = isExp ? '-' : isInc ? '+' : '↔'
                            const color = isExp ? '#e53e3e' : isInc ? '#38a169' : 'var(--tblr-primary)'
                            const d = new Date(tx.tx_date + 'T00:00:00')
                            const dateStr = d.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
                            const acctColor = tx.account?.color || '#ccc'

                            return (
                              <div
                                key={tx.id}
                                className="d-flex justify-content-between align-items-center px-3 py-2"
                                style={{
                                  borderTop: i === 0 ? '1px solid #f0f0f0' : undefined,
                                  borderBottom: i < transactions.length - 1 ? '1px solid #fafafa' : undefined,
                                }}
                              >
                                <div className="flex-grow-1 overflow-hidden me-2">
                                  <div className="fw-semibold text-truncate" style={{ fontSize: '14px', color: '#1a202c' }}>
                                    {tx.merchant || tx.category?.name || (isInc ? 'Pemasukan' : isExp ? 'Pengeluaran' : 'Transfer')}
                                  </div>
                                  <div className="d-flex align-items-center gap-1 flex-wrap" style={{ fontSize: '11px', color: '#a0aec0' }}>
                                    {tx.account?.name && (
                                      <span
                                        className="rounded px-1 fw-semibold"
                                        style={{ background: acctColor + '22', color: acctColor, fontSize: '10px' }}
                                      >
                                        {tx.account.name}
                                      </span>
                                    )}
                                    {tx.category?.name && <span>{tx.category.name}</span>}
                                    <span>&middot; {dateStr}</span>
                                  </div>
                                </div>
                                <div className="fw-bold flex-shrink-0" style={{ color, fontSize: '14px' }}>
                                  {prefix}{fmt(tx.amount)}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  )
}
