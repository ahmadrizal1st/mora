import React, { useMemo } from 'react';
import { Icon } from '@/shared/components/ui';
import { useCredits } from '../hooks/useCredits';

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

export function CreditTypeCards() {
  const { data: credits = [], isLoading } = useCredits();

  const creditTypes = useMemo(() => {
    // KTA
    const ktaLoans = credits.filter(c => c.credit?.credit_type === 'kta');
    const ktaLimit = ktaLoans.reduce((s, c) => s + (c.credit?.limit || 0), 0);
    const ktaUsed = ktaLoans.reduce((s, c) => s + (c.credit?.total_amount || 0), 0);
    const ktaPaid = Math.max(0, ktaLimit - ktaUsed);
    const ktaPct = ktaLimit > 0 ? (ktaPaid / ktaLimit) * 100 : 0;

    // KPR
    const kprLoans = credits.filter(c => c.credit?.credit_type === 'kpr');
    const kprLimit = kprLoans.reduce((s, c) => s + (c.credit?.limit || 0), 0);
    const kprUsed = kprLoans.reduce((s, c) => s + (c.credit?.total_amount || 0), 0);
    const kprPaid = Math.max(0, kprLimit - kprUsed);
    const kprPct = kprLimit > 0 ? (kprPaid / kprLimit) * 100 : 0;

    // CC
    const ccAccounts = credits.filter(c => c.credit?.credit_type === 'credit_card');
    const ccLimit = ccAccounts.reduce((s, c) => s + (c.credit?.limit || 0), 0);
    const ccUsed = ccAccounts.reduce((s, c) => s + (c.credit?.total_amount || 0), 0);
    const ccPct = ccLimit > 0 ? (ccUsed / ccLimit) * 100 : 0;

    // Paylater
    const plAccounts = credits.filter(c => c.credit?.credit_type === 'paylater');
    const plLimit = plAccounts.reduce((s, c) => s + (c.credit?.limit || 0), 0);
    const plUsed = plAccounts.reduce((s, c) => s + (c.credit?.total_amount || 0), 0);
    const plPct = plLimit > 0 ? (plUsed / plLimit) * 100 : 0;

    return [
      {
        id: 'kta',
        title: 'Personal Loan',
        subtitle: `${ktaLoans.length} pinjaman aktif`,
        icon: 'building-bank',
        color: 'primary',
        rows: [
          { label: 'Total Plafon',      value: fmt(ktaLimit) },
          { label: 'Sisa Hutang',       value: fmt(ktaUsed), cls: 'text-danger' },
          { label: 'Sudah Dibayar',     value: fmt(ktaPaid), cls: 'text-success' },
        ],
        progress: ktaPct,
        progressColor: 'primary',
        progressLabel: `${ktaPct.toFixed(1)}% terlunasi`,
        visible: ktaLoans.length > 0
      },
      {
        id: 'kpr',
        title: 'Mortgage / KPR',
        subtitle: `${kprLoans.length} properti`,
        icon: 'home',
        color: 'warning',
        rows: [
          { label: 'Total Plafon',      value: fmt(kprLimit) },
          { label: 'Sisa Hutang',       value: fmt(kprUsed), cls: 'text-danger' },
          { label: 'Sudah Dibayar',     value: fmt(kprPaid), cls: 'text-success' },
        ],
        progress: kprPct,
        progressColor: 'warning',
        progressLabel: `${kprPct.toFixed(1)}% terlunasi`,
        visible: kprLoans.length > 0
      },
      {
        id: 'cc',
        title: 'Credit Cards',
        subtitle: `${ccAccounts.length} kartu aktif`,
        icon: 'credit-card',
        color: 'azure',
        customBody: (
          <div>
            <div className="row g-2 mb-3">
              {ccAccounts.map((c, i) => {
                const pct = c.credit!.limit > 0 ? Math.round((c.credit!.total_amount / c.credit!.limit) * 100) : 0;
                return (
                  <div key={i} className="col-6">
                    <div className="card border shadow-none bg-transparent">
                      <div className="card-body p-2">
                        <div className="fw-bold small mb-1">{c.name}</div>
                        <div className="text-muted mb-2" style={{ fontSize: '11px' }}>{fmt(c.credit!.total_amount)} / {fmt(c.credit!.limit)}</div>
                        <div className="progress progress-sm mb-1">
                          <div className={`progress-bar bg-${pct > 60 ? 'danger' : pct > 30 ? 'warning' : 'success'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <div className="text-muted" style={{ fontSize: '10px' }}>{pct}% used</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ),
        visible: ccAccounts.length > 0
      },
      {
        id: 'paylater',
        title: 'Paylater',
        subtitle: `${plAccounts.length} provider aktif`,
        icon: 'clock-dollar',
        color: 'green',
        rows: [
          { label: 'Total Limit',  value: fmt(plLimit) },
          { label: 'Total Dipakai', value: fmt(plUsed), cls: 'text-danger' },
          { label: 'Sisa Limit',   value: fmt(plLimit - plUsed), cls: 'text-success' },
        ],
        infoBox: (
          <div className="alert alert-primary mb-0 mt-3 p-2">
            <div className="small">
              Global utilization: <strong>{plPct.toFixed(1)}%</strong>
            </div>
          </div>
        ),
        visible: plAccounts.length > 0
      },
    ].filter(ct => ct.visible);
  }, [credits]);

  if (isLoading) return null;
  
  if (creditTypes.length === 0) {
    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body text-center py-5">
           <Icon icon="info-circle" size={32} className="text-muted opacity-50 mb-2" />
           <p className="text-muted mb-0">Belum ada rincian tipe kredit. Tambahkan profil kredit untuk melihat ringkasan di sini.</p>
        </div>
      </div>
    );
  }

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
                            {row.value}
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
