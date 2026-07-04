import { useState, useMemo } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { Modal} from '@/shared/components/ui/Modal'
import type { DebtRecord } from '../../types/debt.types'
import { useUpdateDebt } from '../../hooks/useDebts'

export function DebtRemindersWidget({ debts = [], onAdd }: { debts?: DebtRecord[], onAdd?: () => void }) {
  const [selectedDebt, setSelectedDebt] = useState<DebtRecord | null>(null)
  const updateDebt = useUpdateDebt()

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

      if (dDate.getTime() <= now.getTime() || d.status === 'Jatuh Tempo') {
        t.push(d) // due today, past due, or explicitly marked as jatuh tempo
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
          <div 
            key={idx} 
            className="d-flex justify-content-between align-items-center p-2 rounded-3 mb-2" 
            style={{ backgroundColor: '#f8f9fa', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onClick={() => setSelectedDebt(item)}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e9ecef')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
          >
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
    <>
      <div className="card shadow-sm border-0 d-flex flex-column w-100" style={{ borderRadius: '16px', overflow: 'hidden', height: '100%', maxHeight: '400px' }}>
        <div className="card-header border-bottom-0 bg-transparent p-3 pb-2 d-flex justify-content-between align-items-center flex-shrink-0">
          <h4 className="card-title fw-bold m-0" style={{ fontSize: '15px' }}>Pengingat Jatuh Tempo</h4>
          <a href="#" className="text-muted small text-decoration-none" style={{ fontSize: '12px' }}>Lihat semua</a>
        </div>
        <div className="card-body p-3 pt-0 d-flex flex-column" style={{ overflowY: 'auto', flex: '1 1 auto', minHeight: 0 }}>
          {isEmpty ? (
            <div className="text-center py-4 d-flex flex-column justify-content-center align-items-center" style={{ flex: 1, minHeight: '200px' }}>
              <div className="d-flex justify-content-center text-secondary mb-3">
                <Icon icon="calendar-check" size={40} stroke={1.5} style={{ opacity: 0.6 }} />
              </div>
              <div className="fw-bold text-body mb-1">Tidak Ada Pengingat</div>
              <div className="text-muted small">Tambahkan catatan utang atau piutang.</div>
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

      <Modal show={!!selectedDebt} onClose={() => setSelectedDebt(null)} size="sm">
        {(() => {
          const isUtang = selectedDebt?.type === 'Utang'
          const colorHex = isUtang ? '#e53e3e' : '#38a169'
          const colorBg = isUtang ? 'rgba(229, 62, 62, 0.08)' : 'rgba(56, 161, 105, 0.08)'
          
          return (
            <div className="position-relative p-0 m-0 w-100">
              {/* Background Header Decoration */}
              <div 
                className="position-absolute top-0 start-0 w-100" 
                style={{ height: '140px', background: `linear-gradient(180deg, ${colorBg} 0%, rgba(255,255,255,0) 100%)` }}
              />
              
              {/* Close button */}
              <button 
                onClick={() => setSelectedDebt(null)} 
                className="btn-close position-absolute top-0 end-0 m-3 shadow-none z-1"
                aria-label="Close"
              />

              <div className="modal-body text-center pt-5 pb-4 px-4 position-relative z-1">
                {/* Avatar */}
                <div 
                  className="avatar avatar-xl rounded-circle mb-3 d-flex align-items-center justify-content-center mx-auto fs-1 fw-semibold text-uppercase shadow-sm bg-white"
                  style={{ color: '#555555', width: '72px', height: '72px' }}
                >
                  {selectedDebt?.personName?.substring(0, 2)}
                </div>

                <div className="text-muted text-uppercase fw-semibold tracking-wide mb-1" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                  Detail {selectedDebt?.type}
                </div>
                <h3 className="mb-1 fw-bold text-dark fs-3">{selectedDebt?.personName}</h3>
                <div className="text-muted small mb-4">{selectedDebt?.description || 'Tidak ada catatan tambahan'}</div>
                
                <div className="fw-bolder mb-4" style={{ fontSize: '32px', color: colorHex, letterSpacing: '-1px' }}>
                  Rp {selectedDebt?.amount?.toLocaleString('id-ID')}
                </div>
                
                <div className="d-flex flex-column gap-3 text-start bg-white border p-3 rounded-4 shadow-sm mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <Icon icon="activity" size={16} />
                      <span>Status</span>
                    </div>
                    <span className={`badge bg-${selectedDebt?.status === 'Lunas' ? 'success' : 'warning'}-lt px-2 py-1`}>
                      {selectedDebt?.status}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <Icon icon="calendar-event" size={16} />
                      <span>Jatuh Tempo</span>
                    </div>
                    <span className="fw-semibold text-dark small">
                      {selectedDebt?.dueDate && new Date(selectedDebt.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column gap-2 w-100">
                  <button 
                    className="btn btn-primary w-100 rounded-pill py-2 shadow-sm fw-bold border-0" 
                    style={{ background: `linear-gradient(90deg, ${colorHex} 0%, ${isUtang ? '#c53030' : '#276749'} 100%)` }}
                    onClick={() => {
                      if (selectedDebt) {
                        updateDebt.mutate({ 
                          id: selectedDebt.id, 
                          data: { status: 'Lunas' } 
                        })
                        setSelectedDebt(null)
                      }
                    }}
                    disabled={updateDebt.isPending}
                  >
                    {updateDebt.isPending ? 'Memproses...' : (
                      <>
                        <Icon icon="check" size={18} className="me-2" /> Tandai Lunas
                      </>
                    )}
                  </button>
                  <button 
                    className="btn btn-light w-100 rounded-pill py-2 border shadow-none text-success fw-medium d-flex align-items-center justify-content-center gap-2" 
                    onClick={() => {
                      alert('Buka WhatsApp untuk ' + selectedDebt?.personName)
                    }}
                  >
                    <Icon icon="brand-whatsapp" size={18} />
                    Kirim Pengingat WA
                  </button>
                </div>
              </div>
            </div>
          )
        })()}
      </Modal>
    </>
  )
}
