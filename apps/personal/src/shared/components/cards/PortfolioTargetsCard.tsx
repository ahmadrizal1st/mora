import { formatCurrency } from '@/shared/utils/currencyUtils';

interface PortfolioTargetsCardProps {
  data: {
    cash: number;
    investment: number;
    saving: number;
  };
}

export function PortfolioTargetsCard({ data }: PortfolioTargetsCardProps) {
  // Mock targets for demonstration, but using real current values
  const targets = {
    investment: 100000000, // 100jt target
    saving: 50000000,      // 50jt target
    total: 200000000,     // 200jt total target
  };

  const totalCurrent = data.cash + data.investment + data.saving;
  
  const getProgress = (current: number, target: number) => {
    const pct = (current / target) * 100;
    return Math.min(Math.round(pct), 100);
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-header border-0 pb-0 pt-4 px-4">
        <h3 className="card-title fw-bold">Portfolio Targets</h3>
      </div>
      
      <div className="card-body p-4 pt-3 d-flex flex-column">
        <div className="mb-4 mt-1">
          <div className="subheader text-muted mb-1 text-uppercase">Target Assets</div>
          <div className="h1 fw-bold mb-0 lh-1" style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>{formatCurrency(targets.total)}</div>
        </div>

        <div className="d-flex flex-column justify-content-between flex-grow-1">
          {/* Plan 1: Investment */}
          <div>
            <div className="fw-bold mb-2">Investment Target</div>
            <div className="d-flex gap-1 mb-2">
               <div className="rounded-pill bg-primary" style={{ height: '6px', flex: getProgress(data.investment, targets.investment) }}></div>
               <div className="rounded-pill" style={{ height: '6px', flex: 100 - getProgress(data.investment, targets.investment), background: 'var(--tblr-primary-lt)' }}></div>
            </div>
            <div className="d-flex justify-content-between text-muted small fw-medium">
              <div>{formatCurrency(data.investment)} / {formatCurrency(targets.investment)}</div>
              <div className="text-dark fw-bold">{getProgress(data.investment, targets.investment)}%</div>
            </div>
          </div>

          <hr className="my-3 border-light opacity-50" />

          {/* Plan 2: Saving */}
          <div>
            <div className="fw-bold mb-2">Emergency Fund Target</div>
            <div className="d-flex gap-1 mb-2">
               <div className="rounded-pill bg-success" style={{ height: '6px', flex: getProgress(data.saving, targets.saving) }}></div>
               <div className="rounded-pill" style={{ height: '6px', flex: 100 - getProgress(data.saving, targets.saving), background: 'var(--tblr-success-lt)' }}></div>
            </div>
            <div className="d-flex justify-content-between text-muted small fw-medium">
              <div>{formatCurrency(data.saving)} / {formatCurrency(targets.saving)}</div>
              <div className="text-dark fw-bold">{getProgress(data.saving, targets.saving)}%</div>
            </div>
          </div>

          <hr className="my-3 border-light opacity-50" />

          {/* Plan 3: Total Progression */}
          <div>
            <div className="fw-bold mb-2">Overall Progression</div>
            <div className="d-flex gap-1 mb-2">
               <div className="rounded-pill bg-dark" style={{ height: '6px', flex: getProgress(totalCurrent, targets.total) }}></div>
               <div className="rounded-pill" style={{ height: '6px', flex: 100 - getProgress(totalCurrent, targets.total), background: 'var(--tblr-gray-200)' }}></div>
            </div>
            <div className="d-flex justify-content-between text-muted small fw-medium">
              <div>{formatCurrency(totalCurrent)} / {formatCurrency(targets.total)}</div>
              <div className="text-dark fw-bold">{getProgress(totalCurrent, targets.total)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
