import React from 'react';
import { formatCurrency } from '@/shared/utils/currencyUtils';

interface GoalsOverviewCardProps {
  totalSaved: number;
  totalTarget: number;
}

export function GoalsOverviewCard({ totalSaved, totalTarget }: GoalsOverviewCardProps) {
  const percentage = Math.round((totalSaved / totalTarget) * 100);

  return (
    <div className="card border-0 shadow-sm mb-4 overflow-hidden" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4 position-relative">
        <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
          <div className="col">
            <div className="text-secondary small fw-medium mb-1">TOTAL DANA DIKUMPULKAN</div>
            <div className="fw-bold fs-1 text-primary">{formatCurrency(totalSaved)}</div>
            <p className="text-secondary small mt-2 m-0">
              "Kamu sudah mencapai <strong>{percentage}%</strong> dari seluruh mimpimu. Terus semangat!"
            </p>
          </div>
          <div className="col-md-5 mt-3 mt-md-0">
            <div className="d-flex justify-content-between mb-2">
              <span className="small fw-bold">PROGRESS KESELURUHAN</span>
              <span className="small fw-bold">{percentage}%</span>
            </div>
            <div className="progress progress-md" style={{ height: '12px', borderRadius: '20px', backgroundColor: '#f1f4f9' }}>
              <div 
                className="progress-bar bg-primary" 
                role="progressbar" 
                style={{ width: `${percentage}%`, borderRadius: '20px', boxShadow: '0 4px 10px rgba(124,111,255,0.3)' }}
              ></div>
            </div>
          </div>
        </div>
        {/* Decorative background element */}
        <div 
          className="position-absolute" 
          style={{ 
            top: '-20px', 
            right: '-20px', 
            width: '150px', 
            height: '150px', 
            background: 'radial-gradient(circle, rgba(124,111,255,0.1) 0%, transparent 70%)',
            zIndex: 0
          }}
        ></div>
      </div>
    </div>
  );
}
