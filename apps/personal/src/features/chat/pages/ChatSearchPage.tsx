import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Icon } from '@/shared/components/ui/Icon'
import { Button } from '@/shared/components/ui/Button'
import { useChatStore } from '../store/useChatStore'
import { ChatHistoryDrawer } from '../components/ChatHistoryDrawer'
import clsx from 'clsx'

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 172800) return 'yesterday'
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return 'last week'
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

export function ChatSearchPage() {
  const navigate = useNavigate()
  const { sessions, deleteSessions, loadSession, fetchSessions, createNewSession } = useChatStore()

  useEffect(() => {
    fetchSessions()
  }, [])

  const [isDrawerOpen, setIsDrawerOpen] = useState(window.innerWidth >= 768)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions
    const query = searchQuery.toLowerCase()
    return sessions.filter((s) => s.title.toLowerCase().includes(query))
  }, [sessions, searchQuery])

  const paginatedSessions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredSessions.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredSessions, currentPage])
  
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage)

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
    setSelectedIds(new Set())
  }

  const toggleSelection = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filteredSessions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredSessions.map((s) => s.id)))
    }
  }

  const handleDelete = () => {
    if (selectedIds.size > 0) {
      deleteSessions(Array.from(selectedIds))
      setSelectedIds(new Set())
      setIsSelectionMode(false)
    }
  }

  const handleRowClick = (id: string) => {
    if (isSelectionMode) {
      toggleSelection(id)
    } else {
      loadSession(id)
      navigate({ to: '/ai/chat/$sessionId', params: { sessionId: id } })
    }
  }

  return (
    <div
      className="d-flex w-100 bg-light dark:bg-dark text-body dark:text-white"
      style={{ height: '100dvh', paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <ChatHistoryDrawer isOpen={isDrawerOpen} onToggle={() => setIsDrawerOpen(!isDrawerOpen)} />

      <div
        className="flex-grow-1 d-flex flex-column h-100 position-relative"
        style={{ minWidth: 0 }}
      >
        <div
          className="bg-transparent px-3 py-3 d-flex align-items-center gap-3 position-absolute w-100"
          style={{ zIndex: 10, top: 0, left: 0, right: 0 }}
        >
          {!isDrawerOpen && (
            <Button
              iconOnly
              ghost
              size="md"
              icon="layout-sidebar"
              className="p-0 text-secondary d-md-none"
              onClick={() => setIsDrawerOpen(true)}
            />
          )}
          <div className="flex-grow-1"></div>
          <Button
            to="/dashboard"
            pill
            white
            size="md"
            icon="home"
            text="Home"
            className="fw-medium text-body"
          />
        </div>

        <div className="flex-grow-1 overflow-auto custom-scrollbar pt-5 mt-4 pb-5">
          <div className="mx-auto w-100 px-4 py-4" style={{ maxWidth: '900px' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center bg-warning bg-opacity-10 rounded-circle flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                  <Icon icon="messages" size={24} className="text-warning" />
                </div>
                <div>
                  <h2
                    className="mb-1 fw-bold text-dark dark:text-white"
                    style={{ fontSize: '24px' }}
                  >
                    Chats
                  </h2>
                  <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                    All your conversations in one place. Continue where you left off.
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                {isSelectionMode ? (
                  <>
                    <span className="text-muted small me-2">{selectedIds.size} selected</span>
                    <Button
                      size="sm"
                      pill
                      color="dark"
                      className="bg-light dark:bg-secondary dark:bg-opacity-25 border-0 text-body dark:text-white hover-bg-secondary hover-bg-opacity-25 px-3 py-2"
                      onClick={handleSelectAll}
                      text={
                        selectedIds.size === filteredSessions.length && filteredSessions.length > 0
                          ? 'Deselect all'
                          : 'Select all'
                      }
                    />
                    <Button
                      size="sm"
                      pill
                      color="dark"
                      className="bg-light dark:bg-secondary dark:bg-opacity-25 border-0 text-body dark:text-white hover-bg-secondary hover-bg-opacity-25 px-3 py-2"
                      onClick={handleDelete}
                      disabled={selectedIds.size === 0}
                      text="Delete"
                    />
                    <Button
                      size="sm"
                      pill
                      color="dark"
                      className="bg-transparent border-0 text-body dark:text-white hover-bg-light dark:hover-bg-secondary dark:hover-bg-opacity-25 px-3 py-2"
                      onClick={toggleSelectionMode}
                      text="Cancel"
                    />
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-light bg-transparent border rounded-pill px-3 py-2 d-flex align-items-center gap-2 text-dark fw-medium hover-bg-light transition-colors"
                      onClick={toggleSelectionMode}
                      style={{ fontSize: '14px', borderColor: '#e9ecef' }}
                    >
                      Select chats <Icon icon="chevron-down" size={16} className="text-muted" />
                    </button>
                    <button
                      className="btn btn-sm text-white rounded-pill px-3 py-2 fw-medium d-flex align-items-center gap-2 shadow-sm transition-colors"
                      style={{ backgroundColor: '#ff7a00', fontSize: '14px' }}
                      onClick={() => {
                        createNewSession()
                        navigate({ to: '/ai/chat/' })
                      }}
                    >
                      <Icon icon="plus" size={16} /> New chat
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="bg-white dark:bg-dark-card border border-light dark:border-dark rounded-4 shadow-sm d-flex align-items-center px-3 py-2">
                <Icon icon="search" size={18} className="text-muted me-2 flex-shrink-0" />
                <input
                  type="text"
                  className="form-control bg-transparent border-0 shadow-none px-2 py-1 text-body"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  style={{ fontSize: '15px' }}
                />
                <button className="btn btn-icon btn-sm text-muted bg-transparent border-0 rounded-circle hover-bg-light flex-shrink-0">
                  <Icon icon="adjustments-horizontal" size={18} />
                </button>
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              {filteredSessions.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <p>No chats found</p>
                </div>
              ) : (
                paginatedSessions.map((session, index) => {
                  const isSelected = selectedIds.has(session.id)
                  return (
                    <div
                      key={session.id}
                      className={clsx(
                        'bg-white dark:bg-dark-card border border-light dark:border-dark rounded-3 px-3 py-2 d-flex align-items-center gap-3 transition-colors cursor-pointer',
                        isSelectionMode && isSelected ? 'border-primary bg-primary bg-opacity-10' : 'hover-bg-light'
                      )}
                      onClick={() => handleRowClick(session.id)}
                    >
                      {isSelectionMode && (
                        <div
                          className="d-flex align-items-center justify-content-center text-muted flex-shrink-0"
                          style={{ width: '20px', height: '20px' }}
                          onClick={(e) => {
                            toggleSelection(session.id, e)
                          }}
                        >
                          {isSelected ? (
                            <Icon icon="circle-check-filled" size={18} className="text-primary" />
                          ) : (
                            <Icon icon="circle" size={18} className="opacity-50" />
                          )}
                        </div>
                      )}
                      
                      <div className="text-muted flex-shrink-0 d-flex align-items-center">
                         <Icon icon="messages" size={18} />
                      </div>

                      <div className="flex-grow-1 min-w-0 d-flex align-items-center justify-content-between gap-3">
                        <div
                          className="text-dark dark:text-white text-truncate fw-medium"
                          style={{ fontSize: '14px' }}
                        >
                          {session.title}
                        </div>
                        <div className="text-muted text-nowrap flex-shrink-0" style={{ fontSize: '12px' }}>
                          {formatRelativeTime(session.updatedAt)}
                        </div>
                      </div>
                      
                      {!isSelectionMode && (
                        <button className="btn btn-icon btn-sm text-muted bg-transparent border-0 rounded-circle hover-bg-light flex-shrink-0 ms-1" style={{ width: '28px', height: '28px' }} onClick={(e) => { e.stopPropagation(); /* TODO: Show menu */ }}>
                          <Icon icon="dots-vertical" size={16} />
                        </button>
                      )}
                    </div>
                  )
                })
              )}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
                <button 
                  className="btn btn-icon btn-sm rounded-circle border border-light bg-white text-muted hover-bg-light shadow-sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <Icon icon="chevron-left" size={16} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={clsx(
                      "btn btn-sm rounded-2 d-flex align-items-center justify-content-center fw-medium border-0",
                      page === currentPage ? "text-warning bg-warning bg-opacity-10" : "text-muted bg-transparent hover-bg-light"
                    )}
                    style={{ width: '32px', height: '32px', fontSize: '13px' }}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  className="btn btn-icon btn-sm rounded-circle border border-light bg-white text-muted hover-bg-light shadow-sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <Icon icon="chevron-right" size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
