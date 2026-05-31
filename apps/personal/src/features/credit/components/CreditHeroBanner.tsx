import { Icon } from '@/shared/components/ui'
import { useCreditSummary } from '../hooks/useCreditSummary'

const shortFmt = (n: number) => {
  if (n >= 1_000_000_000) return 'Rp ' + (n / 1_000_000_000).toFixed(1) + ' M'
  if (n >= 1_000_000) return 'Rp ' + (n / 1_000_000).toFixed(0) + ' jt'
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(n)
}

export function CreditHeroBanner() {
  const {
    totalLimit,
    totalOutstanding,
    utilizationPct,
    nextDue,
    nextDueAmount,
    creditScore,
    scoreTrend,
    activeCount,
    isLoading,
  } = useCreditSummary()

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="row g-2 g-lg-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100 placeholder-glow">
                <div className="card-body p-3 p-lg-4">
                  <div className="placeholder col-6 mb-3"></div>
                  <div className="placeholder col-10 mb-1"></div>
                  <div className="placeholder col-8"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const dueDate = nextDue as Date | null
  const formattedDate =
    dueDate instanceof Date
      ? dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      : '-'
  const daysRemaining =
    dueDate instanceof Date
      ? Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null

  const utilColor = utilizationPct > 70 ? 'danger' : utilizationPct > 40 ? 'warning' : 'success'

  return (
    <>
      <div className="mb-4 d-none d-md-block">
        <div className="row g-2 g-lg-3">
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-3 p-lg-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div
                    className="avatar avatar-sm bg-red text-white"
                    style={{ borderRadius: '10px' }}
                  >
                    <Icon icon="credit-card" size={16} />
                  </div>
                  <div
                    className="subheader text-muted m-0"
                    style={{ letterSpacing: '0.05em', fontSize: '10px' }}
                  >
                    TOTAL LIMIT
                  </div>
                </div>
                <div className="h1 fw-bold m-0 mb-1">{shortFmt(totalLimit)}</div>
                <div className="text-muted small">{activeCount} jalur kredit aktif</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-3 p-lg-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div
                    className="avatar avatar-sm bg-azure text-white"
                    style={{ borderRadius: '10px' }}
                  >
                    <Icon icon="chart-pie" size={16} />
                  </div>
                  <div
                    className="subheader text-muted m-0"
                    style={{ letterSpacing: '0.05em', fontSize: '10px' }}
                  >
                    OUTSTANDING
                  </div>
                </div>
                <div className="h1 fw-bold m-0 mb-1 text-danger">{shortFmt(totalOutstanding)}</div>
                <div className="d-flex align-items-center gap-2">
                  <span
                    className={`badge bg-${utilColor}-lt text-${utilColor} border-0 px-2 rounded-pill`}
                    style={{ fontSize: '10px' }}
                  >
                    {utilizationPct.toFixed(0)}% Utilisasi
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-3 p-lg-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div
                    className="avatar avatar-sm bg-orange text-white"
                    style={{ borderRadius: '10px' }}
                  >
                    <Icon icon="calendar-event" size={16} />
                  </div>
                  <div
                    className="subheader text-muted m-0"
                    style={{ letterSpacing: '0.05em', fontSize: '10px' }}
                  >
                    JATUH TEMPO
                  </div>
                </div>
                <div className="h1 fw-bold m-0 mb-1 text-warning">{formattedDate}</div>
                <div className="d-flex align-items-center justify-content-between">
                  {dueDate instanceof Date ? (
                    <>
                      <span className="text-muted" style={{ fontSize: '11px' }}>
                        Sisa {daysRemaining} hari
                      </span>
                      <span className="fw-bold text-dark" style={{ fontSize: '12px' }}>
                        {shortFmt(nextDueAmount)}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted small">Tidak ada tagihan</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-3 p-lg-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div
                    className="avatar avatar-sm bg-blue text-white"
                    style={{ borderRadius: '10px' }}
                  >
                    <Icon icon="award" size={16} />
                  </div>
                  <div
                    className="subheader text-muted m-0"
                    style={{ letterSpacing: '0.05em', fontSize: '10px' }}
                  >
                    CREDIT SCORE
                  </div>
                </div>
                <div className="d-flex align-items-baseline gap-2 mb-1">
                  <div className="h1 fw-bold m-0 text-success">{creditScore}</div>
                  <span className="small text-success fw-bold">↑ +{scoreTrend}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span
                    className="badge bg-blue-lt text-blue border-0 px-2 rounded-pill"
                    style={{ fontSize: '10px' }}
                  >
                    Very Good
                  </span>
                  <span className="text-muted" style={{ fontSize: '11px' }}>
                    SLIK/OJK
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="card border-0 shadow-sm mb-4 overflow-hidden d-block d-md-none"
        style={{ borderRadius: '16px' }}
      >
        <div className="row g-0">
          <div className="col-6 border-end border-bottom p-3 position-relative">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                className="avatar avatar-sm bg-red-lt text-red"
                style={{ borderRadius: '8px', width: '28px', height: '28px' }}
              >
                <Icon icon="credit-card" size="sm" />
              </div>
              <div
                className="text-muted fw-bold text-truncate"
                style={{ fontSize: '10px', letterSpacing: '0.05em' }}
              >
                TOTAL LIMIT
              </div>
            </div>
            <div
              className="fs-4 fw-bold text-body mb-1 text-truncate"
              style={{ letterSpacing: '-0.5px' }}
            >
              {shortFmt(totalLimit)}
            </div>
            <div className="text-muted small text-truncate" style={{ fontSize: '11px' }}>
              {activeCount} jalur kredit aktif
            </div>
          </div>

          <div className="col-6 border-bottom p-3 position-relative">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                className="avatar avatar-sm bg-azure-lt text-azure"
                style={{ borderRadius: '8px', width: '28px', height: '28px' }}
              >
                <Icon icon="chart-pie" size="sm" />
              </div>
              <div
                className="text-muted fw-bold text-truncate"
                style={{ fontSize: '10px', letterSpacing: '0.05em' }}
              >
                OUTSTANDING
              </div>
            </div>
            <div
              className="fs-4 fw-bold text-danger mb-1 text-truncate"
              style={{ letterSpacing: '-0.5px' }}
            >
              {shortFmt(totalOutstanding)}
            </div>
            <div className="text-muted small text-truncate" style={{ fontSize: '11px' }}>
              <span className={`text-${utilColor} fw-bold`}>{utilizationPct.toFixed(0)}%</span>{' '}
              Utilisasi
            </div>
          </div>

          <div className="col-6 border-end p-3 position-relative">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                className="avatar avatar-sm bg-orange-lt text-orange"
                style={{ borderRadius: '8px', width: '28px', height: '28px' }}
              >
                <Icon icon="calendar-event" size="sm" />
              </div>
              <div
                className="text-muted fw-bold text-truncate"
                style={{ fontSize: '10px', letterSpacing: '0.05em' }}
              >
                JATUH TEMPO
              </div>
            </div>
            <div
              className="fs-4 fw-bold text-warning mb-1 text-truncate"
              style={{ letterSpacing: '-0.5px' }}
            >
              {formattedDate}
            </div>
            <div className="text-muted small text-truncate" style={{ fontSize: '11px' }}>
              {dueDate instanceof Date ? `Sisa ${daysRemaining} hari` : 'Tidak ada tagihan'}
            </div>
          </div>

          <div className="col-6 p-3 position-relative">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div
                className="avatar avatar-sm bg-blue-lt text-blue"
                style={{ borderRadius: '8px', width: '28px', height: '28px' }}
              >
                <Icon icon="award" size="sm" />
              </div>
              <div
                className="text-muted fw-bold text-truncate"
                style={{ fontSize: '10px', letterSpacing: '0.05em' }}
              >
                CREDIT SCORE
              </div>
            </div>
            <div
              className="fs-4 fw-bold text-success mb-1 text-truncate d-flex align-items-baseline gap-2"
              style={{ letterSpacing: '-0.5px' }}
            >
              {creditScore}
              <span className="small text-success fw-bold" style={{ fontSize: '11px' }}>
                ↑ +{scoreTrend}
              </span>
            </div>
            <div className="text-muted small text-truncate" style={{ fontSize: '11px' }}>
              SLIK/OJK
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
