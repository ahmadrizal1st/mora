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
}

export const TransactionList: FC<TransactionListProps> = ({
  transactions,
  isLoading,
  onEdit,
  onDelete,
  formatCurrency,
  formatDate,
  deletePendingId,
}) => {
  const groupedTransactions = useMemo(() => {
    if (!transactions) return {};
    const groups: Record<string, Transaction[]> = {};
    transactions.forEach((tx) => {
      // Standardize date to YYYY-MM-DD for grouping
      const dateKey = tx.tx_date.split('T')[0]; 
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(tx);
    });
    return groups;
  }, [transactions]);

  const sortedDates = useMemo(() => 
    Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a)),
    [groupedTransactions]
  );

  const getRelativeDateLabel = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (dateStr === today) return 'Hari Ini';
    if (dateStr === yesterday) return 'Kemarin';
    
    return formatDate(dateStr, 'date');
  };

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
    <div className="transaction-list-container px-3 px-md-4 py-2">
      {sortedDates.map((date) => (
        <div key={date} className="transaction-group mb-4">
          <div 
            className="group-header d-flex justify-content-between align-items-center mb-3 py-1"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
          >
            <span className="fw-bold text-dark fs-4">{getRelativeDateLabel(date)}</span>
            <div className="text-secondary small d-flex align-items-center gap-2">
              <span className="badge bg-light text-dark rounded-pill px-2">
                {groupedTransactions[date].length} Transaksi
              </span>
            </div>
          </div>
          
          <div className="transaction-items d-flex flex-column gap-2">
            {groupedTransactions[date].map((tx) => (
              <div 
                key={tx.id} 
                className="transaction-item card border-0 mb-1"
                onClick={(e) => onEdit(tx, e as unknown as MouseEvent)}
                style={{ 
                  cursor: 'pointer', 
                  borderRadius: '12px',
                  backgroundColor: 'white'
                }}
              >
                <div className="card-body p-3">
                  <div className="row align-items-center g-3">
                    <div className="col-auto">
                      <div 
                        className="category-icon-wrapper rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                        style={{ 
                          width: '48px', 
                          height: '48px', 
                          backgroundColor: `${tx.category?.color || '#6c757d'}15`,
                          color: tx.category?.color || '#6c757d',
                          border: `1px solid ${tx.category?.color || '#6c757d'}20`
                        }}
                      >
                        <Icon icon={tx.category?.icon || 'category'} size={28} stroke={1.5} />
                      </div>
                    </div>
                    
                    <div className="col text-truncate">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="fw-bold text-dark fs-3 text-truncate">
                          {tx.merchant || (tx.type === 'transfer' ? 'Transfer Dana' : 'Umum')}
                        </span>
                        {tx.input_method !== 'manual' && (
                          <span className="text-muted" title={`Input via ${tx.input_method}`}>
                            <Icon 
                              icon={
                                tx.input_method === 'image' ? 'photo' : 
                                tx.input_method === 'audio' ? 'microphone' : 
                                tx.input_method === 'file' ? 'file-text' : 
                                'pencil'
                              } 
                              size={12} 
                            />
                          </span>
                        )}
                      </div>
                      <div className="d-flex align-items-center flex-wrap gap-2 text-secondary small">
                        <div className="d-flex align-items-center gap-1">
                          <span 
                            className="status-dot rounded-circle" 
                            style={{ 
                              backgroundColor: tx.account?.color || '#eee', 
                              width: '8px', 
                              height: '8px',
                              display: 'inline-block'
                            }}
                          ></span>
                          {tx.account?.name}
                        </div>
                        <span className="opacity-50">•</span>
                        <span>{formatDate(tx.tx_date, 'time')}</span>
                        {tx.tags && tx.tags.length > 0 && (
                          <>
                            <span className="opacity-50">•</span>
                            <div className="d-flex gap-1 overflow-hidden">
                              {tx.tags.slice(0, 2).map(tag => (
                                <span key={tag.id} className="badge bg-light text-muted border-0 fw-normal" style={{ fontSize: '10px' }}>
                                  #{tag.name}
                                </span>
                              ))}
                              {tx.tags.length > 2 && <span className="text-muted" style={{ fontSize: '10px' }}>+{tx.tags.length - 2}</span>}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-auto text-end">
                      <div 
                        className={`fw-bold fs-3 ${
                          tx.type === 'income' ? 'text-success' : 
                          tx.type === 'expense' ? 'text-danger' : 
                          'text-primary'
                        }`}
                      >
                        {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''}
                        {formatCurrency(tx.amount)}
                      </div>
                      {tx.status && (
                        <span 
                          className="badge border-0 rounded-pill mt-1" 
                          style={{ 
                            backgroundColor: `${tx.status.color}15`, 
                            color: tx.status.color,
                            fontSize: '10px',
                            fontWeight: 600
                          }}
                        >
                          {tx.status.name}
                        </span>
                      )}
                    </div>
                    
                    <div className="col-auto d-none d-md-block ms-2">
                      <button 
                        className="btn btn-ghost-danger btn-icon border-0" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(tx.id);
                        }}
                        disabled={deletePendingId === tx.id}
                      >
                        {deletePendingId === tx.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <Icon icon="trash" size={18} stroke={1.5} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <style>{`
        .transaction-group:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};
