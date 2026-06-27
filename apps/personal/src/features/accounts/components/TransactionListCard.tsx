import React from 'react'
import { Icon } from '@/shared/components/ui/Icon'

interface Transaction {
  ico: string
  color: string
  n: string
  c: string
  a: string
  d: string
  p: boolean
}

interface TransactionListCardProps {
  transactions: Transaction[]
}

export function TransactionListCard({ transactions }: TransactionListCardProps) {
  return (
    <div className="card border-0 rounded-4 shadow-sm h-100">
      <div className="card-body p-0">
        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
          <span className="fw-bold" style={{ fontSize: '14px' }}>Transaksi Terbaru</span>
          <a href="#" className="text-primary text-decoration-none" style={{ fontSize: '13px' }}>
            Lihat Semua
          </a>
        </div>

        <div>
          {transactions.length === 0 ? (
            <div className="text-center py-5">
              <div className="empty-icon text-secondary mb-2">
                <Icon icon="receipt-off" size={40} stroke={1.5} opacity={0.6} />
              </div>
              <div className="fw-bold text-body mb-1">Transaksi Kosong</div>
              <div className="text-muted small">Belum ada transaksi terbaru.</div>
            </div>
          ) : (
            transactions.map((tx, i) => {
              const prefix = tx.p ? '+' : '-'
              const color = tx.p ? '#38a169' : '#e53e3e'
              
              return (
                <div 
                  key={i} 
                  className="d-flex justify-content-between align-items-center px-4 py-3"
                  style={{ borderBottom: i < transactions.length - 1 ? '1px solid #fafafa' : undefined }}
                >
                  <div className="flex-grow-1 overflow-hidden me-2">
                    <div className="fw-semibold text-truncate" style={{ fontSize: '14px', color: '#1a202c' }}>
                      {tx.n}
                    </div>
                    <div className="d-flex align-items-center gap-1 flex-wrap mt-1" style={{ fontSize: '11px', color: '#a0aec0' }}>
                      <span className={`rounded px-1 fw-semibold bg-${tx.color}-lt text-${tx.color}`} style={{ fontSize: '10px' }}>
                        {tx.c}
                      </span>
                      <span>&middot; {tx.d}</span>
                    </div>
                  </div>
                  <div className="fw-bold flex-shrink-0" style={{ color, fontSize: '14px' }}>
                    {prefix}{tx.a.replace(/Rp\s?|-/g, '')}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
