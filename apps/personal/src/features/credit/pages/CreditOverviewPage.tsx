import React, { useMemo } from 'react';
import { Icon, Chart } from '@/shared/components/ui';
import { CreditTypeCards } from '../components/CreditTypeCards';
import { CreditScoreGauge } from '../components/CreditScoreGauge';
import { DebtPayoffPlannerPreview } from '../components/DebtPayoffPlannerPreview';
import { useCreditSummary } from '../hooks/useCreditSummary';
import { useCredits } from '../hooks/useCredits';

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

export function CreditOverviewPage() {
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
        {/* Left: Credit Score Widget (Premium Redesign) */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '16px', background: 'linear-gradient(180deg, var(--tblr-bg-surface) 0%, rgba(var(--tblr-primary-rgb), 0.03) 100%)' }}>
            <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center text-center position-relative">
              <div className="subheader text-secondary mb-2" style={{ letterSpacing: '0.1em', fontSize: '10px', fontWeight: 700 }}>CREDIT SCORE</div>
              
              <div className="position-relative w-100 d-flex justify-content-center" style={{ marginTop: '0px', marginBottom: '-10px' }}>
                <CreditScoreGauge score={550} />
              </div>

              {/* Status Badge */}
              <span className={`badge bg-${scoreColor === 'var(--tblr-success)' ? 'success' : scoreColor === 'var(--tblr-primary)' ? 'primary' : 'warning'}-lt text-${scoreColor === 'var(--tblr-success)' ? 'success' : scoreColor === 'var(--tblr-primary)' ? 'primary' : 'warning'} border-0 px-3 py-2 rounded-pill fw-bold shadow-sm mb-4 z-1`} style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                {scoreLabel.toUpperCase()}
              </span>

              {/* Key Factors */}
              <div className="w-100 mt-auto bg-white rounded-3 shadow-sm border p-3 z-1" style={{ borderColor: 'var(--tblr-border-color-light)' }}>
                <div className="row g-2">
                  <div className="col-6 border-end" style={{ borderColor: 'var(--tblr-border-color-light)' }}>
                    <div className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>Pembayaran</div>
                    <div className="d-flex align-items-center justify-content-center gap-1">
                      <Icon icon="circle-check" size={14} className="text-success" />
                      <span className="fw-bold text-dark" style={{ fontSize: '12px' }}>Lancar</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>Utilisasi</div>
                    <div className="d-flex align-items-center justify-content-center gap-1">
                      <Icon icon="chart-pie" size={14} className="text-primary" />
                      <span className="fw-bold text-dark" style={{ fontSize: '12px' }}>{utilizationPct.toFixed(0)}% Sehat</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-footer bg-transparent border-0 pb-3 pt-0 d-flex justify-content-center">
              <div className="d-flex align-items-center gap-2 text-muted fw-medium" style={{ fontSize: '10px' }}>
                <Icon icon="shield-check" size={14} className="text-success" />
                Diverifikasi SLIK/OJK • {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
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
      <div className="d-none d-lg-block">
        <DebtPayoffPlannerPreview />
      </div>
    </>
  );
}
