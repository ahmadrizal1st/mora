import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'

interface BudgetSummaryCardsProps {
  totalBudget: number
  spent: number
  safeToSpendPerDay: number
  currentDate: Date
}

export function BudgetSummaryCards({ totalBudget, spent, safeToSpendPerDay, currentDate }: BudgetSummaryCardsProps) {
  const sisaAnggaran = totalBudget - spent
  const percentage = totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0
  
  // Format current month and year (e.g. "Juni 2026")
  const monthYear = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

  return (
    <>
      {/* Total Budget */}
      <div className="flex-grow-1" style={{ flex: '1 1 20%', minWidth: '220px' }}>
        <div className="card shadow-none border h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body p-3 d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-3">
              <div 
                className="avatar rounded bg-primary text-white d-flex align-items-center justify-content-center" 
                style={{ width: '32px', height: '32px' }}
              >
                <Icon icon="wallet" size="sm" />
              </div>
              <div 
                className="text-muted fw-bold text-uppercase m-0" 
                style={{ fontSize: '11px', letterSpacing: '0.04em' }}
              >
                Total Budget
              </div>
            </div>
            <div className="d-flex flex-column gap-1">
              <div className="h2 m-0 fw-bold text-dark" style={{ letterSpacing: '-0.5px' }}>
                {formatCurrency(totalBudget)}
              </div>
              <div className="text-muted m-0 lh-1" style={{ fontSize: '12px' }}>
                {monthYear}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terpakai */}
      <div className="flex-grow-1" style={{ flex: '1 1 20%', minWidth: '220px' }}>
        <div className="card shadow-none border h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body p-3 d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-3">
              <div 
                className="avatar rounded bg-danger text-white d-flex align-items-center justify-content-center" 
                style={{ width: '32px', height: '32px' }}
              >
                <Icon icon="trending-down" size="sm" />
              </div>
              <div 
                className="text-muted fw-bold text-uppercase m-0" 
                style={{ fontSize: '11px', letterSpacing: '0.04em' }}
              >
                Terpakai
              </div>
            </div>
            <div className="d-flex flex-column gap-1">
              <div className="h2 m-0 fw-bold text-danger" style={{ letterSpacing: '-0.5px' }}>
                {formatCurrency(spent)}
              </div>
              <div className="text-muted m-0 lh-1" style={{ fontSize: '12px' }}>
                {percentage}% digunakan
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sisa Anggaran */}
      <div className="flex-grow-1" style={{ flex: '1 1 20%', minWidth: '220px' }}>
        <div className="card shadow-none border h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body p-3 d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-3">
              <div 
                className="avatar rounded bg-success text-white d-flex align-items-center justify-content-center" 
                style={{ width: '32px', height: '32px' }}
              >
                <Icon icon="cash" size="sm" />
              </div>
              <div 
                className="text-muted fw-bold text-uppercase m-0" 
                style={{ fontSize: '11px', letterSpacing: '0.04em' }}
              >
                Sisa Anggaran
              </div>
            </div>
            <div className="d-flex flex-column gap-1">
              <div className="h2 m-0 fw-bold text-success" style={{ letterSpacing: '-0.5px' }}>
                {sisaAnggaran < 0 ? '-' : ''}{formatCurrency(Math.abs(sisaAnggaran))}
              </div>
              <div className="text-muted m-0 lh-1" style={{ fontSize: '12px' }}>
                Tersedia
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Harian (Safe) */}
      <div className="flex-grow-1" style={{ flex: '1 1 20%', minWidth: '220px' }}>
        <div className="card shadow-none border h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body p-3 d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-3">
              <div 
                className="avatar rounded bg-orange text-white d-flex align-items-center justify-content-center" 
                style={{ width: '32px', height: '32px' }}
              >
                <Icon icon="shield-check" size="sm" />
              </div>
              <div 
                className="text-muted fw-bold text-uppercase m-0" 
                style={{ fontSize: '11px', letterSpacing: '0.04em' }}
              >
                Harian (Safe)
              </div>
            </div>
            <div className="d-flex flex-column gap-1">
              <div className="h2 m-0 fw-bold text-orange" style={{ letterSpacing: '-0.5px' }}>
                {safeToSpendPerDay < 0 ? '-' : ''}{formatCurrency(Math.abs(safeToSpendPerDay))}
              </div>
              <div className="text-muted m-0 lh-1" style={{ fontSize: '12px' }}>
                Estimasi harian
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
