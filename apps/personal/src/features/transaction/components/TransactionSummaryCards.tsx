import {
  MetricAreaChartCard,
  ComparisonChartCard,
  SummaryChartCard,
} from '@/shared/components/cards/charts'
import type { FC } from 'react'
import type { TransactionSummary } from '../types/transaction.types'

interface ChartSeriesItem {
  name: string
  data: number[]
  color?: string
}

interface TransactionChartData {
  incomeSeries: ChartSeriesItem[]
  incomeLabels: string[]
  expenseSeries: ChartSeriesItem[]
  expenseLabels: string[]
  countSeries: ChartSeriesItem[]
  countLabels: string[]
  comparisonSeries?: ChartSeriesItem[]
  comparisonLabels?: string[]
}

interface TransactionSummaryCardsProps {
  summary: TransactionSummary | undefined
  isLoading: boolean
  chartData: TransactionChartData
  formatCurrency: (amount: number) => string
}

export const TransactionSummaryCards: FC<TransactionSummaryCardsProps> = ({
  summary,
  isLoading,
  chartData,
  formatCurrency,
}) => {
  return (
    <div 
      style={{ 
        display: 'grid', 
        gap: '12px', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' 
      }}
    >
      <div>
        <MetricAreaChartCard
          title="Total Pemasukan"
          value={isLoading ? '...' : formatCurrency(summary?.total_income || 0)}
          trendValue={summary?.income_trend || 0}
          color="success"
          chartId="income-chart"
          series={chartData.incomeSeries}
          categories={chartData.incomeLabels}
          style={{ height: '140px' }}
        />
      </div>
      <div>
        <MetricAreaChartCard
          title="Total Pengeluaran"
          value={isLoading ? '...' : formatCurrency(summary?.total_expense || 0)}
          trendValue={summary?.expense_trend || 0}
          color="danger"
          chartId="expense-chart"
          series={chartData.expenseSeries}
          categories={chartData.expenseLabels}
          style={{ height: '140px' }}
        />
      </div>
      <div>
        <ComparisonChartCard
          title="Saldo Bersih"
          value={isLoading ? '...' : formatCurrency(summary?.net_balance || 0)}
          trendValue={summary?.balance_trend || 0}
          series={chartData.comparisonSeries}
          categories={chartData.comparisonLabels}
          style={{ height: '140px' }}
        />
      </div>
      <div>
        <SummaryChartCard
          title="Jumlah Transaksi"
          value={isLoading ? '...' : (summary?.transaction_count || 0).toString()}
          trendValue={summary?.count_trend || 0}
          chartId="tx-count-chart"
          series={chartData.countSeries}
          categories={chartData.countLabels}
          style={{ height: '140px' }}
        />
      </div>
    </div>
  )
}
