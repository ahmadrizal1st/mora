import { PeriodSummaryCard } from './PeriodSummaryCard'
import { CategoryBreakdownCard } from './CategoryBreakdownCard'
import { DailyHeatmapCard } from './DailyHeatmapCard'
import { TransactionsListCard } from './TransactionsListCard'
import { Icon } from '@/shared/components/ui/Icon'

interface ReportDashboardGridProps {
  income: number
  expense: number
  netBalance?: number
  savingRate?: number | null
  isDetail?: boolean
  dateFrom?: string
  dateTo?: string
  onClickDetail?: () => void
}

export function ReportDashboardGrid({
  income,
  expense,
  netBalance,
  savingRate,
  isDetail = false,
  dateFrom,
  dateTo,
  onClickDetail,
}: ReportDashboardGridProps) {
  const formatCurrency = (val: number) => Math.abs(val).toLocaleString('id-ID')
  const averageDaily = expense > 0 ? expense / 30 : 0

  return (
    <div className="row g-3 align-items-start">
      {/* ===========================
          LEFT COLUMN (sticky on desktop)
          =========================== */}
      <div className="col-12 col-lg-4">
        <div
          className="d-flex flex-column gap-3"
          style={{
            position: 'sticky',
            top: '16px',
          }}
        >
          {/* Period Summary Card */}
          <PeriodSummaryCard
            income={income}
            expense={expense}
            netBalance={netBalance}
            savingRate={savingRate}
            onNavigate={!isDetail && onClickDetail ? onClickDetail : undefined}
          />

          {/* Belum Lunas (detail only) */}
          {isDetail && (
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-3">
                <div className="fw-bold mb-2" style={{ fontSize: '14px' }}>Belum Lunas</div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary" style={{ fontSize: '13px' }}>Piutang</span>
                  <span className="fw-semibold" style={{ fontSize: '13px' }}>Tidak ada</span>
                </div>
              </div>
            </div>
          )}

          {/* Metric cards (on main page only) */}
          {!isDetail && (
            <div className="row g-2">
              <div className="col-6">
                <div className="card shadow-sm border-0 rounded-4 h-100">
                  <div className="card-body p-3">
                    <div className="text-secondary fw-bold mb-2" style={{ fontSize: '10px', letterSpacing: '1px' }}>TINGKAT MENABUNG</div>
                    <div className="fw-bold" style={{ fontSize: '22px', color: income > 0 && ((income - expense) / income) > 0 ? '#2d7d46' : '#e53e3e' }}>
                      {income > 0 ? `${Math.round(((income - expense) / income) * 100)}%` : 'N/A'}
                    </div>
                    <p className="text-secondary mb-0" style={{ fontSize: '10px' }}>Target ideal: ≥ 20%</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card shadow-sm border-0 rounded-4 h-100">
                  <div className="card-body p-3">
                    <div className="text-secondary fw-bold mb-2" style={{ fontSize: '10px', letterSpacing: '1px' }}>RATA-RATA HARIAN</div>
                    <div className="fw-bold" style={{ fontSize: '16px' }}>{formatCurrency(Math.round(averageDaily))}</div>
                    <div className="text-secondary" style={{ fontSize: '10px' }}>per hari &middot; pengeluaran</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alert (main page only, if data available) */}
          {!isDetail && expense > 0 && (
            <div className="alert d-flex align-items-start gap-2 p-2 mb-0 border-0 bg-danger-lt rounded-3">
              <Icon icon="trending-up" className="text-danger mt-1 flex-shrink-0" size={15} />
              <div className="flex-grow-1 text-danger" style={{ fontSize: '12px', lineHeight: 1.4 }}>
                Pantau kategori pengeluaran terbesar Anda bulan ini
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===========================
          RIGHT COLUMN (scrollable)
          =========================== */}
      <div className="col-12 col-lg-8">
        <div className="d-flex flex-column gap-3">
          {/* Category Donuts */}
          <CategoryBreakdownCard title="Dompet" dateFrom={dateFrom} dateTo={dateTo} />
          <CategoryBreakdownCard title="Kategori" dateFrom={dateFrom} dateTo={dateTo} />

          {/* Daily Heatmap */}
          <DailyHeatmapCard dateFrom={dateFrom} dateTo={dateTo} />

          {/* Transactions */}
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-3">
              <TransactionsListCard dateFrom={dateFrom} dateTo={dateTo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
