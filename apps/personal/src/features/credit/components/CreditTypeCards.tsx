import { useMemo } from 'react'
import { Icon } from '@/shared/components/ui'
import { useCredits } from '../hooks/useCredits'

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n)

export function CreditTypeCards() {
  const { data: credits = [], isLoading } = useCredits()

  const creditTypes = useMemo(() => {
    const ktaLoans = credits.filter((c) => c.credit?.credit_type === 'kta')
    const ktaLimit = ktaLoans.reduce((s, c) => s + (c.credit?.limit || 0), 0)
    const ktaUsed = ktaLoans.reduce((s, c) => s + (c.credit?.total_amount || 0), 0)
    const ktaPaid = Math.max(0, ktaLimit - ktaUsed)
    const ktaPct = ktaLimit > 0 ? (ktaPaid / ktaLimit) * 100 : 0

    const kprLoans = credits.filter((c) => c.credit?.credit_type === 'kpr')
    const kprLimit = kprLoans.reduce((s, c) => s + (c.credit?.limit || 0), 0)
    const kprUsed = kprLoans.reduce((s, c) => s + (c.credit?.total_amount || 0), 0)
    const kprPaid = Math.max(0, kprLimit - kprUsed)
    const kprPct = kprLimit > 0 ? (kprPaid / kprLimit) * 100 : 0

    const ccAccounts = credits.filter((c) => c.credit?.credit_type === 'credit_card')
    const ccLimit = ccAccounts.reduce((s, c) => s + (c.credit?.limit || 0), 0)
    const ccUsed = ccAccounts.reduce((s, c) => s + (c.credit?.total_amount || 0), 0)
    const ccPct = ccLimit > 0 ? (ccUsed / ccLimit) * 100 : 0

    const plAccounts = credits.filter((c) => c.credit?.credit_type === 'paylater')
    const plLimit = plAccounts.reduce((s, c) => s + (c.credit?.limit || 0), 0)
    const plUsed = plAccounts.reduce((s, c) => s + (c.credit?.total_amount || 0), 0)
    const plPct = plLimit > 0 ? (plUsed / plLimit) * 100 : 0

    return [
      {
        id: 'kta',
        title: 'Personal Loan',
        subtitle: `${ktaLoans.length} pinjaman aktif`,
        icon: 'building-bank',
        color: 'primary',
        rows: [
          { label: 'Total Plafon', value: fmt(ktaLimit) },
          { label: 'Sisa Hutang', value: fmt(ktaUsed), cls: 'text-danger' },
          { label: 'Sudah Dibayar', value: fmt(ktaPaid), cls: 'text-success' },
        ],
        progress: ktaPct,
        progressColor: 'primary',
        progressLabel: `${ktaPct.toFixed(1)}% terlunasi`,
        visible: ktaLoans.length > 0,
      },
      {
        id: 'kpr',
        title: 'Mortgage / KPR',
        subtitle: `${kprLoans.length} properti`,
        icon: 'home',
        color: 'warning',
        rows: [
          { label: 'Total Plafon', value: fmt(kprLimit) },
          { label: 'Sisa Hutang', value: fmt(kprUsed), cls: 'text-danger' },
          { label: 'Sudah Dibayar', value: fmt(kprPaid), cls: 'text-success' },
        ],
        progress: kprPct,
        progressColor: 'warning',
        progressLabel: `${kprPct.toFixed(1)}% terlunasi`,
        visible: kprLoans.length > 0,
      },
      {
        id: 'cc',
        title: 'Credit Cards',
        subtitle: `${ccAccounts.length} kartu aktif`,
        icon: 'credit-card',
        color: 'azure',
        customBody: (
          <div>
            <div className="row g-2">
              {ccAccounts.map((c, i) => {
                const pct =
                  c.credit!.limit > 0
                    ? Math.round((c.credit!.total_amount / c.credit!.limit) * 100)
                    : 0
                const dueDate = c.credit?.due_date
                  ? new Date(c.credit.due_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : 'N/A'
                const colClass = ccAccounts.length === 1 ? 'col-12' : 'col-6'
                return (
                  <div key={i} className={colClass}>
                    <div className="card border shadow-none bg-transparent h-100">
                      <div className="card-body p-2 d-flex flex-column gap-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="fw-bold small text-truncate" style={{ maxWidth: '80%' }}>
                            {c.name}
                          </div>
                          <span className="badge bg-azure-lt border-0" style={{ fontSize: '8px' }}>
                            CC
                          </span>
                        </div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          {fmt(c.credit!.total_amount)} / {fmt(c.credit!.limit)}
                        </div>
                        <div className="progress progress-sm" style={{ height: '4px' }}>
                          <div
                            className={`progress-bar bg-${pct > 60 ? 'danger' : pct > 30 ? 'warning' : 'success'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="mt-2 d-flex flex-column gap-1">
                          <div
                            className="d-flex justify-content-between"
                            style={{ fontSize: '10px' }}
                          >
                            <span className="text-muted">Jatuh Tempo</span>
                            <span className="fw-medium">{dueDate}</span>
                          </div>
                          <div
                            className="d-flex justify-content-between"
                            style={{ fontSize: '10px' }}
                          >
                            <span className="text-muted">Min. Bayar</span>
                            <span className="fw-medium">
                              {fmt(Math.round(c.credit!.total_amount * 0.1))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <ul className="list-group list-group-flush mt-3 mb-2">
              <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-1 border-0">
                <span className="text-muted small">Total Limit Gabungan</span>
                <span className="fw-bold small">{fmt(ccLimit)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-1 border-0">
                <span className="text-muted small">Total Hutang Kartu</span>
                <span className="fw-bold small text-danger">{fmt(ccUsed)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-1 border-0">
                <span className="text-muted small">Sisa Limit Tersedia</span>
                <span className="fw-bold small text-success">{fmt(ccLimit - ccUsed)}</span>
              </li>
            </ul>
          </div>
        ),
        infoBox: (
          <div className="alert alert-azure mb-0 mt-2 p-2 border-0">
            <div className="small d-flex justify-content-between align-items-center">
              <span>Global CC Utilization:</span>
              <strong className={ccPct > 40 ? 'text-warning' : 'text-azure'}>
                {ccPct.toFixed(1)}%
              </strong>
            </div>
          </div>
        ),
        visible: ccAccounts.length > 0,
      },
      {
        id: 'paylater',
        title: 'Paylater',
        subtitle: `${plAccounts.length} provider aktif`,
        icon: 'clock-dollar',
        color: 'green',
        customBody: (
          <div>
            <div className="row g-2 mb-3">
              {plAccounts.map((c, i) => {
                const pct =
                  c.credit!.limit > 0
                    ? Math.round((c.credit!.total_amount / c.credit!.limit) * 100)
                    : 0
                const dueDate = c.credit?.due_date
                  ? new Date(c.credit.due_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : 'N/A'
                const colClass = plAccounts.length === 1 ? 'col-12' : 'col-6'
                return (
                  <div key={i} className={colClass}>
                    <div className="card border shadow-none bg-transparent h-100">
                      <div className="card-body p-2 d-flex flex-column gap-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="fw-bold small text-truncate" style={{ maxWidth: '80%' }}>
                            {c.name}
                          </div>
                          <span className="badge bg-green-lt border-0" style={{ fontSize: '8px' }}>
                            PL
                          </span>
                        </div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          {fmt(c.credit!.total_amount)} / {fmt(c.credit!.limit)}
                        </div>
                        <div className="progress progress-sm" style={{ height: '4px' }}>
                          <div
                            className={`progress-bar bg-${pct > 60 ? 'danger' : pct > 30 ? 'warning' : 'success'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="mt-2 d-flex flex-column gap-1">
                          <div
                            className="d-flex justify-content-between"
                            style={{ fontSize: '10px' }}
                          >
                            <span className="text-muted">Jatuh Tempo</span>
                            <span className="fw-medium">{dueDate}</span>
                          </div>
                          <div
                            className="d-flex justify-content-between"
                            style={{ fontSize: '10px' }}
                          >
                            <span className="text-muted">Cicilan Bln Ini</span>
                            <span className="fw-medium">{fmt(c.credit!.monthly_payment || 0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <ul className="list-group list-group-flush mt-2">
              <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-1 border-0">
                <span className="text-muted small">Total Limit Paylater</span>
                <span className="fw-bold small">{fmt(plLimit)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-1 border-0">
                <span className="text-muted small">Total Hutang Berjalan</span>
                <span className="fw-bold small text-danger">{fmt(plUsed)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-1 border-0">
                <span className="text-muted small">Sisa Limit Tersedia</span>
                <span className="fw-bold small text-success">{fmt(plLimit - plUsed)}</span>
              </li>
            </ul>
          </div>
        ),
        infoBox: (
          <div className="mt-2">
            <div className="alert alert-green mb-0 p-2 border-0 opacity-75">
              <div className="small d-flex justify-content-between align-items-center">
                <span>Global Utilization:</span>
                <strong className={plPct > 40 ? 'text-warning' : 'text-green'}>
                  {plPct.toFixed(1)}%
                </strong>
              </div>
            </div>
          </div>
        ),
        visible: plAccounts.length > 0,
      },
    ]
  }, [credits])

  if (isLoading) return null

  return (
    <div className="mb-4">
      <div className="row g-2 g-lg-3">
        {creditTypes.map((ct, idx) => {
          const isEmpty = ct.visible === false
          return (
            <div key={idx} className="col-12 col-xl-6">
              <div className={`card border-0 shadow-sm h-100 ${isEmpty ? 'opacity-75' : ''}`}>
                <div className="card-header py-2 px-3">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className={`avatar avatar-sm bg-${isEmpty ? 'secondary' : ct.color} text-white`}
                      style={{ borderRadius: '10px' }}
                    >
                      <Icon icon={ct.icon} size={16} />
                    </span>
                    <div>
                      <div className="card-title fw-bold mb-0" style={{ fontSize: '13px' }}>
                        {ct.title}
                      </div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>
                        {isEmpty ? 'Belum ada jalur aktif' : ct.subtitle}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body p-3">
                  {isEmpty ? (
                    <div className="text-center py-4">
                      <div className="avatar avatar-md bg-light text-muted rounded-circle mb-2 mx-auto">
                        <Icon icon={ct.icon} size={20} />
                      </div>
                      <div className="text-muted small">Belum ada data {ct.title} terdaftar</div>
                    </div>
                  ) : (
                    <>
                      {ct.customBody ? (
                        ct.customBody
                      ) : (
                        <>
                          <ul className="list-group list-group-flush mb-2">
                            {(ct.rows ?? []).map((row, i) => (
                              <li
                                key={i}
                                className="list-group-item d-flex justify-content-between align-items-center px-0 py-1 border-0"
                              >
                                <span className="text-muted small">{row.label}</span>
                                <span className={`fw-bold small ${row.cls ?? ''}`}>
                                  {row.value}
                                </span>
                              </li>
                            ))}
                          </ul>
                          {ct.progress !== undefined && (
                            <div className="mt-2">
                              <div className="progress progress-sm mb-1" style={{ height: '4px' }}>
                                <div
                                  className={`progress-bar bg-${ct.progressColor}`}
                                  style={{ width: `${ct.progress}%` }}
                                />
                              </div>
                              <div className="text-muted" style={{ fontSize: '10px' }}>
                                {ct.progressLabel}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {ct.infoBox}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
