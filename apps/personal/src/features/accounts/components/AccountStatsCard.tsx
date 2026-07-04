import { Icon } from '@/shared/components/ui/Icon'
import { Link } from '@tanstack/react-router'

export interface AccountStats {
  daily_avg: string
  frequency: string
  most_expensive_day: string
}

interface AccountStatsCardProps {
  stats?: AccountStats
}

export function AccountStatsCard({ stats }: AccountStatsCardProps) {
  const { daily_avg = '-', frequency = '-', most_expensive_day = '-' } = stats || {}
  const isEmpty = !stats || !stats.daily_avg || stats.daily_avg === '-' || stats.daily_avg === '0' || stats.daily_avg === 'Rp 0'

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-3">
        <div className="text-secondary text-uppercase fw-semibold fs-5 mb-3">
          Statistik Akun (Bulan Ini)
        </div>

        {isEmpty ? (
          <div className="text-center py-4 d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex justify-content-center text-secondary mb-3">
              <Icon icon="chart-line" size={40} stroke={1.5} style={{ opacity: 0.6 }} />
            </div>
            <div className="fw-bold text-body mb-1">Belum Ada Statistik</div>
            <div className="text-muted small mb-3">Catat transaksi untuk melihat statistik.</div>
            <Link to="/tracker/" className="btn btn-primary btn-sm d-flex align-items-center gap-2">
              <Icon icon="plus" size={16} stroke={2} />
              Catat Transaksi
            </Link>
          </div>
        ) : (
          <div className="row g-3">
            <div className="col-6">
              <div className="p-2 bg-body-tertiary rounded text-center">
                <div className="text-secondary small mb-1">Rerata Harian</div>
                <div className="text-body fw-bold font-monospace">{daily_avg}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="p-2 bg-body-tertiary rounded text-center">
                <div className="text-secondary small mb-1">Frekuensi</div>
                <div className="text-body fw-bold font-monospace">{frequency}</div>
              </div>
            </div>
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between p-2 border-dashed border-1 rounded">
                <div className="d-flex align-items-center gap-2">
                  <Icon icon="calendar-stats" size="sm" className="text-primary" />
                  <span className="text-secondary small">Hari Paling Boros</span>
                </div>
                <span className="text-body fw-bold small">{most_expensive_day}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
