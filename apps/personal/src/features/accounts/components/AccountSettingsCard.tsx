import { Icon } from '@/shared/components/ui/Icon'

export function AccountSettingsCard() {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-3">
        <div className="text-secondary text-uppercase fw-semibold fs-5 mb-3">
          Account Security & Limits
        </div>

        <div className="list-group list-group-flush">
          <div className="list-group-item px-0 border-0 py-2">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <Icon icon="shield-lock" size="sm" className="text-success" />
                <span className="text-body small fw-medium">Status Keamanan</span>
              </div>
              <span className="badge bg-success-lt">Terlindungi</span>
            </div>
          </div>

          <div className="list-group-item px-0 border-0 py-2">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <Icon icon="arrows-up-down" size="sm" className="text-primary" />
                <span className="text-body small fw-medium">Limit Transfer Harian</span>
              </div>
              <span className="text-body fw-bold font-monospace small">Rp 25.000.000</span>
            </div>
          </div>

          <div className="list-group-item px-0 border-0 py-2">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <Icon icon="refresh" size="sm" className="text-secondary" />
                <span className="text-body small fw-medium">Auto-debit Status</span>
              </div>
              <span className="text-secondary small">3 Aktif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
