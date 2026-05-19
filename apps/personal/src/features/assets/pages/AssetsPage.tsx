import React, { useMemo } from 'react';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { VisualStatCard } from '@/shared/components/cards/VisualStatCard';
import { NetWorthGrowthCard } from '@/shared/components/cards/NetWorthGrowthCard';
import { VisualTransactionsCard } from '@/shared/components/cards/VisualTransactionsCard';
import { AssetAllocationCard } from '@/shared/components/cards/AssetAllocationCard';
import { PortfolioTargetsCard } from '@/shared/components/cards/PortfolioTargetsCard';
import { FinanceScoreCard } from '@/shared/components/cards/FinanceScoreCard';
import { CardBalanceCard } from '@/shared/components/cards/CardBalanceCard';
import { RecentActivitiesCard } from '@/shared/components/cards/RecentActivitiesCard';
import { useAccounts } from '@/features/transaction/hooks/useAccounts';
import { formatCurrency } from '@/shared/utils/currencyUtils';

export default function AssetsPage() {
  const { data: accountsResponse } = useAccounts();
  const accounts = accountsResponse?.data || [];

  const stats = useMemo(() => {
    const totals = {
      cash: 0,
      investment: 0,
      saving: 0,
      liabilities: 0,
    };

    accounts.forEach(acc => {
      const balance = Number(acc.balance) || 0;
      if (['cash', 'bank', 'e-wallet'].includes(acc.account_type)) {
        totals.cash += balance;
      } else if (acc.account_type === 'investment') {
        totals.investment += balance;
      } else if (acc.account_type === 'saving') {
        totals.saving += balance;
      } else if (['credit', 'loan'].includes(acc.account_type)) {
        totals.liabilities += balance;
      }
    });

    return totals;
  }, [accounts]);

  const totalAssets = stats.cash + stats.investment + stats.saving;
  const netWorth = totalAssets - stats.liabilities;
  return (
    <BaseLayout pageTitle="Laporan Keuangan">
      <div className="row row-cards g-3">
        {/* COLUMN 1 & 2 Combined (6/12 total width) - Used for small stats, wide chart, and table */}
        <div className="col-lg-6">
          <div className="row row-cards g-3">
            {/* Top Stat 1: Total Aset Bersih */}
            <div className="col-md-6">
              <VisualStatCard
                title="Total Aset Bersih"
                value={formatCurrency(netWorth)}
                trendPercentage=""
                trendAbsolute=""
                icon="building-bank"
                isPositive={netWorth >= 0}
              />
            </div>
            {/* Top Stat 2: Kas & Rekening */}
            <div className="col-md-6">
              <VisualStatCard
                title="Kas & Rekening"
                value={formatCurrency(stats.cash)}
                trendPercentage=""
                trendAbsolute=""
                icon="wallet"
                isPositive={true}
              />
            </div>
            {/* Bottom Stat 1: Tabungan */}
            <div className="col-md-6">
              <VisualStatCard
                title="Tabungan"
                value={formatCurrency(stats.saving)}
                trendPercentage=""
                trendAbsolute=""
                icon="pig-money"
                isPositive={true}
              />
            </div>
            {/* Bottom Stat 2: Kewajiban */}
            <div className="col-md-6">
              <VisualStatCard
                title="Total Kewajiban"
                value={formatCurrency(stats.liabilities)}
                trendPercentage=""
                trendAbsolute=""
                icon="credit-card"
                isPositive={false}
              />
            </div>

            {/* Full width within the 6/12 block for responsive wide elements */}
            <div className="col-12">
              <NetWorthGrowthCard currentNetWorth={totalAssets} />
            </div>
            <div className="col-12">
              <VisualTransactionsCard />
            </div>
          </div>
        </div>

        {/* COLUMN 3: Asset Allocation & Targets - takes exactly 1/4 (3/12) of total screen width */}
        <div className="col-lg-3">
          <div className="row row-cards g-3">
            <div className="col-12">
              <AssetAllocationCard data={stats} />
            </div>
            <div className="col-12">
              <PortfolioTargetsCard data={stats} />
            </div>
          </div>
        </div>

        {/* COLUMN 4: Health, Accounts, Activities - takes exactly 1/4 (3/12) of total screen width */}
        <div className="col-lg-3">
          <div className="row row-cards g-3">
            <div className="col-12">
              <FinanceScoreCard />
            </div>
            <div className="col-12">
              <CardBalanceCard />
            </div>
            <div className="col-12">
              <RecentActivitiesCard />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
