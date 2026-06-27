interface PeriodSummaryCardProps {
  income: number
  expense: number
  netBalance?: number
  savingRate?: number | null
  startDateLabel?: string
  endDateLabel?: string
  onNavigate?: () => void
}

export function PeriodSummaryCard({
  income,
  expense,
  netBalance,
  savingRate,
  startDateLabel,
  endDateLabel,
  onNavigate,
}: PeriodSummaryCardProps) {
  const formatCurrency = (val: number) => Math.abs(val).toLocaleString('id-ID')

  const saldo = netBalance ?? (income - expense)
  const averageDaily = expense > 0 ? expense / 30 : 0
  const koreksi = 0
  const savingPct = savingRate != null ? savingRate : income > 0 ? Math.round(((income - expense) / income) * 100) : null

  return (
    <div className="card shadow-sm border-0 rounded-4 w-100">
      {/* Header label */}
      <div className="card-header border-0 pb-0 d-flex align-items-center justify-content-between">
        <span className="text-secondary fw-bold" style={{ fontSize: '11px', letterSpacing: '1px' }}>RINGKASAN PERIODE</span>
        {(startDateLabel || endDateLabel) && onNavigate && (
          <button
            className="btn btn-sm btn-ghost-secondary rounded-pill p-0 px-2"
            style={{ fontSize: '12px' }}
            onClick={onNavigate}
          >
            Lihat Detail &rsaquo;
          </button>
        )}
      </div>

      <div className="card-body pt-2">
        {/* Summary rows */}
        <div className="d-flex justify-content-between align-items-center mb-2 py-1 border-bottom">
          <span className="text-secondary" style={{ fontSize: '14px' }}>Pemasukan</span>
          <span className="fw-bold text-success" style={{ fontSize: '14px' }}>+ {formatCurrency(income)}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2 py-1 border-bottom">
          <span className="text-secondary" style={{ fontSize: '14px' }}>Pengeluaran</span>
          <span className="fw-bold text-danger" style={{ fontSize: '14px' }}>- {formatCurrency(expense)}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3 py-1 border-bottom">
          <span className="text-secondary" style={{ fontSize: '14px' }}>Saldo Bersih</span>
          <span
            className={`fw-bold ${saldo >= 0 ? 'text-success' : 'text-danger'}`}
            style={{ fontSize: '14px' }}
          >
            {saldo >= 0 ? '+' : '-'} {formatCurrency(saldo)}
          </span>
        </div>

        {/* Metric cards row */}
        <div className="row g-2 mt-1">
          <div className="col-6">
            <div className="bg-light rounded-3 p-2 h-100">
              <div className="text-secondary mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px', fontWeight: 600 }}>TINGKAT MENABUNG</div>
              <div className="fw-bold" style={{ fontSize: '22px', color: savingPct != null && savingPct < 0 ? '#e53e3e' : '#2d7d46' }}>
                {savingPct != null ? `${savingPct}%` : 'N/A'}
              </div>
              <div className="text-secondary" style={{ fontSize: '10px' }}>Target: ≥ 20%</div>
            </div>
          </div>
          <div className="col-6">
            <div className="bg-light rounded-3 p-2 h-100">
              <div className="text-secondary mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px', fontWeight: 600 }}>RATA-RATA HARIAN</div>
              <div className="fw-bold" style={{ fontSize: '18px', color: '#333' }}>
                {formatCurrency(Math.round(averageDaily))}
              </div>
              <div className="text-secondary" style={{ fontSize: '10px' }}>per hari &middot; pengeluaran</div>
            </div>
          </div>
        </div>

        {koreksi !== 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
            <span className="text-secondary" style={{ fontSize: '13px' }}>Koreksi Saldo</span>
            <span className="fw-semibold text-success" style={{ fontSize: '13px' }}>+ {formatCurrency(koreksi)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
