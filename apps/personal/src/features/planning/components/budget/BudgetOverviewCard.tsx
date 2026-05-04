import { Chart } from '@/shared/components/ui/Chart';
import { Icon } from '@/shared/components/ui/Icon';
import { formatCurrency } from '@/shared/utils/currencyUtils';

interface BudgetOverviewCardProps {
  totalBudget: number;
  spent: number;
  safeToSpendPerDay: number;
}

export function BudgetOverviewCard({ totalBudget, spent, safeToSpendPerDay }: BudgetOverviewCardProps) {
  const percentage = Math.min(Math.round((spent / totalBudget) * 100), 100);

  const radialChartData = {
    type: 'radialBar' as const,
    series: [{ name: 'Terpakai', data: [percentage] }],
    hollowSize: '65%', 
    startAngle: 0,
    endAngle: 360,
    donutValue: `${percentage}%`,
    donutLabel: '', 
    color: 'indigo',
    extend: {
      stroke: { lineCap: 'round' },
      plotOptions: {
        radialBar: {
          hollow: { size: '65%' },
          dataLabels: {
            name: { show: false },
            value: {
              offsetY: 8,
              fontSize: '22px',
              fontWeight: 700,
              color: '#1e293b'
            }
          }
        }
      }
    }
  };

  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4 d-flex flex-column justify-content-between">
        <div className="d-flex align-items-center mb-0">
          <div style={{ width: '150px', flexShrink: 0, marginLeft: '-15px' }}>
            <Chart 
              chartId="budgetOverviewRadialMain" 
              chartData={radialChartData as any} 
              height={10} // ~160px
            />
          </div>
          <div className="flex-fill ps-2">
            <div className="text-secondary small fw-bold text-uppercase mb-1" style={{ fontSize: '10px' }}>Anggaran Terpakai</div>
            <div className="h2 fw-bold mb-0 text-primary" style={{ letterSpacing: '-0.5px', fontSize: '1.5rem' }}>{formatCurrency(spent)}</div>
            <div className="text-muted small">dari <span className="fw-bold text-dark">{formatCurrency(totalBudget)}</span></div>
          </div>
        </div>

        <div className="row g-2">
          <div className="col-6">
            <div className="p-3 rounded-3 bg-light-lt border border-light shadow-sm h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="avatar avatar-xs rounded-3 bg-secondary-lt text-secondary border border-secondary" style={{ width: '22px', height: '22px' }}>
                  <Icon icon="wallet" size="xs" />
                </div>
                <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '9px' }}>Sisa Saldo</span>
              </div>
              <div className="fw-bold text-dark fs-3">{formatCurrency(totalBudget - spent)}</div>
            </div>
          </div>
          <div className="col-6">
            <div className="p-3 rounded-3 bg-success-lt border border-success-subtle shadow-sm h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="avatar avatar-xs rounded-3 bg-success-lt text-success border border-success" style={{ width: '22px', height: '22px' }}>
                  <Icon icon="shield-check" size="xs" />
                </div>
                <span className="text-success-dark small fw-bold text-uppercase" style={{ fontSize: '9px' }}>Aman Digunakan</span>
              </div>
              <div className="fw-bold text-success fs-3">{formatCurrency(safeToSpendPerDay)} <span className="small opacity-50 fw-normal">/hr</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
