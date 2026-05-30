import { useState, useEffect, useRef } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { Button } from '@/shared/components/ui/Button'
import { useChatStore } from '../store/useChatStore'
import { ChatHistoryDrawer } from '../components/ChatHistoryDrawer'
import { ChatMessageBubble } from '../components/ChatMessageBubble'
import { ChatInput } from '../components/ChatInput'

export default function ChatPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(window.innerWidth >= 768)
  const { messages, activeSessionId, isTyping, sendMessage } = useChatStore()
  
  const currentMessages = activeSessionId ? messages[activeSessionId] || [] : []
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150
    setShowScrollButton(!isNearBottom)
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages, isTyping])

  return (
    <div className="d-flex w-100 bg-light dark:bg-dark" style={{ height: '100dvh', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <ChatHistoryDrawer 
        isOpen={isDrawerOpen} 
        onToggle={() => setIsDrawerOpen(!isDrawerOpen)} 
      />

      <div className="flex-grow-1 d-flex flex-column h-100 position-relative" style={{ minWidth: 0 }}>
        {/* Header */}
        <div className="bg-transparent px-3 py-3 d-flex align-items-center gap-3 position-absolute w-100" style={{ zIndex: 10, top: 0, left: 0, right: 0 }}>
          {/* On mobile, show floating toggle when closed */}
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

        {/* Main Area */}
        <div className="flex-grow-1 d-flex flex-column pt-5 mt-4 overflow-hidden">
          {currentMessages.length === 0 ? (
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center px-3" style={{ paddingBottom: '10vh' }}>
              <h2 className="fw-medium text-body mb-4 d-flex align-items-center gap-2" style={{ fontFamily: 'serif' }}>
                <Icon icon="sparkles" size={32} className="text-warning" />
                How can I help you today?
              </h2>
              <div className="w-100" style={{ maxWidth: '768px' }}>
                <div className="bg-white dark:bg-dark-card shadow-sm overflow-hidden border border-light dark:border-dark" style={{ borderRadius: '24px' }}>
                  <ChatInput onSendMessage={sendMessage} isTyping={isTyping} />
                </div>
              </div>
              <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mt-4">
                <button className="btn btn-sm btn-light rounded-pill px-3 py-2 d-flex align-items-center gap-2 border bg-white dark:bg-dark-card text-muted hover-bg-light transition-colors">
                  <Icon icon="pencil" size={16} /> Write code
                </button>
                <button className="btn btn-sm btn-light rounded-pill px-3 py-2 d-flex align-items-center gap-2 border bg-white dark:bg-dark-card text-muted hover-bg-light transition-colors">
                  <Icon icon="chart-bar" size={16} /> Analyze finances
                </button>
                <button className="btn btn-sm btn-light rounded-pill px-3 py-2 d-flex align-items-center gap-2 border bg-white dark:bg-dark-card text-muted hover-bg-light transition-colors">
                  <Icon icon="bulb" size={16} /> Advice
                </button>
              </div>
            </div>
          ) : (
            <>
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-grow-1 overflow-auto p-3 p-md-4 custom-scrollbar" 
                style={{ scrollbarWidth: 'thin' }}
              >
                <div className="mx-auto w-100 d-flex flex-column" style={{ maxWidth: '768px' }}>
                  {currentMessages.map(msg => (
                    <ChatMessageBubble key={msg.id} message={msg} />
                  ))}
                  
                  {isTyping && (
                    <div className="d-flex justify-content-start mb-4 align-items-start">
                      <div className="flex-shrink-0 me-3 mt-1" style={{ alignSelf: 'flex-start' }}>
                        <div className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center text-primary" style={{ width: '32px', height: '32px' }}>
                          <Icon icon="robot" size={20} />
                        </div>
                      </div>
                      <div className="pt-2 d-flex align-items-center">
                        <div className="typing-indicator d-flex gap-1 align-items-center h-100">
                          <span className="bg-secondary rounded-circle" style={{ width: '6px', height: '6px', animation: 'blink 1.4s infinite both', animationDelay: '0s' }}></span>
                          <span className="bg-secondary rounded-circle" style={{ width: '6px', height: '6px', animation: 'blink 1.4s infinite both', animationDelay: '0.2s' }}></span>
                          <span className="bg-secondary rounded-circle" style={{ width: '6px', height: '6px', animation: 'blink 1.4s infinite both', animationDelay: '0.4s' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <div className="mt-auto px-3 pb-2 pt-2 bg-transparent position-relative">
                {showScrollButton && (
                  <div className="position-absolute w-100 d-flex justify-content-center" style={{ top: '-46px', left: 0, zIndex: 100 }}>
                    <Button 
                      onClick={scrollToBottom}
                      iconOnly
                      icon="arrow-down"
                      size="md"
                      className="rounded-circle bg-white dark:bg-dark border border-light dark:border-secondary shadow-sm text-muted hover-text-primary transition-colors d-flex align-items-center justify-content-center m-0 p-0"
                      style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
                    />
                  </div>
                )}
                <div className="mx-auto w-100 bg-white dark:bg-dark-card shadow overflow-hidden border border-light dark:border-dark" style={{ maxWidth: '768px', borderRadius: '24px' }}>
                  <ChatInput onSendMessage={sendMessage} isTyping={isTyping} />
                </div>
                <div className="text-center mt-2 mb-1">
                  <small className="text-muted" style={{ fontSize: '12px' }}>Mora AI can make mistakes. Please double-check responses.</small>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0% { opacity: 0.3; transform: scale(0.8); }
          20% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.3; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}
