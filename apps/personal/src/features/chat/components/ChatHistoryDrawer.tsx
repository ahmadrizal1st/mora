import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { Icon } from '@/shared/components/ui/Icon'
import { useChatStore } from '../store/useChatStore'

interface ChatHistoryDrawerProps {
  isOpen: boolean
  onToggle: () => void
}

export function ChatHistoryDrawer({ isOpen, onToggle }: ChatHistoryDrawerProps) {
  const { sessions, activeSessionId, loadSession, createNewSession } = useChatStore()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSessionClick = (id: string) => {
    loadSession(id)
    if (isMobile) {
      onToggle()
    }
  }

  const handleNewSession = () => {
    createNewSession()
    if (isMobile) {
      onToggle()
    }
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" 
          onClick={onToggle}
          style={{ zIndex: 1040 }}
        />
      )}

      {/* Drawer Container */}
      <div 
        className={clsx(
          'bg-white dark:bg-dark-card border-end border-light dark:border-dark h-100 flex-shrink-0 transition-all overflow-hidden d-flex flex-column',
          isMobile ? 'position-fixed top-0 start-0' : 'position-relative'
        )}
        style={{ 
          width: isMobile ? '280px' : (isOpen ? '280px' : '64px'), 
          zIndex: isMobile ? 1045 : 1,
          transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'width 0.3s ease, transform 0.3s ease'
        }}
      >
        {!isOpen && !isMobile ? (
          <div className="d-flex flex-column align-items-center py-4 h-100 gap-3 w-100 bg-white dark:bg-dark-card">
            <button 
              className="btn btn-icon border-0 bg-transparent text-body mb-2" 
              onClick={onToggle}
              title="Open Sidebar"
            >
              <Icon icon="robot" size={24} />
            </button>
            <button 
              className="btn btn-icon border-0 bg-transparent text-muted hover-bg-light"
              onClick={handleNewSession}
              title="New Chat"
            >
              <Icon icon="edit" size={22} />
            </button>
            <button className="btn btn-icon border-0 bg-transparent text-muted hover-bg-light" title="Search">
              <Icon icon="search" size={22} />
            </button>
            <button className="btn btn-icon border-0 bg-transparent text-muted hover-bg-light" title="Chats">
              <Icon icon="message-circle" size={22} />
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column h-100 bg-white dark:bg-dark-card" style={{ width: '280px', minWidth: '280px' }}>
          <div className="p-3 border-bottom border-light dark:border-dark d-flex align-items-center justify-content-between">
            <h5 className="mb-0 fw-semibold d-flex align-items-center gap-2">
              <Icon icon="history" size={20} className="text-primary" />
              Chat History
            </h5>
            <button 
              className="btn btn-sm btn-light border-0 p-1 bg-transparent text-muted" 
              onClick={onToggle}
            >
              <Icon icon={isMobile ? "x" : "layout-sidebar"} size={20} />
            </button>
          </div>

          <div className="p-3">
            <button 
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 shadow-sm mb-3"
              onClick={handleNewSession}
            >
              <Icon icon="plus" size={18} />
              New Chat
            </button>
            <div className="input-icon">
              <span className="input-icon-addon">
                <Icon icon="search" size={16} />
              </span>
              <input type="text" className="form-control form-control-sm rounded-3 bg-light dark:bg-dark border-0" placeholder="Search chats..." />
            </div>
          </div>

          <div className="flex-grow-1 overflow-auto px-2 pb-3" style={{ scrollbarWidth: 'thin' }}>
            <div className="d-flex flex-column gap-1">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  className={clsx(
                    'd-flex align-items-center gap-2 w-100 p-2 rounded-3 border-0 text-start transition-colors',
                    session.id === activeSessionId 
                      ? 'bg-primary bg-opacity-10 text-primary fw-medium' 
                      : 'bg-transparent text-body hover-bg-light'
                  )}
                  onClick={() => handleSessionClick(session.id)}
                >
                  <Icon 
                    icon="message-circle" 
                    size={18} 
                    className={session.id === activeSessionId ? 'text-primary' : 'text-muted flex-shrink-0'} 
                  />
                  <div className="text-truncate flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="text-truncate d-block" style={{ fontSize: '14px', lineHeight: '1.2' }}>{session.title}</div>
                    <div className="text-muted text-truncate d-block mt-1" style={{ fontSize: '11px', lineHeight: '1' }}>
                      {new Date(session.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
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
          </div>
        )}
      </div>
    </>
  )
}
