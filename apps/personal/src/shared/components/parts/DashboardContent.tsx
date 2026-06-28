import { useState } from 'react'
import { Icon } from '../ui/Icon'
import { Chart } from '../ui/Chart'
import { CoinestCard } from '../cards/CoinestCard'
import { QuickActions } from './QuickActions'
import { SparklineStatCard } from '../cards/SparklineStatCard'
import { TransactionListCard } from '@/features/accounts/components/TransactionListCard'
import { UpcomingBillsCard } from '@/features/accounts/components/UpcomingBillsCard'
import { MobileGridMenu } from './MobileGridMenu'

import peopleData from '../../data/people.json'
import { type Person } from '@/shared/types/common.types'
import { useAccountSummary } from '@/features/transaction/hooks/useAccounts'
import {
  useTransactionSummary,
  useTransactionHistory,
  useTransactionStatistics,
  useTransactions
} from '@/features/transaction/hooks/useTransactions'
import { useGoals, useBudgets, useSubscriptions } from '@/features/planning/hooks/usePlanning'
import { useAuth } from '@/features/auth/hooks/useAuth'
export function DashboardContent() {
  const { user } = useAuth()
  const { data: accountData, isLoading: isLoadingAccount } = useAccountSummary()
  const { data: txSummary, isLoading: isLoadingTxSummary } = useTransactionSummary()
  const { data: txHistory, isLoading: isLoadingTxHistory } = useTransactionHistory({ group_by: 'month' })
  const { data: txStats, isLoading: isLoadingTxStats } = useTransactionStatistics()
  const { data: recentTx, isLoading: isLoadingRecent } = useTransactions({ per_page: 10, sort_by: 'tx_date', sort_dir: 'desc' } as any)
  const { data: goals, isLoading: isLoadingGoals } = useGoals()
  const { data: budgets, isLoading: isLoadingBudgets } = useBudgets()
  const { data: subs, isLoading: isLoadingSubs } = useSubscriptions()

  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('expense')

  const statsColors = [
    'var(--tblr-primary)',
    'color-mix(in srgb, var(--tblr-primary), transparent 40%)',
    'color-mix(in srgb, var(--tblr-primary), transparent 70%)',
    'var(--tblr-secondary-lt)',
    'var(--tblr-secondary-lt)',
  ]

  const isLoading = isLoadingAccount || isLoadingTxSummary || isLoadingTxHistory || isLoadingTxStats || isLoadingRecent || isLoadingGoals || isLoadingBudgets || isLoadingSubs

  if (isLoading) {
    return <div className="p-4 text-center text-muted">Loading dashboard...</div>
  }

  const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`

  const formatCurrencyShort = (value: number): string => {
    const abs = Math.abs(value)
    const sign = value < 0 ? '-' : ''
    if (abs >= 1_000_000_000_000) return `${sign}Rp ${(abs / 1_000_000_000_000).toFixed(1).replace('.', ',')}T`
    if (abs >= 1_000_000_000)     return `${sign}Rp ${(abs / 1_000_000_000).toFixed(1).replace('.', ',')}M`
    if (abs >= 1_000_000)         return `${sign}Rp ${(abs / 1_000_000).toFixed(1).replace('.', ',')}JT`
    if (abs >= 1_000)             return `${sign}Rp ${(abs / 1_000).toFixed(0)}K`
    return `${sign}Rp ${abs}`
  }

  const summary = {
    balance: formatCurrencyShort(accountData?.total_balance || 0),
    income: formatCurrencyShort(txSummary?.total_income || 0),
    expense: formatCurrencyShort(txSummary?.total_expense || 0),
    savings: formatCurrencyShort(goals?.totalSaved || 0),
    incomeTrend: txSummary?.income_trend || 0,
    expenseTrend: txSummary?.expense_trend || 0,
    savingsTrend: 0,
  }

  const limits = {
    monthly: {
      total: formatCurrency(budgets?.totalBudget || 0),
      spent: formatCurrency(budgets?.spent || 0),
      progress: budgets?.totalBudget ? Math.min(100, Math.round(((budgets?.spent || 0) / budgets.totalBudget) * 100)) : 0,
    }
  }

  const savingsPlans = goals?.goals?.map((g: any) => ({
    name: g.name,
    current: formatCurrency(g.saved),
    target: formatCurrency(g.target),
    progress: g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0,
    icon: g.icon || 'star',
  })) || []

  const cashflow = {
    series: [
      { name: 'Income', data: txHistory?.income || [] },
      { name: 'Expense', data: (txHistory?.expense || []).map((v: number) => -v) }
    ],
    months: txHistory?.income_labels || []
  }

  const statistics = {
    series: txStats?.series || []
  }

  const recentTransactions = recentTx?.data?.map((tx: any) => ({
    ico: tx.category?.icon || 'receipt',
    color: tx.category?.color || 'blue',
    n: tx.title || tx.category?.name || 'Transaksi',
    c: tx.category?.name || 'Lainnya',
    a: formatCurrency(Number(tx.amount)),
    d: new Date(tx.tx_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    p: tx.type === 'income'
  })) || []

  const upcomingBills = subs?.subscriptions?.slice(0, 5).map((s: any) => ({
    ico: s.icon || 'box',
    name: s.name,
    due: new Date(s.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    amt: formatCurrency(s.amount)
  })) || []

  return (
    <div className="d-flex flex-column flex-lg-row gap-2 gap-lg-3">
      <div className="d-flex flex-column gap-2 gap-lg-3" style={{ flex: 1, minWidth: 0 }}>
        <CoinestCard balance={summary.balance} name={user?.name || 'User'} />
        <QuickActions />
        <div className="card border-0 shadow-sm d-none d-lg-flex flex-column">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="subheader m-0 fw-bold">Budget Utilization</div>
                  <div className="dropdown">
                    <a
                      className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
                      href="#"
                      data-bs-toggle="dropdown"
                    >
                      <span className="text-decoration-underline-hover">This Month</span>
                      <Icon icon="chevron-down" size="xs" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                      <button className="dropdown-item">This Month</button>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="small">
                    <span className="fw-bold">{limits.monthly.spent}</span>
                    <span className="ms-1 text-secondary" style={{ fontSize: '0.75rem' }}>
                      spent of {limits.monthly.total}
                    </span>
                  </div>
                  <div className="fw-bold small">{limits.monthly.progress}%</div>
                </div>
                <div
                  className="progress rounded-pill overflow-hidden"
                  style={{
                    height: '8px',
                    background: 'color-mix(in srgb, var(--tblr-primary), transparent 85%)',
                  }}
                >
                  <div
                    className="progress-bar bg-primary rounded-pill"
                    style={{ width: `${limits.monthly.progress}%` }}
                  />
                </div>
              </div>
            </div>
        <div className="card border-0 shadow-sm d-none d-lg-flex flex-column flex-grow-1">
              <div className="card-header border-0 pb-0">
                <h3 className="card-title fw-bold">Saving Plans</h3>
                <div className="card-actions">
                  <a
                    href="#"
                    className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
                  >
                    <Icon icon="plus" size="xs" /> Add Plan
                  </a>
                </div>
              </div>
              <div className="card-body d-flex flex-column">
                <div className="mb-4">
                  <div className="subheader text-secondary m-0 text-mobile-xs">Total Savings</div>
                  <div
                    className="h1 fw-bold m-0 text-mobile-lg"
                    style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}
                  >
                    {summary.savings}
                  </div>
                </div>

                {savingsPlans.length === 0 ? (
                  <div className="text-center py-4 flex-grow-1 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <div className="d-flex justify-content-center text-secondary mb-3">
                      <Icon icon="pig-money" size={40} stroke={1.5} opacity={0.6} />
                    </div>
                    <div className="fw-bold text-body mb-1">Belum Ada Tabungan</div>
                    <div className="text-muted small mb-3">Buat impian keuangan Anda jadi nyata!</div>
                    <button className="btn btn-primary btn-sm d-flex align-items-center gap-2">
                      <Icon icon="plus" size={16} stroke={2} />
                      Tambah Target
                    </button>
                  </div>
                ) : (
                  savingsPlans.slice(0, 5).map((plan, i) => (
                    <div
                      key={i}
                      className="card border shadow-none mb-2"
                      style={{ borderColor: 'var(--tblr-border-color-light)' }}
                    >
                      <div className="card-body p-2 px-3">
                        <div className="d-flex align-items-center mb-2">
                          <div
                            className="bg-primary text-white rounded-2 d-flex align-items-center justify-content-center me-3 shadow-sm"
                            style={{ width: '28px', height: '28px' }}
                          >
                            <Icon icon={plan.icon} size="xs" color="white" />
                          </div>
                          <div className="fw-bold text-truncate" style={{ fontSize: '0.85rem' }}>
                            {plan.name}
                          </div>
                          <div className="ms-auto dropdown">
                            <a
                              href="#"
                              className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
                              data-bs-toggle="dropdown"
                            >
                              <span className="text-decoration-underline-hover">Options</span>
                              <Icon icon="chevron-down" size="xs" />
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <button className="dropdown-item">View Details</button>
                              <button className="dropdown-item">Edit Plan</button>
                              <button className="dropdown-item text-danger">Delete</button>
                            </div>
                          </div>
                        </div>

                        <div
                          className="progress rounded-pill overflow-hidden mb-2"
                          style={{
                            height: '6px',
                            background: 'color-mix(in srgb, var(--tblr-primary), transparent 85%)',
                          }}
                        >
                          <div
                            className="progress-bar bg-primary rounded-pill"
                            style={{ width: `${plan.progress}%` }}
                          />
                        </div>

                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                          <div className="small text-nowrap">
                            <span className="fw-bold">{plan.current}</span>
                            <span className="ms-2 text-secondary" style={{ fontSize: '0.7rem' }}>
                              {plan.progress}%
                            </span>
                          </div>
                          <div className="small text-secondary text-nowrap ms-auto" style={{ fontSize: '0.7rem' }}>
                            Target: <span className="fw-bold">{plan.target}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
        </div>

      <div className="d-flex flex-column gap-2 gap-lg-3" style={{ flex: 2, minWidth: 0 }}>
        <MobileGridMenu />
        <div
          className="d-flex gap-2 gap-lg-3 overflow-x-auto hide-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div className="mobile-slider-item" style={{ flex: 1, minWidth: '160px' }}>
            <SparklineStatCard
              title="Total Income"
              value={summary.income}
              trendValue={summary.incomeTrend}
              icon="trending-up"
              color="green"
            />
          </div>
          <div className="mobile-slider-item" style={{ flex: 1, minWidth: '160px' }}>
            <SparklineStatCard
              title="Total Expense"
              value={summary.expense}
              trendValue={summary.expenseTrend}
              icon="trending-down"
              color="red"
            />
          </div>
          <div className="mobile-slider-item" style={{ flex: 1, minWidth: '160px' }}>
            <SparklineStatCard
              title="Total Savings"
              value={summary.savings}
              trendValue={summary.savingsTrend}
              icon="wallet"
              color="azure"
            />
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header">
            <h3 className="card-title">Cashflow</h3>
            <div className="card-actions">
              <div className="dropdown">
                <a
                  href="#"
                  className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
                  data-bs-toggle="dropdown"
                >
                  <span className="text-decoration-underline-hover">This Year</span>
                  <Icon icon="chevron-down" size="xs" />
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <button className="dropdown-item">This Year</button>
                  <button className="dropdown-item">Last Year</button>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body d-flex flex-column gap-2">
            <div>
              <div className="subheader text-muted text-mobile-xs">Total Balance</div>
              <div className="h1 mb-0 h1-mobile">{summary.balance}</div>
            </div>
            <Chart
              chartId="cashflow-bars"
              chartData={{
                type: 'bar',
                height: 18,
                series: cashflow.series.map((s) => ({
                  ...s,
                  color: s.name === 'Income' ? 'primary' : 'secondary',
                })),
                categories: cashflow.months,
                legend: true,
                datalabels: false,
                stacked: true,
                xaxis: {
                  labels: {
                    show: true,
                    style: { fontSize: '11px', fontWeight: 500, color: 'var(--tblr-secondary)' },
                  },
                  axisBorder: { show: false },
                  axisTicks: { show: false },
                  crosshairs: {
                    show: false,
                  },
                },
                yaxis: {
                  tickAmount: 4,
                  labels: {
                    style: { fontSize: '11px', color: 'var(--tblr-secondary)' },
                    formatter: (val: number) => {
                      if (val === undefined || val === null) return '';
                      const absoluteVal = Math.abs(val)
                      if (absoluteVal >= 1000000000) return `${(absoluteVal / 1000000000).toFixed(1)}M`
                      if (absoluteVal >= 1000000) return `${(absoluteVal / 1000000).toFixed(1)}Jt`
                      if (absoluteVal >= 1000) return `${(absoluteVal / 1000).toFixed(0)}K`
                      return absoluteVal.toString()
                    },
                  },
                },
                grid: {
                  borderColor: 'var(--tblr-border-color-light)',
                  strokeDashArray: 3,
                  xaxis: { lines: { show: false } },
                },
                legendOptions: {
                  position: 'top',
                  horizontalAlign: 'right',
                  fontSize: '12px',
                  offsetY: -30,
                  markers: { radius: 4 },
                },
                extend: {
                  tooltip: {
                    y: {
                      formatter: (val: number) => {
                        return 'Rp ' + Math.abs(val).toLocaleString('id-ID')
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="flex-grow-1 d-flex flex-column">
          <TransactionListCard transactions={recentTransactions} />
        </div>
      </div>

      <div className="d-flex flex-column gap-2 gap-lg-3" style={{ flex: 1, minWidth: 0 }}>
        <div className="card border-0 shadow-sm">
          <div className="card-header border-0 pb-0">
                <h3 className="card-title fw-bold">Statistic</h3>
                <div className="card-actions">
                  <a
                    href="#"
                    className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
                  >
                    <span className="text-decoration-underline-hover">This Month</span>
                    <Icon icon="chevron-down" size="xs" />
                  </a>
                </div>
              </div>
              <div className="card-body pt-0">
                <div
                  className="d-flex mb-4"
                  style={{ gap: '0', borderBottom: '1px solid var(--tblr-border-color-light)' }}
                >
                  <div
                    className={`flex-fill text-center pb-3 cursor-pointer transition-all`}
                    onClick={() => setActiveTab('income')}
                    style={{
                      opacity: activeTab === 'income' ? 1 : 0.4,
                      borderBottom:
                        activeTab === 'income'
                          ? '2px solid var(--tblr-primary)'
                          : '2px solid transparent',
                    }}
                  >
                    <span
                      className="subheader text-mobile-sm"
                      style={{ fontWeight: activeTab === 'income' ? 700 : 400 }}
                    >
                      Income <span className="ms-1 text-secondary">({summary.income})</span>
                    </span>
                  </div>
                  <div
                    className={`flex-fill text-center pb-3 cursor-pointer transition-all`}
                    onClick={() => setActiveTab('expense')}
                    style={{
                      opacity: activeTab === 'expense' ? 1 : 0.4,
                      borderBottom:
                        activeTab === 'expense'
                          ? '2px solid var(--tblr-primary)'
                          : '2px solid transparent',
                    }}
                  >
                    <span
                      className="subheader text-mobile-sm"
                      style={{ fontWeight: activeTab === 'expense' ? 700 : 400 }}
                    >
                      Expense <span className="ms-1 text-secondary">({summary.expense})</span>
                    </span>
                  </div>
                </div>

                <div className="py-2 text-center">
                  <Chart
                    chartId="statistic-donut-enhanced"
                    chartData={{
                      type: 'donut',
                      series: statistics.series.map((s: any, idx: number) => ({
                        ...s,
                        color: statsColors[idx],
                      })),
                      donutLabel: `Total ${activeTab === 'expense' ? 'Expense' : 'Income'}`,
                      donutValue: activeTab === 'expense' ? summary.expense : summary.income,
                      legend: false,
                      height: 14,
                      hollowSize: '70%',
                    }}
                  />
                </div>

                <div className="mt-4 custom-scrollbar overflow-y-auto pe-1" style={{ maxHeight: '200px' }}>
                  {statistics.series.map((s: any, i: number) => {
                    const totalVal = activeTab === 'expense' ? (txSummary?.total_expense || 0) : (txSummary?.total_income || 0)
                    const pct = totalVal > 0 ? Math.round((s.data[0] / totalVal) * 100) : 0
                    
                    return (
                      <div key={i} className="d-flex align-items-center last-mb-0 small mb-2">
                        <div
                          className="rounded-3 px-2 py-1 me-3 text-center fw-bold shadow-sm"
                          style={{
                            width: '45px',
                            fontSize: '0.65rem',
                            background: statsColors[i],
                            color: i === 0 ? 'var(--tblr-primary-fg)' : 'var(--tblr-body-color)',
                          }}
                        >
                          {pct}%
                        </div>
                        <span className="fw-medium text-truncate" style={{ maxWidth: '100px' }}>{s.name}</span>
                        <span className="ms-auto fw-bold text-nowrap">Rp {s.data[0].toLocaleString('id-ID')}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

        <div className="d-none d-lg-block flex-grow-1 d-flex flex-column">
          <UpcomingBillsCard bills={upcomingBills} />
        </div>
      </div>
    </div>
  )
}
