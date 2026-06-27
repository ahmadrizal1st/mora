import { useNavigate } from '@tanstack/react-router'

interface PeriodCardProps {
  dateFrom: string
  dateTo: string
  income: number
  expense: number
  startBalance?: number
  endBalance?: number
  correctionBalance?: number
  loanBalance?: number
}

function fmt(val: number) {
  return Math.abs(val).toLocaleString('id-ID')
}

function fmtDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

type Row = {
  label: string
  value: string
  color?: string
  bold?: boolean
  separator?: boolean
}

export function PeriodCard({
  dateFrom,
  dateTo,
  income,
  expense,
  startBalance = 0,
  endBalance,
  correctionBalance = 0,
  loanBalance = 0,
}: PeriodCardProps) {
  const navigate = useNavigate()

  const saldo = income - expense
  const savingRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0
  const avgDaily = expense > 0 ? Math.round(expense / 30) : 0
  const calcEndBalance = endBalance ?? (startBalance + saldo - loanBalance + correctionBalance)

  const fromLabel = fmtDate(dateFrom)
  const toLabel = fmtDate(dateTo)

  const handleClick = () => {
    const d = new Date(dateFrom + 'T00:00:00')
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    const lastDay = new Date(y, m, 0).getDate()
    const isFullMonth =
      dateFrom === `${y}-${String(m).padStart(2, '0')}-01` &&
      dateTo === `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
    const periodId = isFullMonth
      ? `${y}-${String(m).padStart(2, '0')}`
      : `${dateFrom}_${dateTo}`
    navigate({ to: `/reports/${periodId}` })
  }

  const rows: Row[] = [
    { label: 'Saldo Awal', value: fmt(startBalance) },
    { label: 'Pengeluaran', value: `- ${fmt(expense)}`, color: '#e53e3e' },
    { label: 'Pemasukan', value: `+ ${fmt(income)}`, color: '#38a169' },
    { label: 'Saldo', value: `+ ${fmt(saldo)}`, color: saldo >= 0 ? '#38a169' : '#e53e3e', separator: true },
    { label: 'Pinjaman', value: loanBalance > 0 ? `- ${fmt(loanBalance)}` : '0', color: loanBalance > 0 ? '#e53e3e' : undefined },
    { label: 'Koreksi Saldo', value: correctionBalance !== 0 ? `+ ${fmt(correctionBalance)}` : '0', color: correctionBalance > 0 ? '#38a169' : undefined },
    { label: 'Tingkat Menabung', value: `${savingRate}%` },
    { label: 'Rata-rata Harian', value: fmt(avgDaily) },
  ]

  return (
    <div
      className="card shadow-sm border-0 rounded-4 mb-3 overflow-hidden"
      style={{ cursor: 'pointer' }}
      onClick={handleClick}
    >
      {/* Header — date centered, chevron right */}
      <div
        className="position-relative d-flex align-items-center justify-content-center py-3 px-4"
        style={{ borderBottom: '1px solid #f0f0f0', minHeight: '52px' }}
      >
        <span className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
          {fromLabel} - {toLabel}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18" height="18"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="#aaa"
          fill="none"
          className="position-absolute end-0 me-3"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </div>

      {/* Rows */}
      <div>
        {rows.map((row, i) => (
          <div key={row.label}>
            {row.separator && <div style={{ height: '1px', backgroundColor: '#f0f0f0' }} />}
            <div
              className="d-flex justify-content-between align-items-center px-4"
              style={{
                padding: '10px 24px',
                borderBottom: i < rows.length - 1 ? '1px solid #fafafa' : undefined,
                fontSize: '14px',
              }}
            >
              <span style={{ color: '#718096' }}>{row.label}</span>
              <span
                style={{
                  color: row.color || '#1a202c',
                  fontWeight: row.bold ? 700 : 500,
                }}
              >
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer: Saldo Akhir */}
      <div
        className="d-flex justify-content-between align-items-center px-4"
        style={{
          padding: '12px 24px',
          borderTop: '1px solid #f0f0f0',
          fontSize: '14px',
        }}
      >
        <span style={{ fontWeight: 700, color: '#1a202c' }}>Saldo Akhir</span>
        <span style={{ fontWeight: 700, color: calcEndBalance >= 0 ? '#38a169' : '#e53e3e' }}>
          + {fmt(calcEndBalance)}
        </span>
      </div>
    </div>
  )
}
