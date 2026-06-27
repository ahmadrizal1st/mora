import { useState } from 'react'
import { useTransactions } from '@/features/transaction/hooks/useTransactions'
import { Icon } from '@/shared/components/ui/Icon'
import type { TransactionType } from '@/features/transaction/types/transaction.types'

interface TransactionsListCardProps {
  dateFrom?: string
  dateTo?: string
}

const TYPE_FILTERS: { label: string; value: 'all' | TransactionType }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Pengeluaran', value: 'expense' },
  { label: 'Pemasukan', value: 'income' },
  { label: 'Transfer', value: 'transfer' },
]

const SORT_OPTIONS = [
  { label: 'Terbaru', value: '-tx_date' },
  { label: 'Terlama', value: 'tx_date' },
  { label: 'Terbesar', value: '-amount' },
  { label: 'Terkecil', value: 'amount' },
]

export function TransactionsListCard({ dateFrom, dateTo }: TransactionsListCardProps) {
  const [activeType, setActiveType] = useState<'all' | TransactionType>('all')
  const [sortBy, setSortBy] = useState('-tx_date')
  const [showSortMenu, setShowSortMenu] = useState(false)

  const filters = {
    ...(activeType !== 'all' ? { type: activeType as TransactionType } : {}),
    ...(dateFrom ? { date_from: dateFrom } : {}),
    ...(dateTo ? { date_to: dateTo } : {}),
    per_page: 50,
    sort_by: sortBy.replace('-', ''),
    sort_dir: (sortBy.startsWith('-') ? 'desc' : 'asc') as 'asc' | 'desc',
  }

  const { data: txData, isLoading } = useTransactions(filters)
  const transactions = txData?.data || []

  const formatCurrency = (val: number) => Math.abs(val).toLocaleString('id-ID')
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
  }

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Terbaru'

  return (
    <div>
      {/* Filter type chips */}
      <div className="d-flex gap-2 overflow-auto pb-2 mb-3" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        {TYPE_FILTERS.map(f => (
          <button
            key={f.value}
            className={`btn btn-sm rounded-pill px-3 flex-shrink-0 ${
              activeType === f.value
                ? 'btn-primary'
                : 'btn-outline-secondary bg-white border'
            }`}
            onClick={() => setActiveType(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Header row */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold m-0" style={{ fontSize: '13px' }}>
          {activeType === 'all' ? 'Semua Transaksi' : TYPE_FILTERS.find(f => f.value === activeType)?.label}
          {txData?.total ? (
            <span className="text-secondary fw-normal ms-2" style={{ fontSize: '12px' }}>
              {txData.total} item
            </span>
          ) : null}
        </h3>
        <div className="position-relative">
          <button
            className="d-flex align-items-center bg-white px-2 py-1 rounded-pill border gap-1"
            style={{ fontSize: '12px' }}
            onClick={() => setShowSortMenu(v => !v)}
          >
            <Icon icon="arrows-sort" size={13} />
            {currentSortLabel}
            <Icon icon="chevron-down" size={13} />
          </button>
          {showSortMenu && (
            <div
              className="position-absolute end-0 bg-white border rounded-3 shadow-sm py-1"
              style={{ zIndex: 100, minWidth: '140px', top: '110%' }}
            >
              {SORT_OPTIONS.map(o => (
                <button
                  key={o.value}
                  className={`dropdown-item px-3 py-2 ${sortBy === o.value ? 'text-primary fw-bold' : ''}`}
                  style={{ fontSize: '13px' }}
                  onClick={() => { setSortBy(o.value); setShowSortMenu(false) }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center text-secondary py-4" style={{ fontSize: '13px' }}>
          <div className="spinner-border spinner-border-sm me-2" />
          Memuat transaksi...
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-secondary py-5">
          <Icon icon="receipt-off" size={40} className="mb-2 opacity-50" />
          <div style={{ fontSize: '13px' }}>Belum ada transaksi</div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {transactions.map((tx) => {
            const isExpense = tx.type === 'expense'
            const isIncome = tx.type === 'income'
            const amountColor = isExpense ? 'text-danger' : isIncome ? 'text-success' : 'text-blue'
            const amountPrefix = isExpense ? '-' : isIncome ? '+' : '↔'

            return (
              <div key={tx.id} className="card border-0 rounded-4 shadow-sm">
                <div className="card-body p-3 d-flex justify-content-between align-items-center gap-2">
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-semibold text-dark mb-1 text-truncate" style={{ fontSize: '14px' }}>
                      {tx.merchant || tx.category?.name || (isIncome ? 'Pemasukan' : isExpense ? 'Pengeluaran' : 'Transfer')}
                    </div>
                    <div className="d-flex align-items-center gap-1 flex-wrap" style={{ fontSize: '11px', color: '#888' }}>
                      {tx.account?.name && (
                        <span
                          className="badge rounded px-1 py-0"
                          style={{ fontSize: '9px', backgroundColor: tx.account.color || '#e0e0e0', color: '#fff' }}
                        >
                          {tx.account.name}
                        </span>
                      )}
                      {tx.category?.name && (
                        <span>{tx.category.name}</span>
                      )}
                      <span>&middot;</span>
                      <span>{formatDate(tx.tx_date)}</span>
                    </div>
                  </div>
                  <div className={`fw-bold flex-shrink-0 ${amountColor}`} style={{ fontSize: '14px' }}>
                    {amountPrefix}{formatCurrency(tx.amount)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
