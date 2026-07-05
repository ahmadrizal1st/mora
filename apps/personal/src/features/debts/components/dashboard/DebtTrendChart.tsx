import { useState, useMemo } from 'react'
import { Chart } from '@/shared/components/ui/Chart'
import { Icon } from '@/shared/components/ui/Icon'
import { Datepicker } from '@/shared/components/ui/Datepicker'
import { Modal, ModalHeader } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import type { DebtRecord } from '../../types/debt.types'

export function DebtTrendChart({ debts = [], onAdd }: { debts?: DebtRecord[], onAdd?: () => void }) {
  
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [, setAppliedCustomLabel] = useState('')

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
          {!debts || debts.length === 0 || (trendData.piutang.every(v => v === 0) && trendData.utang.every(v => v === 0)) ? (
          <div className="text-center py-4 flex-grow-1 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '200px' }}>
            <div className="d-flex justify-content-center text-secondary mb-3">
              <Icon icon="chart-bar" size={40} stroke={1.5} style={{ opacity: 0.6 }} />
            </div>
            <div className="fw-bold text-body mb-1">Belum Ada Tren</div>
            <div className="text-muted small">Tambahkan catatan utang atau piutang.</div>
          </div>
          ) : (
            <div className="flex-grow-1 d-flex flex-column justify-content-end" style={{ marginTop: '-40px' }}>
              <Chart chartId="debtTrendChart" chartData={chartData as any} />
            </div>
          )}
        </div>
      </div>

      <Modal show={showCustomModal} onClose={() => setShowCustomModal(false)} size="sm" centered>
        <ModalHeader title="Pilih Jarak Waktu" onClose={() => setShowCustomModal(false)} />
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
          <Button variant="link" color="secondary" onClick={() => setShowCustomModal(false)}>Batal</Button>
          <Button color="primary" onClick={() => {
            if (customStart && customEnd) {
              setAppliedCustomLabel(`${customStart} s/d ${customEnd}`)
              setShowCustomModal(false)
            }
          }}>Terapkan</Button>
        </div>
      </Modal>
    </>
  )
}
