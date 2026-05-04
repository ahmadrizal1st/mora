import React, { useState } from 'react';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { PlanningSegmentedNav } from '../components/shared/PlanningSegmentedNav';
import { PlanningMetricCard } from '../components/shared/PlanningMetricCard';
import { BudgetTab } from '../components/budget/BudgetTab';
import { GoalsTab } from '../components/goals/GoalsTab';
import { SubscriptionsTab } from '../components/subscriptions/SubscriptionsTab';
import { Icon } from '@/shared/components/ui/Icon';
import { MOCK_BUDGET_DATA } from '../data/mockPlanningData';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import './PlanningPage.css';

export function PlanningPage() {
  const [activeTab, setActiveTab] = useState<'budget' | 'goals' | 'subscriptions'>('budget');
  const { totalBudget, spent } = MOCK_BUDGET_DATA;
  const remaining = totalBudget - spent;

  return (
    <BaseLayout 
      pageTitle="Financial Planning"
      pagePretitle="STRATEGY"
      showBackButton={false}
    >
      {/* 1. TOP STATS ROW - Perfectly balanced 4-column layout */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <PlanningMetricCard 
            title="Total Budget" 
            value={formatCurrency(totalBudget)} 
            subtext="Mei 2026" 
            icon="wallet" 
            valueColor="primary" 
          />
        </div>
        <div className="col-6 col-lg-3">
          <PlanningMetricCard 
            title="Terpakai" 
            value={formatCurrency(spent)} 
            subtext={`${Math.round((spent/totalBudget)*100)}% digunakan`} 
            icon="trending-down" 
            valueColor="danger" 
          />
        </div>
        <div className="col-6 col-lg-3">
          <PlanningMetricCard 
            title="Sisa Anggaran" 
            value={formatCurrency(remaining)} 
            subtext="Tersedia" 
            icon="cash" 
            valueColor="success" 
          />
        </div>
        <div className="col-6 col-lg-3">
          <PlanningMetricCard 
            title="Harian (Safe)" 
            value={formatCurrency(MOCK_BUDGET_DATA.safeToSpendPerDay)} 
            subtext="Estimasi harian" 
            icon="shield-check" 
            valueColor="warning" 
          />
        </div>
      </div>

      {/* 2. NAVIGATION TOOLBAR - Unified control center */}
      <div className="card shadow-sm border-0 mb-4 bg-white" style={{ borderRadius: '12px' }}>
        <div className="card-body py-2 px-3">
          <div className="row align-items-center g-3">
            <div className="col-12 col-md-auto">
              <PlanningSegmentedNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="col-12 col-md-auto ms-md-auto d-flex align-items-center gap-3">
              <div className="d-flex align-items-center bg-light rounded-2 p-1 border">
                <button className="btn btn-icon btn-sm border-0 bg-transparent text-secondary hover-primary">
                  <Icon icon="chevron-left" size="sm" />
                </button>
                <span className="px-3 small fw-bold text-dark text-center" style={{ minWidth: '90px' }}>
                  Mei 2026
                </span>
                <button className="btn btn-icon btn-sm border-0 bg-transparent text-secondary hover-primary">
                  <Icon icon="chevron-right" size="sm" />
                </button>
              </div>
              <button className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-2 rounded-2 shadow-sm">
                <Icon icon="plus" size="sm" stroke={2.5} />
                <span className="fw-bold">Tambah Baru</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT - Dynamic Tab Switcher */}
      <div className="tab-content transition-all animate-in fade-in duration-500">
        {activeTab === 'budget' && <BudgetTab />}
        {activeTab === 'goals' && <GoalsTab />}
        {activeTab === 'subscriptions' && <SubscriptionsTab />}
      </div>
    </BaseLayout>
  );
}
