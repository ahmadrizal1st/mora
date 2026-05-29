import { MOCK_BUDGET_DATA } from '../data/mockPlanningData';
import { BudgetOverviewCard } from '../components/budget/BudgetOverviewCard';
import { BudgetCategoryItem } from '../components/budget/BudgetCategoryItem';
import { BudgetTrendChartCard } from '../components/budget/BudgetTrendChartCard';
import { BudgetDetailedTable } from '../components/budget/BudgetDetailedTable';
import { SavingsHealthCard } from '../components/shared/SavingsHealthCard';
import { BudgetBurnRateCard } from '../components/budget/BudgetBurnRateCard';
import { BudgetInsights } from '../components/budget/BudgetInsights';
import { Budget503020Card } from '../components/budget/Budget503020Card';
import { Icon } from '@/shared/components/ui/Icon';
import { formatCurrency } from '@/shared/utils/currencyUtils';

export function BudgetPage() {
  const { categories, totalBudget, spent, safeToSpendPerDay } = MOCK_BUDGET_DATA;
  
  const needs = categories.filter(c => c.type === 'needs');
  const wants = categories.filter(c => c.type === 'wants');
  const savings = categories.filter(c => c.type === 'savings');

  return (
    <div className="row row-cards g-3 tab-content-anim">
      {/* LEVEL 1: High-Level Analytics Row */}
      <div className="col-lg-8 d-none d-lg-block">
        <div className="h-100">
          <BudgetTrendChartCard />
        </div>
      </div>
      <div className="col-lg-4">
        <div className="h-100">
          <SavingsHealthCard />
        </div>
      </div>

      {/* LEVEL 2: Velocity & Distribution (NEW) */}
      <div className="col-lg-4 d-lg-flex">
        <BudgetBurnRateCard spent={spent} totalBudget={totalBudget} />
      </div>
      <div className="col-lg-4 d-lg-flex">
        <Budget503020Card />
      </div>
      <div className="col-lg-4 d-lg-flex">
        <div className="d-flex flex-column gap-3 h-100 w-100">
          <BudgetOverviewCard 
            totalBudget={totalBudget} 
            spent={spent} 
            safeToSpendPerDay={safeToSpendPerDay} 
          />
        </div>
      </div>

      {/* LEVEL 3: Categories vs Insights */}
      <div className="col-lg-8">
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <div className="card-header border-bottom py-3 px-4 bg-surface">
            <h3 className="card-title fw-bold m-0 d-flex align-items-center gap-2">
              <Icon icon="category" size="sm" className="text-primary" />
              Allocation Summary
            </h3>
          </div>
          <div className="card-body p-4">
            <div className="mb-5">
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary-subtle">
                <div className="d-flex align-items-center gap-2">
                  <div className="avatar avatar-xs rounded bg-primary text-white shadow-sm">
                    <Icon icon="home" size="xs" />
                  </div>
                  <h4 className="fw-bold m-0 small text-uppercase text-ls-sm">Needs (50%) 🏠</h4>
                </div>
                <div className="text-end">
                  <div className="small text-muted" style={{ fontSize: '10px' }}>Terpakai: <span className="text-body fw-bold">{formatCurrency(needs.reduce((a, b) => a + b.spent, 0))}</span> / {formatCurrency(needs.reduce((a, b) => a + b.limit, 0))}</div>
                </div>
              </div>
              <div className="row g-4">
                {needs.map(cat => (
                  <div key={cat.id} className="col-12 col-md-6">
                    <BudgetCategoryItem category={cat} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary-subtle">
                <div className="d-flex align-items-center gap-2">
                  <div className="avatar avatar-xs rounded bg-warning text-white shadow-sm">
                    <Icon icon="star" size="xs" />
                  </div>
                  <h4 className="fw-bold m-0 small text-uppercase text-ls-sm">Wants (30%) ⭐</h4>
                </div>
                <div className="text-end">
                  <div className="small text-muted" style={{ fontSize: '10px' }}>Terpakai: <span className="text-body fw-bold">{formatCurrency(wants.reduce((a, b) => a + b.spent, 0))}</span> / {formatCurrency(wants.reduce((a, b) => a + b.limit, 0))}</div>
                </div>
              </div>
              <div className="row g-4">
                {wants.map(cat => (
                  <div key={cat.id} className="col-12 col-md-6">
                    <BudgetCategoryItem category={cat} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary-subtle">
                <div className="d-flex align-items-center gap-2">
                  <div className="avatar avatar-xs rounded bg-success text-white shadow-sm">
                    <Icon icon="pig-money" size="xs" />
                  </div>
                  <h4 className="fw-bold m-0 small text-uppercase text-ls-sm">Savings (20%) 💰</h4>
                </div>
                <div className="text-end">
                  <div className="small text-muted" style={{ fontSize: '10px' }}>Terpakai: <span className="text-body fw-bold">{formatCurrency(savings.reduce((a, b) => a + b.spent, 0))}</span> / {formatCurrency(savings.reduce((a, b) => a + b.limit, 0))}</div>
                </div>
              </div>
              <div className="row g-4">
                {savings.map(cat => (
                  <div key={cat.id} className="col-12 col-md-6">
                    <BudgetCategoryItem category={cat} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4 d-none d-lg-block">
        <BudgetInsights />
      </div>

      {/* LEVEL 4: Granular Data Row */}
      <div className="col-lg-12 d-none d-md-block">
        <div>
          <BudgetDetailedTable />
        </div>
      </div>
    </div>
  );
}
