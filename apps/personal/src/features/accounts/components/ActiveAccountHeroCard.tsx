import { clsx } from 'clsx'
import { Icon } from '@/shared/components/ui/Icon'

interface ActiveAccountHeroCardProps {
  type: string
  name: string
  balance: string
  num: string
  chg: string
  chgPos: boolean
  inc: string
  incSub: string
  exp: string
  expSub: string
}

export function ActiveAccountHeroCard({
  type,
  name,
  balance,
  num,
  chg,
  chgPos,
  inc,
  incSub,
  exp,
  expSub,
}: ActiveAccountHeroCardProps) {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-4">
        <div className="text-secondary text-uppercase fw-semibold fs-5 mb-1">{type}</div>
        <div className="d-flex align-items-center gap-2 mb-4">
          <h1 className="mb-0 fw-bold text-body">{name}</h1>
          <span className="badge badge-outline text-primary">Active</span>
        </div>

        <div className="text-secondary small mb-1">Saldo tersedia</div>
        <div className="display-6 fw-bold mb-0 text-body">{balance}</div>
        <div className="text-muted small mb-4">IDR • {num}</div>

        <div
          className={clsx(
            'badge py-1 px-2 mb-4',
            chgPos ? 'bg-success-lt text-success' : 'bg-danger-lt text-danger'
          )}
        >
          <Icon icon={chgPos ? 'trending-up' : 'trending-down'} size="xxs" className="me-1" />
          {chg} bulan ini
        </div>

        <div className="hr-text text-secondary my-4" style={{ fontSize: '0.65rem' }}>
          RINGKASAN AKUN
        </div>

        <div className="row g-3 mb-4">
          <div className="col-6">
            <div className="text-secondary fs-5 mb-1">Income</div>
            <div className="h2 text-success fw-bold mb-0">{inc}</div>
            <div className="text-muted small" style={{ fontSize: '0.7rem' }}>
              {incSub}
            </div>
          </div>
          <div className="col-6 text-end">
            <div className="text-secondary fs-5 mb-1">Expense</div>
            <div className="h2 text-danger fw-bold mb-0">{exp}</div>
            <div className="text-muted small" style={{ fontSize: '0.7rem' }}>
              {expSub}
            </div>
          </div>
        </div>

        <div className="row g-2">
          <div className="col-6">
            <button className="btn btn-primary w-100 btn-sm">Transfer</button>
          </div>
          <div className="col-6">
            <button className="btn btn-outline-secondary w-100 btn-sm">Top Up</button>
          </div>
          <div className="col-6">
            <button className="btn btn-outline-secondary w-100 btn-sm">Bayar</button>
          </div>
          <div className="col-6">
            <button className="btn btn-outline-secondary w-100 btn-sm">Mutasi</button>
          </div>
        </div>
      </div>
    </div>
  )
}
