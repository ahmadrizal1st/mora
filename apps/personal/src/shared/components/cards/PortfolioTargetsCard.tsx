import { formatCurrency } from '@/shared/utils/currencyUtils';

interface PortfolioTargetsCardProps {
  data: {
    cash: number;
    investment: number;
    saving: number;
  };
}

export function PortfolioTargetsCard({ data }: PortfolioTargetsCardProps) {
  const targets = {
    saving: 50000000,      // 50jt target
    emergency: 50000000,   // 50jt target
    investment: 100000000, // 100jt target
    reksadana: 50000000,   // 50jt target
    total: 250000000,      // 250jt total target
  };
  
  const getProgress = (current: number, target: number) => {
    const pct = (current / target) * 100;
    return Math.min(Math.round(pct), 100);
  };

  const targetItems = [
    {
      name: 'Target Tabungan',
      current: data.saving,
      target: targets.saving,
      colorClass: 'bg-primary',
      lightBg: 'var(--tblr-primary-lt)',
    },
    {
      name: 'Dana Darurat',
      current: data.saving * 0.8,
      target: targets.emergency,
      colorClass: 'bg-success',
      lightBg: 'var(--tblr-success-lt)',
    },
    {
      name: 'Investasi Saham',
      current: data.investment,
      target: targets.investment,
      colorClass: 'bg-warning',
      lightBg: 'var(--tblr-warning-lt)',
    }
  ];

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header border-0 pb-0 pt-4 px-4">
        <h3 className="card-title fw-bold">Target Keuangan Bulan Ini</h3>
      </div>
      
      <div className="card-body p-4 pt-3 d-flex flex-column">
        <div className="mb-4 mt-1">
          <div className="subheader text-muted mb-1 text-uppercase">Target Bulan Ini</div>
          <div className="h1 fw-bold mb-0 lh-1" style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>{formatCurrency(targets.total)}</div>
        </div>

        <div className="d-flex flex-column justify-content-between flex-grow-1">
          {targetItems.map((item, index) => (
            <div key={item.name}>
              <div className="fw-bold mb-2">{item.name}</div>
              <div className="d-flex gap-1 mb-2">
                 <div className={`rounded-pill ${item.colorClass}`} style={{ height: '6px', flex: getProgress(item.current, item.target) }}></div>
                 <div className="rounded-pill" style={{ height: '6px', flex: 100 - getProgress(item.current, item.target), background: item.lightBg }}></div>
              </div>
              <div className="d-flex justify-content-between text-muted small fw-medium">
                <div>{formatCurrency(item.current)} / {formatCurrency(item.target)}</div>
                <div className="text-dark fw-bold">{getProgress(item.current, item.target)}%</div>
              </div>
              {index < targetItems.length - 1 && <hr className="my-3 border-light opacity-50" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
