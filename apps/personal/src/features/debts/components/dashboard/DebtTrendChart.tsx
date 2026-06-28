import { useState, useMemo } from 'react'
import { Chart } from '@/shared/components/ui/Chart'
import { Icon } from '@/shared/components/ui/Icon'
import { Datepicker } from '@/shared/components/ui/Datepicker'
import type { DebtRecord } from '../../types/debt.types'

export function DebtTrendChart({ debts = [] }: { debts?: DebtRecord[] }) {
  const [range, setRange] = useState('W')
  const [groupBy, setGroupBy] = useState('day')
  
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [appliedCustomLabel, setAppliedCustomLabel] = useState('')

  const rangeLabels: Record<string, string> = {
    'W': 'This Week',
    'M': 'This Month',
    'Y': 'This Year',
    'Custom': 'Custom Jarak Waktu...'
  }

  let displayLabel = rangeLabels[range] || 'Select Range'
  if (range === 'Custom' && appliedCustomLabel) {
    displayLabel = appliedCustomLabel
  }

  const handleSetRange = (r: string) => {
    setRange(r)
    if (r === 'W') setGroupBy('day')
    else if (r === 'M') setGroupBy('week')
    else if (r === 'Y') setGroupBy('month')
  }

  // Compute trend data dynamically
  const trendData = useMemo(() => {
    if (!debts || debts.length === 0) {
      return { categories: ['Kosong'], piutang: [0], utang: [0] }
    }
    
    // Sort debts by due date ascending
    const sorted = [...debts].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    
    // Group by month-year for simplicity in this demo (or could use day)
    const grouped: Record<string, { utang: number, piutang: number }> = {}
    
    sorted.forEach(d => {
      const date = new Date(d.dueDate)
      const label = date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
      if (!grouped[label]) grouped[label] = { utang: 0, piutang: 0 }
      
      if (d.type === 'Utang' && d.status !== 'Lunas') {
        grouped[label].utang += d.amount
      } else if (d.type === 'Piutang' && d.status !== 'Lunas') {
        grouped[label].piutang += d.amount
      }
    })

    const categories = Object.keys(grouped)
    if (categories.length === 0) return { categories: ['Kosong'], piutang: [0], utang: [0] }
    
    const piutang = categories.map(c => grouped[c].piutang)
    const utang = categories.map(c => grouped[c].utang)

    return { categories, piutang, utang }
  }, [debts])

  const currentNetBalance = useMemo(() => {
    const totalUtang = debts.filter(d => d.type === 'Utang' && d.status !== 'Lunas').reduce((sum, d) => sum + d.amount, 0)
    const totalPiutang = debts.filter(d => d.type === 'Piutang' && d.status !== 'Lunas').reduce((sum, d) => sum + d.amount, 0)
    return totalPiutang - totalUtang
  }, [debts])

  const chartData = {
    type: 'line' as const,
    height: 16,
    series: [
      { name: 'Piutang', data: trendData.piutang, color: 'success' },
      { name: 'Utang', data: trendData.utang, color: 'danger' },
    ],
    sparkline: false,
    strokeWidth: [3, 3],
    strokeCurve: 'smooth',
    legend: true,
    legendOptions: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      offsetY: -30,
      markers: { width: 12, height: 12, radius: 0 },
    },
    extend: {
      xaxis: {
        categories: trendData.categories,
        labels: {
          show: true,
          style: { fontSize: '12px', fontWeight: 500, cssClass: 'text-muted' },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        show: true,
        labels: {
          style: { fontSize: '12px', fontWeight: 500, cssClass: 'text-muted' },
          formatter: (val: number) => `Rp ${(val / 1000000).toFixed(1)}jt`,
        },
      },
      grid: {
        show: true,
        borderColor: 'var(--tblr-border-color)',
        strokeDashArray: 4,
        padding: { bottom: 0, top: -20 },
      },
      markers: {
        size: 4,
      },
    },
  }

  return (
    <>
      <div className="card border-0 shadow-sm d-flex flex-column h-100">
        <div className="card-header">
          <h3 className="card-title">Debt & Receivable Trend</h3>
        </div>
        <div className="card-body d-flex flex-column gap-2 flex-grow-1">
          <div>
            <div className="subheader text-muted text-mobile-xs">NET BALANCE</div>
            <div className="h1 mb-0 h1-mobile">
              Rp {currentNetBalance.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="flex-grow-1 d-flex flex-column justify-content-end" style={{ marginTop: '-40px' }}>
            <Chart chartId="debtTrendChart" chartData={chartData as any} />
          </div>
        </div>
      </div>

      {showCustomModal && (
        <div className="modal modal-blur fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Pilih Jarak Waktu</h5>
                <button type="button" className="btn-close" onClick={() => setShowCustomModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tanggal Mulai</label>
                  <Datepicker value={customStart} onChange={setCustomStart} />
                </div>
                <div>
                  <label className="form-label">Tanggal Akhir</label>
                  <Datepicker value={customEnd} onChange={setCustomEnd} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-link link-secondary" onClick={() => setShowCustomModal(false)}>Batal</button>
                <button type="button" className="btn btn-primary" onClick={() => {
                  if (customStart && customEnd) {
                    setAppliedCustomLabel(`${customStart} s/d ${customEnd}`)
                    setShowCustomModal(false)
                  }
                }}>Terapkan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
