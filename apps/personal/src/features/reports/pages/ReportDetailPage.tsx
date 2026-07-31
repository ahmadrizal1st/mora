import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { useTransactionSummary } from '@/features/transaction/hooks/useTransactions'
import { CategoryBreakdownCard } from '@/features/reports/components/CategoryBreakdownCard'
import { DailyHeatmapCard } from '@/features/reports/components/DailyHeatmapCard'
import { Icon } from '@/shared/components/ui/Icon'
import { TransactionsListCard } from '../components/TransactionsListCard'

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

export function ReportDetailPage() {
  const { periodId } = useParams({ from: '/reports/$periodId' })
  const { dateFrom, dateTo } = parsePeriodId(periodId)
  const [globalTxType, setGlobalTxType] = useState<'expense' | 'income'>('expense')

  const { data: summary, isLoading: loadingSummary } = useTransactionSummary({ date_from: dateFrom, date_to: dateTo })

  const income = summary?.total_income || 0
  const expense = summary?.total_expense || 0
  const saldo = income - expense
  const savingRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0
  const avgDaily = expense > 0 ? Math.round(expense / 30) : 0
  const calcEndBalance = saldo

  const headerLabel = `${fmtDate(dateFrom)} - ${fmtDate(dateTo)}`

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
              <Icon icon="printer" size={16} />
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
                            className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom"
                            style={{
                              borderBottomColor: i < arr.length - 1 ? 'var(--tblr-border-color)' : 'transparent',
                              borderTop: row.label === 'Saldo Akhir' ? '1px solid var(--tblr-border-color)' : undefined,
                              marginTop: row.label === 'Saldo Akhir' ? '4px' : undefined,
                              paddingTop: row.label === 'Saldo Akhir' ? '12px' : undefined,
                              fontSize: '14px',
                            }}
                          >
                            <span style={{ color: row.bold ? 'var(--tblr-body-color)' : 'var(--tblr-secondary-color)', fontWeight: row.bold ? 700 : 400 }}>{row.label}</span>
                            <span style={{ color: row.color || 'var(--tblr-body-color)', fontWeight: row.bold ? 700 : 600 }}>{row.value}</span>
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
                <div className="d-flex w-100" style={{ borderBottom: '1px solid var(--tblr-border-color)' }} role="tablist">
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
                          color: isActive ? 'var(--tblr-body-color)' : 'var(--tblr-secondary-color)',
                          fontWeight: isActive ? '800' : '600',
                          borderBottom: isActive ? '3px solid var(--tblr-primary)' : '3px solid transparent',
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
              <div className="row g-3 mt-2">
                <div className="col-12">
                  <TransactionsListCard dateFrom={dateFrom} dateTo={dateTo} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  )
}
