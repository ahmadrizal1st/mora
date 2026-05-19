import React, { useMemo } from 'react';
import { Icon } from '@/shared/components/ui';
import { CreditTypeCards } from '../CreditTypeCards';
import { DebtPayoffPlannerPreview } from '../DebtPayoffPlannerPreview';
import { useCreditSummary } from '../../hooks/useCreditSummary';
import { useCredits } from '../../hooks/useCredits';

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

export function CreditTabOverview() {
  const { totalOutstanding, totalMonthlyBurden, activeCount, utilizationPct, creditScore, scoreTrend, isLoading } = useCreditSummary();
  const { data: credits = [] } = useCredits();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const quickAlerts = useMemo(() => {
    const alerts: any[] = [];
    credits.forEach(acc => {
      const credit = acc.credit;
      if (!credit) return;
      
      const dueDate = credit.due_date ? new Date(credit.due_date) : null;
      const now = new Date();
      if (dueDate && dueDate >= now) {
         const diff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
         if (diff <= 7) {
           alerts.push({
             icon: 'alert-triangle',
             color: 'danger',
             text: `${acc.name} jatuh tempo ${dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} — ${diff} hari lagi`,
             action: 'Bayar Sekarang'
           });
         }
      }
      
      const utilization = (credit.limit > 0) ? (credit.total_amount / credit.limit) * 100 : 0;
      if (utilization > 50) {
        alerts.push({
          icon: 'info-circle',
          color: 'warning',
          text: `${acc.name} utilisasi ${utilization.toFixed(0)}% — di atas batas aman`,
          action: 'Lihat Detail'
        });
      }
    });
    
    if (alerts.length === 0 && !isLoading) {
       alerts.push({ icon: 'check', color: 'success', text: 'Semua lini kredit dalam kondisi aman', action: null });
    }
    
    return alerts;
  }, [credits, isLoading]);

  const scoreColor = creditScore >= 740 ? 'var(--tblr-success)' : creditScore >= 670 ? 'var(--tblr-primary)' : 'var(--tblr-warning)';
  const scoreLabel = creditScore >= 740 ? 'Sangat Baik' : creditScore >= 670 ? 'Baik' : 'Perlu Pantau';

  if (isLoading) {
    return <div className="py-5 text-center text-muted">Memuat ringkasan kredit...</div>;
  }

  const visibleAlerts = isExpanded ? quickAlerts : quickAlerts.slice(0, 1);

  return (
    <>
      <div className="row g-3 mb-4">
        {/* Left: Credit Score Widget */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '16px' }}>
            <div className="card-body p-3 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="subheader text-secondary" style={{ letterSpacing: '0.05em', fontSize: '9px', fontWeight: 600 }}>CREDIT SCORE</div>
                  <span className={`badge bg-${scoreColor === 'var(--tblr-success)' ? 'success' : scoreColor === 'var(--tblr-primary)' ? 'primary' : 'warning'} text-white border-0 px-2 py-1 rounded-pill fw-bold shadow-sm`} style={{ fontSize: '9px', letterSpacing: '0.3px' }}>
                    {scoreLabel.toUpperCase()}
                  </span>
                </div>
                
                <div className="d-flex align-items-center gap-3">
                  <div className="h1 fw-black m-0 lh-1" style={{ fontSize: '42px', color: scoreColor }}>{creditScore}</div>
                  <div className="d-flex flex-column">
                    <div className="text-success small fw-bold d-flex align-items-center" style={{ fontSize: '13px' }}>
                      <Icon icon="trending-up" size={14} className="me-1" />
                      +{scoreTrend}
                    </div>
                    <div className="text-muted" style={{ fontSize: '9px' }}>vs bulan lalu</div>
                  </div>
                </div>
              </div>

              {/* Added Key Factors to fill space */}
              <div className="my-2 py-2 border-top border-bottom border-dashed border-secondary-subtle">
                <div className="row g-2">
                  <div className="col-6">
                    <div className="d-flex align-items-center gap-2">
                      <Icon icon="check" size={12} className="text-success" />
                      <div style={{ fontSize: '10px' }}>
                        <div className="text-muted text-uppercase fw-bold" style={{ fontSize: '8px' }}>Pembayaran</div>
                        <div className="fw-bold text-dark">Lancar</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center gap-2">
                      <Icon icon="chart-pie" size={12} className="text-primary" />
                      <div style={{ fontSize: '10px' }}>
                        <div className="text-muted text-uppercase fw-bold" style={{ fontSize: '8px' }}>Utilisasi</div>
                        <div className="fw-bold text-dark">{utilizationPct.toFixed(0)}% Sehat</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-0">
                <div className="progress progress-sm mb-1" style={{ height: '4px', background: 'var(--tblr-border-color-light)', borderRadius: '10px' }}>
                  <div className="progress-bar" style={{ width: `${(creditScore / 850) * 100}%`, backgroundColor: scoreColor }} />
                </div>
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: '9px', fontWeight: 600 }}>
                  <span>300</span>
                  <span className="text-uppercase" style={{ letterSpacing: '0.5px', opacity: 0.6 }}>Credit Health Index</span>
                  <span>850</span>
                </div>
              </div>
            </div>
            <div className="card-footer bg-body-tertiary border-0 py-2 px-3">
              <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '10px' }}>
                <Icon icon="shield-check" size={12} className="text-success" />
                Diverifikasi SLIK/OJK • Mei 2026
              </div>
            </div>
          </div>
        </div>

        {/* Right: Key Metrics Grid */}
        <div className="col-12 col-lg-8">
          <div className="row g-2 h-100">
            <div className="col-6 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="avatar avatar-xs bg-red text-white rounded-2" style={{ width: '22px', height: '22px' }}>
                      <Icon icon="wallet" size={11} />
                    </span>
                    <div className="subheader text-secondary m-0" style={{ fontSize: '9px', fontWeight: 600 }}>TOTAL HUTANG</div>
                  </div>
                  <div className="h2 fw-black m-0 text-danger" style={{ fontSize: '24px' }}>{fmt(totalOutstanding).replace('Rp ', '')}</div>
                  <div className="text-muted small" style={{ fontSize: '10px' }}>Sisa saldo aktif</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="avatar avatar-xs bg-azure text-white rounded-2" style={{ width: '22px', height: '22px' }}>
                      <Icon icon="calendar-dollar" size={11} />
                    </span>
                    <div className="subheader text-secondary m-0" style={{ fontSize: '9px', fontWeight: 600 }}>BEBAN BULANAN</div>
                  </div>
                  <div className="h2 fw-black m-0" style={{ fontSize: '24px' }}>{fmt(totalMonthlyBurden).replace('Rp ', '')}</div>
                  <div className="text-muted small" style={{ fontSize: '10px' }}>Total cicilan/bln</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="avatar avatar-xs bg-green text-white rounded-2" style={{ width: '22px', height: '22px' }}>
                      <Icon icon="chart-bar" size={11} />
                    </span>
                    <div className="subheader text-secondary m-0" style={{ fontSize: '9px', fontWeight: 600 }}>UTILISASI GLOBAL</div>
                  </div>
                  <div className={`h2 fw-black m-0 ${utilizationPct > 40 ? 'text-warning' : 'text-success'}`} style={{ fontSize: '24px' }}>{utilizationPct.toFixed(0)}%</div>
                  <div className="text-muted small" style={{ fontSize: '10px' }}>Kapasitas terpakai</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="avatar avatar-xs bg-purple text-white rounded-2" style={{ width: '22px', height: '22px' }}>
                      <Icon icon="building-bank" size={11} />
                    </span>
                    <div className="subheader text-secondary m-0" style={{ fontSize: '9px', fontWeight: 600 }}>JALUR AKTIF</div>
                  </div>
                  <div className="h2 fw-black m-0" style={{ fontSize: '24px' }}>{activeCount}</div>
                  <div className="text-muted small" style={{ fontSize: '10px' }}>Layanan berjalan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Alerts */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header border-0 d-flex justify-content-between align-items-center">
          <h3 className="card-title fw-bold">Notifikasi & Peringatan</h3>
          <div className="card-actions d-flex align-items-center gap-2">
            <span className="badge bg-blue-lt text-blue border-0">{quickAlerts.length} item</span>
            {quickAlerts.length > 1 && (
              <button 
                className="btn btn-link btn-sm text-decoration-none p-0 fw-bold"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Sembunyikan' : 'Lihat Semua'}
              </button>
            )}
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="d-flex flex-column gap-2">
            {visibleAlerts.map((alert, i) => (
              <div
                key={i}
                className={`d-flex align-items-center gap-3 py-2 px-3 rounded-2 bg-${alert.color}-lt`}
              >
                <div className={`avatar avatar-xs bg-${alert.color}-lt text-${alert.color} rounded-circle flex-shrink-0`}
                  style={{ border: '1px solid currentColor' }}>
                  <Icon icon={alert.icon} size={12} />
                </div>
                <div className="flex-fill small fw-medium">{alert.text}</div>
                {alert.action && (
                  <button className={`btn btn-sm btn-${alert.color} px-3 flex-shrink-0 fw-bold rounded-pill`} style={{ fontSize: '10px' }}>
                    {alert.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Credit Type Cards */}
      <CreditTypeCards />

      {/* Debt Payoff Planner */}
      <DebtPayoffPlannerPreview />
    </>
  );
}
