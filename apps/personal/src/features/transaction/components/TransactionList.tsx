import { useMemo, type FC, type MouseEvent } from 'react'
import { Icon, Spinner } from '@/shared/components/ui'
import type { Transaction } from '../types/transaction.types'

interface TransactionListProps {
  transactions: Transaction[] | undefined
  isLoading: boolean
  onEdit: (tx: Transaction, e: MouseEvent) => void
  onDelete: (id: string) => void
  formatCurrency: (amount: number) => string
  formatDate: (dateString: string, type?: 'date' | 'time') => string
  deletePendingId?: string | null
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  lastElementRef?: (node: HTMLDivElement) => void
}

export const TransactionList: FC<TransactionListProps> = ({
  transactions,
  isLoading,
  onEdit,
  formatCurrency,
  hasNextPage,
  isFetchingNextPage,
  lastElementRef,
}) => {
  const groupedByMonth = useMemo(() => {
    if (!transactions) return {}
    const groups: Record<string, Transaction[]> = {}
    transactions.forEach((tx) => {
      const date = new Date(tx.tx_date)
      const monthYear = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(
        date
      )
      if (!groups[monthYear]) groups[monthYear] = []
      groups[monthYear].push(tx)
    })
    return groups
  }, [transactions])

  const monthKeys = useMemo(() => Object.keys(groupedByMonth), [groupedByMonth])

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <Spinner size="lg" />
        <p className="mt-3 text-secondary">Memuat data transaksi...</p>
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty py-5">
        <div className="empty-icon text-secondary mb-3">
          <Icon icon="mood-sad" size={64} stroke={1.5} />
        </div>
        <p className="empty-title h3">Tidak ada transaksi ditemukan</p>
        <p className="empty-subtitle text-secondary">
          Coba gunakan filter lain atau buat transaksi baru.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-0 overflow-hidden">
      {monthKeys.map((month, monthIndex) => (
        <div key={month} className="mb-4">
          <div className="px-3 px-md-4 py-3 bg-body-tertiary d-flex align-items-center gap-2">
            <div
              style={{
                width: 4,
                height: 16,
                backgroundColor: 'var(--mora-primary)',
                borderRadius: 4,
              }}
            />
            <span
              className="fw-black text-body text-uppercase tracking-wider"
              style={{ fontSize: '0.85rem', opacity: 0.8 }}
            >
              {month}
            </span>
          </div>

          <div>
            {groupedByMonth[month].map((tx, txIndex) => {
              const txDate = new Date(tx.tx_date)
              const day = txDate.getDate()
              const monthShort = new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(txDate)
              const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(txDate)

              return (
                <div
                  key={tx.id}
                  ref={
                    monthIndex === monthKeys.length - 1 &&
                    txIndex === groupedByMonth[month].length - 1
                      ? lastElementRef
                      : undefined
                  }
                  className="d-flex align-items-center py-3 px-3 px-md-4 border-bottom position-relative"
                  onClick={(e) => onEdit(tx, e as unknown as MouseEvent)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className="me-2 me-md-4 text-center border rounded-0 px-1 py-1 bg-surface-secondary"
                    style={{ minWidth: 54 }}
                  >
                    <div
                      className="text-uppercase fw-bolder text-secondary"
                      style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}
                    >
                      {dayName}
                    </div>
                    <div
                      className="fw-black"
                      style={{ fontSize: '1.4rem', color: 'var(--mora-primary)', lineHeight: 1.1 }}
                    >
                      {day < 10 ? `0${day}` : day}
                    </div>
                    <div
                      className="fw-bold text-secondary opacity-75"
                      style={{ fontSize: '0.65rem' }}
                    >
                      {monthShort}
                    </div>
                  </div>

                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h4
                          className="fw-bold mb-0 text-truncate text-body"
                          style={{ fontSize: '1rem', letterSpacing: '-0.2px' }}
                        >
                          {tx.merchant || 'Transaksi Mora'}
                        </h4>
                        <div className="small fw-medium text-secondary opacity-75">
                          {tx.category?.name || 'Umum'}
                        </div>
                      </div>
                      <div className="text-end">
                        <div
                          className={`fw-black ${
                            tx.type === 'expense'
                              ? 'text-danger'
                              : tx.type === 'income'
                                ? 'text-success'
                                : 'text-body'
                          }`}
                          style={{ fontSize: '1.1rem', letterSpacing: '-0.5px' }}
                        >
                          {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''}
                          {formatCurrency(tx.amount)}
                        </div>
                        <div
                          className="d-inline-flex align-items-center fw-bolder text-success text-uppercase mt-1"
                          style={{
                            fontSize: '0.65rem',
                            padding: '2px 8px',
                            borderRadius: 6,
                            backgroundColor: 'var(--tblr-success-lt)',
                          }}
                        >
                          <Icon icon="circle-check-filled" size={12} className="me-1" />
                          <span>Selesai</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ms-3 opacity-25">
                    <Icon icon="chevron-right" size={18} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {isFetchingNextPage && (
        <div className="py-4 text-center border-top">
          <Spinner size="sm" />
          <span className="ms-2 text-secondary small">Memuat lebih banyak...</span>
        </div>
      )}

      {!hasNextPage && transactions && transactions.length > 0 && (
        <div className="py-4 text-center text-muted small opacity-50 d-md-none">
          Semua transaksi telah dimuat
        </div>
      )}
    </div>
  )
}
