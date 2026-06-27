import { useState, useEffect, useMemo, useRef, useCallback, type FC, type MouseEvent } from 'react'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { Icon, Pagination, DropdownGrouping, Modal, Button } from '@/shared/components/ui'
import {
  useTransactions,
  useTransactionSummary,
  useDeleteTransaction,
  useTransactionHistory,
  useInfiniteTransactions,
} from '../hooks/useTransactions'
import type { TransactionFilters, Transaction } from '../types/transaction.types'
import { TransactionFiltersComponent } from '../components/TransactionFilters'
import { TransactionSummaryCards } from '../components/TransactionSummaryCards'
import { TransactionTable } from '../components/TransactionTable'
import { TransactionList } from '../components/TransactionList'
import { TransactionInvoice } from '../components/TransactionInvoice'
import { useTransactionModalStore } from '../store/useTransactionModalStore'

export const TransactionListPage: FC = () => {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    per_page: 15,
  })

  const { openMethodModal, openForm, setTxToDelete, isMethodModalOpen } =
    useTransactionModalStore()

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  const [invoiceTransaction, setInvoiceTransaction] = useState<Transaction | undefined>(undefined)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setViewMode('list')
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>('day')

  const [viewMode, setViewMode] = useState<'table' | 'list'>('list')

  const { data: response, isLoading: isLoadingTx } = useTransactions(filters)
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingInfinite,
  } = useInfiniteTransactions({ ...filters, per_page: 10 })

  const observer = useRef<IntersectionObserver | null>(null)
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoadingInfinite || isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isLoadingInfinite, isFetchingNextPage, hasNextPage, fetchNextPage]
  )

  const allTransactions = useMemo(() => {
    let list: Transaction[] = []
    if (isMobile) {
      list = infiniteData?.pages.flatMap((page) => page.data) || []
    } else {
      list = response?.data || []
    }

    const seen = new Set()
    return list.filter((tx) => {
      if (seen.has(tx.id)) return false
      seen.add(tx.id)
      return true
    })
  }, [isMobile, infiniteData, response])

  const { data: summary, isLoading: isLoadingSummary } = useTransactionSummary({
    date_from: filters.date_from,
    date_to: filters.date_to,
    account_id: filters.account_id,
    group_by: groupBy,
  })

  const { data: historyData } = useTransactionHistory({
    date_from: filters.date_from,
    date_to: filters.date_to,
    account_id: filters.account_id,
    group_by: groupBy,
  })

  const deleteMutation = useDeleteTransaction()

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)

    holdTimerRef.current = setTimeout(() => {
      openMethodModal()
      holdTimerRef.current = null

      try {
        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
      } catch (err) {}

      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50)
      }
    }, 150)
  }

  const handlePointerUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
      openMethodModal()

      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(20)
      }
    }
  }

  const handleContextMenu = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault()
  }

  const handleEdit = useCallback((tx: Transaction, e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setInvoiceTransaction(tx)
    setIsInvoiceOpen(true)
  }, [])

  const handleStartEdit = (tx: Transaction) => {
    setIsInvoiceOpen(false)
    openForm(tx)
  }

  const chartData = useMemo(() => {
    if (!historyData || !historyData.income) {
      return {
        incomeSeries: [{ name: 'Pemasukan', data: [0] }],
        incomeLabels: [],
        expenseSeries: [{ name: 'Pengeluaran', data: [0] }],
        expenseLabels: [],
        countSeries: [{ name: 'Transaksi', data: [0] }],
        countLabels: [],
      }
    }

    return {
      incomeSeries: [{ name: 'Pemasukan', data: historyData.income }],
      incomeLabels: historyData.income_labels,
      expenseSeries: [{ name: 'Pengeluaran', data: historyData.expense }],
      expenseLabels: historyData.expense_labels,
      countSeries: [{ name: 'Transaksi', data: historyData.count }],
      countLabels: historyData.count_labels,
      comparisonSeries: [
        { name: 'Pemasukan', data: historyData.income, color: 'primary' },
        { name: 'Pengeluaran', data: historyData.expense, color: 'secondary' },
      ],
      comparisonLabels: historyData.income_labels,
    }
  }, [historyData])

  const handleClearFilters = () => {
    setFilters({ page: 1, per_page: 15 })
  }

  const handleSort = (column: string) => {
    setFilters((prev) => {
      const isSameCol = prev.sort_by === column
      const newDir = isSameCol ? (prev.sort_dir === 'desc' ? 'asc' : 'desc') : 'desc'
      return { ...prev, sort_by: column, sort_dir: newDir, page: 1 }
    })
  }

  const getSortIcon = (column: string) => {
    if (filters.sort_by !== column)
      return <Icon icon="selector" size={12} className="ms-1 opacity-40" />
    return filters.sort_dir === 'asc' ? (
      <Icon icon="chevron-up" size={12} className="ms-1 text-primary" />
    ) : (
      <Icon icon="chevron-down" size={12} className="ms-1 text-primary" />
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount || 0)
  }

  const formatDate = (dateString: string, type: 'date' | 'time' | 'full' = 'date') => {
    try {
      if (!dateString) return '-'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return '-'

      const datePart = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date)
      const timePart = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(date)

      if (type === 'time') return timePart
      if (type === 'full') return `${datePart} ${timePart}`
      return datePart
    } catch {
      return '-'
    }
  }

  return (
    <BaseLayout
      pageTitle="Daftar Transaksi"
      containerFlushMobile={true}
      flush={true}
      bodyClass="px-0"
      pageActions={
        <div className="d-flex align-items-center gap-2">
          {isMobile && (
            <button
              className="border-0 p-0 bg-transparent ms-auto"
              onClick={() => setIsFilterModalOpen(true)}
              style={{
                color: 'var(--tblr-body-color)',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: 'none',
                transition: 'none',
              }}
            >
              <Icon icon="filter" size={24} stroke={1.5} />
            </button>
          )}
        </div>
      }
    >
      <div className="container-xl">
        {!isMobile && (
          <>
            <TransactionSummaryCards
              summary={summary}
              isLoading={isLoadingSummary}
              chartData={chartData}
              formatCurrency={formatCurrency}
            />

            <TransactionFiltersComponent
              filters={filters}
              onChange={setFilters}
              onClear={handleClearFilters}
            />
          </>
        )}

        <div className={`card border-0 ${isMobile ? 'shadow-none rounded-0 mx-n3' : 'shadow-sm'}`}>
          {!isMobile && (
            <div className="card-header border-0 bg-transparent py-3">
              <h3 className="card-title fw-bold">Semua Transaksi</h3>
              <div className="card-actions d-flex align-items-center gap-2">
                <div className="btn-group shadow-sm rounded-2 overflow-hidden me-2">
                  <button
                    className={`btn btn-icon border-0 ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost-secondary bg-surface'}`}
                    onClick={() => setViewMode('list')}
                    title="Tampilan Daftar"
                  >
                    <Icon icon="list" size={18} />
                  </button>
                  <button
                    className={`btn btn-icon border-0 ${viewMode === 'table' ? 'btn-primary' : 'btn-ghost-secondary bg-surface'}`}
                    onClick={() => setViewMode('table')}
                    title="Tampilan Tabel"
                  >
                    <Icon icon="table" size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="card-body p-0">
            {viewMode === 'table' ? (
              <TransactionTable
                transactions={allTransactions}
                isLoading={isMobile ? isLoadingInfinite : isLoadingTx}
                onEdit={handleEdit}
                onDelete={(id) => setTxToDelete(id)}
                onSort={handleSort}
                getSortIcon={getSortIcon}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                deletePendingId={deleteMutation.isPending ? deleteMutation.variables : null}
              />
            ) : (
              <TransactionList
                transactions={allTransactions}
                isLoading={isMobile ? isLoadingInfinite : isLoadingTx}
                onEdit={handleEdit}
                onDelete={(id) => setTxToDelete(id)}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
                deletePendingId={deleteMutation.isPending ? deleteMutation.variables : null}
                hasNextPage={isMobile ? hasNextPage : false}
                isFetchingNextPage={isMobile ? isFetchingNextPage : false}
                lastElementRef={isMobile ? lastElementRef : undefined}
              />
            )}
          </div>

          {!isMobile && response && response.total > 0 && (
            <div className="card-footer d-flex flex-column flex-md-row align-items-center justify-content-between bg-transparent border-top-0 py-3 gap-3">
              <div className="text-secondary small d-flex align-items-center">
                Menampilkan&nbsp;<strong>{response.from || 0}</strong>&nbsp;–&nbsp;
                <strong>{response.to || 0}</strong>&nbsp;dari&nbsp;<strong>{response.total}</strong>
                &nbsp;transaksi
              </div>
              {response.last_page > 1 && (
                <div className="pagination-wrapper">
                  <Pagination
                    activeItem={filters.page || 1}
                    count={response.last_page}
                    className="m-0"
                    onPageChange={(page) => setFilters({ ...filters, page })}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        show={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        size={isMobile ? 'fullscreen' : 'lg'}
        top={!isMobile}
        className={isMobile ? 'p-0' : ''}
      >
        {invoiceTransaction && (
          <TransactionInvoice
            transaction={invoiceTransaction}
            onClose={() => setIsInvoiceOpen(false)}
            onEdit={handleStartEdit}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        )}
      </Modal>

      <Modal
        show={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        size="fullscreen"
        className="p-0"
      >
        <div className="d-flex flex-column h-100 bg-surface">
          <header className="px-3 py-3 border-bottom d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <button
                className="border-0 p-0 shadow-none bg-transparent d-flex align-items-center"
                onClick={() => setIsFilterModalOpen(false)}
                style={{ boxShadow: 'none', outline: 'none', width: 'auto', height: 'auto' }}
              >
                <Icon icon="arrow-left" size={24} />
              </button>
              <h2 className="h3 mb-0 fw-bold">Filter Transaksi</h2>
            </div>
            <button
              className="btn btn-link text-primary p-0 fw-bold shadow-none border-0"
              onClick={() => {
                handleClearFilters()
                setIsFilterModalOpen(false)
              }}
              style={{ boxShadow: 'none', outline: 'none' }}
            >
              Reset
            </button>
          </header>
          <div className="flex-grow-1 overflow-auto p-2">
            <TransactionFiltersComponent
              filters={filters}
              onChange={(newFilters) => {
                setFilters(newFilters)
              }}
              onClear={handleClearFilters}
            />
          </div>
          <footer className="p-4 border-top">
            <Button
              element="button"
              color="primary"
              block
              size="md"
              onClick={() => setIsFilterModalOpen(false)}
            >
              Terapkan Filter
            </Button>
          </footer>
        </div>
      </Modal>

      <button
        className="btn btn-primary rounded-circle position-fixed shadow-lg d-none d-md-flex align-items-center justify-content-center p-0"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={handleContextMenu}
        style={{
          bottom: 32,
          right: 32,
          width: 72,
          height: 72,
          zIndex: 1020,
          touchAction: 'none',
          display: isMethodModalOpen ? 'none' : undefined,
          backgroundColor: '#f76707',
          border: 'none',
        }}
        aria-label="Tambah Transaksi"
      >
        <Icon icon="plus" size={32} stroke={3} />
      </button>
    </BaseLayout>
  )
}
