import React from 'react';
import { Icon } from '@/shared/components/ui/Icon';

export function SubscriptionCategoryBreakdown() {
  const categories = [
    { name: 'Streaming', amount: 'Rp 450rb', color: 'var(--tblr-primary)', percentage: 45, icon: 'device-tv' },
    { name: 'Productivity', amount: 'Rp 300rb', color: '#2fb344', percentage: 30, icon: 'briefcase' },
    { name: 'Cloud Storage', amount: 'Rp 150rb', color: '#206bc4', percentage: 15, icon: 'cloud' },
    { name: 'Lainnya', amount: 'Rp 100rb', color: '#667382', percentage: 10, icon: 'dots' }
  ];

  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4">
        <div className="row align-items-center g-4">
          <div className="col-md-3 border-end-md pe-md-4">
            <div className="text-secondary small fw-bold text-uppercase mb-2" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>Kategori Utama</div>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="p-2 bg-primary-lt rounded-circle text-primary shadow-sm">
                <Icon icon="device-tv" size="sm" />
              </div>
              <div>
                <h3 className="fw-bold mb-0">Streaming</h3>
                <div className="text-primary fw-bold" style={{ fontSize: '12px' }}>45% Total</div>
              </div>
            </div>
            <p className="small text-secondary mb-0 leading-tight" style={{ fontSize: '11px' }}>
              Pengeluaran terbesar bulan ini dialokasikan untuk layanan hiburan.
            </p>
          </div>
          <div className="col-md-9 ps-md-4">
            <div className="row g-4">
              {categories.map((cat, i) => (
                <div key={i} className="col-sm-6 col-lg-3">
                  <div className="d-flex justify-content-between align-items-end mb-2">
                    <div className="fw-bold text-dark" style={{ fontSize: '11px', textTransform: 'uppercase' }}>{cat.name}</div>
                    <div className="fw-bold text-primary" style={{ fontSize: '11px' }}>{cat.amount}</div>
                  </div>
                  <div className="progress mb-2" style={{ height: '8px', backgroundColor: '#f1f4f9', borderRadius: '10px' }}>
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${cat.percentage}%`, 
                        backgroundColor: cat.color, 
                        borderRadius: '10px',
                        boxShadow: `0 2px 4px ${cat.color}33`
                      }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted" style={{ fontSize: '9px' }}>Proporsi</span>
                    <span className="badge bg-light text-secondary border-0 p-0" style={{ fontSize: '10px' }}>{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
