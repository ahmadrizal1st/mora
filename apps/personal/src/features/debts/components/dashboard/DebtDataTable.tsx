import { useState, useMemo, forwardRef, useImperativeHandle } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { Modal, ModalHeader, Button, Pagination, Spinner } from '@/shared/components/ui'

import type { DebtRecord, DebtStatus } from '../../types/debt.types'
import { useCreateDebt, useUpdateDebt, useDeleteDebt } from '../../hooks/useDebts'

export interface DebtDataTableRef {
  openCreate: () => void
}

const PAGE_SIZE = 10
const STATUSES = ['Belum Lunas', 'Sebagian', 'Menunggu', 'Jatuh Tempo', 'Lunas'] as const
const styles = `
  .debt-row:hover {
    background-color: var(--tblr-table-hover-bg, rgba(0, 0, 0, 0.04));
  }
`
const EMPTY_FORM: Omit<DebtRecord, 'id' | 'createdAt'> = {
  personName: '', type: 'Utang', status: 'Belum Lunas', dueDate: '', amount: 0, amountPaid: 0, description: '', priority: 'Sedang',
}

export const DebtDataTable = forwardRef<DebtDataTableRef, { records?: DebtRecord[], isLoading?: boolean }>(({ records = [], isLoading = false }, ref) => {
  const [activeTab, setActiveTab] = useState<'Semua' | 'Piutang' | 'Utang' | 'Jatuh Tempo'>('Semua')
  const [page, setPage] = useState(1)

  // API Hooks
  const createDebt = useCreateDebt()
  const updateDebt = useUpdateDebt()
  const deleteDebt = useDeleteDebt()

  // Modal state
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<DebtRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DebtRecord | null>(null)
  const [form, setForm] = useState<Omit<DebtRecord, 'id' | 'createdAt'>>(EMPTY_FORM)

  const filteredData = useMemo(() => {
    let data = records
    if (activeTab === 'Piutang') data = data.filter((d) => d.type === 'Piutang')
    if (activeTab === 'Utang') data = data.filter((d) => d.type === 'Utang')
    if (activeTab === 'Jatuh Tempo') {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      data = data.filter((d) => {
        const dDate = new Date(d.dueDate)
        dDate.setHours(0, 0, 0, 0)
        return d.status === 'Jatuh Tempo' || (dDate.getTime() <= now.getTime() && d.status !== 'Lunas')
      })
    }
    return data
  }, [activeTab, records])

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE)
  const paginatedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleTabChange = (tab: typeof activeTab) => { setActiveTab(tab); setPage(1) }

  const openCreate = () => { setForm(EMPTY_FORM); setEditTarget(null); setShowForm(true) }

  useImperativeHandle(ref, () => ({
    openCreate
  }))
  const openEdit = (item: DebtRecord) => { 
    setForm({ 
      personName: item.personName, 
      type: item.type, 
      status: item.status, 
      dueDate: item.dueDate, 
      amount: item.amount, 
      amountPaid: item.amountPaid,
      description: item.description || '',
      priority: item.priority || 'Sedang'
    })
    setEditTarget(item)
    setShowForm(true) 
  }

  const handleSave = () => {
    if (!form.personName || !form.dueDate || !form.amount) return
    if (editTarget) {
      updateDebt.mutate({ id: editTarget.id, data: form })
    } else {
      createDebt.mutate(form)
    }
    setShowForm(false)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteDebt.mutate(deleteTarget.id)
    setDeleteTarget(null)
  }

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      'Jatuh Tempo': 'text-danger', 'Menunggu': 'text-warning', 'Sebagian': 'text-success',
      'Belum Lunas': 'text-warning', 'Lunas': 'text-success',
    }
    return <span className={`fw-semibold ${map[status] || 'text-muted'}`}>{status}</span>
  }

  return (
    <>
      <style>{styles}</style>
      <div className="card shadow-sm border-0">
        {/* Tabs + Add button */}
        <div className="card-header d-flex align-items-center justify-content-between">
          <ul className="nav gap-3" style={{ borderBottom: 'none' }}>
            {(['Semua', 'Piutang', 'Utang', 'Jatuh Tempo'] as const).map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  onClick={() => handleTabChange(tab)}
                  className="bg-transparent border-0 fw-semibold"
                  style={{
                    fontSize: '14px',
                    color: activeTab === tab ? 'var(--tblr-body-color)' : 'var(--tblr-secondary)',
                    transition: 'color 0.15s',
                  }}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3 shadow-none" onClick={openCreate} style={{ backgroundColor: '#f76707', borderColor: '#f76707', borderRadius: '8px' }}>
              <Icon icon="plus" size={16} />
              <span className="d-none d-sm-inline fw-medium">Tambah Baru</span>
            </button>
          </div>
        </div>

        <div className="card-body p-0 d-flex flex-column">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom flex-shrink-0">
            <span className="fw-bold" style={{ fontSize: '13px' }}>Daftar Utang / Piutang</span>
            <span className="text-secondary" style={{ fontSize: '12px' }}>{filteredData.length} item</span>
          </div>

          {/* List */}
          <div className="d-flex flex-column flex-grow-1">
            {isLoading ? (
              <div className="text-center py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                <Spinner />
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-4 flex-grow-1 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div className="d-flex justify-content-center text-secondary mb-3">
                  <Icon icon="folder-off" size={40} stroke={1.5} style={{ opacity: 0.6 }} />
                </div>
                <div className="fw-bold text-body mb-1">Belum Ada Data</div>
                <div className="text-muted small">Anda belum memiliki catatan utang atau piutang.</div>
              </div>
            ) : (
              paginatedData.map((item, i) => {
                const isPiutang = item.type === 'Piutang'
                const color = isPiutang ? '#38a169' : '#e53e3e'
                const prefix = isPiutang ? '+ ' : '- '
                
                const now = new Date()
                now.setHours(0, 0, 0, 0)
                const dDate = new Date(item.dueDate)
                dDate.setHours(0, 0, 0, 0)
                const isOverdue = dDate.getTime() <= now.getTime() && item.status !== 'Lunas'
                const displayStatus = isOverdue ? 'Jatuh Tempo' : item.status

                return (
                  <div
                    key={item.id}
                    className="d-flex justify-content-between align-items-center px-3 py-2 debt-row"
                    style={{ 
                      borderBottom: i < paginatedData.length - 1 ? '1px solid #f1f5f9' : undefined,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onClick={() => openEdit(item)}
                  >
                    <div className="flex-grow-1 overflow-hidden me-2">
                      <div className="fw-semibold text-truncate text-body" style={{ fontSize: '13.5px', marginBottom: '2px' }}>
                        {item.personName}
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: '11px', color: 'var(--tblr-gray-500)' }}>
                        <span
                          className="rounded-pill px-2 fw-bold d-inline-flex align-items-center justify-content-center"
                          style={{ background: isPiutang ? '#38a16915' : '#e53e3e15', color, fontSize: '9px', height: '18px' }}
                        >
                          {item.type}
                        </span>
                        <span>·</span>
                        <span>{getStatusText(displayStatus)}</span>
                        <span>·</span>
                        <span>{new Date(item.dueDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="fw-bold flex-shrink-0" style={{ color, fontSize: '13.5px' }}>
                        {prefix}Rp {Number(item.amount).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card-footer d-flex flex-column flex-md-row align-items-center justify-content-between bg-transparent border-top py-2 gap-3">
              <div className="text-secondary small d-flex align-items-center">
                Menampilkan&nbsp;<strong>{(page - 1) * PAGE_SIZE + 1}</strong>&nbsp;–&nbsp;
                <strong>{Math.min(page * PAGE_SIZE, filteredData.length)}</strong>&nbsp;dari&nbsp;<strong>{filteredData.length}</strong>
                &nbsp;data
              </div>
              <div className="pagination-wrapper">
                <Pagination
                  activeItem={page}
                  count={totalPages}
                  className="m-0 pagination-sm"
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal show={showForm} onClose={() => setShowForm(false)} size="lg" scrollable>
        <ModalHeader
          title={editTarget ? 'Edit Catatan' : 'Tambah Catatan'}
          onClose={() => setShowForm(false)}
        />
        <div className="modal-body p-4">
          <div className="mb-3">
            <label className="form-label">Jenis</label>
            <div className="form-selectgroup">
              {(['Utang', 'Piutang'] as const).map((t) => (
                <label key={t} className="form-selectgroup-item">
                  <input
                    type="radio"
                    className="form-selectgroup-input"
                    checked={form.type === t}
                    onChange={() => setForm(f => ({ ...f, type: t }))}
                  />
                  <span className="form-selectgroup-label">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nama <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="Nama orang / lembaga"
                value={form.personName}
                onChange={(e) => setForm(f => ({ ...f, personName: e.target.value }))}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as DebtStatus }))}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Jumlah <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text">Rp</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={form.amount || ''}
                  onChange={(e) => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Jatuh Tempo <span className="text-danger">*</span></label>
              <input
                type="date"
                className="form-control"
                value={form.dueDate}
                onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Catatan <span className="text-muted fw-normal">(opsional)</span></label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Tambahkan catatan jika perlu..."
              value={form.description || ''}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="mt-4 d-flex justify-content-between align-items-center gap-2">
            <div>
              {editTarget && (
                <Button 
                  element="button" 
                  type="button" 
                  color="danger"
                  icon="trash" 
                  onClick={() => {
                    setShowForm(false)
                    setDeleteTarget(editTarget)
                  }}
                >
                  Hapus
                </Button>
              )}
            </div>
            <div className="d-flex gap-2">
              <Button element="button" type="button" link className="text-muted" onClick={() => setShowForm(false)}>Batal</Button>
              <Button element="button" type="button" color="primary" icon="check" onClick={handleSave}>
                {editTarget ? 'Simpan Perubahan' : 'Simpan Catatan'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={!!deleteTarget} onClose={() => setDeleteTarget(null)} size="sm">
        <ModalHeader title="Konfirmasi Penghapusan" onClose={() => setDeleteTarget(null)} />
        <div className="modal-body text-center py-4">
          <Icon icon="alert-triangle" size={48} className="text-danger mb-3" />
          <h3>Hapus Catatan?</h3>
          <div className="text-secondary mb-4">
            Apakah Anda yakin ingin menghapus catatan <strong>{deleteTarget?.personName}</strong>? Tindakan ini tidak dapat dibatalkan.
          </div>
          <div className="d-flex gap-2">
            <Button element="button" type="button" className="flex-fill" onClick={() => setDeleteTarget(null)}>Batal</Button>
            <Button element="button" type="button" color="danger" className="flex-fill fw-bold" onClick={handleDelete}>Ya, Hapus</Button>
          </div>
        </div>
      </Modal>
    </>
  )
})
DebtDataTable.displayName = 'DebtDataTable'
