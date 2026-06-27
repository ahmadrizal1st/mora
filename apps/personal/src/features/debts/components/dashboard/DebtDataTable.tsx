import { useState, useMemo } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { Modal, ModalHeader, Button } from '@/shared/components/ui'

interface DebtRecord {
  id: string
  personName: string
  type: 'Utang' | 'Piutang'
  status: string
  dueDate: string
  amount: number
  notes?: string
}

const INITIAL_DATA: DebtRecord[] = [
  { id: '1', personName: 'Budi Santoso', type: 'Utang', status: 'Belum Lunas', dueDate: '2026-07-10', amount: 1200000, notes: 'Pinjaman untuk renovasi' },
  { id: '2', personName: 'Siti Rahayu', type: 'Piutang', status: 'Menunggu', dueDate: '2026-07-05', amount: 850000 },
  { id: '3', personName: 'Ahmad Fauzi', type: 'Utang', status: 'Jatuh Tempo', dueDate: '2026-06-20', amount: 3500000, notes: 'KTA Bank' },
  { id: '4', personName: 'Rina Wulandari', type: 'Piutang', status: 'Lunas', dueDate: '2026-06-15', amount: 500000 },
  { id: '5', personName: 'Doni Prasetyo', type: 'Utang', status: 'Belum Lunas', dueDate: '2026-07-20', amount: 2000000 },
  { id: '6', personName: 'Maya Sari', type: 'Piutang', status: 'Menunggu', dueDate: '2026-07-12', amount: 750000 },
  { id: '7', personName: 'Joko Widodo', type: 'Utang', status: 'Sebagian', dueDate: '2026-07-08', amount: 4500000, notes: 'Cicilan motor' },
  { id: '8', personName: 'Dewi Lestari', type: 'Piutang', status: 'Jatuh Tempo', dueDate: '2026-06-25', amount: 1100000 },
  { id: '9', personName: 'Hendra Gunawan', type: 'Utang', status: 'Belum Lunas', dueDate: '2026-08-01', amount: 600000 },
  { id: '10', personName: 'Yeni Kurniawati', type: 'Piutang', status: 'Lunas', dueDate: '2026-06-10', amount: 925000 },
  { id: '11', personName: 'Rizky Pratama', type: 'Utang', status: 'Jatuh Tempo', dueDate: '2026-06-18', amount: 2750000, notes: 'Tagihan listrik bareng' },
  { id: '12', personName: 'Anita Susanti', type: 'Piutang', status: 'Menunggu', dueDate: '2026-07-25', amount: 1350000 },
  { id: '13', personName: 'Bambang Sutrisno', type: 'Utang', status: 'Sebagian', dueDate: '2026-07-15', amount: 800000 },
  { id: '14', personName: 'Fitri Handayani', type: 'Piutang', status: 'Belum Lunas', dueDate: '2026-08-05', amount: 450000 },
  { id: '15', personName: 'Irwan Setiawan', type: 'Utang', status: 'Lunas', dueDate: '2026-06-01', amount: 3200000 },
  { id: '16', personName: 'Nurul Hidayah', type: 'Piutang', status: 'Jatuh Tempo', dueDate: '2026-06-22', amount: 670000 },
  { id: '17', personName: 'Agus Salim', type: 'Utang', status: 'Menunggu', dueDate: '2026-07-30', amount: 1800000, notes: 'Patungan beli laptop' },
  { id: '18', personName: 'Sri Wahyuni', type: 'Piutang', status: 'Lunas', dueDate: '2026-06-08', amount: 990000 },
  { id: '19', personName: 'Teguh Santoso', type: 'Utang', status: 'Belum Lunas', dueDate: '2026-08-10', amount: 2300000 },
  { id: '20', personName: 'Lina Marlina', type: 'Piutang', status: 'Menunggu', dueDate: '2026-07-18', amount: 560000 },
]

const PAGE_SIZE = 7
const STATUSES = ['Belum Lunas', 'Menunggu', 'Sebagian', 'Jatuh Tempo', 'Lunas']
const EMPTY_FORM: Omit<DebtRecord, 'id'> = {
  personName: '', type: 'Utang', status: 'Belum Lunas', dueDate: '', amount: 0, notes: '',
}

export function DebtDataTable() {
  const [activeTab, setActiveTab] = useState<'Semua' | 'Piutang' | 'Utang' | 'Jatuh Tempo'>('Semua')
  const [page, setPage] = useState(1)
  const [records, setRecords] = useState<DebtRecord[]>(INITIAL_DATA)

  // Modal state
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<DebtRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DebtRecord | null>(null)
  const [form, setForm] = useState<Omit<DebtRecord, 'id'>>(EMPTY_FORM)

  const filteredData = useMemo(() => {
    let data = records
    if (activeTab === 'Piutang') data = data.filter((d) => d.type === 'Piutang')
    if (activeTab === 'Utang') data = data.filter((d) => d.type === 'Utang')
    if (activeTab === 'Jatuh Tempo') data = data.filter((d) => d.status === 'Jatuh Tempo')
    return data
  }, [activeTab, records])

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE)
  const paginatedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleTabChange = (tab: typeof activeTab) => { setActiveTab(tab); setPage(1) }

  const openCreate = () => { setForm(EMPTY_FORM); setEditTarget(null); setShowForm(true) }
  const openEdit = (item: DebtRecord) => { setForm({ personName: item.personName, type: item.type, status: item.status, dueDate: item.dueDate, amount: item.amount, notes: item.notes || '' }); setEditTarget(item); setShowForm(true) }

  const handleSave = () => {
    if (!form.personName || !form.dueDate || !form.amount) return
    if (editTarget) {
      setRecords((prev) => prev.map((r) => r.id === editTarget.id ? { ...editTarget, ...form } : r))
    } else {
      const newId = String(Date.now())
      setRecords((prev) => [{ id: newId, ...form }, ...prev])
    }
    setShowForm(false)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setRecords((prev) => prev.filter((r) => r.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      'Jatuh Tempo': 'text-danger', 'Menunggu': 'text-warning', 'Sebagian': 'text-success',
      'Belum Lunas': 'text-warning', 'Lunas': 'text-success',
    }
    return <span className={`fw-semibold ${map[status] || 'text-muted'}`} style={{ fontSize: '11px' }}>{status}</span>
  }

  return (
    <>
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
            <button className="btn btn-light bg-surface btn-sm border d-flex align-items-center gap-2 shadow-none px-3" style={{ borderRadius: '8px' }}>
              <Icon icon="download" size={16} className="text-secondary" />
              <span className="d-none d-sm-inline text-secondary fw-medium">Ekspor Laporan</span>
            </button>
            <button className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3 shadow-none" onClick={openCreate} style={{ backgroundColor: '#f76707', borderColor: '#f76707', borderRadius: '8px' }}>
              <Icon icon="plus" size={16} />
              <span className="d-none d-sm-inline fw-medium">Tambah Baru</span>
            </button>
          </div>
        </div>

        <div className="card-body p-0 d-flex flex-column">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom flex-shrink-0">
            <span className="fw-bold" style={{ fontSize: '14px' }}>Daftar Utang / Piutang</span>
            <span className="text-secondary" style={{ fontSize: '13px' }}>{filteredData.length} item</span>
          </div>

          {/* List */}
          <div className="d-flex flex-column flex-grow-1">
            {filteredData.length === 0 ? (
              <div className="text-center py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                <div className="d-flex justify-content-center text-secondary mb-3">
                  <Icon icon="folder-off" size={40} stroke={1.5} opacity={0.6} />
                </div>
                <div className="fw-bold text-body mb-1">Belum Ada Data</div>
                <div className="text-muted small mb-3">Anda belum memiliki catatan utang atau piutang.</div>
                <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={openCreate}>
                  <Icon icon="plus" size={16} className="me-1" /> Tambah Data
                </button>
              </div>
            ) : (
              paginatedData.map((item, i) => {
                const isPiutang = item.type === 'Piutang'
                const color = isPiutang ? '#38a169' : '#e53e3e'
                const prefix = isPiutang ? '+ ' : '- '

                return (
                  <div
                    key={item.id}
                    className="d-flex justify-content-between align-items-center px-4 py-1"
                    style={{ borderBottom: i < paginatedData.length - 1 ? '1px solid var(--tblr-border-color-light, #fafafa)' : undefined }}
                  >
                    <div className="flex-grow-1 overflow-hidden me-2">
                      <div className="fw-semibold text-truncate" style={{ fontSize: '14px', color: '#1a202c' }}>
                        {item.personName}
                      </div>
                      <div className="d-flex align-items-center gap-1 flex-wrap mt-1" style={{ fontSize: '11px', color: '#a0aec0' }}>
                        <span
                          className="rounded px-1 fw-semibold"
                          style={{ background: isPiutang ? '#38a16922' : '#e53e3e22', color, fontSize: '10px' }}
                        >
                          {item.type}
                        </span>
                        <span>· {getStatusText(item.status)}</span>
                        <span>· {new Date(item.dueDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="fw-bold flex-shrink-0" style={{ color, fontSize: '14px' }}>
                        {prefix}Rp {Number(item.amount).toLocaleString('id-ID')}
                      </div>
                      <div className="d-flex gap-1 ms-2">
                        <button className="btn btn-sm btn-ghost-secondary p-1" onClick={() => openEdit(item)} title="Edit">
                          <Icon icon="pencil" size={14} />
                        </button>
                        <button className="btn btn-sm btn-ghost-danger p-1" onClick={() => setDeleteTarget(item)} title="Hapus">
                          <Icon icon="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center px-4 py-2 border-top">
              <span className="text-muted" style={{ fontSize: '12px' }}>Hal. {page} dari {totalPages}</span>
              <div className="d-flex gap-1">
                <button className="btn btn-sm btn-ghost-secondary px-2 py-1" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ fontSize: '12px' }}>
                  <Icon icon="chevron-left" size="xs" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={`btn btn-sm px-2 py-1 ${page === p ? 'btn-primary' : 'btn-ghost-secondary'}`} onClick={() => setPage(p)} style={{ fontSize: '12px', minWidth: '28px' }}>
                    {p}
                  </button>
                ))}
                <button className="btn btn-sm btn-ghost-secondary px-2 py-1" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ fontSize: '12px' }}>
                  <Icon icon="chevron-right" size="xs" />
                </button>
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
              <select className="form-select" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}>
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
              value={form.notes || ''}
              onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>

          <div className="mt-4 d-flex justify-content-end gap-2">
            <Button element="button" type="button" link className="text-muted" onClick={() => setShowForm(false)}>Batal</Button>
            <Button element="button" type="button" color="primary" icon="check" onClick={handleSave}>
              {editTarget ? 'Simpan Perubahan' : 'Simpan Catatan'}
            </Button>
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
}
