import { clsx } from 'clsx'
import { useState, useEffect } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
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
    return 'Kemarin'
  } else {
    const diffTime = Math.abs(new Date().getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays < 7) {
      return `${diffDays} hari lalu`
    }
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
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
      'w-100 d-flex align-items-center gap-2 px-2 py-2 rounded-3 border-0 text-start text-decoration-none transition-colors',
      active
        ? 'bg-primary bg-opacity-10 fw-medium'
        : 'bg-transparent text-body hover-nav-item'
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
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: 'rgba(0,0,0,0.4)', zIndex: 1040, backdropFilter: 'blur(2px)' }}
          onClick={onToggle}
        />
      )}

      <div
        className="border-end d-flex flex-column"
        style={{
          position: isMobile ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          zIndex: isMobile ? 1045 : 1,
          width: isMobile ? '272px' : isOpen ? '260px' : '52px',
          minWidth: isMobile ? '272px' : isOpen ? '260px' : '52px',
          height: '100%',
          transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
          transition: 'transform 0.28s cubic-bezier(.4,0,.2,1), width 0.28s cubic-bezier(.4,0,.2,1), min-width 0.28s cubic-bezier(.4,0,.2,1)',
          background: 'var(--tblr-bg-surface)',
          borderColor: 'var(--tblr-border-color)',
          overflow: 'hidden',
        }}
      >
        {/* Collapsed icon strip (desktop only) */}
        {!isOpen && !isMobile && (
          <div className="d-flex flex-column align-items-center py-3 gap-2 h-100">
            <button
              className="btn btn-ghost btn-sm btn-icon rounded-3 text-body mb-1"
              onClick={onToggle}
              title="Buka sidebar"
              style={{ width: 36, height: 36 }}
            >
              <Icon icon="layout-sidebar" size={20} />
            </button>
            <button
              className="btn btn-ghost btn-sm btn-icon rounded-3 text-body"
              onClick={handleNewSession}
              title="Chat baru"
              style={{ width: 36, height: 36 }}
            >
              <Icon icon="edit" size={18} />
            </button>
            <Link
              to="/ai/search"
              className="btn btn-ghost btn-sm btn-icon rounded-3 text-body"
              title="Cari"
              style={{ width: 36, height: 36 }}
            >
              <Icon icon="search" size={18} />
            </Link>
            <Link
              to="/ai/templates"
              className="btn btn-ghost btn-sm btn-icon rounded-3 text-body"
              title="Template"
              style={{ width: 36, height: 36 }}
            >
              <Icon icon="wand" size={18} />
            </Link>
            <div className="flex-grow-1" />
            <Link
              to="/dashboard"
              className="btn btn-ghost btn-sm btn-icon rounded-3 text-body"
              title="Kembali ke Dashboard"
              style={{ width: 36, height: 36 }}
            >
              <Icon icon="home" size={18} />
            </Link>
          </div>
        )}

        {/* Expanded sidebar */}
        {(isOpen || isMobile) && (
          <div className="d-flex flex-column h-100" style={{ minWidth: 0 }}>
            {/* Header */}
            <div
              className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom"
              style={{ borderColor: 'var(--tblr-border-color)', flexShrink: 0 }}
            >
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #ff7a00, #ffb347)' }}
                >
                  <img src="/static/logo-small-white.svg" alt="Mora AI" style={{ width: 16, height: 16 }} />
                </div>
                <span className="fw-semibold" style={{ fontSize: 15 }}>Mora AI</span>
              </div>
              <button
                className="btn btn-ghost btn-sm btn-icon rounded-3 text-muted"
                onClick={onToggle}
                title={isMobile ? 'Tutup sidebar' : 'Perkecil sidebar'}
              >
                {isMobile ? <Icon icon="x" size={18} /> : <Icon icon="layout-sidebar" size={18} />}
              </button>
            </div>

            {/* Action buttons */}
            <div className="px-2 pt-3 pb-2" style={{ flexShrink: 0 }}>
              <button
                className="btn w-100 d-flex align-items-center gap-2 py-2 rounded-3 mb-2"
                style={{ background: '#ff7a00', color: '#fff', border: 'none', fontWeight: 500, fontSize: 14 }}
                onClick={handleNewSession}
              >
                <Icon icon="plus" size={16} />
                <span>Chat baru</span>
              </button>

              <div className="d-flex flex-column gap-1">
                <Link
                  to="/ai/search"
                  className={navItemClass(isNavActive('/ai/search'))}
                  style={{ fontSize: 14 }}
                >
                  <Icon icon="search" size={15} className="flex-shrink-0 text-muted" />
                  <span className="flex-grow-1">Cari percakapan</span>
                </Link>
                <Link
                  to="/ai/templates"
                  className={navItemClass(isNavActive('/ai/templates'))}
                  style={{ fontSize: 14 }}
                >
                  <Icon icon="wand" size={15} className="flex-shrink-0 text-muted" />
                  <span className="flex-grow-1">Template</span>
                </Link>
              </div>
            </div>

            {/* Session list */}
            <div
              className="flex-grow-1 overflow-auto px-2 pb-3 chat-scrollbar-thin"
              style={{ minHeight: 0 }}
            >
              {sessions.length > 0 && (
                <div
                  className="text-muted px-2 mb-2 mt-1"
                  style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}
                >
                  Riwayat
                </div>
              )}
              <div className="d-flex flex-column gap-1">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    className={clsx(
                      'd-flex align-items-center gap-2 w-100 px-2 py-2 rounded-3 border-0 text-start transition-colors',
                      session.id === activeSessionId
                        ? 'bg-primary bg-opacity-10 fw-medium'
                        : 'bg-transparent text-body hover-nav-item'
                    )}
                    onClick={() => handleSessionClick(session.id)}
                  >
                    <Icon icon="messages" size={14} className="text-muted flex-shrink-0" />
                    <div className="text-truncate flex-grow-1" style={{ minWidth: 0, fontSize: 13 }}>
                      {session.title}
                    </div>
                    <span className="text-muted flex-shrink-0" style={{ fontSize: 10 }}>
                      {formatShortTime(session.updatedAt)}
                    </span>
                  </button>
                ))}
              </div>

              {sessions.length === 0 && (
                <div className="text-center text-muted mt-5 px-3">
                  <Icon icon="messages" size={28} className="mb-2 opacity-40" />
                  <p className="small mb-0" style={{ fontSize: 13 }}>Belum ada riwayat chat</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="px-3 py-3 border-top d-flex align-items-center gap-2"
              style={{ borderColor: 'var(--tblr-border-color)', flexShrink: 0 }}
            >
              <Link
                to="/dashboard"
                className="btn btn-ghost btn-sm d-flex align-items-center gap-2 text-muted rounded-3 px-2 flex-grow-1"
                style={{ fontSize: 13 }}
              >
                <Icon icon="home" size={15} />
                <span>Kembali ke Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
