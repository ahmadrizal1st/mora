import { useState, useMemo } from 'react'
import { Icon, Button } from '@/shared/components/ui'
import { useCredits } from '../hooks/useCredits'

type Strategy = 'avalanche' | 'snowball'

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n)

export function DebtPayoffPlannerPreview() {
  const [strategy, setStrategy] = useState<Strategy>('avalanche')
  const { data: credits = [], isLoading } = useCredits()

  const strategyDebts = useMemo(() => {
    const validDebts = credits.filter((c) => c.credit && (c.credit.total_amount || 0) > 0)

    if (strategy === 'avalanche') {
      return [...validDebts].sort(
        (a, b) => (b.credit?.interest_rate || 0) - (a.credit?.interest_rate || 0)
      )
    } else {
      return [...validDebts].sort(
        (a, b) => (a.credit?.total_amount || 0) - (b.credit?.total_amount || 0)
      )
    }
  }, [credits, strategy])

  const upcomingBills = useMemo(() => {
    return credits
      .filter((c) => c.credit?.due_date)
      .sort(
        (a, b) => new Date(a.credit!.due_date!).getTime() - new Date(b.credit!.due_date!).getTime()
      )
      .slice(0, 5)
  }, [credits])

  if (isLoading) return null

  if (credits.length === 0) {
    return (
      <div
        className="card border shadow-none mb-4 py-5 text-center"
        style={{ borderRadius: '16px' }}
      >
        <div className="card-body">
          <Icon icon="comet" size={32} className="text-muted opacity-50 mb-2" />
          <p className="text-muted mb-0">
            Belum ada data hutang untuk dianalisis. Tambahkan profil kredit untuk menggunakan
            Planner.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4">
      <div className="row g-2 g-lg-3">
        <div className="col-12 col-md-5">
          <div
            className="card border shadow-none h-100 overflow-hidden"
            style={{ borderRadius: '16px' }}
          >
            <div className="card-header py-2 px-3 bg-transparent border-0 pb-0 pt-3">
              <h3 className="card-title fw-bold" style={{ fontSize: '13px' }}>
                Strategi Pelunasan
              </h3>
            </div>
            <div className="card-body p-3">
              <p className="text-muted mb-3" style={{ fontSize: '12px' }}>
                Pilih metode terbaik untuk melunasi hutang Anda lebih cepat.
              </p>

              <div className="d-flex flex-column gap-2 mb-3">
                {(
                  [
                    {
                      key: 'avalanche',
                      label: 'Metode Avalanche',
                      sub: 'Bunga tertinggi dulu',
                      icon: 'trending-down',
                      color: 'orange',
                    },
                    {
                      key: 'snowball',
                      label: 'Metode Snowball',
                      sub: 'Hutang terkecil dulu',
                      icon: 'snowflake',
                      color: 'orange',
                    },
                  ] as const
                ).map((s) => {
                  const isActive = strategy === s.key
                  return (
                    <div
                      key={s.key}
                      onClick={() => setStrategy(s.key)}
                      className={`p-3 rounded-3 border-2 cursor-pointer transition-all d-flex align-items-center gap-3 ${
                        isActive
                          ? `border-${s.color} bg-${s.color}-lt shadow-sm`
                          : 'border-transparent bg-body-tertiary border-opacity-10'
                      }`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                      <div
                        className={`avatar avatar-md rounded-circle ${isActive ? `bg-${s.color} text-white` : 'bg-white text-muted shadow-sm'}`}
                      >
                        <Icon icon={s.icon as any} size={20} />
                      </div>
                      <div className="flex-fill">
                        <div
                          className={`fw-bold ${isActive ? `text-${s.color}` : ''}`}
                          style={{ fontSize: '13px' }}
                        >
                          {s.label}
                        </div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          {s.sub}
                        </div>
                      </div>
                      {isActive && (
                        <div className={`badge bg-${s.color} rounded-circle p-1`}>
                          <Icon icon="check" size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div
                className="p-3 rounded-3 border border-orange border-opacity-50 bg-orange-lt position-relative overflow-hidden shadow-sm"
                style={{ boxShadow: '0 0 15px rgba(255, 107, 0, 0.05)' }}
              >
                <div className="position-absolute top-0 end-0 p-1 opacity-20 mr-n2 mt-n2">
                  <Icon icon="sparkles" size={48} className="text-orange" />
                </div>
                <div className="d-flex align-items-start gap-3 position-relative">
                  <div
                    className="bg-orange text-white flex-shrink-0 shadow-sm d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', borderRadius: '10px' }}
                  >
                    <Icon icon="info-circle" size={18} />
                  </div>
                  <div>
                    <div className="fw-bold text-orange small mb-1 d-flex align-items-center gap-2">
                      Rekomendasi AI
                      <span
                        className="badge bg-orange text-white border-0"
                        style={{ fontSize: '8px', padding: '2px 5px' }}
                      >
                        CERDAS
                      </span>
                    </div>
                    <div className="small text-dark-emphasis" style={{ lineHeight: '1.5' }}>
                      Prioritas:{' '}
                      <span
                        className="badge bg-white text-orange border border-orange border-opacity-25 fw-bold ms-1"
                        style={{ fontSize: '11px' }}
                      >
                        {strategyDebts[0]?.name || '-'}
                      </span>
                      .
                      <div className="mt-1 opacity-75">
                        Bayar ini dulu karena memiliki{' '}
                        {strategy === 'avalanche' ? 'suku bunga tertinggi' : 'saldo terkecil'}.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-7">
          <div className="card border shadow-none h-100" style={{ borderRadius: '16px' }}>
            <div className="card-header border-0 pb-0 pt-3">
              <h3 className="card-title fw-bold">Tagihan Mendatang</h3>
              <div className="card-actions">
                <span className="badge bg-orange-lt text-orange border-0">Terdekat</span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table table-nowrap table-borderless">
                <thead>
                  <tr>
                    <th>Jatuh Tempo</th>
                    <th>Akun</th>
                    <th className="text-end">Jumlah</th>
                    <th className="w-1" />
                  </tr>
                </thead>
                <tbody>
                  {upcomingBills.map((b, i) => {
                    const daysLeft = b.credit!.due_date
                      ? Math.ceil(
                          (new Date(b.credit!.due_date).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : 0
                    const isUrgent = daysLeft <= 7
                    return (
                      <tr key={i}>
                        <td>
                          <div className="fw-bold small">
                            {new Date(b.credit!.due_date!).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </div>
                          <div className={`small ${isUrgent ? 'text-danger' : 'text-muted'}`}>
                            {daysLeft} hari lagi
                          </div>
                        </td>
                        <td>
                          <div className="fw-bold small">{b.name}</div>
                          <div className="text-muted small">{b.provider?.name || 'Bank'}</div>
                        </td>
                        <td className="text-end">
                          <div className="fw-bold small">
                            {fmt(b.credit?.installment_amount || b.credit?.total_amount || 0)}
                          </div>
                        </td>
                        <td style={{ width: '80px' }}>
                          {isUrgent ? (
                            <Button
                              block
                              size="sm"
                              element="button"
                              color="danger"
                              className="fw-bold"
                              style={{ fontSize: '10px', padding: '0.25rem 0.5rem' }}
                              text="Bayar"
                            />
                          ) : (
                            <Button
                              block
                              size="sm"
                              element="button"
                              white={true}
                              className="fw-bold text-body"
                              style={{
                                fontSize: '10px',
                                padding: '0.25rem 0.5rem',
                                color: 'var(--tblr-emphasis-color)',
                              }}
                              text="Detail"
                            />
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
