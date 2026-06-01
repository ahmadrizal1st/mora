import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'

interface DebtOverviewCardProps {
  totalDebt: number
  totalReceivable: number
  activeDebtCount: number
  activeReceivableCount: number
}

export function DebtOverviewCard({
  totalDebt,
  totalReceivable,
  activeDebtCount,
  activeReceivableCount,
}: DebtOverviewCardProps) {
  const netPosition = totalReceivable - totalDebt
  const isPositive = netPosition >= 0

  return (
    <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4">
        <h3 className="card-title fw-bold mb-4 d-flex align-items-center gap-2">
          <Icon icon="wallet" size="sm" className="text-primary" />
          Ringkasan Keuangan
        </h3>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="d-flex align-items-center p-3 rounded-3 bg-danger-lt border border-danger-subtle h-100">
              <div className="avatar bg-danger text-white me-3 shadow-sm">
                <Icon icon="arrow-down-right" />
              </div>
              <div>
                <div className="text-danger fw-semibold small mb-1">Total Utang (Harus Dibayar)</div>
                <div className="fs-3 fw-bold text-dark">{formatCurrency(totalDebt)}</div>
                <div className="text-muted small mt-1">{activeDebtCount} tagihan aktif</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex align-items-center p-3 rounded-3 bg-success-lt border border-success-subtle h-100">
              <div className="avatar bg-success text-white me-3 shadow-sm">
                <Icon icon="arrow-up-right" />
              </div>
              <div>
                <div className="text-success fw-semibold small mb-1">Total Piutang (Akan Diterima)</div>
                <div className="fs-3 fw-bold text-dark">{formatCurrency(totalReceivable)}</div>
                <div className="text-muted small mt-1">{activeReceivableCount} tagihan aktif</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-top d-flex align-items-center justify-content-between">
          <div>
            <span className="text-muted small fw-medium">Posisi Bersih:</span>
          </div>
          <div className={`fs-4 fw-bold ${isPositive ? 'text-success' : 'text-danger'} d-flex align-items-center gap-2`}>
            {isPositive ? <Icon icon="trending-up" size="sm" /> : <Icon icon="trending-down" size="sm" />}
            {formatCurrency(Math.abs(netPosition))} {isPositive ? '(Surplus)' : '(Defisit)'}
          </div>
        </div>
      </div>
    </div>
  )
}
