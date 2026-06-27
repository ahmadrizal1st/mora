import { useState } from 'react'
import { Chart } from '@/shared/components/ui/Chart'
import { Icon } from '@/shared/components/ui/Icon'
import { Datepicker } from '@/shared/components/ui/Datepicker'

const MOCK_DEBT_TREND = {
  categories: ['1 Mei', '6 Mei', '11 Mei', '16 Mei', '21 Mei', '26 Mei', '31 Mei'],
  piutang: [6000000, 11000000, 9000000, 7000000, 11000000, 10000000, 13000000],
  utang: [3000000, 4000000, 5000000, 3000000, 5000000, 7000000, 6000000],
}

export function DebtTrendChart() {
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

  const chartData = {
    type: 'line' as const,
    height: 15,
    series: [
      { name: 'Piutang', data: MOCK_DEBT_TREND.piutang, color: 'success' },
      { name: 'Utang', data: MOCK_DEBT_TREND.utang, color: 'danger' },
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
        categories: MOCK_DEBT_TREND.categories,
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
          formatter: (val: number) => `${val / 1000000}jt`,
        },
      },
      grid: {
        show: true,
        borderColor: 'var(--tblr-border-color)',
        strokeDashArray: 4,
        padding: { bottom: 5 },
      },
      markers: {
        size: 0,
      },
    },
  }

  return (
    <>
      <div className="card border-0 shadow-sm d-flex flex-column h-100">
        <div className="card-header">
          <h3 className="card-title">Debt & Receivable Trend</h3>
          <div className="card-actions d-flex align-items-center">
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
                {range !== 'Y' && (
                  <button className="dropdown-item" onClick={() => setGroupBy('day')}>Per Hari</button>
                )}
                {range !== 'W' && (
                  <button className="dropdown-item" onClick={() => setGroupBy('week')}>Per Minggu</button>
                )}
                {(range !== 'W' && range !== 'M') && (
                  <button className="dropdown-item" onClick={() => setGroupBy('month')}>Per Bulan</button>
                )}
              </div>
            </div>
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
                <button className="dropdown-item" onClick={() => handleSetRange('W')}>This Week</button>
                <button className="dropdown-item" onClick={() => handleSetRange('M')}>This Month</button>
                <button className="dropdown-item" onClick={() => handleSetRange('Y')}>This Year</button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => {
                  handleSetRange('Custom')
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
            <div className="subheader text-muted text-mobile-xs">NET BALANCE</div>
            <div className="h1 mb-0 h1-mobile">
              Rp {(MOCK_DEBT_TREND.piutang[MOCK_DEBT_TREND.piutang.length - 1] - MOCK_DEBT_TREND.utang[MOCK_DEBT_TREND.utang.length - 1]).toLocaleString('id-ID')}
            </div>
          </div>
          <Chart chartId="debtTrendChart" chartData={chartData as any} />
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
