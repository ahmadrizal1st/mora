import React, { useState, useMemo } from 'react';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { SummaryMetricCard } from '../components/SummaryMetricCard';
import { AccountCard } from '../components/AccountCard';
import { CashFlowChartCard } from '../components/CashFlowChartCard';
import { TransactionListCard } from '../components/TransactionListCard';
import { SpendingCategoryCard } from '../components/SpendingCategoryCard';
import { AccountVisualCard } from '../components/AccountVisualCard';
import { RecentInsightsCard } from '../components/RecentInsightsCard';
import { TopMerchantsCard } from '../components/TopMerchantsCard';
import { AccountStatsCard } from '../components/AccountStatsCard';
import { Icon } from '@/shared/components/ui/Icon';
import { AddAccountModal } from '../components/AddAccountModal';
import { BUDGET_DATA } from '../data/mockData';
import './AccountsPage.css';

export function AccountsPage() {
  const [cur, setCur] = useState(0);
  const [range, setRange] = useState('W');
  const [showAddModal, setShowAddModal] = useState(false);
  const a = BUDGET_DATA[cur];

  const cfData = useMemo(() => {
    const s = cur * 11;
    const map: Record<string, string[]> = {
      W: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      M: ['M1', 'M2', 'M3', 'M4'],
      '3M': ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      Y: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
    };
    const lbl = map[range] || map['W'];
    const inc = lbl.map((_, i) => Math.round(500 + Math.abs(Math.sin((i + s) * 1.4)) * 2000));
    const exp = lbl.map((_, i) => Math.round(300 + Math.abs(Math.cos((i + s) * 1.8)) * 1200));
    return { lbl, inc, exp };
  }, [cur, range]);

  return (
    <BaseLayout pageTitle="Detail Akun & Mutasi">
      {/* ACCOUNT SELECTION CAROUSEL */}
      <div className="d-flex align-items-stretch overflow-auto gap-3 pb-3 mb-4 accounts-carousel-track">
        {BUDGET_DATA.map((acc, idx) => (
          <AccountCard
            key={idx}
            isActive={cur === idx}
            type={acc.type}
            name={acc.name}
            balance={acc.bal}
            delta={acc.chg}
            chgPos={acc.chgPos}
            logo={acc.logo}
            color={acc.color}
            onClick={() => setCur(idx)}
          />
        ))}
        <div 
          className="card shadow-sm cursor-pointer" 
          onClick={() => setShowAddModal(true)}
          style={{ 
            minWidth: '220px', 
            alignSelf: 'stretch',
            border: '1px dashed var(--tblr-border-color)',
            background: 'var(--tblr-bg-surface-secondary, #f6f8fb)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className="card-body d-flex flex-column align-items-center justify-content-center flex-fill py-4">
            <div className="mb-2">
              <Icon icon="plus" size="lg" className="text-secondary" stroke={1.5} />
            </div>
            <div className="text-secondary fw-bold small">Tambah Akun</div>
          </div>
        </div>
      </div>

      {/* ACCOUNT TOP KPI */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <SummaryMetricCard title="Saldo Terkini" value={a.bal} subtext={a.name} icon="wallet" iconColor="primary" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <SummaryMetricCard title="Total Pemasukan" value={a.inc} subtext="Mei 2025" icon="trending-up" valueColor="success" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <SummaryMetricCard title="Total Pengeluaran" value={a.exp} subtext="12 Transaksi" icon="trending-down" valueColor="danger" />
        </div>
        <div className="col-sm-6 col-lg-3">
          <SummaryMetricCard 
            title="Net Mutasi" 
            value={a.chgPos ? `+${a.chg}` : `-${a.chg}`} 
            subtext="Tren vs bulan lalu" 
            icon="arrows-exchange" 
            valueColor={a.chgPos ? 'success' : 'danger'} 
          />
        </div>
      </div>

      {/* BALANCED CONTENT GRID */}
      <div className="row row-cards g-3">
        {/* LEFT COLUMN: VISUALS & MONITORING (3/12) */}
        <div className="col-lg-3">
          <div className="row row-cards g-3">
            <div className="col-12">
              <AccountVisualCard name={a.name} num={a.num} type={a.type} balance={a.bal} logo={a.logo} color={a.color} />
            </div>
            <div className="col-12">
              <AccountStatsCard />
            </div>
            <div className="col-12">
              <TopMerchantsCard />
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: MAIN CHARTS & LISTS (6/12) */}
        <div className="col-lg-6">
          <div className="row row-cards g-3">
            <div className="col-12">
              <CashFlowChartCard range={range} setRange={setRange} data={cfData} />
            </div>
            <div className="col-12">
              <TransactionListCard transactions={a.tx} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ANALYSIS & INSIGHTS (3/12) */}
        <div className="col-lg-3">
          <div className="row row-cards g-3">
            <div className="col-12">
              <SpendingCategoryCard categories={a.cats} />
            </div>
            <div className="col-12">
              <RecentInsightsCard />
            </div>
          </div>
        </div>
      </div>

      <AddAccountModal show={showAddModal} onClose={() => setShowAddModal(false)} />
    </BaseLayout>
  );
}
