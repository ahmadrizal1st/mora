import React from 'react';
import { MOCK_SUBSCRIPTIONS_DATA } from '../../data/mockPlanningData';
import { UpcomingBillsCard } from './UpcomingBillsCard';
import { SubscriptionItem } from './SubscriptionItem';
import { SubscriptionDistributionChart } from './SubscriptionDistributionChart';
import { SubscriptionCalendar } from './SubscriptionCalendar';
import { Icon } from '@/shared/components/ui/Icon';

export function SubscriptionsTab() {
  const { totalMonthly, paidThisMonth, subscriptions } = MOCK_SUBSCRIPTIONS_DATA;

  return (
    <div className="row row-cards g-3 tab-content-anim">
      {/* ROW 1: Analytics & Highlights */}
      <div className="col-lg-4">
        <div className="h-100">
          <UpcomingBillsCard totalMonthly={totalMonthly} paidThisMonth={paidThisMonth} />
        </div>
      </div>
      <div className="col-lg-4">
        <div className="h-100">
          <SubscriptionDistributionChart />
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card shadow-sm border-0 glass-card text-primary h-100 overflow-hidden" style={{ borderRadius: '16px' }}>
          <div className="card-body p-4 d-flex flex-column justify-content-center text-center">
            <div className="p-3 bg-primary-lt rounded-circle d-inline-flex mb-3 mx-auto shadow-sm">
              <Icon icon="bolt" size="md" />
            </div>
            <h3 className="fw-bold mb-2">Smart Optimization</h3>
            <p className="small text-secondary mb-4 fw-medium leading-relaxed">
              Anda bisa menghemat <strong>Rp 1.2jt/tahun</strong> dengan optimasi paket Family pada layanan streaming.
            </p>
            <button className="btn btn-primary btn-sm fw-bold w-100 rounded-pill shadow-sm transition-all">Optimalkan Sekarang</button>
          </div>
        </div>
      </div>

      {/* ROW 2: Detailed Temporal View vs Timeline */}
      <div className="col-lg-8">
        <div className="h-100">
          <SubscriptionCalendar />
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '12px' }}>
          <div className="card-header border-bottom py-3 px-4 bg-white">
            <h3 className="card-title fw-bold m-0 d-flex align-items-center gap-2">
              <Icon icon="calendar-time" size="sm" className="text-primary" />
              Payment Queue
            </h3>
          </div>
          <div className="card-body p-4">
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="badge badge-dot bg-warning"></div>
                <h4 className="fw-bold m-0 small text-uppercase text-ls-sm">Jatuh Tempo</h4>
              </div>
              <div className="row g-2">
                {subscriptions.filter(s => s.status === 'upcoming').map(sub => (
                  <div key={sub.id} className="col-12">
                    <SubscriptionItem subscription={sub} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="badge badge-dot bg-success"></div>
                <h4 className="fw-bold m-0 small text-uppercase text-ls-sm">Lunas / Lainnya</h4>
              </div>
              <div className="row g-2">
                {subscriptions.filter(s => s.status !== 'upcoming').map(sub => (
                  <div key={sub.id} className="col-12">
                    <SubscriptionItem subscription={sub} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
