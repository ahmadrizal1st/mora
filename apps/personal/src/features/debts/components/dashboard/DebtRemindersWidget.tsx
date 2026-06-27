import { useMemo } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import type { DebtRecord } from '../../types/debt.types'

export function DebtRemindersWidget({ debts = [] }: { debts?: DebtRecord[] }) {
  const { today, tomorrow, thisWeek } = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    
    const tmrw = new Date(now)
    tmrw.setDate(tmrw.getDate() + 1)
    
    const weekEnd = new Date(now)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const active = debts.filter(d => d.status !== 'Lunas').sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    
    const t: DebtRecord[] = []
    const tm: DebtRecord[] = []
    const tw: DebtRecord[] = []

    active.forEach(d => {
      const dDate = new Date(d.dueDate)
      dDate.setHours(0, 0, 0, 0)

      if (dDate.getTime() === now.getTime() || (dDate.getTime() < now.getTime() && d.status !== 'Jatuh Tempo')) {
        t.push(d) // due today or past due but not marked as jatuh tempo yet
      } else if (dDate.getTime() === tmrw.getTime()) {
        tm.push(d)
      } else if (dDate.getTime() > tmrw.getTime() && dDate.getTime() <= weekEnd.getTime()) {
        tw.push(d)
      }
    })

    return { today: t, tomorrow: tm, thisWeek: tw }
  }, [debts])

  const renderGroup = (label: string, badgeColor: string, textColor: string, items: DebtRecord[]) => {
    if (items.length === 0) return null
    const total = items.reduce((acc, d) => acc + d.amount, 0)
    
    return (
      <div className="mb-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center gap-2">
            <span className={`badge bg-${badgeColor} ${label === 'Hari Ini' ? 'badge-blink' : ''}`} style={{ width: 6, height: 6, minWidth: 6 }}></span>
            <span className={`text-${textColor} fw-bold`} style={{ fontSize: '12px' }}>{label}</span>
          </div>
          <span className="text-muted" style={{ fontSize: '11px' }}>Total Rp {total.toLocaleString('id-ID')}</span>
        </div>
        
        {items.map((item, idx) => (
          <div key={idx} className="d-flex justify-content-between align-items-center p-2 rounded-3 mb-2" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
              <span className="avatar avatar-sm rounded-circle bg-white shadow-sm border text-uppercase" style={{ fontSize: '10px' }}>
                {item.personName.substring(0, 2)}
              </span>
              <div className="text-truncate">
                <div className="fw-semibold small text-dark text-truncate">{item.type} {item.personName}</div>
                <div className={`text-${textColor}`} style={{ fontSize: '10px' }}>
                  {label === 'Hari Ini' ? 'Jatuh Tempo Hari Ini' : label === 'Besok' ? 'Jatuh Tempo Besok' : new Date(item.dueDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <span className="fw-bold text-dark small">Rp {(item.amount / 1000).toLocaleString('id-ID')}k</span>
              <Icon icon="chevron-right" size={14} className="text-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const isEmpty = today.length === 0 && tomorrow.length === 0 && thisWeek.length === 0

  return (
    <div className="card shadow-sm border-0 d-flex flex-column w-100" style={{ borderRadius: '16px', overflow: 'hidden', height: '100%', maxHeight: '400px' }}>
      <div className="card-header border-bottom-0 bg-transparent p-3 pb-2 d-flex justify-content-between align-items-center flex-shrink-0">
        <h4 className="card-title fw-bold m-0" style={{ fontSize: '15px' }}>Pengingat Jatuh Tempo</h4>
        <a href="#" className="text-muted small text-decoration-none" style={{ fontSize: '12px' }}>Lihat semua</a>
      </div>
      <div className="card-body p-3 pt-0" style={{ overflowY: 'auto', flex: '1 1 auto', minHeight: 0 }}>
        {isEmpty ? (
          <div className="text-center text-muted py-4 m-auto">
            <Icon icon="calendar-check" size={32} className="mb-2 opacity-50" />
            <div className="small">Tidak ada tagihan jatuh tempo dalam 7 hari ke depan.</div>
          </div>
        ) : (
          <>
            {renderGroup('Hari Ini', 'red', 'danger', today)}
            {renderGroup('Besok', 'orange', 'orange', tomorrow)}
            {renderGroup('Minggu Ini', 'yellow', 'yellow', thisWeek)}
          </>
        )}
      </div>
    </div>
  )
}
