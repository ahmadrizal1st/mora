import React from 'react';
import { Icon } from '@/shared/components/ui/Icon';

export function SmartInsightCard() {
  return (
    <div className="card shadow-sm border-0 h-100 bg-orange-lt overflow-hidden" style={{ borderRadius: '16px', border: '1px solid rgba(247, 103, 7, 0.15)' }}>
      <div className="card-body p-4 d-flex flex-column position-relative">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-2">
            <h4 className="fw-bold m-0 text-orange">Smart Insight</h4>
          </div>
          <span className="badge bg-orange text-white rounded-pill px-2" style={{ fontSize: '9px' }}>AI RECOMMENDATION</span>
        </div>
        
        <div className="flex-grow-1">
          <p className="text-body mb-4 fw-medium leading-relaxed" style={{ fontSize: '13px' }}>
            Jika Anda menambah setoran <strong className="text-orange">Rp 500rb/bulan</strong>, target <span className="text-orange fw-bold">DP Rumah</span> bisa tercapai <span className="badge bg-orange-lt text-orange border border-orange-subtle px-2">2 Bulan</span> lebih cepat dari estimasi saat ini.
          </p>
        </div>

        <div className="mt-auto">
          <button className="btn btn-orange w-100 rounded-pill shadow-sm fw-bold d-flex align-items-center justify-content-center gap-2">
            <Icon icon="trending-up" size="xs" />
            <span>Optimalkan Tabungan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
