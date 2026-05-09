import React from 'react';
import { Icon } from '@/shared/components/ui';

export function CreditTypeCards() {
  return (
    <div className="mb-4">
      <div className="row g-2 g-lg-3">
        {/* Personal Loan */}
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="avatar avatar-sm bg-primary text-white rounded-2 me-3 shadow-sm">
                  <Icon icon="building-bank" size="sm" />
                </div>
                <div>
                  <div className="h4 mb-0 fw-bold">Personal loan</div>
                  <div className="text-secondary small">KTA • 3 tahun tersisa</div>
                </div>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary small">Plafon</span>
                <span className="fw-bold small">Rp 50.000.000</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary small">Sisa</span>
                <span className="fw-bold small">Rp 31.250.000</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary small">Cicilan/bln</span>
                <span className="fw-bold small">Rp 1.400.000</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="text-secondary small">Suku bunga</span>
                <span className="fw-bold small">8,5% p.a.</span>
              </div>
              <div className="progress progress-sm mb-2">
                <div className="progress-bar bg-primary" style={{ width: '37.5%' }}></div>
              </div>
              <div className="text-secondary small">37,5% terlunasi</div>
            </div>
          </div>
        </div>

        {/* Mortgage / KPR */}
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="avatar avatar-sm bg-warning text-white rounded-2 me-3 shadow-sm">
                  <Icon icon="home" size="sm" />
                </div>
                <div>
                  <div className="h4 mb-0 fw-bold">Mortgage / KPR</div>
                  <div className="text-secondary small">Floating • 12 tahun tersisa</div>
                </div>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary small">Nilai properti</span>
                <span className="fw-bold small">Rp 1,2 M</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary small">Sisa pokok</span>
                <span className="fw-bold small">Rp 480 jt</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary small">Cicilan/bln</span>
                <span className="fw-bold small">Rp 4.800.000</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="text-secondary small">Suku bunga</span>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold small">6,75% p.a.</span>
                  <span className="badge bg-warning-lt text-warning border-0 px-2 rounded-1" style={{ fontSize: '10px' }}>Floating</span>
                </div>
              </div>
              <div className="progress progress-sm mb-2">
                <div className="progress-bar bg-warning" style={{ width: '60%' }}></div>
              </div>
              <div className="text-secondary small">60% terlunasi • LTV 40%</div>
            </div>
          </div>
        </div>

        {/* Credit Cards */}
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="avatar avatar-sm bg-azure text-white rounded-2 me-3 shadow-sm">
                  <Icon icon="credit-card" size="sm" />
                </div>
                <div>
                  <div className="h4 mb-0 fw-bold">Credit cards</div>
                  <div className="text-secondary small">2 kartu aktif</div>
                </div>
              </div>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <div className="card border border-light shadow-none bg-transparent h-100">
                    <div className="card-body p-3">
                      <div className="fw-bold small mb-1">Visa Platinum</div>
                      <div className="text-secondary small mb-2" style={{ fontSize: '11px' }}>Rp 3,2 jt / 20 jt</div>
                      <div className="progress progress-sm mb-2">
                        <div className="progress-bar bg-success" style={{ width: '16%' }}></div>
                      </div>
                      <div className="text-secondary small" style={{ fontSize: '11px' }}>16% used</div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card border border-light shadow-none bg-transparent h-100">
                    <div className="card-body p-3">
                      <div className="fw-bold small mb-1">Mastercard Gold</div>
                      <div className="text-secondary small mb-2" style={{ fontSize: '11px' }}>Rp 8,5 jt / 15 jt</div>
                      <div className="progress progress-sm mb-2">
                        <div className="progress-bar bg-warning" style={{ width: '56%' }}></div>
                      </div>
                      <div className="text-secondary small" style={{ fontSize: '11px' }}>56% used</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <span className="badge bg-secondary-lt text-secondary border-0 px-3 py-2 rounded-pill fw-normal">Rewards: 12.450 pts</span>
                <span className="badge bg-secondary-lt text-secondary border-0 px-3 py-2 rounded-pill fw-normal">Due: 20 Mei</span>
              </div>
            </div>
          </div>
        </div>

        {/* Paylater */}
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="avatar avatar-sm bg-green text-white rounded-2 me-3 shadow-sm">
                  <Icon icon="clock-dollar" size="sm" />
                </div>
                <div>
                  <div className="h4 mb-0 fw-bold">Paylater</div>
                  <div className="text-secondary small">2 provider aktif</div>
                </div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-secondary small">GoPay Later</span>
                <span className="fw-bold small">Rp 1,2 jt / 5 jt</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-secondary small">Shopee PayLater</span>
                <span className="fw-bold small">Rp 2,8 jt / 10 jt</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="text-secondary small">Akulaku</span>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold small">Rp 0 / 3 jt</span>
                  <span className="badge bg-success-lt text-success border-0 px-2 rounded-1" style={{ fontSize: '10px' }}>Lunas</span>
                </div>
              </div>
              
              <div className="bg-primary-lt p-3 rounded-2 border-start border-primary border-3">
                <div className="text-secondary small">
                  Total outstanding paylater: <span className="fw-bold text-dark">Rp 4 jt dari Rp 18 jt limit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
