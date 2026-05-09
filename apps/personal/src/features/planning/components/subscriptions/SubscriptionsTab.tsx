import { MOCK_SUBSCRIPTIONS_DATA } from '../../data/mockPlanningData';
import { UpcomingBillsCard } from './UpcomingBillsCard';
import { SubscriptionItem } from './SubscriptionItem';
import { SubscriptionDistributionChart } from './SubscriptionDistributionChart';
import { SubscriptionCalendar } from './SubscriptionCalendar';
import { SubscriptionTrendChart } from './SubscriptionTrendChart';
import { TrialTrackerCard } from './TrialTrackerCard';
import { SubscriptionSmartInsight } from './SubscriptionSmartInsight';
import { AddSubscriptionCard } from './AddSubscriptionCard';
import { SubscriptionMetricStrip } from './SubscriptionMetricStrip';
import { SubscriptionCategoryBreakdown } from './SubscriptionCategoryBreakdown';
import { Icon } from '@/shared/components/ui/Icon';

export function SubscriptionsTab() {
  const { totalMonthly, paidThisMonth, subscriptions } = MOCK_SUBSCRIPTIONS_DATA;

  return (
    <div className="tab-content-anim">
      {/* HEADER: Search & Filters */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div className="position-relative" style={{ minWidth: '320px' }}>
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary">
            <Icon icon="search" size="sm" />
          </div>
          <input 
            type="text" 
            className="form-control ps-5 border-0 shadow-sm" 
            placeholder="Cari layanan langganan..." 
            style={{ borderRadius: '14px', height: '46px', fontSize: '14px' }}
          />
        </div>
        <div className="d-flex align-items-center gap-2 overflow-auto no-scrollbar pb-1">
          {['Semua', 'Streaming', 'Kerja', 'Edukasi', 'Lainnya'].map((cat, i) => (
            <button 
              key={i} 
              className={`btn btn-sm rounded-pill fw-bold px-4 ${i === 0 ? 'btn-primary text-white shadow-sm' : 'btn-ghost-secondary border-0'}`}
              style={{ height: '38px' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="row row-cards g-3">
        {/* METRIC STRIP: Now part of the main grid row */}
        <SubscriptionMetricStrip />

        {/* ROW 1: Analytics & Highlights */}
        <div className="col-lg-4">
          <UpcomingBillsCard totalMonthly={totalMonthly} paidThisMonth={paidThisMonth} />
        </div>
        <div className="col-lg-4">
          <SubscriptionTrendChart />
        </div>
        <div className="col-lg-4">
          <SubscriptionDistributionChart />
        </div>

        {/* MIDDLE ROW: Category Breakdown - Now part of main grid, gap controlled by g-3 */}
        <div className="col-12">
          <SubscriptionCategoryBreakdown />
        </div>

        {/* ROW 2: Calendar vs Trial Tracker */}
        <div className="col-lg-8">
          <SubscriptionCalendar />
        </div>

        <div className="col-lg-4">
          <div className="d-flex flex-column gap-3 h-100">
            <TrialTrackerCard />
            <SubscriptionSmartInsight />
          </div>
        </div>

        {/* ROW 3: Detailed List */}
        <div className="col-lg-12">
          <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
            <div className="card-header border-0 bg-transparent pt-4 px-4 pb-0 d-flex align-items-center justify-content-between">
              <h3 className="card-title fw-bold m-0 d-flex align-items-center gap-2">
                <Icon icon="credit-card" size="sm" className="text-primary" />
                Daftar Langganan Aktif
              </h3>
              <span className="badge bg-primary-lt text-primary border-0 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '10px' }}>
                {subscriptions.length} Layanan
              </span>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                {subscriptions.map(sub => (
                  <div key={sub.id} className="col-12 col-md-6 col-lg-4">
                    <SubscriptionItem subscription={{...sub, color: 'var(--tblr-primary)'}} />
                  </div>
                ))}
                <div className="col-12 col-md-6 col-lg-4">
                  <AddSubscriptionCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
