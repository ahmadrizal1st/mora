import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'

interface BudgetSummaryCardsProps {
  totalBudget: number
  spent: number
  safeToSpendPerDay: number
}

export function BudgetSummaryCards({ totalBudget, spent, safeToSpendPerDay }: BudgetSummaryCardsProps) {
  const sisaAnggaran = totalBudget - spent
  const percentage = totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0
  
  // Format current month and year (e.g. "Juni 2026")
  const date = new Date()
  const monthYear = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

  return (
    <>
      {/* Total Budget */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="card shadow-none border h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body p-3">
            <div className="d-flex align-items-center mb-3">
              <div 
                className="avatar rounded bg-primary text-white d-flex align-items-center justify-content-center" 
                style={{ width: '32px', height: '32px' }}
              >
                <Icon icon="wallet" size="sm" />
              </div>
              <div 
                className="ms-3 text-muted fw-bold text-uppercase" 
                style={{ fontSize: '11px', letterSpacing: '0.04em' }}
              >
                Total Budget
              </div>
            </div>
            <div className="h2 mb-1 fw-bold text-dark" style={{ letterSpacing: '-0.5px' }}>
              {formatCurrency(totalBudget)}
            </div>
            <div className="text-muted" style={{ fontSize: '12px' }}>
              {monthYear}
            </div>
          </div>
        </div>
      </div>

      {/* Terpakai */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="card shadow-none border h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body p-3">
            <div className="d-flex align-items-center mb-3">
              <div 
                className="avatar rounded bg-danger text-white d-flex align-items-center justify-content-center" 
                style={{ width: '32px', height: '32px' }}
              >
                <Icon icon="trending-down" size="sm" />
              </div>
              <div 
                className="ms-3 text-muted fw-bold text-uppercase" 
                style={{ fontSize: '11px', letterSpacing: '0.04em' }}
              >
                Terpakai
              </div>
            </div>
            <div className="h2 mb-1 fw-bold text-danger" style={{ letterSpacing: '-0.5px' }}>
              {formatCurrency(spent)}
            </div>
            <div className="text-muted" style={{ fontSize: '12px' }}>
              {percentage}% digunakan
            </div>
          </div>
        </div>
      </div>

      {/* Sisa Anggaran */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="card shadow-none border h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body p-3">
            <div className="d-flex align-items-center mb-3">
              <div 
                className="avatar rounded bg-success text-white d-flex align-items-center justify-content-center" 
                style={{ width: '32px', height: '32px' }}
              >
                <Icon icon="cash" size="sm" />
              </div>
              <div 
                className="ms-3 text-muted fw-bold text-uppercase" 
                style={{ fontSize: '11px', letterSpacing: '0.04em' }}
              >
                Sisa Anggaran
              </div>
            </div>
            <div className="h2 mb-1 fw-bold text-success" style={{ letterSpacing: '-0.5px' }}>
              {sisaAnggaran < 0 ? '-' : ''}{formatCurrency(Math.abs(sisaAnggaran))}
            </div>
            <div className="text-muted" style={{ fontSize: '12px' }}>
              Tersedia
            </div>
          </div>
        </div>
      </div>

      {/* Harian (Safe) */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="card shadow-none border h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body p-3">
            <div className="d-flex align-items-center mb-3">
              <div 
                className="avatar rounded bg-orange text-white d-flex align-items-center justify-content-center" 
                style={{ width: '32px', height: '32px' }}
              >
                <Icon icon="shield-check" size="sm" />
              </div>
              <div 
                className="ms-3 text-muted fw-bold text-uppercase" 
                style={{ fontSize: '11px', letterSpacing: '0.04em' }}
              >
                Harian (Safe)
              </div>
            </div>
            <div className="h2 mb-1 fw-bold text-orange" style={{ letterSpacing: '-0.5px' }}>
              {safeToSpendPerDay < 0 ? '-' : ''}{formatCurrency(Math.abs(safeToSpendPerDay))}
            </div>
            <div className="text-muted" style={{ fontSize: '12px' }}>
              Estimasi harian
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
