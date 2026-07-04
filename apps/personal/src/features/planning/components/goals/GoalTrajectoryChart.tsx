import React from 'react'
import { Chart } from '@/shared/components/ui/Chart'
import { Icon } from '@/shared/components/ui/Icon'

export function GoalTrajectoryChart({ 
  totalSaved = 0, 
  totalTarget = 0, 
  goals = [] 
}: { 
  totalSaved?: number
  totalTarget?: number
  goals?: any[] 
}) {
  const totalMonthlyDeposit = goals.reduce((acc, curr) => acc + (curr.monthlyDeposit || 0), 0)
  
  // Generate 6 months data
  const months = []
  const targetData = []
  const actualData = []
  const now = new Date()
  
  // Calculate months remaining for the furthest goal
  const activeGoals = goals.filter(g => g.saved < g.target && g.rawEta)
  let maxEtaDate = new Date()
  maxEtaDate.setFullYear(maxEtaDate.getFullYear() + 1) // default 1 year
  
  if (activeGoals.length > 0) {
    maxEtaDate = new Date(Math.max(...activeGoals.map(g => new Date(g.rawEta).getTime())))
  }
  
  // difference in months
  const monthsRemaining = Math.max(1, (maxEtaDate.getFullYear() - now.getFullYear()) * 12 + maxEtaDate.getMonth() - now.getMonth())
  const pointsToRender = monthsRemaining + 1
  
  const targetMonthlyStep = (totalTarget - totalSaved) / Math.max(1, monthsRemaining)

  for (let i = 0; i < pointsToRender; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    months.push(d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }))
    
    targetData.push(Math.round(totalSaved + targetMonthlyStep * i))
    actualData.push(Math.round(totalSaved + totalMonthlyDeposit * i))
  }

  const chartData = {
    type: 'line' as const,
    height: 12,
    series: [
      { name: 'Target', data: targetData, color: 'secondary' },
      { name: 'Proyeksi Aktual', data: actualData, color: 'primary' },
    ],
    categories: months,
    extend: {
      stroke: { width: [2, 4], dashArray: [5, 0] },
      markers: { size: pointsToRender > 12 ? 0 : 4 },
      xaxis: { 
        tickAmount: Math.min(6, pointsToRender),
        labels: {
          formatter: (value: string) => {
            if (!value) return value
            return value.split(' ')
          }
        }
      },
      yaxis: {
        labels: {
          formatter: (value: number) => {
            if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}M`
            if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}k`
            return `Rp ${value}`
          }
        }
      }
    },
  }

  const estDateString = maxEtaDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  const isEmpty = (goals.length === 0 || (totalTarget === 0 && totalSaved === 0))

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-4 d-flex flex-column h-100">
        <h4 className="fw-bold text-secondary small text-uppercase mb-4">Savings Trajectory</h4>
        
        {isEmpty ? (
          <div className="text-center py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <Icon icon="chart-line" size={32} stroke={1.5} className="text-secondary opacity-50 mb-3" />
            <div className="fw-bold text-body mb-1" style={{ fontSize: '14px' }}>Belum Ada Proyeksi</div>
            <div className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.5' }}>Tambahkan impian untuk melihat proyeksi tabungan.</div>
          </div>
        ) : (
          <>
            <div className="mx-n2 flex-grow-1 d-flex align-items-center">
              <div className="w-100">
                <Chart chartId="goalTrajectory" chartData={{ ...chartData, height: 15 } as any} />
              </div>
            </div>
            <div className="mt-3 text-center small text-secondary pt-3 border-top">
              <div className="mb-2">
                Estimasi selesai: <span className="fw-bold text-body">{activeGoals.length > 0 ? estDateString : 'Tidak ada'}</span>
              </div>
              <p className="m-0" style={{ fontSize: '11px', lineHeight: '1.4', opacity: 0.8 }}>
                Jika Garis <strong>Proyeksi Aktual</strong> berada di atas garis <strong>Target</strong>, 
                rencana tabungan Anda sudah di jalur yang benar untuk mencapai impian Anda.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
