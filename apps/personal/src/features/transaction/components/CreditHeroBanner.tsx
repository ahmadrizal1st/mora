import React from 'react';
import { Icon } from '@/shared/components/ui';

export function CreditHeroBanner() {
  const utilPct = 28;
  const scoreVal = 742;

  return (
    <div className="mb-4">
      <div className="row g-2 g-lg-3">

        {/* Total Limit */}
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-lg-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="avatar avatar-sm bg-primary-lt text-primary rounded-2">
                  <Icon icon="credit-card" size={18} />
                </div>
                <div className="subheader text-secondary m-0">Total Limit</div>
              </div>
              <div className="h2 fw-bold m-0 mb-1">Rp 85 jt</div>
              <div className="text-secondary small">3 jalur kredit aktif</div>
            </div>
          </div>
        </div>

        {/* Total Outstanding + Utilization */}
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-lg-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="avatar avatar-sm bg-azure-lt text-azure rounded-2">
                  <Icon icon="chart-pie" size={18} />
                </div>
                <div className="subheader text-secondary m-0">Outstanding</div>
              </div>
              <div className="h2 fw-bold m-0 mb-2">Rp 24 jt</div>
              <div
                className="progress mb-2"
                style={{ height: '6px', borderRadius: '99px', background: 'color-mix(in srgb, var(--tblr-primary), transparent 85%)' }}
              >
                <div
                  className="progress-bar bg-primary"
                  style={{ width: `${utilPct}%`, borderRadius: '99px' }}
                />
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="text-secondary small">{utilPct}% utilisasi</span>
                <span className="badge bg-success-lt text-success border-0 px-2 rounded-1" style={{ fontSize: '10px' }}>Aman</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Due */}
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-lg-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="avatar avatar-sm bg-warning-lt text-warning rounded-2">
                  <Icon icon="calendar-event" size={18} />
                </div>
                <div className="subheader text-secondary m-0">Jatuh Tempo</div>
              </div>
              <div className="h2 fw-bold m-0 mb-2">14 Mei</div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-warning-lt text-warning border-0 px-2 rounded-1" style={{ fontSize: '10px' }}>3 hari lagi</span>
                <span className="fw-bold small">Rp 1,4 jt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Score */}
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-lg-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="avatar avatar-sm bg-success-lt text-success rounded-2">
                  <Icon icon="award" size={18} />
                </div>
                <div className="subheader text-secondary m-0">Credit Score</div>
              </div>
              <div className="d-flex align-items-baseline gap-2 mb-2">
                <div className="h2 fw-bold m-0 text-success">{scoreVal}</div>
                <span className="small text-success fw-bold">↑ +8</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success-lt text-success border-0 px-2 rounded-1" style={{ fontSize: '10px' }}>Very Good</span>
                <span className="text-secondary small">6 bln</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
