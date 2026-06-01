import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'

interface DebtSummaryCardsProps {
  totalPiutang: number
  totalUtang: number
  jatuhTempoCount: number
  jatuhTempoAmount: number
  arusKasBersih: number
}

export function DebtSummaryCards({
  totalPiutang,
  totalUtang,
  jatuhTempoCount,
  jatuhTempoAmount,
  arusKasBersih,
}: DebtSummaryCardsProps) {
  const isSurplus = arusKasBersih >= 0

  return (
    <div className="row g-3">
      {/* Total Piutang */}
      <div className="col-sm-6 col-lg-3">
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <div 
                className="avatar bg-green text-white rounded-3 me-2 d-flex align-items-center justify-content-center" 
                style={{ width: '28px', height: '28px' }}
              >
                <Icon icon="wallet" size={16} />
              </div>
              <div className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                Total Piutang
              </div>
            </div>
            <div className="h2 fw-bold text-dark mb-1" style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
              {formatCurrency(totalPiutang)}
            </div>
            <div className="text-muted small" style={{ fontSize: '11px' }}>
              +12,4% bulan ini
            </div>
          </div>
        </div>
      </div>

      {/* Total Utang */}
      <div className="col-sm-6 col-lg-3">
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <div 
                className="avatar bg-red text-white rounded-3 me-2 d-flex align-items-center justify-content-center" 
                style={{ width: '28px', height: '28px' }}
              >
                <Icon icon="file-invoice" size={16} />
              </div>
              <div className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                Total Utang
              </div>
            </div>
            <div className="h2 fw-bold text-danger mb-1" style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
              {formatCurrency(totalUtang)}
            </div>
            <div className="text-muted small" style={{ fontSize: '11px' }}>
              +8,7% bulan ini
            </div>
          </div>
        </div>
      </div>

      {/* Jatuh Tempo */}
      <div className="col-sm-6 col-lg-3">
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <div 
                className="avatar bg-orange text-white rounded-3 me-2 d-flex align-items-center justify-content-center" 
                style={{ width: '28px', height: '28px' }}
              >
                <Icon icon="calendar-due" size={16} />
              </div>
              <div className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                Jatuh Tempo Mgg Ini
              </div>
            </div>
            <div className="h2 fw-bold text-orange mb-1" style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
              {jatuhTempoCount} Transaksi
            </div>
            <div className="text-muted small" style={{ fontSize: '11px' }}>
              Total {formatCurrency(jatuhTempoAmount)}
            </div>
          </div>
        </div>
      </div>

      {/* Arus Kas Bersih */}
      <div className="col-sm-6 col-lg-3">
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '12px' }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <div 
                className="avatar bg-blue text-white rounded-3 me-2 d-flex align-items-center justify-content-center" 
                style={{ width: '28px', height: '28px' }}
              >
                <Icon icon="trending-up" size={16} />
              </div>
              <div className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                Arus Kas Bersih
              </div>
            </div>
            <div className="h2 fw-bold text-blue mb-1" style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
              {isSurplus ? '+' : '-'}{formatCurrency(Math.abs(arusKasBersih))}
            </div>
            <div className="text-muted small" style={{ fontSize: '11px' }}>
              +15,3% bulan ini
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
