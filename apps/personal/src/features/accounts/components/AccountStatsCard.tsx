import { Icon } from '@/shared/components/ui/Icon'

export function AccountStatsCard() {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-3">
        <div className="text-secondary text-uppercase fw-semibold fs-5 mb-3">
          Statistik Akun (Mei)
        </div>

        <div className="row g-3">
          <div className="col-6">
            <div className="p-2 bg-body-tertiary rounded text-center">
              <div className="text-secondary small mb-1">Rerata Harian</div>
              <div className="text-body fw-bold font-monospace">Rp 320rb</div>
            </div>
          </div>
          <div className="col-6">
            <div className="p-2 bg-body-tertiary rounded text-center">
              <div className="text-secondary small mb-1">Frekuensi</div>
              <div className="text-body fw-bold font-monospace">1.2x / hari</div>
            </div>
          </div>
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between p-2 border-dashed border-1 rounded">
              <div className="d-flex align-items-center gap-2">
                <Icon icon="calendar-stats" size="sm" className="text-primary" />
                <span className="text-secondary small">Hari Paling Boros</span>
              </div>
              <span className="text-body fw-bold small">Jumat, 12 Mei</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
