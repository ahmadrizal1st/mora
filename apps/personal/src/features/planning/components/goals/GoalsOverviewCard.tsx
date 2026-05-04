import React from 'react';
import { formatCurrency } from '@/shared/utils/currencyUtils';

interface GoalsOverviewCardProps {
  totalSaved: number;
  totalTarget: number;
}

export function GoalsOverviewCard({ totalSaved, totalTarget }: GoalsOverviewCardProps) {
  const percentage = Math.round((totalSaved / totalTarget) * 100);

  return (
    <div className="card border-0 shadow-sm overflow-hidden h-100" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4 d-flex flex-column h-100 position-relative">
        {/* Subtle background element */}
        <div className="position-absolute top-0 end-0 p-4 opacity-5" style={{ transform: 'rotate(-15deg) translate(20%, -20%)' }}>
          <i className="ti ti-chart-pie" style={{ fontSize: '120px' }}></i>
        </div>

        <div className="row align-items-center position-relative mb-4" style={{ zIndex: 1 }}>
          <div className="col">
            <div className="text-secondary small fw-bold mb-1" style={{ letterSpacing: '0.05em' }}>TOTAL DANA DIKUMPULKAN</div>
            <div className="fw-bold fs-1 text-orange d-flex align-items-baseline gap-2">
              {formatCurrency(totalSaved)}
              <span className="badge bg-orange-lt text-orange border-0 fs-5 rounded-pill px-3">
                {percentage}%
              </span>
            </div>
            <p className="text-secondary small mt-3 m-0 fw-medium italic opacity-75">
              "Kamu sudah mencapai <strong>{percentage}%</strong> dari seluruh mimpimu. Terus semangat!"
            </p>
          </div>
          <div className="col-md-5 mt-3 mt-md-0 text-md-end">
            <div className="d-flex justify-content-between mb-2">
              <span className="small fw-bold text-secondary">KEMAJUAN GLOBAL</span>
              <span className="small fw-bold text-orange">{percentage}%</span>
            </div>
            <div className="progress progress-md" style={{ height: '12px', borderRadius: '20px', backgroundColor: '#f1f4f9' }}>
              <div 
                className="progress-bar bg-orange" 
                role="progressbar" 
                style={{ 
                  width: `${percentage}%`, 
                  borderRadius: '20px', 
                  boxShadow: '0 4px 15px rgba(247, 103, 7, 0.3)',
                  transition: 'width 1.5s ease-in-out'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* New Insights Section to fill the space */}
        <div className="mt-auto pt-4 border-top">
          <div className="row g-3">
            <div className="col-6">
              <div className="p-3 bg-light rounded-3 border-0 transition-all hover-bg-light-dark">
                <div className="text-secondary small mb-1 fw-bold" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>SISA TARGET</div>
                <div className="fw-bold text-dark fs-4">{formatCurrency(totalTarget - totalSaved)}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="p-3 bg-light rounded-3 border-0 transition-all hover-bg-light-dark">
                <div className="text-secondary small mb-1 fw-bold" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>RATA-RATA /BULAN</div>
                <div className="fw-bold text-success fs-4">+{formatCurrency(6000000)}</div>
              </div>
            </div>
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between p-3 bg-orange-lt rounded-3 border border-orange-subtle shadow-sm">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 bg-orange text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '32px', height: '32px' }}>
                    <i className="ti ti-calendar-stats" style={{ fontSize: '16px' }}></i>
                  </div>
                  <div>
                    <div className="text-orange small fw-bold" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>ESTIMASI SELESAI</div>
                    <div className="fw-bold text-orange">Maret 2027</div>
                  </div>
                </div>
                <button className="btn btn-orange btn-sm rounded-pill px-3 fw-bold">Detail</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
