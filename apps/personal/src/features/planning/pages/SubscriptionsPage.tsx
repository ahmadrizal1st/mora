import React, { useState, useMemo, useContext } from 'react';
import { MOCK_SUBSCRIPTIONS_DATA } from '../data/mockPlanningData';
import { UpcomingBillsCard } from '../components/subscriptions/UpcomingBillsCard';
import { SubscriptionItem } from '../components/subscriptions/SubscriptionItem';
import { SubscriptionDistributionChart } from '../components/subscriptions/SubscriptionDistributionChart';
import { SubscriptionCalendar } from '../components/subscriptions/SubscriptionCalendar';
import { SubscriptionTrendChart } from '../components/subscriptions/SubscriptionTrendChart';
import { TrialTrackerCard } from '../components/subscriptions/TrialTrackerCard';
import { SubscriptionSmartInsight } from '../components/subscriptions/SubscriptionSmartInsight';
import { AddSubscriptionCard } from '../components/subscriptions/AddSubscriptionCard';
import { SubscriptionMetricStrip } from '../components/subscriptions/SubscriptionMetricStrip';
import { SubscriptionCategoryBreakdown } from '../components/subscriptions/SubscriptionCategoryBreakdown';
import { Icon } from '@/shared/components/ui/Icon';
import { PlanningContext } from './PlanningLayout';

const getSubCategory = (subName: string): string => {
  const name = subName.toLowerCase();
  if (name.includes('netflix') || name.includes('spotify') || name.includes('youtube') || name.includes('disney') || name.includes('hbo')) return 'Streaming';
  if (name.includes('indihome') || name.includes('internet') || name.includes('zoom') || name.includes('slack') || name.includes('canva') || name.includes('figma')) return 'Kerja';
  if (name.includes('pln') || name.includes('token') || name.includes('listrik') || name.includes('air') || name.includes('pdam')) return 'Lainnya';
  return 'Lainnya';
};

export function SubscriptionsPage() {
  const { subsData, setIsSubModalOpen } = useContext(PlanningContext);
  const data = subsData || MOCK_SUBSCRIPTIONS_DATA;
  const { totalMonthly, paidThisMonth, subscriptions } = data;
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub: any) => {
      const matchesCategory = selectedCategory === 'Semua' || getSubCategory(sub.name) === selectedCategory;
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [subscriptions, selectedCategory, searchQuery]);

  return (
    <div className="tab-content-anim">
      {/* HEADER: Search & Filters */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div className="input-icon" style={{ minWidth: '320px' }}>
          <span className="input-icon-addon">
            <Icon icon="search" size="sm" className="text-secondary" />
          </span>
          <input 
            type="text" 
            className="form-control border-0 shadow-sm" 
            placeholder="Cari layanan langganan..." 
            style={{ borderRadius: '14px', height: '46px', fontSize: '14px' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="d-flex align-items-center gap-2 overflow-auto no-scrollbar pb-1">
          {['Semua', 'Streaming', 'Kerja', 'Edukasi', 'Lainnya'].map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button 
                key={cat} 
                className={`btn btn-sm rounded-pill fw-bold px-4 ${isActive ? 'btn-primary text-white shadow-sm' : 'btn-ghost-secondary border-0'}`}
                style={{ 
                  height: '38px',
                  backgroundColor: isActive ? 'var(--tblr-primary)' : 'transparent',
                  borderColor: isActive ? 'var(--tblr-primary)' : 'transparent',
                  color: isActive ? '#fff' : 'inherit'
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="row row-cards g-3">
        {/* METRIC STRIP: Now part of the main grid row */}
        <SubscriptionMetricStrip />

        {/* ROW 1: Analytics & Highlights */}
        <div className="col-lg-4">
          <UpcomingBillsCard totalMonthly={totalMonthly} paidThisMonth={paidThisMonth} />
        </div>
        <div className="col-lg-4 d-none d-lg-block">
          <SubscriptionTrendChart />
        </div>
        <div className="col-lg-4 d-none d-lg-block">
          <SubscriptionDistributionChart />
        </div>

        {/* MIDDLE ROW: Category Breakdown - Now part of main grid, gap controlled by g-3 */}
        <div className="col-12 d-none d-lg-block">
          <SubscriptionCategoryBreakdown />
        </div>

        {/* ROW 2: Calendar vs Trial Tracker */}
        <div className="col-lg-8 d-none d-lg-block">
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
                {filteredSubscriptions.length} Layanan
              </span>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                {filteredSubscriptions.map((sub: any) => (
                  <div key={sub.id} className="col-12 col-md-6 col-lg-4">
                    <SubscriptionItem subscription={{...sub, color: 'var(--tblr-primary)'}} />
                  </div>
                ))}
                <div className="col-12 col-md-6 col-lg-4">
                  <AddSubscriptionCard onClick={() => setIsSubModalOpen(true)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
