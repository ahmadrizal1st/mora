import { useState } from 'react'
import { Chart } from '@/shared/components/ui/Chart'
import { Icon } from '@/shared/components/ui/Icon'
import { Datepicker } from '@/shared/components/ui/Datepicker'

interface CashFlowChartCardProps {
  range: string
  setRange: (r: string) => void
  groupBy?: string
  setGroupBy?: (g: string) => void
  balance: string | number
  data: {
    lbl: string[]
    inc: number[]
    exp: number[]
  }
}

export function CashFlowChartCard({ range, setRange, groupBy, setGroupBy, balance, data }: CashFlowChartCardProps) {
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

  const chartData = {
    type: 'bar' as const,
    height: 18,
    series: [
      { name: 'Income', data: data.inc, color: 'primary' },
      { name: 'Expense', data: data.exp, color: 'secondary' },
    ],
    categories: data.lbl,
    legend: true,
    datalabels: false,
    stacked: true,
    xaxis: {
      labels: {
        show: true,
        style: { fontSize: '11px', fontWeight: 500, color: 'var(--tblr-secondary)' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        show: false,
      },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        style: { fontSize: '11px', color: 'var(--tblr-secondary)' },
        formatter: (val: number) => {
          if (val === undefined || val === null) return '';
          const absoluteVal = Math.abs(val)
          if (absoluteVal >= 1000000000) return `${(absoluteVal / 1000000000).toFixed(1)}M`
          if (absoluteVal >= 1000000) return `${(absoluteVal / 1000000).toFixed(1)}Jt`
          if (absoluteVal >= 1000) return `${(absoluteVal / 1000).toFixed(0)}K`
          return absoluteVal.toString()
        },
      },
    },
    grid: {
      borderColor: 'var(--tblr-border-color-light)',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    legendOptions: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      offsetY: -30,
      markers: { radius: 4 },
    },
    extend: {
      tooltip: {
        y: {
          formatter: (val: number) => {
            return 'Rp ' + Math.abs(val).toLocaleString('id-ID')
          }
        }
      }
    }
  }

  return (
    <div className="card border-0 shadow-sm flex-grow-1 d-flex flex-column h-100">
      <div className="card-header">
        <h3 className="card-title">Cashflow</h3>
        <div className="card-actions d-flex align-items-center">
          {groupBy && setGroupBy && (
            <div className="dropdown me-3">
              <a
                href="#"
                className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
                data-bs-toggle="dropdown"
              >
                <span className="text-decoration-underline-hover">Per {groupBy === 'day' ? 'Hari' : groupBy === 'week' ? 'Minggu' : 'Bulan'}</span>
                <Icon icon="chevron-down" size="xs" />
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                <button className="dropdown-item" onClick={() => setGroupBy('day')}>Per Hari</button>
                {range !== 'W' && (
                  <button className="dropdown-item" onClick={() => setGroupBy('week')}>Per Minggu</button>
                )}
                {(range !== 'W' && range !== 'M') && (
                  <button className="dropdown-item" onClick={() => setGroupBy('month')}>Per Bulan</button>
                )}
              </div>
            </div>
          )}
          <div className="dropdown">
            <a
              href="#"
              className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
              data-bs-toggle="dropdown"
            >
              <span className="text-decoration-underline-hover">{displayLabel}</span>
              <Icon icon="chevron-down" size="xs" />
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              <button className="dropdown-item" onClick={() => setRange('W')}>This Week</button>
              <button className="dropdown-item" onClick={() => setRange('M')}>This Month</button>
              <button className="dropdown-item" onClick={() => setRange('Y')}>This Year</button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => {
                setRange('Custom')
                setShowCustomModal(true)
              }}>
                <Icon icon="calendar-event" size="sm" className="me-2" />
                Custom Jarak Waktu...
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body d-flex flex-column gap-2">
        <div>
          <div className="subheader text-muted text-mobile-xs">Total Balance</div>
          <div className="h1 mb-0 h1-mobile">{typeof balance === 'number' ? `Rp ${balance.toLocaleString('id-ID')}` : balance}</div>
        </div>
        
        {data.lbl.length === 0 ? (
          <div className="text-center py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex justify-content-center text-secondary mb-3">
              <Icon icon="chart-bar-off" size={40} stroke={1.5} opacity={0.6} />
            </div>
            <div className="fw-bold text-body mb-1">Data Cash Flow Kosong</div>
            <div className="text-muted small">Belum ada aktivitas mutasi untuk periode ini.</div>
          </div>
        ) : (
          <Chart chartId="cashflow-acc-bars" chartData={chartData as any} />
        )}
      </div>

      {/* Custom Date Range Modal */}
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
    </div>
  )
}
