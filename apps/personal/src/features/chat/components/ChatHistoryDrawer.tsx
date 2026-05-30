import { clsx } from 'clsx'
import { Icon } from '@/shared/components/ui/Icon'
import { Button } from '@/shared/components/ui/Button'
import { Link, useNavigate } from '@tanstack/react-router'
import { useChatStore } from '../store/useChatStore'

interface ChatHistoryDrawerProps {
  isOpen: boolean
  onToggle: () => void
}

export function ChatHistoryDrawer({ isOpen, onToggle }: ChatHistoryDrawerProps) {
  const navigate = useNavigate()
  const { sessions, activeSessionId, loadSession, createNewSession } = useChatStore()

  const handleSessionClick = (id: string) => {
    loadSession(id)
    navigate({ to: '/chat' })
    if (window.innerWidth < 768) {
      onToggle()
    }
  }

  const handleNewSession = () => {
    createNewSession()
    navigate({ to: '/chat' })
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
            <Link to="/ai/search" className="border-0 bg-transparent text-muted p-2 d-flex align-items-center justify-content-center rounded-3 hover-text-primary transition-colors text-decoration-none" title="Search">
              <Icon icon="search" size={20} />
            </Link>
            <button className="border-0 bg-transparent text-muted p-2 d-flex align-items-center justify-content-center rounded-3 hover-text-primary transition-colors" title="Templates">
              <Icon icon="wand" size={20} />
            </button>
            <button className="border-0 bg-transparent text-muted p-2 d-flex align-items-center justify-content-center rounded-3 hover-text-primary transition-colors" title="Documents">
              <Icon icon="file-invoice" size={20} />
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
                  className="border-0 bg-transparent text-muted p-2 d-flex align-items-center justify-content-center rounded-3 hover-text-primary transition-colors d-md-none" 
                  onClick={onToggle}
                >
                  <Icon icon="x" size={20} />
                </button>
              </div>
            </div>

            <div className="p-3 pb-0 d-flex flex-column gap-1">
              <button 
                className="w-100 d-flex align-items-center gap-3 p-2 rounded-3 border-0 bg-transparent text-muted hover-text-primary hover-bg-light dark:hover-bg-dark transition-colors text-start"
                onClick={handleNewSession}
              >
                <Icon icon="pencil" size={20} className="opacity-75 flex-shrink-0" />
                <span className="fw-medium flex-grow-1">New chat</span>
              </button>

              <Link to="/ai/search" className="w-100 d-flex align-items-center gap-3 p-2 rounded-3 border-0 bg-transparent text-muted hover-text-primary hover-bg-light dark:hover-bg-dark transition-colors text-start text-decoration-none">
                <Icon icon="search" size={20} className="opacity-75 flex-shrink-0" />
                <span className="fw-medium flex-grow-1">Search</span>
              </Link>
              <button className="w-100 d-flex align-items-center gap-3 p-2 rounded-3 border-0 bg-transparent text-muted hover-text-primary hover-bg-light dark:hover-bg-dark transition-colors text-start">
                <Icon icon="wand" size={20} className="opacity-75 flex-shrink-0" />
                <span className="fw-medium flex-grow-1">Templates</span>
              </button>
              <button className="w-100 d-flex align-items-center gap-3 p-2 rounded-3 border-0 bg-transparent text-muted hover-text-primary hover-bg-light dark:hover-bg-dark transition-colors text-start">
                <Icon icon="file-invoice" size={20} className="opacity-75 flex-shrink-0" />
                <span className="fw-medium flex-grow-1">Documents</span>
              </button>
            </div>

            <div className="flex-grow-1 overflow-auto px-2 pb-3 mt-3" style={{ scrollbarWidth: 'thin' }}>
              <div className="text-muted small fw-semibold px-2 mb-2" style={{ fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Recent</div>
              <div className="d-flex flex-column gap-1">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    className={clsx(
                      'd-flex align-items-center gap-2 w-100 p-2 rounded-3 border-0 text-start transition-colors',
                      session.id === activeSessionId 
                        ? 'bg-primary bg-opacity-10 text-primary fw-medium' 
                        : 'bg-transparent text-body hover-bg-light dark:hover-bg-dark hover-text-primary'
                    )}
                    onClick={() => handleSessionClick(session.id)}
                  >

                    <div className="text-truncate flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="text-truncate d-block" style={{ fontSize: '14px', lineHeight: '1.4' }}>{session.title}</div>
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
                pill
                white
                size="md"
                style={{ height: '42px' }}
                icon="home"
                text="Home"
                className="fw-medium text-body"
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
