import React from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { Link } from '@tanstack/react-router'

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
    <div className="card border-0 rounded-4 shadow-sm flex-grow-1 h-100">
      <div className="card-body p-0 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom flex-shrink-0">
          <span className="fw-bold" style={{ fontSize: '13px' }}>Transaksi Terbaru</span>
          <a href="#" className="text-primary text-decoration-none" style={{ fontSize: '12px' }}>
            Lihat Semua
          </a>
        </div>

        <div className="d-flex flex-column flex-grow-1">
          {transactions.length === 0 ? (
            <div className="text-center py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex justify-content-center text-secondary mb-3">
                <Icon icon="receipt-off" size={40} stroke={1.5} style={{ opacity: 0.6 }} />
              </div>
              <div className="fw-bold text-body mb-1">Transaksi Kosong</div>
              <div className="text-muted small">Belum ada transaksi terbaru.</div>
            </div>
          ) : (
            transactions.slice(0, 5).map((tx, i) => {
              const color = tx.p ? '#38a169' : '#e53e3e'
              
              return (
                <div 
                  key={i} 
                  className="d-flex justify-content-between align-items-center px-3 py-2"
                  style={{ borderBottom: i < Math.min(transactions.length, 5) - 1 ? '1px solid #fafafa' : undefined }}
                >
                  <div className="flex-grow-1 overflow-hidden me-2">
                    <div className="fw-semibold text-truncate text-body" style={{ fontSize: '13.5px', marginBottom: '2px' }}>
                      {tx.n}
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: '11px', color: 'var(--tblr-gray-500)' }}>
                      <span className="rounded-pill px-2 fw-bold d-inline-flex align-items-center justify-content-center" style={{ backgroundColor: tx.color.startsWith('#') ? tx.color + '15' : `var(--tblr-${tx.color}-lt)`, color: tx.color.startsWith('#') ? tx.color : `var(--tblr-${tx.color})`, fontSize: '9px', height: '18px' }}>
                        {tx.c}
                      </span>
                      <span>&middot;</span>
                      <span>{tx.d}</span>
                    </div>
                  </div>
                  <div className="fw-bold flex-shrink-0" style={{ color, fontSize: '13.5px' }}>
                    {tx.p ? '+ ' : '- '}Rp {tx.a.replace(/[^0-9.,]/g, '')}
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
