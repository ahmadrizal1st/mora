import { Icon } from '@/shared/components/ui'

interface InvoiceRow {
  id?: string
  subject: string
  client: string
  vatNo?: string
  date?: string
  status: string
  statusColor?: string
  price: string
}

interface RecentTransactionsTableProps {
  invoices?: InvoiceRow[]
  hideHeader?: boolean
  hideFooter?: boolean
}

export function RecentTransactionsTable({
  invoices = [],
  hideHeader = false,
  hideFooter = false,
}: RecentTransactionsTableProps) {
  return (
    <div className={hideHeader && hideFooter ? '' : 'card'}>
      {!hideHeader && (
        <div className="card-header">
          <h3 className="card-title">Recent Transactions</h3>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-sm table-vcenter card-table text-nowrap">
          <thead>
            <tr className="text-mobile-xs">
              <th>Subject</th>
              <th>Account</th>
              <th className="d-none d-md-table-cell">Date</th>
              <th className="d-none d-sm-table-cell">Status</th>
              <th className="text-end">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-5">
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
              invoices.map((inv, i) => (
                <tr key={i} className="text-mobile-xs">
                  <td className="text-truncate" style={{ maxWidth: '120px' }}>
                    <a href="#" className="text-reset fw-medium">
                      {inv.subject}
                    </a>
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '100px' }}>
                    {inv.client}
                  </td>
                  <td className="d-none d-md-table-cell text-secondary">{inv.date}</td>
                  <td className="d-none d-sm-table-cell">
                    {inv.status && (
                      <>
                        <span className={`badge bg-${inv.statusColor || 'secondary'} me-1`} />
                        <span className="d-none d-lg-inline">{inv.status}</span>
                      </>
                    )}
                  </td>
                  <td className="fw-bold text-end">{inv.price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!hideFooter && (
        <div className="card-footer d-flex align-items-center">
          <p className="m-0 text-secondary">
            Showing <strong>{invoices.length}</strong> entries
          </p>
        </div>
      )}
    </div>
  )
}
