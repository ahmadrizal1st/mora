import React, { useMemo } from 'react';
import { Icon } from '@/shared/components/ui';
import { CreditTypeCards } from '../CreditTypeCards';
import { DebtPayoffPlannerPreview } from '../DebtPayoffPlannerPreview';
import { useCreditSummary } from '../../hooks/useCreditSummary';
import { useCredits } from '../../hooks/useCredits';

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

export function CreditTabOverview() {
  const { totalOutstanding, totalMonthlyBurden, activeCount, utilizationPct, isLoading } = useCreditSummary();
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

  if (isLoading) {
    return <div className="py-5 text-center text-muted">Memuat ringkasan kredit...</div>;
  }

  const visibleAlerts = isExpanded ? quickAlerts : quickAlerts.slice(0, 1);

  return (
    <>
      <div className="row g-2 g-lg-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="subheader text-secondary mb-1">Total Hutang</div>
              <div className="h3 fw-bold m-0 text-danger">{fmt(totalOutstanding)}</div>
              <div className="text-secondary small mt-1">semua jalur kredit</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="subheader text-secondary mb-1">Beban Bulanan</div>
              <div className="h3 fw-bold m-0">{fmt(totalMonthlyBurden)}</div>
              <div className="text-secondary small mt-1">total cicilan/bulan</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="subheader text-secondary mb-1">Jalur Aktif</div>
              <div className="h3 fw-bold m-0">{activeCount}</div>
              <div className="text-secondary small mt-1">kartu, pinjaman, paylater</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="subheader text-secondary mb-1">Utilisasi Global</div>
              <div className={`h3 fw-bold m-0 ${utilizationPct > 40 ? 'text-warning' : 'text-success'}`}>{utilizationPct.toFixed(0)}%</div>
              <div className="text-secondary small mt-1">
                <span className={`badge bg-${utilizationPct > 40 ? 'warning' : 'success'}-lt text-${utilizationPct > 40 ? 'warning' : 'success'} border-0 px-2 rounded-1`} style={{ fontSize: '10px' }}>
                  {utilizationPct > 40 ? 'Perlu Pantau' : 'Sehat'}
                </span>
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
