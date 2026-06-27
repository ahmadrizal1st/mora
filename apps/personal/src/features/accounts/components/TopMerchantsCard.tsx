import { Icon } from '@/shared/components/ui/Icon'
import { Link } from '@tanstack/react-router'

export interface Merchant {
  name: string
  cat: string
  amount: string
  count: number
  icon: string
  color: string
}

interface TopMerchantsCardProps {
  merchants?: Merchant[]
}

export function TopMerchantsCard({ merchants = [] }: TopMerchantsCardProps) {
  return (
    <div className="card shadow-sm border-0 flex-grow-1 h-100">
      <div className="card-body p-3 d-flex flex-column">
        <div className="text-secondary text-uppercase fw-semibold fs-5 mb-4 flex-shrink-0">
          Top Merchants (Bulan Ini)
        </div>

        <div className="d-flex flex-column gap-2 flex-grow-1">
          {merchants.length === 0 ? (
            <div className="text-center py-4 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex justify-content-center text-secondary mb-3">
                <Icon icon="building-store" size={40} stroke={1.5} opacity={0.6} />
              </div>
              <div className="fw-bold text-body mb-1">Belum Ada Merchant</div>
              <div className="text-muted small">Transaksi Anda akan muncul di sini.</div>
              <Link to="/" className="btn btn-orange rounded-pill btn-sm mt-3 px-3">
                <Icon icon="plus" size={16} className="me-1" />
                Catat Transaksi
              </Link>
            </div>
          ) : (
            merchants.slice(0, 5).map((m, i) => (
              <div key={i} className="border-0">
                <div className="row align-items-center g-2">
                  <div className="col-auto">
                    <div
                      className="d-flex align-items-center justify-content-center text-white shadow-sm"
                      style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: m.color }}
                    >
                      <Icon icon={m.icon} size="sm" style={{ transform: 'scale(0.8)' }} />
                    </div>
                  </div>
                  <div className="col">
                    <div className="text-body fw-bold" style={{ fontSize: '0.8rem' }}>{m.name}</div>
                    <div className="text-secondary" style={{ fontSize: '0.7rem' }}>
                      {m.count} transaksi • {m.cat}
                    </div>
                  </div>
                  <div className="col-auto text-end">
                    <div className="text-body fw-bold font-monospace" style={{ fontSize: '0.8rem' }}>{m.amount}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
