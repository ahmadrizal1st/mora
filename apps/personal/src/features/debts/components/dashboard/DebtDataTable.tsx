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

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <thead>
              <tr>
                <th className="text-muted fw-bold text-uppercase border-bottom-0" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Transaksi</th>
                <th className="text-muted fw-bold text-uppercase border-bottom-0" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Jenis</th>
                <th className="text-muted fw-bold text-uppercase border-bottom-0" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Nominal</th>
                <th className="text-muted fw-bold text-uppercase border-bottom-0" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Jatuh Tempo</th>
                <th className="text-muted fw-bold text-uppercase border-bottom-0" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Status</th>
                <th className="text-muted fw-bold text-uppercase border-bottom-0" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Prioritas</th>
                <th className="w-1 border-bottom-0"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex py-1 align-items-center">
                      <span className="avatar avatar-sm me-3 bg-secondary-lt rounded-circle">
                        {item.personName.charAt(0)}
                      </span>
                      <div className="flex-fill">
                        <div className="font-weight-medium fw-bold text-dark">{item.personName}</div>
                        <div className="text-muted small">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {getTypeBadge(item.type)}
                  </td>
                  <td>
                    <div className="fw-bold text-dark fs-4">{formatCurrency(item.amount)}</div>
                  </td>
                  <td>
                    <div className="text-dark small">{new Date(item.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    {item.status === 'Jatuh Tempo' ? (
                      <div className="text-danger" style={{ fontSize: '10px' }}>Lewat jatuh tempo</div>
                    ) : (
                      <div className="text-orange" style={{ fontSize: '10px' }}>8 hari lagi</div>
                    )}
                  </td>
                  <td className="fw-semibold small">
                    {getStatusBadge(item.status)}
                  </td>
                  <td>
                    {getPriorityBadge(item.priority)}
                  </td>
                  <td>
                    <button className="btn btn-ghost-secondary btn-icon btn-sm border-0">
                      <Icon icon="dots-vertical" size={16} />
                    </button>
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
