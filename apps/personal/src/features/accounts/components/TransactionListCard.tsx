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
        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom flex-shrink-0">
          <span className="fw-bold" style={{ fontSize: '14px' }}>Transaksi Terbaru</span>
          <a href="#" className="text-primary text-decoration-none" style={{ fontSize: '13px' }}>
            Lihat Semua
          </a>
        </div>

        <div className="d-flex flex-column flex-grow-1">
          {transactions.length === 0 ? (
            <div className="text-center py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex justify-content-center text-secondary mb-3">
                <Icon icon="receipt-off" size={40} stroke={1.5} opacity={0.6} />
              </div>
              <div className="fw-bold text-body mb-1">Transaksi Kosong</div>
              <div className="text-muted small">Belum ada transaksi terbaru.</div>
              <Link to="/" className="btn btn-orange rounded-pill btn-sm mt-3 px-3">
                <Icon icon="plus" size={16} className="me-1" />
                Catat Transaksi
              </Link>
            </div>
          ) : (
            transactions.slice(0, 5).map((tx, i) => {
              const prefix = tx.p ? '+' : '-'
              const color = tx.p ? '#38a169' : '#e53e3e'
              
              return (
                <div 
                  key={i} 
                  className="d-flex justify-content-between align-items-center px-4 py-2"
                  style={{ borderBottom: i < Math.min(transactions.length, 5) - 1 ? '1px solid #fafafa' : undefined }}
                >
                  <div className="flex-grow-1 overflow-hidden me-2">
                    <div className="fw-semibold text-truncate" style={{ fontSize: '14px', color: '#1a202c' }}>
                      {tx.n}
                    </div>
                    <div className="d-flex align-items-center gap-1 flex-wrap mt-1" style={{ fontSize: '11px', color: '#a0aec0' }}>
                      <span className="rounded px-1 fw-semibold" style={{ fontSize: '10px', backgroundColor: tx.color.startsWith('#') ? tx.color + '20' : `var(--tblr-${tx.color}-lt)`, color: tx.color.startsWith('#') ? tx.color : `var(--tblr-${tx.color})` }}>
                        {tx.c}
                      </span>
                      <span>&middot; {tx.d}</span>
                    </div>
                  </div>
                  <div className="fw-bold flex-shrink-0" style={{ color, fontSize: '14px' }}>
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
