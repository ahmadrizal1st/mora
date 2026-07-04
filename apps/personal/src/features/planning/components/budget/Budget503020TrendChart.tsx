import { useState, useMemo } from 'react'
import { Chart, ChartData } from '@/shared/components/ui/Chart'
import { Icon } from '@/shared/components/ui/Icon'
import { useBudgetHistory } from '../../hooks/usePlanning'

export function Budget503020TrendChart() {
  const [period, setPeriod] = useState<'6m' | '12m'>('6m')
  const { data: historyData, isLoading } = useBudgetHistory(period === '6m' ? 6 : 12)

  const currentData = useMemo(() => {
    if (!historyData) return { categories: [], needs: [], wants: [], savings: [] }
    return {
      categories: historyData.map((d: any) => d.month),
      needs: historyData.map((d: any) => Number((d.needs / 1000000).toFixed(1))),
      wants: historyData.map((d: any) => Number((d.wants / 1000000).toFixed(1))),
      savings: historyData.map((d: any) => Number((d.savings / 1000000).toFixed(1))),
    }
  }, [historyData])

  const isEmpty = !historyData || historyData.length === 0 || (
    currentData.needs.every(n => n === 0) &&
    currentData.wants.every(w => w === 0) &&
    currentData.savings.every(s => s === 0)
  )

  const chartData: ChartData = {
    type: 'bar',
    stacked: true,
    height: 18,
    categories: currentData.categories,
    series: [
      {
        name: 'Needs',
        data: currentData.needs,
        color: 'orange',
      },
      {
        name: 'Wants',
        data: currentData.wants,
        color: 'blue',
      },
      {
        name: 'Savings',
        data: currentData.savings,
        color: 'green',
      },
    ],
    showDataLabels: false,
    legend: true,
    extend: {
      plotOptions: {
        bar: {
          columnWidth: period === '6m' ? '35%' : '60%',
          borderRadius: 4,
        },
      },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            return 'Rp ' + val + ' Jt'
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return 'Rp ' + val + ' Juta'
          },
        },
      },
      grid: {
        strokeDashArray: 4,
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10,
        },
      },
    },
  }

  return (
    <div className="card shadow-sm border-0 w-100" style={{ borderRadius: '24px' }}>
      <div className="card-header border-bottom-0 pt-4 pb-2 px-4 d-flex align-items-start justify-content-between">
        <div>
          <h3 className="card-title fw-bold text-body m-0" style={{ fontSize: '1.15rem' }}>
            50/30/20 Allocation Trend
          </h3>
          <div className="text-muted small mt-1">Tren realisasi Needs, Wants, & Savings</div>
        </div>
        <div className="dropdown">
          <a
            href="#"
            className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
            data-bs-toggle="dropdown"
          >
            <span className="text-decoration-underline-hover">
              {period === '6m' ? '6 Bulan' : '12 Bulan'}
            </span>
            <Icon icon="chevron-down" size="xs" />
          </a>
          <div className="dropdown-menu dropdown-menu-end">
            <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setPeriod('6m'); }}>6 Bulan</button>
            <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setPeriod('12m'); }}>12 Bulan</button>
          </div>
        </div>
      </div>
      <div className="card-body p-4 pt-0">
        {isLoading ? (
          <div className="text-center text-secondary py-4">Memuat data...</div>
        ) : isEmpty ? (
          <div className="text-center py-4 d-flex flex-column justify-content-center align-items-center">
            <div className="mb-3">
              <Icon icon="chart-bar" size={40} stroke={1.5} style={{ opacity: 0.6 }} />
            </div>
            <div className="fw-bold text-body mb-1">Belum Ada Data</div>
            <div className="text-muted small mb-3">Tambahkan budget untuk melihat analisis</div>
          </div>
        ) : (
          <Chart chartId="budget-503020-trend" chartData={chartData} />
        )}
      </div>
    </div>
  )
}
