import { useState, useMemo } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { useDebts } from '../../hooks/useDebts'
import { DebtRecord } from '../../types/debt.types'

export function DebtDataTable() {
  const [activeTab, setActiveTab] = useState<'Semua' | 'Piutang' | 'Utang' | 'Jatuh Tempo'>('Semua')
  const { data: debts = [], isLoading } = useDebts()

  const filteredData = useMemo(() => {
    let data = debts
    if (activeTab === 'Piutang') data = data.filter((d: DebtRecord) => d.type === 'Piutang')
    if (activeTab === 'Utang') data = data.filter((d: DebtRecord) => d.type === 'Utang')
    if (activeTab === 'Jatuh Tempo') data = data.filter((d: DebtRecord) => d.status === 'Jatuh Tempo')
    return data
  }, [activeTab, debts])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Jatuh Tempo': return <span className="text-danger fw-bold">Jatuh Tempo</span>
      case 'Menunggu': return <span className="text-orange fw-bold">Menunggu</span>
      case 'Sebagian': return <span className="text-success fw-bold">Sebagian</span>
      case 'Belum Lunas': return <span className="text-orange fw-bold">Belum Lunas</span>
      case 'Lunas': return <span className="text-success fw-bold">Lunas</span>
      default: return <span className="text-muted fw-bold">{status}</span>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Tinggi': return <span className="badge bg-red-lt rounded-pill px-2">Tinggi</span>
      case 'Sedang': return <span className="badge bg-orange-lt rounded-pill px-2">Sedang</span>
      case 'Rendah': return <span className="badge bg-blue-lt rounded-pill px-2">Rendah</span>
      default: return <span className="badge bg-secondary-lt rounded-pill px-2">{priority}</span>
    }
  }
  
  const getTypeBadge = (type: string) => {
    return type === 'Piutang' 
      ? <span className="badge bg-green-lt text-uppercase rounded-pill px-2" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>Piutang</span>
      : <span className="badge bg-red-lt text-uppercase rounded-pill px-2" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>Utang</span>
  }

  return (
    <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
      <div className="card-header border-bottom-0 bg-transparent pt-4 pb-0 px-4">
        <ul className="nav nav-tabs border-bottom gap-4 w-100" data-bs-toggle="tabs">
          {['Semua', 'Piutang', 'Utang', 'Jatuh Tempo'].map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link fw-semibold border-0 border-bottom border-2 px-1 pb-3 ${
                  activeTab === tab 
                    ? 'active border-orange text-orange' 
                    : 'border-transparent text-muted'
                }`}
                onClick={() => setActiveTab(tab as any)}
                style={{ background: 'transparent' }}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="card-body p-4 pt-3">
        {/* Filters */}
        <div className="row g-2 mb-4">
          <div className="col-12 col-md-3">
            <div className="input-icon">
              <span className="input-icon-addon">
                <Icon icon="search" size={16} />
              </span>
              <input type="text" className="form-control bg-light border-0 rounded-pill ps-5" placeholder="Cari nama atau catat..." />
            </div>
          </div>
          <div className="col-6 col-md-2">
            <select className="form-select bg-light border-0 text-muted rounded-pill">
              <option>Semua Status</option>
            </select>
          </div>
          <div className="col-6 col-md-2">
            <select className="form-select bg-light border-0 text-muted rounded-pill">
              <option>Semua Kategori</option>
            </select>
          </div>
          <div className="col-6 col-md-2">
            <select className="form-select bg-light border-0 text-muted rounded-pill">
              <option>Semua Kontak</option>
            </select>
          </div>
          <div className="col-6 col-md-2">
            <div className="input-icon">
              <span className="input-icon-addon">
                <Icon icon="calendar" size={16} />
              </span>
              <input type="text" className="form-control bg-light border-0 text-muted rounded-pill ps-5" placeholder="Semua Tanggal" />
            </div>
          </div>
          <div className="col-12 col-md-1 d-flex">
            <button className="btn btn-light w-100 border-0 bg-light rounded-pill d-flex align-items-center justify-content-center gap-1">
              <Icon icon="filter" size={16} />
              <span className="d-md-none">Filter</span>
            </button>
          </div>
        </div>

        {/* Table replacement */}
        <div className="card border-0 rounded-4 shadow-sm">
          <div className="card-body p-0">
            <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
              <span className="fw-bold" style={{ fontSize: '14px' }}>Daftar Utang / Piutang</span>
              <span className="text-secondary" style={{ fontSize: '13px' }}>{filteredData.length} item</span>
            </div>

            <div>
              {filteredData.length === 0 ? (
                <div className="text-center py-5">
                  <div className="empty-icon text-secondary mb-3">
                    <Icon icon="folder-off" size={48} stroke={1.5} opacity={0.5} />
                  </div>
                  <p className="empty-title h4 fw-bold mb-1">Belum Ada Data</p>
                  <p className="empty-subtitle text-muted small mb-3" style={{ maxWidth: '300px', margin: '0 auto' }}>
                    Anda belum memiliki catatan utang atau piutang saat ini.
                  </p>
                  <button className="btn btn-primary btn-sm rounded-pill">
                    <Icon icon="plus" size={16} className="me-1" /> Tambah Data
                  </button>
                </div>
              ) : (
                filteredData.map((item, i) => {
                  const isPiutang = item.type === 'Piutang'
                  const color = isPiutang ? '#38a169' : '#e53e3e'
                  const prefix = isPiutang ? '+' : '-'
                  
                  return (
                    <div 
                      key={item.id} 
                      className="d-flex justify-content-between align-items-center px-4 py-3"
                      style={{ borderBottom: i < filteredData.length - 1 ? '1px solid #fafafa' : undefined }}
                    >
                      <div className="flex-grow-1 overflow-hidden me-2">
                        <div className="fw-semibold text-truncate" style={{ fontSize: '14px', color: '#1a202c' }}>
                          {item.personName}
                        </div>
                        <div className="d-flex align-items-center gap-1 flex-wrap mt-1" style={{ fontSize: '11px', color: '#a0aec0' }}>
                          <span 
                            className="rounded px-1 fw-semibold" 
                            style={{ 
                              background: isPiutang ? '#38a16922' : '#e53e3e22', 
                              color: color, 
                              fontSize: '10px' 
                            }}
                          >
                            {item.type}
                          </span>
                          <span>&middot; {getStatusBadge(item.status)}</span>
                          <span>&middot; {new Date(item.dueDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="text-end flex-shrink-0">
                        <div className="fw-bold" style={{ color, fontSize: '14px' }}>
                          {prefix}{formatCurrency(item.amount).replace(/Rp\s?|-/g, '')}
                        </div>
                        <div className="text-secondary mt-1" style={{ fontSize: '11px' }}>
                          {item.status === 'Jatuh Tempo' ? (
                            <span className="text-danger">Lewat jatuh tempo</span>
                          ) : (
                            <span>8 hari lagi</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
