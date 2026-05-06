import { useMemo, type FC, type MouseEvent } from 'react';
import { Icon, Spinner } from '@/shared/components/ui';
import type { Transaction } from '../types/transaction.types';

interface TransactionListProps {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
  onEdit: (tx: Transaction, e: MouseEvent) => void;
  onDelete: (id: string) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string, type?: 'date' | 'time') => string;
  deletePendingId?: string | null;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  lastElementRef?: (node: HTMLDivElement) => void;
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
    if (!transactions) return {};
    const groups: Record<string, Transaction[]> = {};
    transactions.forEach((tx) => {
      const date = new Date(tx.tx_date);
      const monthYear = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(tx);
    });
    return groups;
  }, [transactions]);

  const monthKeys = useMemo(() => Object.keys(groupedByMonth), [groupedByMonth]);

  if (isLoading) {
    return (
      <div className="py-5 text-center">
        <Spinner size="lg" />
        <p className="mt-3 text-secondary">Memuat data transaksi...</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty py-5">
        <div className="empty-icon text-secondary mb-3">
          <Icon icon="mood-sad" size={64} stroke={1.5} />
        </div>
        <p className="empty-title h3">Tidak ada transaksi ditemukan</p>
        <p className="empty-subtitle text-secondary">Coba gunakan filter lain atau buat transaksi baru.</p>
      </div>
    );
  }

  return (
    <div className="transaction-history-list bg-white">
      {monthKeys.map((month, monthIndex) => (
        <div key={month} className="month-group mb-4">
          <div className="month-header px-3 px-md-4 py-3 bg-light-subtle d-flex align-items-center gap-2">
            <div className="month-indicator" />
            <span className="fw-black text-dark text-uppercase tracking-wider" style={{ fontSize: '0.85rem', opacity: 0.8 }}>
              {month}
            </span>
          </div>
          
          <div className="transaction-rows">
            {groupedByMonth[month].map((tx, txIndex) => {
              const txDate = new Date(tx.tx_date);
              const day = txDate.getDate();
              const monthShort = new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(txDate);
              const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(txDate);

              return (
                <div 
                  key={tx.id} 
                  ref={
                    monthIndex === monthKeys.length - 1 && txIndex === groupedByMonth[month].length - 1
                      ? lastElementRef
                      : undefined
                  }
                  className="transaction-row d-flex align-items-center py-3 px-3 px-md-4 border-bottom position-relative"
                  onClick={(e) => onEdit(tx, e as unknown as MouseEvent)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Unique Date Leaf Column */}
                  <div className="date-leaf me-2 me-md-4 text-center">
                    <div className="day-name">{dayName}</div>
                    <div className="day-num">{day < 10 ? `0${day}` : day}</div>
                    <div className="month-label">{monthShort}</div>
                  </div>

                  {/* Info Column */}
                  <div className="flex-grow-1 min-width-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h4 className="merchant-name fw-bold mb-0 text-truncate">
                          {tx.merchant || 'Transaksi Mora'}
                        </h4>
                        <div className="category-tag small opacity-60">
                          {tx.category?.name || 'Umum'}
                        </div>
                      </div>
                      <div className="text-end">
                        <div className={`amount-display fw-black ${
                          tx.type === 'expense' ? 'text-danger' : 
                          tx.type === 'income' ? 'text-success' : 
                          'text-dark'
                        }`}>
                          {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                        </div>
                        <div className="tx-status-pill">
                          <Icon icon="circle-check-filled" size={12} className="me-1" />
                          <span>Selesai</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Column */}
                  <div className="ms-3 opacity-20">
                    <Icon icon="chevron-right" size={18} />
                  </div>
                </div>
              );
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

      <style>{`
        .transaction-history-list {
          border-radius: 0;
          overflow: hidden;
        }
        
        .month-indicator {
          width: 4px;
          height: 16px;
          background: var(--mora-primary);
          border-radius: 4px;
        }

        .transaction-row {
          border-bottom: 1px solid #f1f5f9;
        }

        /* Unique Date Leaf */
        .date-leaf {
          min-width: 54px;
          background: #f8fafc;
          border-radius: 0;
          padding: 6px 4px;
          border: 1px solid #f1f5f9;
        }
        .date-leaf .day-name {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--mora-text-muted);
          letter-spacing: 0.5px;
        }
        .date-leaf .day-num {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--mora-primary);
          line-height: 1.1;
        }
        .date-leaf .month-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--mora-text-muted);
          opacity: 0.7;
        }

        .merchant-name {
          color: #1e293b;
          font-size: 1rem;
          letter-spacing: -0.2px;
        }
        
        .amount-display {
          font-size: 1.1rem;
          letter-spacing: -0.5px;
        }

        .tx-status-pill {
          display: inline-flex;
          align-items: center;
          font-size: 0.65rem;
          font-weight: 800;
          color: #22c55e;
          background: #f0fdf4;
          padding: 2px 8px;
          border-radius: 6px;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .category-tag {
          font-weight: 500;
          color: #64748b;
        }
      `}</style>
    </div>
  );
};
