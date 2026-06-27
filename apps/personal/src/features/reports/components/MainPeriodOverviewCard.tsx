import { Link } from '@tanstack/react-router'
import { Icon } from '@/shared/components/ui/Icon'

export function MainPeriodOverviewCard() {
  const formatCurrency = (val: number) => Math.abs(val).toLocaleString('id-ID')

  return (
    <Link to="/reports/2026-06" className="text-decoration-none">
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div style={{ width: 24 }}></div> {/* spacer for centering */}
            <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '15px' }}>
              01 Jun 2026 - 30 Jun 2026
            </h4>
            <Icon icon="chevron-right" className="text-secondary" />
          </div>
          
          <div className="d-flex flex-column gap-2 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-secondary">Saldo Awal</span>
              <span className="fw-bold text-dark">{formatCurrency(14648010)}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-secondary">Pengeluaran</span>
              <span className="fw-bold text-danger">- {formatCurrency(113630000)}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-secondary">Pemasukan</span>
              <span className="fw-bold text-success">+ {formatCurrency(450300000)}</span>
            </div>
          </div>

          <hr className="my-3 border-light" />

          <div className="d-flex flex-column gap-2 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-secondary">Saldo</span>
              <span className="fw-bold text-success">+ {formatCurrency(336670000)}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-secondary">Koreksi Saldo</span>
              <span className="fw-bold text-success">+ {formatCurrency(35700000)}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-secondary">Tingkat Menabung</span>
              <span className="fw-bold text-dark">N/A</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-secondary">Rata-rata Harian</span>
              <span className="fw-bold text-dark">{formatCurrency(3787666)}</span>
            </div>
          </div>

          <hr className="my-3 border-light" />

          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold text-dark">Saldo Akhir</span>
            <span className="fw-bold text-success">+ {formatCurrency(387018010)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
