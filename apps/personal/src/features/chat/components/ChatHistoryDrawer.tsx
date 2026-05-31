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

export function ChatHistoryDrawer({ isOpen, onToggle }: ChatHistoryDrawerProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const { sessions, activeSessionId, loadSession, createNewSession } = useChatStore()
  
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isNavActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/')

  const navItemClass = (active: boolean) => clsx(
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
        className="bg-white dark:bg-dark-card border-end border-light dark:border-dark h-100 flex-shrink-0 d-flex flex-column"
        style={{
          position: isMobile ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          zIndex: isMobile ? 1045 : 1,
          width: isMobile ? '280px' : (isOpen ? '280px' : '64px'),
          transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
          transition: 'transform 0.3s ease, width 0.3s ease'
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
                  <Icon icon="layout-sidebar" size={20} />
                </button>
              </div>
            </div>

            <div className="px-2 pb-0 pt-2 d-flex flex-column gap-1">
              <button 
                className={navItemClass(currentPath === '/ai/chat/' || currentPath === '/ai/chat')}
                onClick={handleNewSession}
              >
                <Icon icon="pencil" size={16} className="flex-shrink-0" />
                <span className="flex-grow-1" style={{ fontSize: '14px', lineHeight: '1.4' }}>New chat</span>
              </button>

              <Link to="/ai/search" className={navItemClass(isNavActive('/ai/search')) + ' text-decoration-none'}>
                <Icon icon="search" size={16} className="flex-shrink-0" />
                <span className="flex-grow-1" style={{ fontSize: '14px', lineHeight: '1.4' }}>Search</span>
              </Link>
              <button className={navItemClass(false)}>
                <Icon icon="wand" size={16} className="flex-shrink-0" />
                <span className="flex-grow-1" style={{ fontSize: '14px', lineHeight: '1.4' }}>Templates</span>
              </button>
              <button className={navItemClass(false)}>
                <Icon icon="file-invoice" size={16} className="flex-shrink-0" />
                <span className="flex-grow-1" style={{ fontSize: '14px', lineHeight: '1.4' }}>Documents</span>
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
                        : 'bg-transparent text-body hover-nav-item dark:hover-bg-dark'
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

    </>
  )
}
