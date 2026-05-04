import React from 'react';
import { formatCurrency } from '@/shared/utils/currencyUtils';

interface UpcomingBillsCardProps {
  totalMonthly: number;
  paidThisMonth: number;
}

export function UpcomingBillsCard({ totalMonthly, paidThisMonth }: UpcomingBillsCardProps) {
  const percentage = Math.round((paidThisMonth / totalMonthly) * 100);

  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
      <div className="card-body p-4">
        <div className="text-secondary small fw-bold text-uppercase mb-1" style={{ fontSize: '10px' }}>Total Tagihan</div>
        <div className="h2 fw-bold mb-2">{formatCurrency(totalMonthly)}</div>
        
        <div className="progress progress-sm mb-3" style={{ height: '4px', backgroundColor: '#f1f4f9' }}>
          <div 
            className="progress-bar bg-primary" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="text-secondary small" style={{ fontSize: '10px' }}>Sudah Dibayar</div>
            <div className="fw-bold text-success small">{formatCurrency(paidThisMonth)}</div>
          </div>
          <div className="text-end">
            <div className="text-secondary small" style={{ fontSize: '10px' }}>Sisa</div>
            <div className="fw-bold text-dark small">{formatCurrency(totalMonthly - paidThisMonth)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
