import { clsx } from 'clsx'
import { useState, useEffect } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { Button } from '@/shared/components/ui/Button'
import { Link, useNavigate, useLocation } from '@tanstack/react-router'
import { useChatStore } from '../store/useChatStore'

interface ChatHistoryDrawerProps {
  isOpen: boolean
  onToggle: () => void
}

function formatShortTime(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString()
  
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (isYesterday) {
    return 'Yesterday'
  } else {
    const diffTime = Math.abs(new Date().getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays < 7) {
      return `${diffDays} days ago`
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}


export function ChatHistoryDrawer({ isOpen, onToggle }: ChatHistoryDrawerProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const { sessions, activeSessionId, loadSession, createNewSession } = useChatStore()

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isNavActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/')

  const navItemClass = (active: boolean) =>
    clsx(
      'w-100 d-flex align-items-center gap-2 p-2 rounded-3 border-0 text-start transition-colors',
      active
        ? 'bg-primary bg-opacity-10 text-primary fw-medium'
        : 'bg-transparent text-body hover-nav-item dark:hover-bg-dark'
    )

  const handleSessionClick = (id: string) => {
    loadSession(id)
    navigate({ to: '/ai/chat/$sessionId', params: { sessionId: id } })
    if (isMobile) {
      onToggle()
    }
  }

  const handleNewSession = () => {
    createNewSession()
    navigate({ to: '/ai/chat/' })
    if (isMobile) {
      onToggle()
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
          onClick={onToggle}
          style={{ zIndex: 1040 }}
        />
      )}

      <div
        className="bg-white dark:bg-dark-card border-end border-light dark:border-dark h-100 flex-shrink-0 d-flex flex-column"
        style={{
          position: isMobile ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          zIndex: isMobile ? 1045 : 1,
          width: isMobile ? '280px' : isOpen ? '280px' : '64px',
          transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
          transition: 'transform 0.3s ease, width 0.3s ease',
        }}
      >
        {!isOpen ? (
          <div className="d-flex flex-column align-items-center py-3 h-100 gap-1 w-100 bg-white dark:bg-dark-card d-none d-md-flex">
            <button
              className="border-0 bg-transparent text-body p-2 d-flex align-items-center justify-content-center rounded-3 opacity-75 hover-opacity-100 transition-opacity mb-2"
              onClick={onToggle}
              title="Open Sidebar"
            >
              <Icon icon="layout-sidebar" size={20} />
            </button>
            <button
              className="border-0 bg-transparent text-muted p-2 d-flex align-items-center justify-content-center rounded-3 hover-text-primary transition-colors"
              onClick={handleNewSession}
              title="New chat"
            >
              <Icon icon="pencil" size={20} />
            </button>
            <Link
              to="/ai/search"
              className="border-0 bg-transparent text-muted p-2 d-flex align-items-center justify-content-center rounded-3 hover-text-primary transition-colors text-decoration-none"
              title="Search"
            >
              <Icon icon="search" size={20} />
            </Link>
            <Link
              to="/ai/templates"
              className="border-0 bg-transparent text-muted p-2 d-flex align-items-center justify-content-center rounded-3 hover-text-primary transition-colors text-decoration-none"
              title="Templates"
            >
              <Icon icon="wand" size={20} />
            </Link>
            <button
              className="border-0 bg-transparent text-muted p-2 d-flex align-items-center justify-content-center rounded-3 hover-text-primary transition-colors"
              title="Documents"
              onClick={() => window.alert('Fitur Dokumen akan segera hadir!')}
            >
              <Icon icon="file-invoice" size={20} />
            </button>
          </div>
        ) : (
          <div
            className="d-flex flex-column h-100 bg-white dark:bg-dark-card"
            style={{ width: '280px', minWidth: '280px' }}
          >
            <div className="p-3 border-bottom border-light dark:border-dark d-flex align-items-center justify-content-between">
              <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2 m-0">
                <Icon icon="sparkles" size={20} className="text-primary" />
                Mora AI
              </h5>
              <div className="d-flex align-items-center gap-1">
                <button
                  className="border-0 bg-transparent text-body p-2 d-flex align-items-center justify-content-center rounded-3 opacity-75 hover-opacity-100 transition-opacity d-none d-md-flex"
                  onClick={onToggle}
                  title="Close Menu"
                >
                  <Icon icon="layout-sidebar" size={20} />
                </button>
                <button
                  className="border-0 bg-transparent text-muted p-2 d-flex align-items-center justify-content-center rounded-3 hover-text-primary transition-colors d-md-none"
                  onClick={onToggle}
                >
                  <Icon icon="layout-sidebar" size={20} />
                </button>
              </div>
            </div>

            <div className="px-3 pb-0 pt-3 d-flex flex-column gap-2">
              <button
                className="btn btn-primary d-flex align-items-center justify-content-center gap-2 rounded-3 py-2 border-0 w-100"
                style={{ backgroundColor: '#ff7a00', color: '#fff', fontWeight: 500 }}
                onClick={handleNewSession}
              >
                <Icon icon="plus" size={16} />
                <span>New chat</span>
              </button>
              
              <div className="d-flex flex-column gap-1 mt-2">
                <Link
                  to="/ai/search"
                  className={navItemClass(isNavActive('/ai/search')) + ' text-decoration-none'}
                >
                  <Icon icon="search" size={16} className="flex-shrink-0" />
                  <span className="flex-grow-1" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                    Search
                  </span>
                </Link>
                <Link
                  to="/ai/templates"
                  className={navItemClass(isNavActive('/ai/templates')) + ' text-decoration-none'}
                >
                  <Icon icon="wand" size={16} className="flex-shrink-0" />
                  <span className="flex-grow-1" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                    Templates
                  </span>
                </Link>
              </div>
            </div>

            <div
              className="flex-grow-1 overflow-auto px-2 pb-3 mt-3"
              style={{ scrollbarWidth: 'thin' }}
            >
              <div
                className="text-muted small fw-semibold px-2 mb-2"
                style={{ fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase' }}
              >
                Recent
              </div>
              <div className="d-flex flex-column gap-1">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    className={clsx(
                      'd-flex align-items-center gap-2 w-100 p-2 rounded-3 border-0 text-start transition-colors',
                      session.id === activeSessionId
                        ? 'bg-primary bg-opacity-10 text-primary fw-medium'
                        : 'bg-transparent text-body hover-nav-item dark:hover-bg-dark'
                    )}
                    onClick={() => handleSessionClick(session.id)}
                  >
                    <Icon icon="messages" size={16} className="text-muted flex-shrink-0" />
                    <div className="text-truncate flex-grow-1" style={{ minWidth: 0 }}>
                      <div
                        className="text-truncate d-block"
                        style={{ fontSize: '14px', lineHeight: '1.4' }}
                      >
                        {session.title}
                      </div>
                    </div>
                    <span className="text-muted flex-shrink-0" style={{ fontSize: '11px' }}>
                      {formatShortTime(session.updatedAt)}
                    </span>
                  </button>
                ))}
              </div>

              {sessions.length === 0 && (
                <div className="text-center text-muted mt-5">
                  <Icon icon="messages" size={32} className="mb-2 opacity-50" />
                  <p className="small">No chat history yet</p>
                </div>
              )}
            </div>



            <div
              className="p-3 border-top border-light dark:border-dark mt-auto bg-white dark:bg-dark-card d-flex align-items-center justify-content-between"
              style={{ zIndex: 10 }}
            >
              <Button
                to="/dashboard"
                ghost
                size="md"
                style={{ height: '42px' }}
                icon="home"
                text="Home"
                className="fw-medium text-body px-2"
              />
              <div className="rounded-circle overflow-hidden border border-light" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' }}>
                <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white fw-bold" style={{ fontSize: '14px' }}>
                  AH
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
