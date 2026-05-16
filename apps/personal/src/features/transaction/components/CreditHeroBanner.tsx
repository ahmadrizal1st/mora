import { Icon } from '@/shared/components/ui';
import { useCreditSummary } from '../hooks/useCreditSummary';

const shortFmt = (n: number) => {
  if (n >= 1_000_000_000) return 'Rp ' + (n / 1_000_000_000).toFixed(1) + ' M';
  if (n >= 1_000_000) return 'Rp ' + (n / 1_000_000).toFixed(0) + ' jt';
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(n);
};

export function CreditHeroBanner() {
  const { 
    totalLimit, 
    totalOutstanding, 
    utilizationPct, 
    nextDue, 
    nextDueAmount,
    creditScore,
    scoreTrend,
    activeCount,
    isLoading 
  } = useCreditSummary();

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="row g-2 g-lg-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100 placeholder-glow">
                <div className="card-body p-3 p-lg-4">
                  <div className="placeholder col-6 mb-3"></div>
                  <div className="placeholder col-10 mb-1"></div>
                  <div className="placeholder col-8"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Safe date handling to avoid TS 'never' issues
  const dueDate = nextDue as (Date | null);
  const formattedDate = dueDate instanceof Date ? dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-';
  const daysRemaining = dueDate instanceof Date ? Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  const utilColor = utilizationPct > 70 ? 'danger' : utilizationPct > 40 ? 'warning' : 'success';

  return (
    <div className="mb-4">
      <div className="row g-2 g-lg-3">
        
        {/* Total Limit */}
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="avatar avatar-sm bg-red text-white" style={{ borderRadius: '12px' }}>
                  <Icon icon="credit-card" size={16} />
                </div>
                <div className="subheader text-muted m-0" style={{ letterSpacing: '0.05em', fontSize: '10px' }}>TOTAL LIMIT</div>
              </div>
              <div className="h1 fw-bold m-0 mb-1">{shortFmt(totalLimit)}</div>
              <div className="text-muted small">{activeCount} jalur kredit aktif</div>
            </div>
          </div>
        </div>

        {/* Total Outstanding */}
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="avatar avatar-sm bg-azure text-white" style={{ borderRadius: '12px' }}>
                  <Icon icon="chart-pie" size={16} />
                </div>
                <div className="subheader text-muted m-0" style={{ letterSpacing: '0.05em', fontSize: '10px' }}>OUTSTANDING</div>
              </div>
              <div className="h1 fw-bold m-0 mb-1 text-danger">{shortFmt(totalOutstanding)}</div>
              <div className="d-flex align-items-center gap-2">
                <span className={`badge bg-${utilColor}-lt text-${utilColor} border-0 px-2 rounded-pill`} style={{ fontSize: '10px' }}>
                  {utilizationPct.toFixed(0)}% Utilisasi
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Due */}
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="avatar avatar-sm bg-orange text-white" style={{ borderRadius: '12px' }}>
                  <Icon icon="calendar-event" size={16} />
                </div>
                <div className="subheader text-muted m-0" style={{ letterSpacing: '0.05em', fontSize: '10px' }}>JATUH TEMPO</div>
              </div>
              <div className="h1 fw-bold m-0 mb-1 text-warning">{formattedDate}</div>
              <div className="d-flex align-items-center justify-content-between">
                {dueDate instanceof Date ? (
                  <>
                    <span className="text-muted" style={{ fontSize: '11px' }}>Sisa {daysRemaining} hari</span>
                    <span className="fw-bold text-dark" style={{ fontSize: '12px' }}>{shortFmt(nextDueAmount)}</span>
                  </>
                ) : (
                  <span className="text-muted small">Tidak ada tagihan</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Credit Score */}
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3 p-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="avatar avatar-sm bg-blue text-white" style={{ borderRadius: '12px' }}>
                  <Icon icon="award" size={16} />
                </div>
                <div className="subheader text-muted m-0" style={{ letterSpacing: '0.05em', fontSize: '10px' }}>CREDIT SCORE</div>
              </div>
              <div className="d-flex align-items-baseline gap-2 mb-1">
                <div className="h1 fw-bold m-0 text-success">{creditScore}</div>
                <span className="small text-success fw-bold">↑ +{scoreTrend}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span className="badge bg-blue-lt text-blue border-0 px-2 rounded-pill" style={{ fontSize: '10px' }}>Very Good</span>
                <span className="text-muted" style={{ fontSize: '11px' }}>SLIK/OJK</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
