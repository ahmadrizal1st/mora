import React, { useState, useMemo, useContext } from 'react'
import { UpcomingBillsCard } from '../components/subscriptions/UpcomingBillsCard'
import { SubscriptionItem } from '../components/subscriptions/SubscriptionItem'
import { SubscriptionCalendar } from '../components/subscriptions/SubscriptionCalendar'
import { SubscriptionTrendChart } from '../components/subscriptions/SubscriptionTrendChart'
import { TrialTrackerCard } from '../components/subscriptions/TrialTrackerCard'
import { AddSubscriptionCard } from '../components/subscriptions/AddSubscriptionCard'
import { SubscriptionMetricStrip } from '../components/subscriptions/SubscriptionMetricStrip'
import { SubscriptionCategoryBreakdown } from '../components/subscriptions/SubscriptionCategoryBreakdown'
import { Icon } from '@/shared/components/ui/Icon'
import { PlanningContext } from './PlanningLayout'

const getSubCategory = (subName: string): string => {
  const name = subName.toLowerCase()
  if (
    name.includes('netflix') ||
    name.includes('spotify') ||
    name.includes('youtube') ||
    name.includes('disney') ||
    name.includes('hbo')
  )
    return 'Hiburan'
  if (
    name.includes('indihome') ||
    name.includes('internet') ||
    name.includes('zoom') ||
    name.includes('slack') ||
    name.includes('canva') ||
    name.includes('figma')
  )
    return 'Kerja'
  if (
    name.includes('pln') ||
    name.includes('token') ||
    name.includes('listrik') ||
    name.includes('air') ||
    name.includes('pdam')
  )
    return 'Lainnya'
  return 'Lainnya'
}

export function SubscriptionsPage() {
  const { subsData, handleOpenAddSub, handleEditSub } = useContext(PlanningContext) || {}
  const data = subsData || {
    totalMonthly: 0,
    paidThisMonth: 0,
    subscriptions: []
  }
  const { totalMonthly, paidThisMonth, subscriptions } = data
  const filteredSubscriptions = subscriptions

  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
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
      <SubscriptionMetricStrip
        subscriptions={subscriptions}
        totalMonthly={totalMonthly}
        paidThisMonth={paidThisMonth}
      />

      <div className="d-flex flex-wrap gap-3">
        <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
          <UpcomingBillsCard totalMonthly={totalMonthly} paidThisMonth={paidThisMonth} />
        </div>
        <div className="d-none d-lg-flex flex-column" style={{ flex: '2 1 500px', minWidth: '400px' }}>
          <SubscriptionTrendChart />
        </div>
      </div>

      <div className="d-none d-lg-block">
        <SubscriptionCategoryBreakdown subscriptions={subscriptions} />
      </div>

      <div className="d-flex flex-wrap gap-3">
        <div className="d-none d-lg-block" style={{ flex: '2 1 500px', minWidth: '400px' }}>
          <SubscriptionCalendar />
        </div>
        <div style={{ flex: '1 1 280px', minWidth: '260px' }}>
          <TrialTrackerCard />
        </div>
      </div>

      <div className="card shadow-none border" style={{ borderRadius: '12px' }}>
        <div className="card-header border-0 bg-transparent pt-3 px-3 pb-0">
          <h3 className="card-title fw-bold m-0" style={{ fontSize: '14px' }}>
            Daftar Langganan Aktif
          </h3>
        </div>
        <div className="card-body p-3">
          <div className="d-flex flex-wrap gap-3">
            {filteredSubscriptions.map((sub: any) => (
              <div key={sub.id} style={{ flex: '1 1 280px', minWidth: '260px', maxWidth: '100%' }}>
                <SubscriptionItem
                  subscription={{ ...sub, color: 'var(--tblr-primary)' }}
                  onClick={() => handleEditSub?.(sub)}
                />
              </div>
            ))}
            <div style={{ flex: '1 1 280px', minWidth: '260px', maxWidth: '100%' }}>
              <AddSubscriptionCard onClick={handleOpenAddSub} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
