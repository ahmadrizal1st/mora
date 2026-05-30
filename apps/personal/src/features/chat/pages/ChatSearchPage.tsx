import { useState, useMemo } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Icon } from '@/shared/components/ui/Icon'
import { Button } from '@/shared/components/ui/Button'
import { useChatStore } from '../store/useChatStore'
import { ChatHistoryDrawer } from '../components/ChatHistoryDrawer'
import clsx from 'clsx'

// Simple relative time formatter
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
  const { sessions, deleteSessions, loadSession } = useChatStore()
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(window.innerWidth >= 768)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions
    const query = searchQuery.toLowerCase()
    return sessions.filter(s => s.title.toLowerCase().includes(query))
  }, [sessions, searchQuery])

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
      setSelectedIds(new Set(filteredSessions.map(s => s.id)))
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
      navigate({ to: '/chat' })
    }
  }

  return (
    <div className="d-flex w-100 bg-light dark:bg-dark text-body dark:text-white" style={{ height: '100dvh', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <ChatHistoryDrawer 
        isOpen={isDrawerOpen} 
        onToggle={() => setIsDrawerOpen(!isDrawerOpen)} 
      />

      <div className="flex-grow-1 d-flex flex-column h-100 position-relative" style={{ minWidth: 0 }}>
        {/* Global Header */}
        <div className="bg-transparent px-3 py-3 d-flex align-items-center gap-3 position-absolute w-100" style={{ zIndex: 10, top: 0, left: 0, right: 0 }}>
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

        {/* Main Content Area */}
        <div className="flex-grow-1 overflow-auto custom-scrollbar pt-5 mt-4">
          <div className="mx-auto w-100 px-3 py-4" style={{ maxWidth: '800px' }}>
            
            {/* Title & Actions */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h2 className="mb-0 fw-semibold text-body dark:text-white" style={{ fontFamily: 'serif' }}>Chats</h2>
              
              <div className="d-flex align-items-center gap-2">
                {isSelectionMode ? (
                  <>
                    <span className="text-muted small me-2">{selectedIds.size} selected</span>
                    <Button 
                      size="sm" 
                      pill
                      color="dark"
                      className="bg-light dark:bg-secondary dark:bg-opacity-25 border-0 text-body dark:text-white hover-bg-secondary hover-bg-opacity-25"
                      onClick={handleSelectAll}
                      text={selectedIds.size === filteredSessions.length && filteredSessions.length > 0 ? "Deselect all" : "Select all"}
                    />
                    <Button 
                      size="sm" 
                      pill
                      color="dark"
                      className="bg-light dark:bg-secondary dark:bg-opacity-25 border-0 text-body dark:text-white hover-bg-secondary hover-bg-opacity-25"
                      onClick={handleDelete}
                      disabled={selectedIds.size === 0}
                      text="Delete"
                    />
                    <Button 
                      size="sm" 
                      pill
                      color="dark"
                      className="bg-transparent border-0 text-body dark:text-white hover-bg-light dark:hover-bg-secondary dark:hover-bg-opacity-25"
                      onClick={toggleSelectionMode}
                      text="Cancel"
                    />
                  </>
                ) : (
                  <>
                    <Button 
                      size="sm" 
                      pill
                      white
                      className="text-body dark:text-white hover-bg-light dark:hover-bg-secondary dark:hover-bg-opacity-25"
                      onClick={toggleSelectionMode}
                      text="Select chats"
                    />
                    <Button 
                      size="sm" 
                      pill
                      color="primary"
                      className="fw-medium border-0 shadow-sm"
                      to="/chat"
                      onClick={() => {
                        createNewSession()
                      }}
                      text="New chat"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="input-icon">
                <span className="input-icon-addon">
                  <Icon icon="search" size={16} className="text-muted" />
                </span>
                <input 
                  type="text" 
                  className="form-control bg-white dark:bg-secondary dark:bg-opacity-25 border border-light dark:border-0 text-body dark:text-white py-2 shadow-sm dark:shadow-none" 
                  placeholder="Search chats..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ borderRadius: '50px' }}
                />
              </div>
            </div>

            {/* List of Chats */}
            <div className="d-flex flex-column">
              {filteredSessions.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <p>No chats found</p>
                </div>
              ) : (
                filteredSessions.map((session, index) => {
                  const isSelected = selectedIds.has(session.id)
                  return (
                    <div 
                      key={session.id}
                      className={clsx(
                        "d-flex align-items-center gap-3 py-3 px-2 cursor-pointer transition-colors",
                        index !== filteredSessions.length - 1 && "border-bottom border-light dark:border-secondary dark:border-opacity-25",
                        "hover-bg-white dark:hover-bg-secondary dark:hover-bg-opacity-10 rounded-2",
                        isSelectionMode && isSelected && "bg-primary bg-opacity-10"
                      )}
                      style={{ cursor: 'pointer', minHeight: '48px' }}
                      onClick={() => handleRowClick(session.id)}
                    >
                      {isSelectionMode && (
                        <div 
                          className="d-flex align-items-center justify-content-center text-muted"
                          style={{ width: '24px', height: '24px' }}
                          onClick={(e) => {
                            toggleSelection(session.id, e)
                          }}
                        >
                          {isSelected ? (
                            <Icon icon="circle-check-filled" size={20} className="text-primary" />
                          ) : (
                            <Icon icon="circle" size={20} className="opacity-50" />
                          )}
                        </div>
                      )}
                      
                      <div className="flex-grow-1 d-flex align-items-center">
                        <span className="text-body dark:text-white me-3 text-truncate fw-medium" style={{ fontSize: '14px', maxWidth: '70%' }}>
                          {session.title || 'Untitled'}
                        </span>
                        <span className="text-muted small" style={{ fontSize: '12px' }}>
                          {formatRelativeTime(session.updatedAt)}
                        </span>
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
