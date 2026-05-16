import { useState } from 'react';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Icon } from '@/shared/components/ui/Icon';
import { WealthSegmentedNav, type WealthTab } from '../components/shared/WealthSegmentedNav';
import { WealthMetricCard } from '../components/shared/WealthMetricCard';
import { PortfolioTab } from '../components/portfolio/PortfolioTab';
import { WatchlistTab } from '../components/watchlist/WatchlistTab';
import { MarketTab } from '../components/market/MarketTab';
import { DividendsTab } from '../components/dividends/DividendsTab';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import { MOCK_PORTFOLIO_DATA } from '../data/mockWealthData';
import './WealthPage.css';

export function WealthPage() {
  const [activeTab, setActiveTab] = useState<WealthTab>('portfolio');
  const { totalValue, totalGain, gainPercent, dayChange, dayChangePercent } = MOCK_PORTFOLIO_DATA;

  return (
    <BaseLayout 
      pageTitle="Wealth Management"
      pagePretitle="PORTFOLIO & MARKETS"
      showBackButton={false}
    >
      {/* 1. TOP STATS ROW */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <WealthMetricCard 
            title="Total Wealth" 
            value={formatCurrency(totalValue)} 
            subtext="Update real-time" 
            icon="building-bank" 
            valueColor="primary" 
          />
        </div>
        <div className="col-6 col-lg-3">
          <WealthMetricCard 
            title="Total Return" 
            value={formatCurrency(totalGain)} 
            subtext={`${gainPercent}% total profit`} 
            icon="trending-up" 
            valueColor={totalGain >= 0 ? 'success' : 'danger'} 
            trend={{ value: `+${gainPercent}%`, positive: totalGain >= 0 }}
          />
        </div>
        <div className="col-6 col-lg-3">
          <WealthMetricCard 
            title="Day Change" 
            value={formatCurrency(dayChange)} 
            subtext={`${dayChangePercent}% hari ini`} 
            icon="clock" 
            valueColor={dayChange >= 0 ? 'success' : 'danger'} 
          />
        </div>
        <div className="col-6 col-lg-3">
          <WealthMetricCard 
            title="Watchlist" 
            value="12 Efek" 
            subtext="3 Alert aktif" 
            icon="eye" 
            valueColor="purple" 
          />
        </div>
      </div>

      {/* 2. NAVIGATION TOOLBAR */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between g-3 flex-wrap">
          <div className="bg-white p-1 rounded-3 shadow-sm border border-light">
            <WealthSegmentedNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-icon btn-ghost-secondary border-0 rounded-circle">
              <Icon icon="refresh" size="sm" />
            </button>
            <button className="btn btn-primary px-4 d-flex align-items-center gap-2 rounded-3 shadow-sm border-0">
              <Icon icon="plus" size="sm" stroke={2.5} />
              <span className="fw-bold">Add Asset</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT */}
      <div className="tab-content transition-all animate-in fade-in duration-500">
        {activeTab === 'portfolio' && <PortfolioTab />}
        {activeTab === 'watchlist' && <WatchlistTab />}
        {activeTab === 'market' && <MarketTab />}
        {activeTab === 'dividends' && <DividendsTab />}
      </div>
    </BaseLayout>
  );
}
