import React from 'react';
import { Icon } from '@/shared/components/ui/Icon';

export function TrialTrackerCard() {
  const trials = [
    { 
      id: 1, 
      name: 'YouTube Premium', 
      daysLeft: 2, 
      price: 'Rp 59.000', 
      logo: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' 
    },
    { 
      id: 2, 
      name: 'Canva Pro', 
      daysLeft: 5, 
      price: 'Rp 95.000', 
      logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968906.png' 
    }
  ];

  return (
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
      <div className="card-header border-0 bg-transparent pt-4 px-4 pb-0">
        <h3 className="card-title fw-bold m-0 d-flex align-items-center gap-2">
          <Icon icon="hourglass-low" size="sm" className="text-primary" />
          Trial Tracker
          <span className="badge bg-primary-lt text-primary border-0 ms-auto rounded-pill px-2 py-1" style={{ fontSize: '10px' }}>
            {trials.length} Aktif
          </span>
        </h3>
      </div>
      <div className="card-body p-4 d-flex flex-column h-100">
        <div className="vstack gap-3 flex-grow-1">
          {trials.map(trial => (
            <div key={trial.id} className="p-3 bg-light rounded-3 transition-all hover-shadow-sm border border-transparent hover-border-primary-lt">
              <div className="d-flex align-items-start gap-3">
                <div className="bg-white p-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', overflow: 'hidden' }}>
                  <img 
                    src={trial.logo} 
                    alt="" 
                    style={{ width: '26px', height: '26px', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{trial.name}</div>
                      <div className="text-secondary" style={{ fontSize: '11px' }}>Billed {trial.price}</div>
                    </div>
                    <div className="text-end">
                      <div className={`fw-bold ${trial.daysLeft <= 2 ? 'text-danger' : 'text-primary'}`} style={{ fontSize: '12px' }}>
                        {trial.daysLeft} Hari lagi
                      </div>
                      <div className="text-secondary" style={{ fontSize: '10px' }}>Sisa Waktu</div>
                    </div>
                  </div>
                  <div className="mt-2 d-flex justify-content-end">
                    <button className="btn btn-ghost-danger btn-sm p-0 fw-bold border-0" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Batalkan Trial
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-2 text-center">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-2 bg-primary-lt rounded-pill">
            <Icon icon="bell-ringing" size="xs" className="text-primary" />
            <span className="small text-primary fw-medium" style={{ fontSize: '11px' }}>
              Pengingat aktif 24 jam sebelum jatuh tempo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
