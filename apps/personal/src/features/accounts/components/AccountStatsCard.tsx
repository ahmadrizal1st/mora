import { Icon } from '@/shared/components/ui/Icon'

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

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-3">
        <div className="text-secondary text-uppercase fw-semibold fs-5 mb-3">
          Statistik Akun (Bulan Ini)
        </div>

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
      </div>
    </div>
  )
}
