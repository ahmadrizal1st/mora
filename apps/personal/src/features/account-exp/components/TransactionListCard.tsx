import React from 'react';
import { Icon } from '@/shared/components/ui/Icon';

interface Transaction {
  ico: string;
  bg: string;
  n: string;
  c: string;
  a: string;
  d: string;
  p: boolean;
}

interface TransactionListCardProps {
  transactions: Transaction[];
}

export function TransactionListCard({ transactions }: TransactionListCardProps) {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-3">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <span className="text-secondary text-uppercase fw-semibold fs-5">Transaksi Terbaru</span>
          <a href="#" className="text-primary small fw-medium">Semua ›</a>
        </div>
        
        <div className="list-group list-group-flush list-group-hoverable">
          {transactions.map((tx, i) => (
            <div key={i} className="list-group-item px-0 border-0 py-2">
              <div className="row align-items-center g-3">
                <div className="col-auto">
                  <div className="avatar avatar-sm rounded" style={{ backgroundColor: tx.bg }}>
                    <span className="fs-3">{tx.ico}</span>
                  </div>
                </div>
                <div className="col">
                  <div className="text-dark fw-bold text-truncate" style={{ fontSize: '0.85rem' }}>{tx.n}</div>
                  <div className="text-secondary small">{tx.c}</div>
                </div>
                <div className="col-auto text-end">
                  <div className={`fw-bold font-monospace ${tx.p ? 'text-success' : 'text-dark'}`} style={{ fontSize: '0.85rem' }}>
                    {tx.p ? '+' : ''}{tx.a}
                  </div>
                  <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>{tx.d}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
