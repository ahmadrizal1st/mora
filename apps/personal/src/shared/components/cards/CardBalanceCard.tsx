import { Icon } from '@/shared/components/ui/Icon'

const holdings = [
  {
    name: 'BCA Tabungan',
    ticker: 'Rek. Utama',
    value: 'Rp 12.500.000',
    pct: '+2.1%',
    positive: true,
    icon: 'building-bank',
    bg: '#005baa',
  },
  {
    name: 'BNI Giro',
    ticker: 'Rek. Giro',
    value: 'Rp 8.200.000',
    pct: '+0.5%',
    positive: true,
    icon: 'building-bank',
    bg: '#e65c00',
  },
  {
    name: 'Mandiri Tabungan',
    ticker: 'Rek. Tabungan',
    value: 'Rp 5.750.000',
    pct: '0.0%',
    positive: false,
    icon: 'building-bank',
    bg: '#1a3a6b',
  },
  {
    name: 'Dana Darurat',
    ticker: 'Deposito BRI',
    value: 'Rp 30.000.000',
    pct: '+6.5%',
    positive: true,
    icon: 'pig-money',
    bg: '#22c55e',
  },
  {
    name: 'Gopay',
    ticker: 'E-Wallet',
    value: 'Rp 3.550.000',
    pct: '+1.2%',
    positive: true,
    icon: 'wallet',
    bg: '#00d084',
  },
]

export function CardBalanceCard() {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-header border-0 pb-0 pt-4 px-4">
        <h3 className="card-title fw-bold">Rekening Saya</h3>
        <div className="card-actions">
          <a
            href="#"
            className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
          >
            <span className="text-decoration-underline-hover">Lihat Semua</span>
            <Icon icon="chevron-right" size="xs" />
          </a>
        </div>
      </div>
      <div className="card-body p-0 pb-3">
        <div className="subheader px-4 pt-2 pb-0">Total Saldo</div>
        <div className="px-4 pb-2">
          <span className="h2 mb-0 fw-bold">Rp 60.000.000</span>
        </div>

        <div className="table-responsive">
          <table className="table table-vcenter table-borderless text-nowrap mb-0">
            <tbody>
              {holdings.map((h, index) => (
                <tr key={h.name} className={index < holdings.length - 1 ? 'border-bottom' : ''}>
                  <td className="w-1 py-2 ps-4">
                    <div
                      className="d-flex align-items-center justify-content-center text-white"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: h.bg,
                        flexShrink: 0,
                      }}
                    >
                      <Icon icon={h.icon} size="sm" />
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <div className="fw-medium text-dark">{h.name}</div>
                    <div className="text-secondary small">{h.ticker}</div>
                  </td>
                  <td className="text-end py-2 pe-4">
                    <div className="fw-medium text-dark">{h.value}</div>
                    <div className={`small ${h.positive ? 'text-success' : 'text-secondary'}`}>
                      {h.positive ? (
                        <Icon icon="trending-up" size="xs" className="me-1" />
                      ) : (
                        <Icon icon="minus" size="xs" className="me-1" />
                      )}
                      {h.pct}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
