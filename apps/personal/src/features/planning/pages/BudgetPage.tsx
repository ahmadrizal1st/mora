import { useState, useEffect } from 'react'
import { useBudgets } from '../hooks/usePlanning'
import { BudgetCategoryItem } from '../components/budget/BudgetCategoryItem'
import { BudgetDetailedTable } from '../components/budget/BudgetDetailedTable'
import { BudgetBurnRateCard } from '../components/budget/BudgetBurnRateCard'
import { BudgetInsights } from '../components/budget/BudgetInsights'
import { Budget503020Card } from '../components/budget/Budget503020Card'
import { BudgetMonthlyComparisonChart } from '../components/budget/BudgetMonthlyComparisonChart'
import { Budget503020TrendChart } from '../components/budget/Budget503020TrendChart'
import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'

export function BudgetPage() {
  const [mounted, setMounted] = useState(false)
  const { data: budgetData } = useBudgets()

  const categories = budgetData?.categories || []
  const totalBudget = budgetData?.totalBudget || 0
  const spent = budgetData?.spent || 0
  const safeToSpendPerDay = budgetData?.safeToSpendPerDay || 0

  const needs = categories.filter((c: any) => c.type === 'needs')
  const wants = categories.filter((c: any) => c.type === 'wants')
  const savings = categories.filter((c: any) => c.type === 'savings')
  const topCategory = categories.length > 0 ? categories.reduce((prev: any, current: any) => (prev.spent > current.spent) ? prev : current) : null;

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="d-flex flex-column gap-3"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.4s ease-out',
      }}
    >
      {/* Top Widgets Row (3 Columns) */}
      <div className="d-flex flex-wrap gap-3">
        <div className="flex-grow-1" style={{ flex: '1 1 30%', minWidth: '300px' }}>
          <BudgetBurnRateCard spent={spent} totalBudget={totalBudget} safeToSpendPerDay={safeToSpendPerDay} topCategory={topCategory} />
        </div>
        <div className="flex-grow-1" style={{ flex: '1 1 30%', minWidth: '300px' }}>
          <Budget503020Card />
        </div>
        <div className="flex-grow-1" style={{ flex: '1 1 30%', minWidth: '300px' }}>
          <BudgetInsights />
        </div>
      </div>

      {/* Monthly Chart Row (2 Columns) */}
      <div className="d-flex flex-wrap gap-3">
        <div className="flex-grow-1" style={{ flex: '1 1 48%', minWidth: '400px' }}>
          <BudgetMonthlyComparisonChart />
        </div>
        <div className="flex-grow-1" style={{ flex: '1 1 48%', minWidth: '400px' }}>
          <Budget503020TrendChart />
        </div>
      </div>

      {/* Allocation Summary Row (3 Columns: Needs, Wants, Savings) */}
      <div className="d-flex flex-wrap gap-3">
        {/* Needs Card */}
        <div className="flex-grow-1" style={{ flex: '1 1 30%', minWidth: '300px' }}>
          <div
            className="card shadow-sm border-0 h-100"
            style={{ borderRadius: '24px', overflow: 'hidden' }}
          >
            <div className="card-header border-bottom py-3 px-4 bg-surface d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <div className="avatar avatar-xs rounded bg-primary text-white shadow-sm">
                  <Icon icon="home" size="xs" />
                </div>
                <h4
                  className="fw-bold m-0 small text-uppercase"
                  style={{ letterSpacing: '0.025em' }}
                >
                  Needs (50%)
                </h4>
              </div>
              <div className="text-end">
                <span className="small text-muted" style={{ fontSize: '10px' }}>
                  Total:{' '}
                  <span className="text-body fw-bold">
                    {formatCurrency(needs.reduce((a: any, b: any) => a + b.spent, 0))}
                  </span>
                </span>
              </div>
            </div>
            <div className="card-body p-3">
              <div className="d-flex flex-column gap-3">
                {needs.sort((a: any, b: any) => b.spent - a.spent).map((cat: any) => (
                  <BudgetCategoryItem key={cat.id} category={cat} />
                ))}
                {needs.length === 0 && (
                  <div className="text-muted small text-center py-4">Belum ada anggaran Needs</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Wants Card */}
        <div className="flex-grow-1" style={{ flex: '1 1 30%', minWidth: '300px' }}>
          <div
            className="card shadow-sm border-0 h-100"
            style={{ borderRadius: '24px', overflow: 'hidden' }}
          >
            <div className="card-header border-bottom py-3 px-4 bg-surface d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <div className="avatar avatar-xs rounded bg-warning text-white shadow-sm">
                  <Icon icon="star" size="xs" />
                </div>
                <h4
                  className="fw-bold m-0 small text-uppercase"
                  style={{ letterSpacing: '0.025em' }}
                >
                  Wants (30%)
                </h4>
              </div>
              <div className="text-end">
                <span className="small text-muted" style={{ fontSize: '10px' }}>
                  Total:{' '}
                  <span className="text-body fw-bold">
                    {formatCurrency(wants.reduce((a: any, b: any) => a + b.spent, 0))}
                  </span>
                </span>
              </div>
            </div>
            <div className="card-body p-3">
              <div className="d-flex flex-column gap-3">
                {wants.sort((a: any, b: any) => b.spent - a.spent).map((cat: any) => (
                  <BudgetCategoryItem key={cat.id} category={cat} />
                ))}
                {wants.length === 0 && (
                  <div className="text-muted small text-center py-4">Belum ada anggaran Wants</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Savings Card */}
        <div className="flex-grow-1" style={{ flex: '1 1 30%', minWidth: '300px' }}>
          <div
            className="card shadow-sm border-0 h-100"
            style={{ borderRadius: '24px', overflow: 'hidden' }}
          >
            <div className="card-header border-bottom py-3 px-4 bg-surface d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <div className="avatar avatar-xs rounded bg-success text-white shadow-sm">
                  <Icon icon="pig-money" size="xs" />
                </div>
                <h4
                  className="fw-bold m-0 small text-uppercase"
                  style={{ letterSpacing: '0.025em' }}
                >
                  Savings (20%)
                </h4>
              </div>
              <div className="text-end">
                <span className="small text-muted" style={{ fontSize: '10px' }}>
                  Total:{' '}
                  <span className="text-body fw-bold">
                    {formatCurrency(savings.reduce((a: any, b: any) => a + b.spent, 0))}
                  </span>
                </span>
              </div>
            </div>
            <div className="card-body p-3">
              <div className="d-flex flex-column gap-3">
                {savings.sort((a: any, b: any) => b.spent - a.spent).map((cat: any) => (
                  <BudgetCategoryItem key={cat.id} category={cat} />
                ))}
                {savings.length === 0 && (
                  <div className="text-muted small text-center py-4">Belum ada anggaran Savings</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="w-100">
        <BudgetDetailedTable />
      </div>
    </div>
  )
}
