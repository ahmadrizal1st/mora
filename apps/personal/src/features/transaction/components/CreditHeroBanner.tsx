import React from 'react';
import { Icon } from '@/shared/components/ui';

export function CreditHeroBanner() {
  return (
    <div className="mb-4">
      <div className="row g-2 g-lg-3">
        {/* Total Limit */}
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-lg-4 d-flex flex-column justify-content-center">
              <div className="subheader mb-1">Total limit</div>
              <div className="h1 fw-bold m-0">Rp 85 jt</div>
              <div className="text-secondary small mt-1">Across 3 active credit lines</div>
            </div>
          </div>
        </div>

        {/* Total Outstanding */}
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-lg-4 d-flex flex-column justify-content-center">
              <div className="subheader mb-1">Total outstanding</div>
              <div className="h1 fw-bold m-0 mb-2">Rp 24 jt</div>
              <div className="progress progress-sm mb-2">
                <div className="progress-bar bg-primary" style={{ width: '28%' }}></div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="text-secondary small">28% util</span>
                <span className="badge bg-success-lt text-success border-0 px-2 rounded-1">Good</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Due */}
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-lg-4 d-flex flex-column justify-content-center">
              <div className="subheader mb-1">Next due</div>
              <div className="h1 fw-bold m-0 mb-2">14 Mei</div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-warning-lt text-warning border-0 px-2 rounded-1">3 hari lagi</span>
                <span className="fw-bold small">Rp 2,1 jt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Score */}
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-lg-4 d-flex flex-column justify-content-center">
              <div className="subheader mb-1">Credit score</div>
              <div className="h1 fw-bold m-0 text-success">742</div>
              <div className="text-secondary small mt-1">Very Good &uarr; +8 bln</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
