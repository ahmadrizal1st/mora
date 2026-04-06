import BaseLayout from '../layouts/BaseLayout';
import { VisualStatCard } from '../components/cards/VisualStatCard';
import { CashflowCard } from '../components/cards/CashflowCard';
import { VisualTransactionsCard } from '../components/cards/VisualTransactionsCard';
import { ExpenseRadialCard } from '../components/cards/ExpenseRadialCard';
import { SavingPlansCard } from '../components/cards/SavingPlansCard';
import { FinanceScoreCard } from '../components/cards/FinanceScoreCard';
import { CardBalanceCard } from '../components/cards/CardBalanceCard';
import { RecentActivitiesCard } from '../components/cards/RecentActivitiesCard';

export default function DashboardAssets() {
  return (
    <BaseLayout pageTitle="Asset Breakdown">
      <div className="row row-cards g-3">
        {/* COLUMN 1 & 2 Combined (6/12 total width) - Used for small stats, wide chart, and table */}
        <div className="col-lg-6">
          <div className="row row-cards g-3">
            {/* Top Stat 1 - takes exactly 1/4 of total screen width */}
            <div className="col-md-6">
              <VisualStatCard
                title="Cash & Equivalents"
                value="$125,000"
                trendPercentage="2.5%"
                trendAbsolute="+$3,125"
                icon="wallet"
                isPositive={true}
              />
            </div>
            {/* Top Stat 2 - takes exactly 1/4 of total screen width */}
            <div className="col-md-6">
              <VisualStatCard
                title="Equities"
                value="$850,000"
                trendPercentage="5.2%"
                trendAbsolute="+$44,200"
                icon="chart-bar"
                isPositive={true}
              />
            </div>
            {/* Bottom Stat 1 */}
            <div className="col-md-6">
              <VisualStatCard
                title="Crypto Assets"
                value="$45,000"
                trendPercentage="12.4%"
                trendAbsolute="+$5,580"
                icon="coin-bitcoin"
                isPositive={true}
              />
            </div>
            {/* Bottom Stat 2 */}
            <div className="col-md-6">
              <VisualStatCard
                title="Real Estate"
                value="$357,000"
                trendPercentage="0.0%"
                trendAbsolute="$0"
                icon="home"
                isPositive={true}
              />
            </div>

            {/* Full width within the 6/12 block for responsive wide elements */}
            <div className="col-12">
              <CashflowCard />
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
              <ExpenseRadialCard />
            </div>
            <div className="col-12">
              <SavingPlansCard />
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
