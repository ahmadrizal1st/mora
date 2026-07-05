import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { Icon } from '@/shared/components/ui/Icon'
import { useChatStore } from '../store/useChatStore'
import { ChatHistoryDrawer } from '../components/ChatHistoryDrawer'
import clsx from 'clsx'

function formatRelativeTime(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Baru saja'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`
  if (diffInSeconds < 172800) return 'Kemarin'
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`
  if (diffInSeconds < 2592000) return 'Minggu lalu'
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} bulan lalu`
  return `${Math.floor(diffInSeconds / 31536000)} tahun lalu`
}

interface ContextMenuState {
  sessionId: string
  x: number
  y: number
}

export function ChatSearchPage() {
  const navigate = useNavigate()
  const { sessions, deleteSessions, loadSession, fetchSessions, createNewSession } = useChatStore()

  useEffect(() => {
    fetchSessions()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [isDrawerOpen, setIsDrawerOpen] = useState(window.innerWidth >= 768)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const ITEMS_PER_PAGE = 15

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null)
      }
    }
    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [contextMenu])

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions
    const query = searchQuery.toLowerCase()
    return sessions.filter((s) => s.title.toLowerCase().includes(query))
  }, [sessions, searchQuery])

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredSessions.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredSessions, currentPage])

  const totalPages = Math.ceil(filteredSessions.length / ITEMS_PER_PAGE)

  const toggleSelectionMode = () => {
    setIsSelectionMode((v) => !v)
    setSelectedIds(new Set())
  }

  const toggleSelection = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    e?.preventDefault()
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filteredSessions.length && filteredSessions.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredSessions.map((s) => s.id)))
    }
  }

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return
    deleteSessions(Array.from(selectedIds))
    setSelectedIds(new Set())
    setIsSelectionMode(false)
  }

  const handleDeleteOne = (id: string) => {
    deleteSessions([id])
    setContextMenu(null)
  }

  const handleRowClick = (id: string) => {
    if (isSelectionMode) {
      toggleSelection(id)
    } else {
      loadSession(id)
      navigate({ to: '/ai/chat/$sessionId', params: { sessionId: id } })
    }
  }

  const handleContextMenuOpen = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    e.preventDefault()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setContextMenu({ sessionId, x: rect.left, y: rect.bottom + 4 })
  }

  const handleNewChat = () => {
    createNewSession()
    navigate({ to: '/ai/chat/' })
  }

  return (
    <div
      className="d-flex w-100 chat-page-container"
      style={{ background: 'var(--tblr-bg-surface)' }}
    >
      <ChatHistoryDrawer isOpen={isDrawerOpen} onToggle={() => setIsDrawerOpen(!isDrawerOpen)} />

      {/* Context Menu (portal-like, fixed position) */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="card shadow"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1050,
            minWidth: 160,
            borderRadius: 10,
            overflow: 'hidden',
            padding: '4px 0',
          }}
        >
          <button
            className="d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100 text-danger"
            style={{ fontSize: 14, cursor: 'pointer' }}
            onClick={() => handleDeleteOne(contextMenu.sessionId)}
          >
            <Icon icon="trash" size={15} />
            Hapus percakapan
          </button>
        </div>
      )}

      <div className="flex-grow-1 d-flex flex-column h-100 min-w-0">
        {/* Mobile Header */}
        <div className="d-flex d-md-none px-3 pt-3 justify-content-between align-items-center">
          <div style={{ width: 32, height: 32 }}>
            {!isDrawerOpen && (
              <div
                className="text-muted d-flex align-items-center justify-content-center"
                style={{ cursor: 'pointer', width: '100%', height: '100%' }}
                onClick={() => setIsDrawerOpen(true)}
              >
                <Icon icon="layout-sidebar" size={20} />
              </div>
            )}
          </div>
          <Link
            to="/dashboard"
            className="text-muted d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32, textDecoration: 'none' }}
            title="Ke Beranda"
          >
            <Icon icon="home" size={20} />
          </Link>
        </div>

        {/* ── Main Content ── */}
        <div className="flex-grow-1 overflow-auto chat-scrollbar-thin">
          <div className="mx-auto w-100 px-3 px-md-4 py-4" style={{ maxWidth: 780 }}>

            {/* Page title + action buttons */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h2 className="fw-bold mb-0" style={{ fontSize: 22 }}>Percakapan</h2>

              <div className="d-flex align-items-center gap-2">
                {isSelectionMode ? (
                  <>
                    <span className="text-muted me-1" style={{ fontSize: 13 }}>
                      {selectedIds.size} dipilih
                    </span>
                    <button
                      className="btn btn-sm rounded-3 px-3"
                      style={{ fontSize: 13, border: '1px solid var(--tblr-border-color)' }}
                      onClick={handleSelectAll}
                    >
                      {selectedIds.size === filteredSessions.length && filteredSessions.length > 0
                        ? 'Batal semua'
                        : 'Pilih semua'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger rounded-3 px-3"
                      style={{ fontSize: 13 }}
                      onClick={handleDeleteSelected}
                      disabled={selectedIds.size === 0}
                    >
                      Hapus
                    </button>
                    <button
                      className="btn btn-sm rounded-3 px-3"
                      style={{ fontSize: 13, border: '1px solid var(--tblr-border-color)' }}
                      onClick={toggleSelectionMode}
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm rounded-3 px-3 d-flex align-items-center gap-1"
                      style={{ fontSize: 13, border: '1px solid var(--tblr-border-color)' }}
                      onClick={toggleSelectionMode}
                    >
                      <Icon icon="checks" size={14} />
                      Pilih
                    </button>
                    <button
                      className="btn btn-sm rounded-3 px-3 d-flex align-items-center gap-1 text-white fw-medium"
                      style={{ fontSize: 13, background: '#ff7a00', border: 'none' }}
                      onClick={handleNewChat}
                    >
                      <Icon icon="plus" size={14} />
                      Chat baru
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Search input */}
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <Icon icon="search" size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Cari percakapan..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
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

            {/* Total count */}
            {!searchQuery && (
              <p className="text-muted mb-3" style={{ fontSize: 12 }}>
                {sessions.length} percakapan
              </p>
            )}
            {searchQuery && (
              <p className="text-muted mb-3" style={{ fontSize: 12 }}>
                {filteredSessions.length} hasil untuk &ldquo;{searchQuery}&rdquo;
              </p>
            )}

            {/* Session list */}
            {filteredSessions.length === 0 ? (
              <div className="text-center py-5">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                  style={{ width: 48, height: 48, background: 'var(--tblr-bg-surface-secondary)' }}
                >
                  <Icon icon="message-circle-off" size={22} className="text-muted" />
                </div>
                <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                  {searchQuery ? `Tidak ada percakapan untuk "${searchQuery}"` : 'Belum ada percakapan'}
                </p>
                {!searchQuery && (
                  <button
                    className="btn btn-sm mt-3 px-4 text-white rounded-3"
                    style={{ background: '#ff7a00', fontSize: 13 }}
                    onClick={handleNewChat}
                  >
                    Mulai percakapan
                  </button>
                )}
              </div>
            ) : (
              <div className="d-flex flex-column" style={{ gap: 2 }}>
                {paginatedSessions.map((session) => {
                  const isSelected = selectedIds.has(session.id)
                  return (
                    <div
                      key={session.id}
                      className={clsx(
                        'chat-search-row d-flex align-items-center gap-3 rounded-3 px-3',
                        isSelected && 'chat-search-row--selected'
                      )}
                      style={{ minHeight: 48, cursor: 'pointer' }}
                      onClick={() => handleRowClick(session.id)}
                    >
                      {/* Checkbox or chat icon */}
                      {isSelectionMode ? (
                        <div
                          className="flex-shrink-0 d-flex align-items-center justify-content-center"
                          style={{ width: 20 }}
                          onClick={(e) => toggleSelection(session.id, e)}
                        >
                          {isSelected ? (
                            <Icon icon="circle-check-filled" size={18} className="text-primary" />
                          ) : (
                            <Icon icon="circle" size={18} className="text-muted" style={{ opacity: 0.45 }} />
                          )}
                        </div>
                      ) : (
                        <div className="flex-shrink-0 text-muted" style={{ width: 18, opacity: 0.5 }}>
                          <Icon icon="message" size={16} />
                        </div>
                      )}

                      {/* Title */}
                      <div className="flex-grow-1 min-w-0">
                        <div
                          className="text-truncate"
                          style={{ fontSize: 14, fontWeight: 500 }}
                        >
                          {session.title}
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="text-muted text-nowrap flex-shrink-0" style={{ fontSize: 12 }}>
                        {formatRelativeTime(session.updatedAt)}
                      </div>

                      {/* Three-dot menu (not in selection mode) */}
                      {!isSelectionMode && (
                        <button
                          className="btn btn-ghost btn-sm btn-icon rounded-2 text-muted flex-shrink-0 chat-search-menu-btn"
                          style={{ width: 28, height: 28, opacity: 0 }}
                          onClick={(e) => handleContextMenuOpen(e, session.id)}
                          title="Opsi"
                        >
                          <Icon icon="dots-vertical" size={15} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
                <button
                  className="btn btn-sm btn-icon rounded-2"
                  style={{ width: 32, height: 32, border: '1px solid var(--tblr-border-color)' }}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <Icon icon="chevron-left" size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={clsx(
                      'btn btn-sm rounded-2',
                      page === currentPage
                        ? 'text-white fw-semibold'
                        : 'text-muted'
                    )}
                    style={{
                      width: 32,
                      height: 32,
                      fontSize: 13,
                      border: page === currentPage ? 'none' : '1px solid transparent',
                      background: page === currentPage ? '#ff7a00' : 'transparent',
                    }}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="btn btn-sm btn-icon rounded-2"
                  style={{ width: 32, height: 32, border: '1px solid var(--tblr-border-color)' }}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <Icon icon="chevron-right" size={14} />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
