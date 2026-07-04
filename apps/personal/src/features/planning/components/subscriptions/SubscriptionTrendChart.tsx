import { Chart } from '@/shared/components/ui/Chart'
import React, { useContext } from 'react'
import { PlanningContext } from '../../pages/PlanningLayout'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { Icon } from '@/shared/components/ui/Icon'

export function SubscriptionTrendChart() {
  const { subsData } = useContext(PlanningContext) || {}
  const subscriptions = subsData?.subscriptions || []
  const totalMonthly = subsData?.totalMonthly || 0

  // Ambil top 12 subscription diurutkan berdasarkan amount terbesar (data asli dari DB)
  const sorted = [...subscriptions]
    .sort((a: any, b: any) => b.amount - a.amount)
    .slice(0, 12)

  const dataPoints = sorted.map((s: any) => s.amount)
  const labels = sorted.map((s: any) =>
    s.name.length > 10 ? s.name.substring(0, 10) + '…' : s.name
  )

  const maxAmount = sorted.length > 0 ? sorted[0].amount : 0

  const chartData = {
    type: 'bar' as const,
    height: 13,
    series: [
      {
        name: 'Biaya Langganan',
        data: dataPoints,
        color: 'primary',
      },
    ],
    categories: labels.length > 0 ? labels : ['Belum ada data'],
    extend: {
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: labels.length <= 4 ? '30%' : '55%',
          distributed: false,
        },
      },
      dataLabels: { enabled: false },
      fill: {
        type: 'solid',
        opacity: 1,
      },
      tooltip: {
        fixed: { enabled: false },
        x: { show: true },
        y: {
          title: {
            formatter: () => 'Biaya: ',
          },
          formatter: (value: number) => `Rp ${value.toLocaleString('id-ID')}`,
        },
        marker: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (value: number) => {
            const jt = value / 1000000
            if (jt >= 0.01) {
              return `Rp ${jt % 1 === 0 ? jt : jt.toFixed(1)} Jt`
            }
            const rb = value / 1000
            if (rb >= 1) {
              return `Rp ${rb % 1 === 0 ? rb : rb.toFixed(0)} Rb`
            }
            return `Rp ${value}`
          }
        }
      }
    },
  }

  return (
    <div className="card shadow-none border h-100 overflow-hidden" style={{ borderRadius: '12px' }}>
      <div className="card-body p-3 d-flex flex-column h-100">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h3 className="card-title fw-bold m-0 text-body" style={{ fontSize: '16px' }}>
              Distribusi Biaya Langganan
            </h3>
            <div className="text-secondary small" style={{ fontSize: '11px' }}>
              Per layanan — data dari database
            </div>
          </div>
          <div className="text-secondary small" style={{ fontSize: '11px' }}>
            {subscriptions.length} layanan aktif
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-2 bg-body-tertiary py-2 px-3 rounded-3">
          <div>
            <div className="text-secondary small fw-medium" style={{ fontSize: '9px', letterSpacing: '0.04em' }}>
              TOTAL BULANAN
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <h3 className="fw-bold m-0 text-primary fs-3">{formatCurrency(totalMonthly)}</h3>
            </div>
          </div>
          <div className="text-end">
            <div className="text-secondary small fw-medium" style={{ fontSize: '9px', letterSpacing: '0.04em' }}>
              TERBESAR
            </div>
            <div className="fw-bold text-dark fs-4">{formatCurrency(maxAmount)}</div>
          </div>
        </div>

        {subscriptions.length === 0 ? (
          <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center py-4">
            <Icon icon="chart-bar" size={32} stroke={1.5} className="text-secondary opacity-50 mb-3" />
            <div className="fw-bold text-body mb-1" style={{ fontSize: '14px' }}>Belum Ada Data Langganan</div>
            <div className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.5' }}>Tambahkan langganan untuk melihat tren</div>
          </div>
        ) : (
          <div className="flex-grow-1 mt-auto w-100 d-flex align-items-end" style={{ margin: '0 -20px -15px -20px', minHeight: '160px' }}>
            <div className="w-100">
              <Chart chartId="subsTrend" chartData={chartData as any} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
