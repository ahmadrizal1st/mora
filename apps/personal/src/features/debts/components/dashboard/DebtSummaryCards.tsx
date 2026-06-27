import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { clsx } from 'clsx'

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
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
          <div className="card-body p-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div 
                className="d-flex align-items-center justify-content-center text-white" 
                style={{ borderRadius: '10px', width: '32px', height: '32px', backgroundColor: '#2fb344' }}
              >
                <Icon icon="wallet" size="sm" className="text-white" />
              </div>
              <div className="subheader text-muted m-0 fw-bold" style={{ letterSpacing: '0.05em', fontSize: '10px' }}>
                TOTAL PIUTANG
              </div>
            </div>
            <div className="h1 mb-1 fw-bold lh-1 text-nowrap text-success" style={{ letterSpacing: '-0.5px' }}>
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
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
          <div className="card-body p-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div 
                className="d-flex align-items-center justify-content-center text-white" 
                style={{ borderRadius: '10px', width: '32px', height: '32px', backgroundColor: '#d63939' }}
              >
                <Icon icon="file-invoice" size="sm" className="text-white" />
              </div>
              <div className="subheader text-muted m-0 fw-bold" style={{ letterSpacing: '0.05em', fontSize: '10px' }}>
                TOTAL UTANG
              </div>
            </div>
            <div className="h1 mb-1 fw-bold lh-1 text-nowrap text-danger" style={{ letterSpacing: '-0.5px' }}>
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
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
          <div className="card-body p-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div 
                className="d-flex align-items-center justify-content-center text-white" 
                style={{ borderRadius: '10px', width: '32px', height: '32px', backgroundColor: '#f76707' }}
              >
                <Icon icon="calendar-due" size="sm" className="text-white" />
              </div>
              <div className="subheader text-muted m-0 fw-bold" style={{ letterSpacing: '0.05em', fontSize: '10px' }}>
                JATUH TEMPO MGG INI
              </div>
            </div>
            <div className="h1 mb-1 fw-bold lh-1 text-nowrap text-warning" style={{ letterSpacing: '-0.5px' }}>
              {jatuhTempoCount} Trx
            </div>
            <div className="text-muted small" style={{ fontSize: '11px' }}>
              Total {formatCurrency(jatuhTempoAmount)}
            </div>
          </div>
        </div>
      </div>

      {/* Arus Kas Bersih */}
      <div className="col-sm-6 col-lg-3">
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
          <div className="card-body p-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div 
                className="d-flex align-items-center justify-content-center text-white" 
                style={{ borderRadius: '10px', width: '32px', height: '32px', backgroundColor: isSurplus ? '#2fb344' : '#d63939' }}
              >
                <Icon icon="trending-up" size="sm" className="text-white" />
              </div>
              <div className="subheader text-muted m-0 fw-bold" style={{ letterSpacing: '0.05em', fontSize: '10px' }}>
                ARUS KAS BERSIH
              </div>
            </div>
            <div className={clsx('h1 mb-1 fw-bold lh-1 text-nowrap', isSurplus ? 'text-success' : 'text-danger')} style={{ letterSpacing: '-0.5px' }}>
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
