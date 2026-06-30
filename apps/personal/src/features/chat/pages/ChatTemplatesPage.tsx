import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Icon, Modal, ModalHeader } from '@/shared/components/ui'
import { useChatStore } from '../store/useChatStore'
import { ChatHistoryDrawer } from '../components/ChatHistoryDrawer'
import {
  useTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  useUseTemplate,
} from '../hooks/useTemplates'
import type { PromptTemplate, TemplateCategory, CreateTemplatePayload } from '../services/templateService'
import clsx from 'clsx'

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: { value: TemplateCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'financial-analysis', label: 'Analisis Keuangan' },
  { value: 'investment', label: 'Investasi' },
  { value: 'planning', label: 'Perencanaan' },
  { value: 'report', label: 'Laporan' },
  { value: 'other', label: 'Lainnya' },
]

const ICONS = [
  'chart-bar', 'chart-pie', 'chart-line', 'chart-area',
  'wallet', 'coins', 'piggy-bank', 'cash',
  'target', 'shield-check', 'trending-up', 'report',
  'file-invoice', 'calculator', 'sparkles', 'star',
]

const COLORS = [
  '#ff7a00', '#20c997', '#6f42c1', '#0d6efd',
  '#e83e8c', '#fd7e14', '#198754', '#dc3545',
]

const CATEGORY_LABEL: Record<TemplateCategory, string> = {
  'financial-analysis': 'Analisis Keuangan',
  investment: 'Investasi',
  planning: 'Perencanaan',
  report: 'Laporan',
  other: 'Lainnya',
}

const DEFAULT_FORM: CreateTemplatePayload = {
  title: '',
  description: '',
  prompt: '',
  category: 'financial-analysis',
  icon: 'sparkles',
  icon_color: '#ff7a00',
}

// ─── TemplateFormModal ────────────────────────────────────────────────────────

interface TemplateFormModalProps {
  initial?: Partial<CreateTemplatePayload>
  onSave: (payload: CreateTemplatePayload) => void
  onClose: () => void
  isLoading: boolean
  mode: 'create' | 'edit'
  show: boolean
}

function TemplateFormModal({ initial, onSave, onClose, isLoading, mode, show }: TemplateFormModalProps) {
  const [form, setForm] = useState<CreateTemplatePayload>({ ...DEFAULT_FORM, ...initial })

  // Reset form when initial changes or modal opens
  useEffect(() => {
    if (show) {
      setForm({ ...DEFAULT_FORM, ...initial })
    }
  }, [initial, show])

  const set = (key: keyof CreateTemplatePayload, value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  const valid = form.title.trim() && form.prompt.trim() && form.category

  return (
    <Modal show={show} onClose={onClose} size="lg">
      <ModalHeader title={mode === 'create' ? 'Buat Template Baru' : 'Edit Template'} onClose={onClose} />
      <div className="modal-body p-4">
        {/* Title */}
        <div className="mb-3">
          <label className="form-label fw-medium" style={{ fontSize: 13 }}>Judul <span className="text-danger">*</span></label>
          <input
            className="form-control"
            style={{ fontSize: 14 }}
            placeholder="contoh: Analisis Arus Kas Bulanan"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label fw-medium" style={{ fontSize: 13 }}>Deskripsi</label>
          <input
            className="form-control"
            style={{ fontSize: 14 }}
            placeholder="Deskripsi singkat template..."
            value={form.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        {/* Prompt */}
        <div className="mb-3">
          <label className="form-label fw-medium" style={{ fontSize: 13 }}>Prompt <span className="text-danger">*</span></label>
          <textarea
            className="form-control"
            style={{ fontSize: 14, minHeight: 120, resize: 'vertical' }}
            placeholder="Tulis prompt yang akan dikirim ke AI saat template digunakan..."
            value={form.prompt}
            onChange={(e) => set('prompt', e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label fw-medium" style={{ fontSize: 13 }}>Kategori <span className="text-danger">*</span></label>
          <select
            className="form-select"
            style={{ fontSize: 14 }}
            value={form.category}
            onChange={(e) => set('category', e.target.value as TemplateCategory)}
          >
            {CATEGORIES.filter(c => c.value !== 'all').map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Icon */}
        <div className="mb-3">
          <label className="form-label fw-medium" style={{ fontSize: 13 }}>Ikon</label>
          <div className="d-flex flex-wrap gap-2">
            {ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                className={clsx('btn btn-sm rounded-2 p-2', form.icon === icon ? 'btn-primary' : 'btn-ghost')}
                style={{ width: 38, height: 38 }}
                onClick={() => set('icon', icon)}
              >
                <Icon icon={icon} size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Icon Color */}
        <div className="mb-1">
          <label className="form-label fw-medium" style={{ fontSize: 13 }}>Warna Ikon</label>
          <div className="d-flex gap-2 flex-wrap">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className="rounded-circle border-0 flex-shrink-0"
                style={{
                  width: 28, height: 28, background: color,
                  outline: form.icon_color === color ? `3px solid ${color}` : 'none',
                  outlineOffset: 2,
                }}
                onClick={() => set('icon_color', color)}
              />
            ))}
            <input
              type="color"
              className="form-control form-control-color rounded-3 border"
              style={{ width: 36, height: 28, padding: '2px 3px', cursor: 'pointer' }}
              value={form.icon_color}
              onChange={(e) => set('icon_color', e.target.value)}
              title="Warna kustom"
            />
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn" onClick={onClose}>
          Batal
        </button>
        <button
          className="btn btn-primary"
          style={{ background: '#ff7a00', border: 'none' }}
          disabled={!valid || isLoading}
          onClick={() => onSave(form)}
        >
          {isLoading ? (
            <span className="spinner-border me-2" style={{ width: 14, height: 14, borderWidth: '0.18em' }} />
          ) : null}
          {mode === 'create' ? 'Buat Template' : 'Simpan Perubahan'}
        </button>
      </div>
    </Modal>
  )
}

// ─── TemplateCard ─────────────────────────────────────────────────────────────

interface TemplateCardProps {
  template: PromptTemplate
  onUse: (t: PromptTemplate) => void
  onEdit: (t: PromptTemplate) => void
  onDelete: (t: PromptTemplate) => void
}

function TemplateCard({ template, onUse, onEdit, onDelete }: TemplateCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const iconBg = template.icon_color + '20' // 12% opacity hex

  return (
    <div
      className="card h-100"
      style={{ borderRadius: 12 }}
    >
      <div className="card-body p-3 d-flex flex-column gap-3">
        {/* Header row */}
        <div className="d-flex align-items-start gap-3">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: 44, height: 44, background: iconBg }}
          >
            <Icon icon={template.icon} size={22} style={{ color: template.icon_color }} />
          </div>

          <div className="flex-grow-1 min-w-0">
            <div className="fw-semibold text-truncate" style={{ fontSize: 14 }}>{template.title}</div>
            {template.description && (
              <div className="text-muted mt-1" style={{ fontSize: 12, lineHeight: 1.45 }}>
                {template.description}
              </div>
            )}
          </div>

          {/* Three-dot menu */}
          <div className="position-relative flex-shrink-0" ref={menuRef}>
            <button
              className="btn btn-ghost btn-sm btn-icon rounded-3 text-muted"
              style={{ width: 28, height: 28 }}
              onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v) }}
            >
              <Icon icon="dots-vertical" size={15} />
            </button>

            {menuOpen && (
              <div
                className="card shadow position-absolute end-0"
                style={{ top: '100%', zIndex: 100, minWidth: 150, borderRadius: 10, padding: '4px 0', marginTop: 4 }}
              >
                <button
                  className="d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100 text-body"
                  style={{ fontSize: 13 }}
                  onClick={() => { setMenuOpen(false); onEdit(template) }}
                >
                  <Icon icon="pencil" size={14} /> Edit
                </button>
                <button
                  className="d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100 text-danger"
                  style={{ fontSize: 13 }}
                  onClick={() => { setMenuOpen(false); onDelete(template) }}
                >
                  <Icon icon="trash" size={14} /> Hapus
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category badge + usage */}
        <div className="d-flex align-items-center justify-content-between">
          <span
            className="badge fw-medium"
            style={{
              fontSize: 11, borderRadius: 6, padding: '3px 8px',
              background: template.icon_color + '18',
              color: template.icon_color,
            }}
          >
            {CATEGORY_LABEL[template.category] ?? template.category}
          </span>
          <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: 11 }}>
            <Icon icon="chart-bar" size={12} />
            {template.usage_count}× digunakan
          </span>
        </div>

        {/* Use button */}
        <button
          className="btn btn-sm w-100 rounded-3 fw-medium"
          style={{
            fontSize: 13, border: `1px solid ${template.icon_color}40`,
            background: template.icon_color + '0d',
            color: template.icon_color,
            marginTop: 'auto',
          }}
          onClick={() => onUse(template)}
        >
          Gunakan Template
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ChatTemplatesPage() {
  const navigate = useNavigate()
  const { createNewSession, fetchSessions } = useChatStore()

  const [isDrawerOpen, setIsDrawerOpen] = useState(window.innerWidth >= 768)
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null)

  // Load chat history on mount
  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const { data: templates = [], isLoading } = useTemplates()
  const createMutation = useCreateTemplate()
  const updateMutation = useUpdateTemplate()
  const deleteMutation = useDeleteTemplate()
  const useMutation_ = useUseTemplate()

  const filtered = useMemo(() => {
    let list = templates
    if (activeCategory !== 'all') list = list.filter(t => t.category === activeCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description ?? '').toLowerCase().includes(q)
      )
    }
    return list
  }, [templates, activeCategory, searchQuery])

  const handleUse = async (template: PromptTemplate) => {
    useMutation_.mutate(template.id)
    createNewSession()
    navigate({ to: '/ai/chat/' })
    // Prompt will be sent by the user seeing the chat — we pre-fill via sessionStorage
    sessionStorage.setItem('mora_template_prompt', template.prompt)
  }

  const handleSave = async (payload: CreateTemplatePayload) => {
    if (modalMode === 'create') {
      await createMutation.mutateAsync(payload)
    } else if (editingTemplate) {
      await updateMutation.mutateAsync({ id: editingTemplate.id, payload })
    }
    setModalMode(null)
    setEditingTemplate(null)
  }

  const handleDelete = (template: PromptTemplate) => {
    if (confirm(`Hapus template "${template.title}"?`)) {
      deleteMutation.mutate(template.id)
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <div className="d-flex w-100 chat-page-container" style={{ background: 'var(--tblr-bg-surface)' }}>
      <ChatHistoryDrawer isOpen={isDrawerOpen} onToggle={() => setIsDrawerOpen(!isDrawerOpen)} />

      {/* Create/Edit Modal */}
      <TemplateFormModal
        mode={modalMode || 'create'}
        initial={editingTemplate ?? undefined}
        onSave={handleSave}
        onClose={() => { setModalMode(null); setEditingTemplate(null) }}
        isLoading={isSaving}
        show={modalMode !== null}
      />

      <div className="flex-grow-1 d-flex flex-column h-100 min-w-0">
        {/* ─── Content ── */}
        <div className="flex-grow-1 overflow-auto chat-scrollbar-thin">
          <div className="mx-auto w-100 px-3 px-md-4 py-4" style={{ maxWidth: 900 }}>

            {/* Mobile sidebar toggle */}
            <div className="d-flex d-md-none align-items-center mb-4">
              <button
                className="btn btn-ghost btn-sm btn-icon rounded-3 text-muted"
                onClick={() => setIsDrawerOpen(true)}
              >
                <Icon icon="layout-sidebar" size={18} />
              </button>
            </div>

            {/* Page header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h2 className="fw-bold mb-1" style={{ fontSize: 22 }}>Templates</h2>
                <p className="text-muted mb-0" style={{ fontSize: 13 }}>
                  Prompt siap pakai untuk analisis keuangan Anda.
                </p>
              </div>
              <button
                className="btn btn-sm rounded-3 px-3 d-flex align-items-center gap-1 text-white fw-medium flex-shrink-0"
                style={{ fontSize: 13, background: '#ff7a00', border: 'none' }}
                onClick={() => setModalMode('create')}
              >
                <Icon icon="plus" size={15} />
                Template baru
              </button>
            </div>

            {/* Category tabs */}
            <div className="d-flex gap-1 overflow-x-auto chat-scrollbar-thin mb-4 pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  className={clsx(
                    'btn btn-sm rounded-pill text-nowrap flex-shrink-0',
                    activeCategory === cat.value
                      ? 'text-white fw-medium'
                      : 'text-muted'
                  )}
                  style={{
                    fontSize: 13,
                    padding: '5px 14px',
                    background: activeCategory === cat.value ? '#ff7a00' : 'transparent',
                    border: activeCategory === cat.value
                      ? 'none'
                      : '1px solid var(--tblr-border-color)',
                  }}
                  onClick={() => setActiveCategory(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <Icon icon="search" size={16} className="text-muted" />
                </span>
                <input
                  className="form-control border-start-0"
                  placeholder="Cari template..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: 14 }}
                />
                {searchQuery && (
                  <button
                    className="btn btn-ghost btn-sm btn-icon"
                    onClick={() => setSearchQuery('')}
                    type="button"
                  >
                    <Icon icon="x" size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border" style={{ color: '#ff7a00', width: 28, height: 28, borderWidth: '0.18em' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                  style={{ width: 48, height: 48, background: 'var(--tblr-bg-surface-secondary)' }}
                >
                  <Icon icon="template" size={22} className="text-muted" />
                </div>
                <p className="text-muted mb-1" style={{ fontSize: 14 }}>
                  {searchQuery
                    ? `Tidak ada template untuk "${searchQuery}"`
                    : 'Belum ada template'}
                </p>
                {!searchQuery && (
                  <button
                    className="btn btn-sm mt-2 px-4 text-white rounded-3"
                    style={{ background: '#ff7a00', fontSize: 13 }}
                    onClick={() => setModalMode('create')}
                  >
                    Buat template pertama
                  </button>
                )}
              </div>
            ) : (
              <div className="row g-3">
                {filtered.map((t) => (
                  <div key={t.id} className="col-12 col-md-6 col-xl-4">
                    <TemplateCard
                      template={t}
                      onUse={handleUse}
                      onEdit={(t) => { setEditingTemplate(t); setModalMode('edit') }}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
