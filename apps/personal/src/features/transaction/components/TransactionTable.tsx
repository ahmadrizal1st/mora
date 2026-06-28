import { type FC, type MouseEvent, type ReactNode } from 'react'
import { Icon, Badge, Spinner } from '@/shared/components/ui'
import type { Transaction } from '../types/transaction.types'

interface TransactionTableProps {
  transactions: Transaction[] | undefined
  isLoading: boolean
  onEdit: (tx: Transaction, e: MouseEvent) => void
  onSort: (column: string) => void
  getSortIcon: (column: string) => ReactNode
  formatCurrency: (amount: number) => string
  formatDate: (dateString: string, type?: 'date' | 'time') => string
}

export const TransactionTable: FC<TransactionTableProps> = ({
  transactions,
  isLoading,
  onEdit,
  onSort,
  getSortIcon,
  formatCurrency,
  formatDate,
}) => {
  const transactionList = transactions ?? []
  return (
    <div className="table-responsive border-0">
      <table
        className="table table-vcenter table-hover card-table mb-0 border-bottom-0 table-faint-borders"
        style={{ tableLayout: 'fixed', width: '100%', minWidth: '1100px' }}
      >
        <thead className="bg-body-tertiary">
          <tr>
            <th
              className="text-secondary opacity-7 fw-bold cursor-pointer py-2"
              style={{ width: '100px' }}
              onClick={() => onSort('tx_date')}
            >
              <div className="d-flex align-items-center">Tanggal {getSortIcon('tx_date')}</div>
            </th>
            <th
              className="text-secondary opacity-7 fw-bold cursor-pointer py-2"
              style={{ width: '150px' }}
              onClick={() => onSort('merchant')}
            >
              <div className="d-flex align-items-center">
                Keterangan / Merchant {getSortIcon('merchant')}
              </div>
            </th>
            <th className="text-secondary opacity-7 fw-bold py-2" style={{ width: '220px' }}>
              Tag
            </th>
            <th
              className="text-secondary opacity-7 fw-bold cursor-pointer py-2"
              style={{ width: '160px' }}
              onClick={() => onSort('category')}
            >
              <div className="d-flex align-items-center">Kategori {getSortIcon('category')}</div>
            </th>
            <th
              className="text-secondary opacity-7 fw-bold cursor-pointer py-2"
              style={{ width: '140px' }}
              onClick={() => onSort('account')}
            >
              <div className="d-flex align-items-center">Akun {getSortIcon('account')}</div>
            </th>
            <th className="text-secondary opacity-7 fw-bold py-2" style={{ width: '100px' }}>
              Status
            </th>
            <th
              className="text-secondary opacity-7 fw-bold text-end cursor-pointer py-2"
              style={{ width: '110px' }}
              onClick={() => onSort('nominal')}
            >
              <div className="d-flex align-items-center justify-content-end">
                Nominal {getSortIcon('nominal')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="table-tbody">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="text-center py-4">
                <div className="empty">
                  <div className="empty-img">
                    <Spinner />
                  </div>
                  <p className="empty-title">Memuat data...</p>
                </div>
              </td>
            </tr>
          ) : transactions?.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4">
                <div className="empty">
                  <div className="empty-icon text-secondary">
                    <Icon icon="mood-sad" size={32} />
                  </div>
                  <p className="empty-title">Tidak ada transaksi ditemukan</p>
                  <p className="empty-subtitle">
                    Coba gunakan filter lain atau buat transaksi baru.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            transactionList.map((tx) => (
              <tr key={tx.id} style={{ cursor: 'pointer' }} onClick={(e) => onEdit(tx, e)}>
                <td className="text-nowrap py-2">
                  <div className="fw-medium">{formatDate(tx.tx_date)}</div>
                  <div className="text-secondary small">{formatDate(tx.created_at, 'time')}</div>
                </td>
                <td className="td-truncate py-2">
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center gap-1">
                      {tx.input_method === 'image' && (
                        <span title="Dari Foto">
                          <Icon icon="photo" size={12} className="text-secondary" />
                        </span>
                      )}
                      {tx.input_method === 'audio' && (
                        <span title="Dari Suara">
                          <Icon icon="microphone" size={12} className="text-secondary" />
                        </span>
                      )}
                      {tx.input_method === 'file' && (
                        <span title="Dari File">
                          <Icon icon="file-text" size={12} className="text-secondary" />
                        </span>
                      )}
                      {tx.input_method === 'text' && (
                        <span title="Dari Teks">
                          <Icon icon="align-left" size={12} className="text-secondary" />
                        </span>
                      )}
                      {tx.input_method === 'manual' && (
                        <span title="Input Manual">
                          <Icon icon="pencil" size={12} className="text-secondary" />
                        </span>
                      )}
                      <span
                        className="fw-medium text-body text-truncate"
                        style={{ maxWidth: '120px' }}
                      >
                        {tx.merchant || (tx.type === 'transfer' ? 'Transfer Dana' : 'Umum')}
                      </span>
                    </div>
                    {tx.notes && (
                      <span
                        className="text-secondary small text-truncate"
                        style={{ maxWidth: '120px' }}
                        title={tx.notes}
                      >
                        {tx.notes.replace(/\n/g, ', ')}
                      </span>
                    )}
                  </div>
                </td>
                <td className="align-middle py-2">
                  <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '180px' }}>
                    {tx.tags?.map((tag) => (
                      <span
                        key={tag.id}
                        className="badge badge-outline text-nowrap"
                        style={{
                          fontSize: '10px',
                          padding: '2px 8px',
                          borderColor: `${tag.color}40`,
                          color: tag.color,
                          backgroundColor: `${tag.color}08`,
                          textAlign: 'center',
                          width: 'fit-content',
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  {(!tx.tags || tx.tags.length === 0) && (
                    <span className="text-muted small">-</span>
                  )}
                </td>
                <td className="align-middle py-2">
                  {tx.category ? (
                    <div className="d-inline-flex align-items-center">
                      <Badge
                        outline
                        pill
                        className="px-2 py-1 fw-medium"
                        style={{
                          borderColor: tx.category.color,
                          color: tx.category.color,
                          backgroundColor: `${tx.category.color}10`,
                          fontSize: '11px',
                        }}
                      >
                        {tx.category.icon && (
                          <Icon icon={tx.category.icon} size={12} className="me-1" />
                        )}
                        {tx.category.name}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-muted small">Tanpa Kategori</span>
                  )}
                </td>
                <td className="align-middle py-2">
                  <div className="d-flex align-items-center">
                    <span
                      className="status-dot me-2"
                      style={{ backgroundColor: tx.account?.color || 'var(--tblr-border-color)' }}
                    ></span>
                    <span className="text-truncate" style={{ maxWidth: '100px' }}>
                      {tx.account?.name}
                    </span>
                  </div>
                </td>
                <td className="align-middle py-2">
                  {tx.status ? (
                    <span
                      className="badge fw-medium"
                      style={{
                        backgroundColor: `${tx.status.color}15`,
                        color: tx.status.color,
                        fontSize: '11px',
                      }}
                    >
                      {tx.status.name}
                    </span>
                  ) : (
                    <span className="badge bg-body-tertiary text-muted">Draft</span>
                  )}
                </td>
                <td className="text-end fw-bold align-middle py-2">
                  <span className={`text-nowrap ${tx.type === 'income' ? 'text-success' : tx.type === 'expense' ? 'text-danger' : 'text-primary'}`}>
                    {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''}
                    {formatCurrency(tx.amount)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
