import React from 'react';
import { Icon } from '@/shared/components/ui/Icon';

export function SubscriptionMetricStrip() {
  const metrics = [
    { 
      label: 'LAYANAN AKTIF', 
      value: '12', 
      icon: 'apps', 
      bgClass: 'bg-blue', 
      detail: 'Dari 3 kategori utama' 
    },
    { 
      label: 'SISA TAGIHAN BULAN INI', 
      value: 'Rp 800rb', 
      icon: 'calendar-event', 
      bgClass: 'bg-orange', 
      detail: 'Sisa 12 hari pembayaran' 
    },
    { 
      label: 'POTENSI HEMAT', 
      value: 'Rp 100rb', 
      icon: 'trending-down', 
      bgClass: 'bg-green', 
      detail: 'Dapat dioptimalkan' 
    },
    { 
      label: 'TRIAL BERAKHIR', 
      value: '2 Layanan', 
      icon: 'hourglass', 
      bgClass: 'bg-red', 
      detail: 'Segera berakhir pekan ini' 
    }
  ];

  return (
    <>
      {metrics.map((m, i) => (
        <div key={i} className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <div className="card-body p-3 p-lg-4">
              
              {/* Header: Icon & Subheader */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <div 
                  className={`avatar avatar-sm ${m.bgClass} text-white`} 
                  style={{ borderRadius: '10px', width: '32px', height: '32px' }}
                >
                  <Icon icon={m.icon as any} size="sm" className="text-white" />
                </div>
                <div 
                  className="subheader text-muted m-0 fw-bold" 
                  style={{ letterSpacing: '0.05em', fontSize: '9px', lineHeight: '1.2' }}
                >
                  {m.label}
                </div>
              </div>

              {/* Value */}
              <div className="h2 fw-bold m-0 mb-1 text-body">
                {m.value}
              </div>

              {/* Detail Footer */}
              <div className="text-muted small" style={{ fontSize: '11px' }}>
                {m.detail}
              </div>

            </div>
          </div>
        </div>
      ))}
    </>
  );
}