import { useState } from 'react'
import { Icon } from '../ui/Icon'
import { Chart } from '../ui/Chart'
import { CoinestCard } from '../cards/CoinestCard'
import { QuickActions } from './QuickActions'
import { SparklineStatCard } from '../cards/SparklineStatCard'
import { RecentTransactionsTable } from '../cards/RecentTransactionsTable'
import { ActivityCard } from '../cards/ActivityCard'
import { MobileGridMenu } from './MobileGridMenu'

import peopleData from '../../data/people.json'
import { type Person } from '@/shared/types/common.types'
import { useDashboardSummary } from '@/features/dashboard/hooks/useDashboard'

export function DashboardContent() {
  const { data: moraData, isLoading } = useDashboardSummary()
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('expense')

  const statsColors = [
    'var(--tblr-primary)',
    'color-mix(in srgb, var(--tblr-primary), transparent 40%)',
    'color-mix(in srgb, var(--tblr-primary), transparent 70%)',
    'var(--tblr-secondary-lt)',
    'var(--tblr-secondary-lt)',
  ]

  if (isLoading || !moraData) {
    return <div className="p-4 text-center text-muted">Loading dashboard...</div>
  }

  const { summary, limits, savingsPlans, cashflow, statistics, recentTransactions, activities } = moraData

  return (
    <div className="row g-2 g-lg-3">
      <div className="col-lg-3">
        <div className="row g-2 g-lg-3">
          <div className="col-12">
            <CoinestCard balance={summary.balance} name="Andrew Forbist" />
          </div>
          <div className="col-12">
            <QuickActions />
          </div>
          <div className="col-12 d-none d-lg-block">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="subheader m-0 fw-bold">Daily Limit</div>
                  <div className="dropdown">
                    <a
                      className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
                      href="#"
                      data-bs-toggle="dropdown"
                    >
                      <span className="text-decoration-underline-hover">Today</span>
                      <Icon icon="chevron-down" size="xs" />
                    </a>
                    <div className="dropdown-menu dropdown-menu-end">
                      <button className="dropdown-item">Today</button>
                      <button className="dropdown-item">Yesterday</button>
                      <button className="dropdown-item">This Week</button>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="small">
                    <span className="fw-bold">{limits.daily.spent}</span>
                    <span className="ms-1 text-secondary" style={{ fontSize: '0.75rem' }}>
                      spent of {limits.daily.total}
                    </span>
                  </div>
                  <div className="fw-bold small">{limits.daily.progress}%</div>
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
                    style={{ width: `${limits.daily.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 d-none d-lg-block">
            <div className="card border-0 shadow-sm">
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
              <div className="card-body">
                <div className="mb-4">
                  <div className="subheader text-secondary m-0 text-mobile-xs">Total Savings</div>
                  <div
                    className="h1 fw-bold m-0 text-mobile-lg"
                    style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}
                  >
                    {summary.savings}
                  </div>
                </div>

                {savingsPlans.map((plan, i) => (
                  <div
                    key={i}
                    className="card border shadow-none mb-3"
                    style={{ borderColor: 'var(--tblr-border-color-light)' }}
                  >
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center mb-3">
                        <div
                          className="bg-primary text-white rounded-2 d-flex align-items-center justify-content-center me-3 shadow-sm"
                          style={{ width: '36px', height: '36px' }}
                        >
                          <Icon icon={plan.icon} size="sm" color="white" />
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
                          height: '8px',
                          background: 'color-mix(in srgb, var(--tblr-primary), transparent 85%)',
                        }}
                      >
                        <div
                          className="progress-bar bg-primary rounded-pill"
                          style={{ width: `${plan.progress}%` }}
                        />
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="small">
                          <span className="fw-bold">{plan.current}</span>
                          <span className="ms-2 text-secondary" style={{ fontSize: '0.7rem' }}>
                            {plan.progress}%
                          </span>
                        </div>
                        <div className="small text-secondary" style={{ fontSize: '0.7rem' }}>
                          Target: <span className="fw-bold">{plan.target}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-6 d-flex flex-column gap-2 gap-lg-3">
        <MobileGridMenu />
        <div
          className="row g-2 g-lg-3 flex-nowrap overflow-x-auto d-md-flex flex-md-wrap hide-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div className="col-auto col-md-4 px-1 px-md-2 mobile-slider-item">
            <SparklineStatCard
              title="Total Income"
              value={summary.income}
              trendValue={summary.incomeTrend}
              icon="trending-up"
              color="green"
            />
          </div>
          <div className="col-auto col-md-4 px-1 px-md-2 mobile-slider-item">
            <SparklineStatCard
              title="Total Expense"
              value={summary.expense}
              trendValue={summary.expenseTrend}
              icon="trending-down"
              color="red"
            />
          </div>
          <div className="col-auto col-md-4 px-1 px-md-2 mobile-slider-item">
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
                  min: -8000,
                  max: 8000,
                  tickAmount: 4,
                  labels: {
                    style: { fontSize: '11px', color: 'var(--tblr-secondary)' },
                    formatter: (val: number) => {
                      const absoluteVal = Math.abs(val)
                      if (absoluteVal >= 1000) return `${val / 1000}K`
                      return val.toString()
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
              }}
            />
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header">
            <h3 className="card-title">Recent Transactions</h3>
            <div className="card-actions">
              <div className="dropdown">
                <a
                  href="#"
                  className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
                  data-bs-toggle="dropdown"
                >
                  <span className="text-decoration-underline-hover">This Month</span>
                  <Icon icon="chevron-down" size="xs" />
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <button className="dropdown-item">This Month</button>
                  <button className="dropdown-item">Last Month</button>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body d-flex flex-column gap-2">
            <RecentTransactionsTable invoices={recentTransactions} hideHeader hideFooter />
          </div>
          <div className="card-footer bg-transparent border-0 text-center py-0 pb-3">
            <a href="#" className="btn btn-link text-secondary text-mobile-xs">
              View all transactions
            </a>
          </div>
        </div>
      </div>

      <div className="col-lg-3">
        <div className="row g-3">
          <div className="col-12">
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
                      series: statistics.series.map((s, idx) => ({
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

                <div className="mt-4">
                  {statistics.series.map((s, i) => {
                    const totalVal = Number(summary.expense.replace(/[^0-9-]/g, ''))
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
                        <span className="ms-auto fw-bold text-nowrap">Rp {s.data[0].toLocaleString()}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 d-none d-lg-block">
            <div className="card border-0 shadow-sm">
              <div className="card-header">
                <h3 className="card-title">Recent Activity</h3>
                <div className="card-actions">
                  <div className="dropdown">
                    <a
                      href="#"
                      className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
                      data-bs-toggle="dropdown"
                    >
                      <span className="text-decoration-underline-hover">View all</span>
                      <Icon icon="chevron-down" size="xs" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <ActivityCard
                  activity={activities.map((a) => ({
                    text: a.text,
                  }))}
                  people={peopleData as Person[]}
                  hideHeader
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
