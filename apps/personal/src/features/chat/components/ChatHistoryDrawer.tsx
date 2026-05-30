import { clsx } from 'clsx'
import { Icon } from '@/shared/components/ui/Icon'
import { Button } from '@/shared/components/ui/Button'
import { useChatStore } from '../store/useChatStore'

interface ChatHistoryDrawerProps {
  isOpen: boolean
  onToggle: () => void
}

export function ChatHistoryDrawer({ isOpen, onToggle }: ChatHistoryDrawerProps) {
  const { sessions, activeSessionId, loadSession, createNewSession } = useChatStore()

  const handleSessionClick = (id: string) => {
    loadSession(id)
    if (window.innerWidth < 768) {
      onToggle()
    }
  }

  const handleNewSession = () => {
    createNewSession()
    if (window.innerWidth < 768) {
      onToggle()
    }
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none" 
          onClick={onToggle}
          style={{ zIndex: 1040 }}
        />
      )}

      {/* Drawer Container */}
      <div 
        className={clsx(
          'bg-white dark:bg-dark-card border-end border-light dark:border-dark h-100 flex-shrink-0 chat-sidebar-drawer d-flex flex-column',
          isOpen ? 'drawer-open' : 'drawer-closed'
        )}
      >
        {!isOpen ? (
          <div className="d-flex flex-column align-items-center py-3 h-100 gap-1 w-100 bg-white dark:bg-dark-card d-none d-md-flex">
            <button 
              className="border-0 bg-transparent text-body p-2 d-flex align-items-center justify-content-center rounded-3 opacity-75 hover-opacity-100 transition-opacity" 
              onClick={onToggle}
              title="Open Sidebar"
            >
              <Icon icon="layout-sidebar" size={20} />
            </button>
            <button 
              className="border-0 bg-transparent text-muted p-2 d-flex align-items-center justify-content-center rounded-3 hover-text-body transition-colors"
              onClick={handleNewSession}
              title="New Chat"
            >
              <Icon icon="edit" size={20} />
            </button>
            <button className="border-0 bg-transparent text-muted p-2 d-flex align-items-center justify-content-center rounded-3 hover-text-body transition-colors" title="Search">
              <Icon icon="search" size={20} />
            </button>
            <button className="border-0 bg-transparent text-muted p-2 d-flex align-items-center justify-content-center rounded-3 hover-text-body transition-colors" title="Chats">
              <Icon icon="message-circle" size={20} />
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column h-100 bg-white dark:bg-dark-card" style={{ width: '280px', minWidth: '280px' }}>
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
                  className="border-0 bg-transparent text-muted p-2 d-flex align-items-center justify-content-center rounded-3 hover-text-body transition-colors d-md-none" 
                  onClick={onToggle}
                >
                  <Icon icon="x" size={20} />
                </button>
              </div>
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

            <div className="p-3 border-top border-light dark:border-dark mt-auto bg-white dark:bg-dark-card" style={{ zIndex: 10 }}>
              <Button 
                to="/dashboard"
                block
                iconOnly
                size="md"
                style={{ height: '42px' }}
                icon="home"
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        .chat-sidebar-drawer {
          position: fixed !important;
          top: 0;
          left: 0;
          height: 100%;
          width: 280px;
          z-index: 1045 !important;
          transition: transform 0.3s ease !important;
        }
        .chat-sidebar-drawer.drawer-open {
          transform: translateX(0) !important;
        }
        .chat-sidebar-drawer.drawer-closed {
          transform: translateX(-100%) !important;
        }

        @media (min-width: 768px) {
          .chat-sidebar-drawer {
            position: relative !important;
            z-index: 1 !important;
            transform: translateX(0) !important;
            transition: width 0.3s ease !important;
          }
          .chat-sidebar-drawer.drawer-open {
            width: 280px !important;
          }
          .chat-sidebar-drawer.drawer-closed {
            width: 64px !important;
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  )
}
