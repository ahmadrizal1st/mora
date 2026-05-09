import React from 'react';
import { Icon } from '@/shared/components/ui/Icon';

interface Bill {
  ico: string;
  name: string;
  due: string;
  amt: string;
}

interface UpcomingBillsCardProps {
  bills: Bill[];
}

export function UpcomingBillsCard({ bills }: UpcomingBillsCardProps) {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-3">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <span className="text-secondary text-uppercase fw-semibold fs-5">Tagihan Mendatang</span>
          <a href="#" className="text-primary small fw-medium">Semua ›</a>
        </div>
        
        <div className="list-group list-group-flush">
          {bills.map((b, i) => (
            <div key={i} className="list-group-item px-0 border-0 py-2">
              <div className="row align-items-center g-3">
                <div className="col-auto">
                  <div className="avatar avatar-sm rounded bg-body-tertiary text-secondary">
                    <span className="fs-3">{b.ico}</span>
                  </div>
                </div>
                <div className="col">
                  <div className="text-body fw-bold text-truncate" style={{ fontSize: '0.85rem' }}>{b.name}</div>
                  <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>{b.due}</div>
                </div>
                <div className="col-auto text-end">
                  <div className="fw-bold font-monospace text-body" style={{ fontSize: '0.85rem' }}>{b.amt}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
