import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'

export function DebtRemindersWidget() {
  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
      <div className="card-header border-bottom-0 bg-transparent p-3 pb-2 d-flex justify-content-between align-items-center">
        <h4 className="card-title fw-bold m-0" style={{ fontSize: '15px' }}>Pengingat Jatuh Tempo</h4>
        <a href="#" className="text-muted small text-decoration-none" style={{ fontSize: '12px' }}>Lihat semua</a>
      </div>
      <div className="card-body p-3 pt-0">
        {/* Hari Ini */}
        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-red badge-blink" style={{ width: 6, height: 6, minWidth: 6 }}></span>
              <span className="text-danger fw-bold" style={{ fontSize: '12px' }}>Hari Ini</span>
            </div>
            <span className="text-muted" style={{ fontSize: '11px' }}>Total Rp 1.200.000</span>
          </div>
          
          <div className="d-flex justify-content-between align-items-center p-2 rounded-3 mb-2" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="d-flex align-items-center gap-2">
              <span className="avatar avatar-sm rounded-circle bg-white shadow-sm border" style={{ backgroundImage: 'url(https://i.pravatar.cc/150?u=1)' }}></span>
              <div>
                <div className="fw-semibold small text-dark">Utang Bank Mandiri</div>
                <div className="text-danger" style={{ fontSize: '10px' }}>Jatuh Tempo Hari Ini</div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold text-dark small">Rp 1.200.000</span>
              <Icon icon="chevron-right" size={14} className="text-muted" />
            </div>
          </div>
        </div>

        {/* Besok */}
        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-orange" style={{ width: 6, height: 6, minWidth: 6 }}></span>
              <span className="text-orange fw-bold" style={{ fontSize: '12px' }}>Besok</span>
            </div>
            <span className="text-muted" style={{ fontSize: '11px' }}>Total Rp 500.000</span>
          </div>
          
          <div className="d-flex justify-content-between align-items-center p-2 rounded-3 mb-2" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="d-flex align-items-center gap-2">
              <span className="avatar avatar-sm rounded-circle bg-white shadow-sm border" style={{ backgroundImage: 'url(https://i.pravatar.cc/150?u=2)' }}></span>
              <div>
                <div className="fw-semibold small text-dark">Piutang Budi</div>
                <div className="text-orange" style={{ fontSize: '10px' }}>Jatuh Tempo Besok</div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold text-dark small">Rp 500.000</span>
              <Icon icon="chevron-right" size={14} className="text-muted" />
            </div>
          </div>
        </div>

        {/* Minggu Ini */}
        <div>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-yellow" style={{ width: 6, height: 6, minWidth: 6 }}></span>
              <span className="text-yellow fw-bold" style={{ fontSize: '12px' }}>Minggu Ini</span>
            </div>
            <span className="text-muted" style={{ fontSize: '11px' }}>Total Rp 1.000.000</span>
          </div>
          
          <div className="d-flex justify-content-between align-items-center p-2 rounded-3 mb-2" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="d-flex align-items-center gap-2">
              <span className="avatar avatar-sm rounded-circle bg-white shadow-sm border" style={{ backgroundImage: 'url(https://i.pravatar.cc/150?u=4)' }}></span>
              <div>
                <div className="fw-semibold small text-dark">Piutang Ahmad</div>
                <div className="text-muted" style={{ fontSize: '10px' }}>12 Mei 2026</div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold text-dark small">Rp 1.000.000</span>
              <Icon icon="chevron-right" size={14} className="text-muted" />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
