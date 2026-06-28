import { useMemo } from 'react'
import { Icon } from '@/shared/components/ui'
import { useCredits } from '../hooks/useCredits'
import type { CreditType } from '../types/credit.types'

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n)

export function CreditTypeCards() {
  const { data: credits = [], isLoading } = useCredits()

  const buildCreditType = (
    id: CreditType,
    title: string,
    subtitleUnit: string,
    icon: string,
    color: string,
    badgeColor: string,
    badgeBg: string,
    badgeText: string,
    totalLabel: string
  ) => {
    const accounts = credits.filter((c) => c.credit?.credit_type === id)
    const limit = accounts.reduce((s, c) => s + (c.credit?.limit || 0), 0)
    const used = accounts.reduce((s, c) => s + (c.credit?.total_amount || 0), 0)

    return {
      id,
      title,
      subtitle: `${accounts.length} ${subtitleUnit} aktif`,
      icon,
      color,
      visible: accounts.length > 0,
      customBody: (
        <div className="d-flex flex-column flex-grow-1">
          <div className="d-flex flex-column pe-2" style={{ maxHeight: '235px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
            {accounts.map((c, i) => {
              const now = new Date()
              now.setHours(0, 0, 0, 0)
              let dueDateStr = '-'
              let isOverdue = false
              let displayStatus = 'Belum Lunas'
              
              if (c.credit?.due_date) {
                const dDate = new Date(c.credit.due_date)
                dueDateStr = dDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                dDate.setHours(0, 0, 0, 0)
                isOverdue = dDate.getTime() <= now.getTime()
                if (isOverdue) displayStatus = 'Jatuh Tempo'
              }

              return (
                <div
                  key={c.id}
                  className="d-flex justify-content-between align-items-center py-2"
                  style={{
                    borderBottom: i < accounts.length - 1 ? '1px solid #f1f5f9' : undefined,
                  }}
                >
                  <div className="flex-grow-1 overflow-hidden me-2">
                    <div className="fw-bold text-truncate text-body" style={{ fontSize: '13px' }}>
                      {c.name}
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-wrap mt-1" style={{ fontSize: '11px', color: 'var(--tblr-gray-500)' }}>
                      <span
                        className="rounded-pill px-2 fw-bold d-inline-flex align-items-center justify-content-center"
                        style={{ background: badgeBg, color: badgeColor, fontSize: '9px', height: '18px' }}
                      >
                        {badgeText}
                      </span>
                      <span>·</span>
                      <span className={isOverdue ? 'text-danger fw-medium' : ''}>{displayStatus}</span>
                      {dueDateStr !== '-' && (
                        <>
                          <span>·</span>
                          <span>{dueDateStr}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-end justify-content-center">
                    <div className="fw-bold flex-shrink-0 text-dark" style={{ fontSize: '13px' }}>
                      {fmt(c.credit!.total_amount)}
                    </div>
                    {c.credit!.limit > 0 && (
                      <div className="text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                        dari {fmt(c.credit!.limit)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-body-tertiary bg-opacity-50 rounded-3 p-2 mt-auto">
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted" style={{ fontSize: '11px' }}>Total Limit {totalLabel}</span>
              <span className="fw-bold text-dark" style={{ fontSize: '12px' }}>{fmt(limit)}</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted" style={{ fontSize: '11px' }}>Total Hutang Berjalan</span>
              <span className="fw-bold text-danger" style={{ fontSize: '12px' }}>{fmt(used)}</span>
            </div>
            <div className="d-flex justify-content-between pt-1 border-top">
              <span className="text-muted" style={{ fontSize: '11px' }}>Sisa Limit Tersedia</span>
              <span className="fw-bold text-success" style={{ fontSize: '12px' }}>{fmt(Math.max(0, limit - used))}</span>
            </div>
          </div>
        </div>
      ),
    }
  }

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const creditTypes = useMemo(() => {
    return [
      buildCreditType('kta', 'Pinjaman Tunai (KTA)', 'pinjaman', 'building-bank', 'primary', '#206bc4', '#206bc422', 'KTA', 'Pinjaman'),
      buildCreditType('kpr', 'Cicilan Rumah (KPR)', 'properti', 'home', 'warning', '#f59f00', '#f59f0022', 'KPR', 'Properti'),
      buildCreditType('credit_card', 'Kartu Kredit', 'kartu', 'credit-card', 'azure', '#4299e1', '#4299e122', 'Kredit', 'Kartu'),
      buildCreditType('paylater', 'Layanan Paylater', 'provider', 'clock-dollar', 'green', '#2fb344', '#2fb34422', 'Paylater', 'Paylater'),
    ]
  }, [credits])

  if (isLoading) return null

  return (
    <div>
      <div className="row g-3">
        {creditTypes.map((ct, idx) => {
          if (!ct.visible) return null
          return (
            <div key={idx} className="col-12 col-xl-6">
              <div className="card border-0 shadow-sm h-100 rounded-3 overflow-hidden d-flex flex-column">
                <div className="card-header border-0 py-2 px-3 bg-transparent d-flex align-items-center gap-2">
                  <span
                    className={`avatar avatar-sm bg-${ct.color} text-white`}
                    style={{ borderRadius: '8px', width: '32px', height: '32px' }}
                  >
                    <Icon icon={ct.icon} size={16} />
                  </span>
                  <div>
                    <div className="card-title fw-bold mb-1 text-dark" style={{ fontSize: '14px' }}>
                      {ct.title}
                    </div>
                    <div className="text-muted fw-medium" style={{ fontSize: '11px' }}>
                      {ct.subtitle}
                    </div>
                  </div>
                </div>
                <div className="card-body p-3 pt-0 d-flex flex-column flex-grow-1">
                  {ct.customBody}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
