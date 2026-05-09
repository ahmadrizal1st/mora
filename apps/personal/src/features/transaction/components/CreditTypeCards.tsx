import React from 'react';
import { Icon } from '@/shared/components/ui';

const creditTypes = [
  {
    title: 'Personal Loan',
    subtitle: 'KTA • 3 tahun tersisa',
    icon: 'building-bank',
    color: 'primary',
    rows: [
      { label: 'Plafon',      value: 'Rp 50.000.000' },
      { label: 'Sisa',        value: 'Rp 31.250.000', cls: 'text-danger' },
      { label: 'Cicilan/bln', value: 'Rp 1.400.000' },
      { label: 'Suku bunga',  value: '8,5% p.a.' },
    ],
    progress: 37.5,
    progressColor: 'primary',
    progressLabel: '37,5% terlunasi',
  },
  {
    title: 'Mortgage / KPR',
    subtitle: 'Floating • 12 tahun tersisa',
    icon: 'home',
    color: 'warning',
    rows: [
      { label: 'Nilai properti', value: 'Rp 1,2 M' },
      { label: 'Sisa pokok',     value: 'Rp 480 jt',  cls: 'text-danger' },
      { label: 'Cicilan/bln',    value: 'Rp 4.800.000' },
      { label: 'Suku bunga',     value: '6,75% p.a.',
        extra: <span className="badge bg-warning-lt text-warning border-0 rounded-1 ms-1" style={{ fontSize: '10px' }}>Floating</span> },
    ],
    progress: 60,
    progressColor: 'warning',
    progressLabel: '60% terlunasi • LTV 40%',
  },
  {
    title: 'Credit Cards',
    subtitle: '2 kartu aktif',
    icon: 'credit-card',
    color: 'azure',
    customBody: (
      <div>
        <div className="row g-2 mb-3">
          {[
            { name: 'Visa Platinum',   usage: 'Rp 3,2 jt / 20 jt', pct: 16, color: 'success' },
            { name: 'Mastercard Gold', usage: 'Rp 8,5 jt / 15 jt', pct: 56, color: 'warning' },
          ].map((cc, i) => (
            <div key={i} className="col-6">
              <div className="card border shadow-none bg-transparent">
                <div className="card-body p-2">
                  <div className="fw-bold small mb-1">{cc.name}</div>
                  <div className="text-muted mb-2" style={{ fontSize: '11px' }}>{cc.usage}</div>
                  <div className="progress progress-sm mb-1">
                    <div className={`progress-bar bg-${cc.color}`} style={{ width: `${cc.pct}%` }} />
                  </div>
                  <div className="text-muted" style={{ fontSize: '10px' }}>{cc.pct}% used</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <span className="badge bg-secondary-lt text-secondary border-0 px-3 py-2 rounded-pill fw-normal">Rewards: 12.450 pts</span>
          <span className="badge bg-secondary-lt text-secondary border-0 px-3 py-2 rounded-pill fw-normal">Due: 20 Mei</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Paylater',
    subtitle: '2 provider aktif',
    icon: 'clock-dollar',
    color: 'green',
    rows: [
      { label: 'GoPay Later',    value: 'Rp 1,2 jt / 5 jt' },
      { label: 'Shopee PayLater', value: 'Rp 2,8 jt / 10 jt' },
      { label: 'Akulaku',        value: 'Rp 0 / 3 jt',
        extra: <span className="badge bg-success-lt text-success border-0 rounded-1 ms-1" style={{ fontSize: '10px' }}>Lunas</span> },
    ],
    infoBox: (
      <div className="alert alert-primary mb-0 mt-3">
        <div className="small">
          Total outstanding: <strong>Rp 4 jt dari Rp 18 jt limit</strong>
        </div>
      </div>
    ),
  },
];

export function CreditTypeCards() {
  return (
    <div className="mb-4">
      <div className="row g-2 g-lg-3">
        {creditTypes.map((ct, idx) => (
          <div key={idx} className="col-12 col-xl-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header">
                <div className="d-flex align-items-center gap-3">
                  <span className={`avatar avatar-sm bg-${ct.color} text-white rounded-2`}>
                    <Icon icon={ct.icon} size={16} />
                  </span>
                  <div>
                    <div className="card-title fw-bold mb-0">{ct.title}</div>
                    <div className="text-muted small">{ct.subtitle}</div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {ct.customBody ? (
                  ct.customBody
                ) : (
                  <>
                    <ul className="list-group list-group-flush mb-3">
                      {(ct.rows ?? []).map((row, i) => (
                        <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                          <span className="text-muted small">{row.label}</span>
                          <span className={`fw-bold small ${row.cls ?? ''}`}>
                            {row.value}{row.extra}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {ct.progress !== undefined && (
                      <>
                        <div className="progress progress-sm mb-1">
                          <div className={`progress-bar bg-${ct.progressColor}`} style={{ width: `${ct.progress}%` }} />
                        </div>
                        <div className="text-muted small">{ct.progressLabel}</div>
                      </>
                    )}
                    {ct.infoBox}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
