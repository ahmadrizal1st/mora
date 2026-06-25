import { useState, useEffect, useRef } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { Button } from '@/shared/components/ui/Button'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useChatStore } from '../store/useChatStore'
import { ChatHistoryDrawer } from '../components/ChatHistoryDrawer'
import { ChatMessageBubble } from '../components/ChatMessageBubble'
import { ChatInput } from '../components/ChatInput'
import { useAccountSummary } from '@/features/transaction/hooks/useAccounts'
import { useTransactionSummary } from '@/features/transaction/hooks/useTransactions'
import { useGoals } from '@/features/planning/hooks/usePlanning'

export default function ChatPage() {
  const navigate = useNavigate()

  const params = useParams({ strict: false }) as { sessionId?: string }
  const urlSessionId = params?.sessionId

  const [isDrawerOpen, setIsDrawerOpen] = useState(window.innerWidth >= 768)
  const { messages, activeSessionId, isTyping, sendMessage, loadSession, createNewSession, fetchSessions, getActiveThread } =
    useChatStore()

  const { data: accountData } = useAccountSummary()
  const { data: txSummary } = useTransactionSummary()
  const { data: goals } = useGoals()

  const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`

  useEffect(() => {
    let mounted = true;
    fetchSessions().finally(() => {
      if (!mounted) return;
      if (urlSessionId) {
        loadSession(urlSessionId)
      } else {
        createNewSession()
      }
    })
    return () => { mounted = false }
  }, [urlSessionId, fetchSessions, loadSession, createNewSession])

  const handleSendMessage = (content: string) => {
    const isNew = !activeSessionId || !messages[activeSessionId]?.length
    sendMessage(content)

    if (isNew && activeSessionId) {
      navigate({ to: '/ai/chat/$sessionId', params: { sessionId: activeSessionId } })
    }
  }

  const currentMessages = activeSessionId ? getActiveThread(activeSessionId) : []
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

  const lastMessageId = currentMessages.length > 0 ? currentMessages[currentMessages.length - 1].id : null;

  useEffect(() => {
    scrollToBottom()
  }, [lastMessageId, isTyping])

  return (
    <div className="d-flex w-100 bg-light dark:bg-dark chat-page-container">
      <ChatHistoryDrawer isOpen={isDrawerOpen} onToggle={() => setIsDrawerOpen(!isDrawerOpen)} />

      <div className="flex-grow-1 d-flex flex-column h-100 position-relative min-w-0">
        <div className="bg-transparent px-4 py-3 d-flex align-items-center gap-3 position-absolute w-100 chat-header-bar" style={{ zIndex: 10 }}>
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
          
          <div className="d-flex align-items-center gap-3">
            {/* Credit Counter */}
            <div className="d-flex align-items-center gap-2 bg-white dark:bg-dark-card border border-light dark:border-dark rounded-pill px-3 py-1 shadow-sm d-none d-sm-flex">
              <Icon icon="bulb" size={14} className="text-warning" />
              <span style={{ fontSize: '13px' }}><span className="text-warning fw-semibold">1,000</span> <span className="text-muted">/ 10K Credit</span></span>
            </div>
            
            {/* Notification Bell */}
            <button className="btn btn-light bg-white dark:bg-dark-card border border-light dark:border-dark rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px' }}>
              <Icon icon="bell" size={16} className="text-muted" />
            </button>
            
            {/* Avatar */}
            <div className="rounded-circle overflow-hidden border border-light shadow-sm" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' }}>
              <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white fw-bold" style={{ fontSize: '14px' }}>
                AH
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow-1 d-flex flex-column pt-5 mt-4 overflow-hidden">
          {currentMessages.length === 0 ? (
            <div className="flex-grow-1 d-flex flex-column align-items-center px-3 pt-4 pb-5 custom-scrollbar overflow-y-auto">
              <div className="w-100 mx-auto" style={{ maxWidth: '1000px' }}>
                <div className="mb-4">
                  <h2 className="fw-bold text-dark dark:text-light mb-2 d-flex align-items-center gap-2" style={{ fontSize: '28px' }}>
                    Hello, Achmad Hakim! <span style={{ fontSize: '24px' }}>👋</span>
                  </h2>
                  <p className="text-muted" style={{ fontSize: '15px' }}>
                    AI assistant for your finances. Analyze, plan, and grow your wealth.
                  </p>
                </div>

                {/* 4 Small Finance Cards */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="bg-white dark:bg-dark-card border border-light dark:border-dark rounded-4 p-3 shadow-sm h-100 d-flex flex-column justify-content-between">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted fw-medium" style={{ fontSize: '12px' }}>Total Balance <Icon icon="eye" size={12} className="ms-1" /></span>
                      </div>
                      <h4 className="fw-bold mb-1">{formatCurrency(accountData?.total_balance || 0)}</h4>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted fw-medium" style={{ fontSize: '12px' }}>Aktual <span className="text-muted fw-normal">saat ini</span></span>
                        <div style={{ width: '60px', height: '24px' }} className="d-flex align-items-end justify-content-end">
                           <svg viewBox="0 0 100 30" className="w-100 h-100" preserveAspectRatio="none">
                             <path d="M0,25 Q10,15 20,20 T40,10 T60,15 T80,5 T100,0" fill="none" stroke="#ff7a00" strokeWidth="2" strokeLinecap="round" />
                           </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="bg-white dark:bg-dark-card border border-light dark:border-dark rounded-4 p-3 shadow-sm h-100 d-flex flex-column justify-content-between">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted fw-medium" style={{ fontSize: '12px' }}>Cash Flow (This Month)</span>
                      </div>
                      <h4 className="fw-bold mb-1">{formatCurrency(txSummary?.total_income || 0)}</h4>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted fw-medium" style={{ fontSize: '12px' }}>Pemasukan <span className="text-muted fw-normal">bulan ini</span></span>
                        <div className="d-flex align-items-end gap-1" style={{ height: '24px' }}>
                           <div className="bg-success rounded-top" style={{ width: '4px', height: '40%', opacity: 0.5 }}></div>
                           <div className="bg-success rounded-top" style={{ width: '4px', height: '60%', opacity: 0.7 }}></div>
                           <div className="bg-success rounded-top" style={{ width: '4px', height: '30%', opacity: 0.4 }}></div>
                           <div className="bg-success rounded-top" style={{ width: '4px', height: '80%', opacity: 0.9 }}></div>
                           <div className="bg-success rounded-top" style={{ width: '4px', height: '100%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="bg-white dark:bg-dark-card border border-light dark:border-dark rounded-4 p-3 shadow-sm h-100 d-flex flex-column justify-content-between">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted fw-medium" style={{ fontSize: '12px' }}>Total Expenses</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h4 className="fw-bold mb-1">{formatCurrency(txSummary?.total_expense || 0)}</h4>
                          <span className="text-muted fw-medium" style={{ fontSize: '12px' }}>Pengeluaran <span className="text-muted fw-normal">bulan ini</span></span>
                        </div>
                        <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                          <svg viewBox="0 0 36 36" className="w-100 h-100" style={{ transform: 'rotate(-90deg)' }}>
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="4" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ff7a00" strokeWidth="4" strokeDasharray="65, 100" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="bg-white dark:bg-dark-card border border-light dark:border-dark rounded-4 p-3 shadow-sm h-100 d-flex flex-column justify-content-between">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted fw-medium" style={{ fontSize: '12px' }}>Savings Goal</span>
                      </div>
                      <h4 className="fw-bold mb-1">{formatCurrency(goals?.totalSaved || 0)}</h4>
                      <div className="d-flex flex-column gap-1 w-100 mt-2">
                        <div className="d-flex justify-content-between align-items-center text-muted" style={{ fontSize: '10px' }}>
                          <span>Target {formatCurrency(goals?.totalTarget || 0)}</span>
                          <span className="fw-bold text-dark dark:text-white">{goals?.totalTarget ? Math.round(((goals?.totalSaved || 0) / goals.totalTarget) * 100) : 0}%</span>
                        </div>
                        <div className="progress" style={{ height: '4px' }}>
                          <div className="progress-bar" role="progressbar" style={{ width: `${goals?.totalTarget ? Math.round(((goals?.totalSaved || 0) / goals.totalTarget) * 100) : 0}%`, backgroundColor: '#ff7a00' }} aria-valuenow={70} aria-valuemin={0} aria-valuemax={100}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 Large Action Cards */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-4">
                    <div 
                      className="rounded-4 p-3 h-100 d-flex gap-3 align-items-center cursor-pointer transition-transform hover-transform-up" 
                      style={{ backgroundColor: '#fff3e6', border: '1px solid rgba(255, 122, 0, 0.1)' }}
                      onClick={() => handleSendMessage('Bantu saya analisis arus kas dan performa keuangan saya.')}
                    >
                      <div className="bg-white p-2 rounded-3 shadow-sm flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                        <Icon icon="chart-bar" size={24} style={{ color: '#ff7a00' }} />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '15px' }}>Analyze Finances</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '12px', lineHeight: '1.4' }}>Analisis arus kas, pengeluaran, dan performa keuangan.</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '28px', height: '28px' }}>
                          <Icon icon="arrow-right" size={14} className="text-dark" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 col-md-4">
                    <div 
                      className="rounded-4 p-3 h-100 d-flex gap-3 align-items-center cursor-pointer transition-transform hover-transform-up" 
                      style={{ backgroundColor: '#e6f7ef', border: '1px solid rgba(32, 201, 151, 0.1)' }}
                      onClick={() => handleSendMessage('Buatkan saya laporan keuangan dan insight penting.')}
                    >
                      <div className="bg-white p-2 rounded-3 shadow-sm flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                        <Icon icon="file-invoice" size={24} style={{ color: '#20c997' }} />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '15px' }}>Report & Insights</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '12px', lineHeight: '1.4' }}>Dapatkan laporan keuangan dan insight cerdas.</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '28px', height: '28px' }}>
                          <Icon icon="arrow-right" size={14} className="text-dark" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div 
                      className="rounded-4 p-3 h-100 d-flex gap-3 align-items-center cursor-pointer transition-transform hover-transform-up" 
                      style={{ backgroundColor: '#f0f0fe', border: '1px solid rgba(102, 16, 242, 0.1)' }}
                      onClick={() => handleSendMessage('Bantu saya membuat rencana anggaran dan tabungan.')}
                    >
                      <div className="bg-white p-2 rounded-3 shadow-sm flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                        <Icon icon="shield-check" size={24} style={{ color: '#6f42c1' }} />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '15px' }}>Plan & Budget</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '12px', lineHeight: '1.4' }}>Buat anggaran, rencana keuangan, dan capai tujuanmu.</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '28px', height: '28px' }}>
                          <Icon icon="arrow-right" size={14} className="text-dark" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input Box */}
                <div className="bg-white dark:bg-dark-card shadow-sm border border-light dark:border-dark rounded-4 p-4 mb-4">
                   <div className="mb-3 ps-1">
                     <span style={{ fontSize: '15px' }} className="text-dark fw-medium">Halo 👋 Ada yang bisa saya bantu terkait keuanganmu hari ini?</span>
                   </div>
                   
                   <div className="d-flex align-items-center gap-2 mb-3 ps-1">
                     <button className="btn btn-sm btn-light bg-transparent border border-light rounded-pill px-3 py-1 d-flex align-items-center gap-2 text-muted hover-bg-light transition-colors" style={{ fontSize: '13px' }}>
                       <Icon icon="adjustments" size={14} /> Mode
                     </button>
                     <button className="btn btn-sm btn-light bg-transparent border border-light rounded-pill px-3 py-1 d-flex align-items-center gap-2 text-muted hover-bg-light transition-colors" style={{ fontSize: '13px' }}>
                       <Icon icon="bolt" size={14} /> Analisis Cepat
                     </button>
                     <button className="btn btn-sm btn-light bg-transparent border border-light rounded-pill px-3 py-1 d-flex align-items-center gap-2 text-muted hover-bg-light transition-colors" style={{ fontSize: '13px' }}>
                       <Icon icon="bulb" size={14} /> Insight
                     </button>
                   </div>
                   
                   <div className="mt-2" style={{ margin: '-10px' }}>
                     <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
                   </div>
                </div>

                {/* Disclaimer */}
                <div className="text-center mb-4">
                  <small className="text-muted" style={{ fontSize: '12px' }}>
                    AI dapat membuat kesalahan. Pastikan untuk memverifikasi informasi penting.
                  </small>
                </div>

                {/* Quick Prompts */}
                <div className="d-flex align-items-center gap-2 overflow-x-auto pb-2 chat-scrollbar-thin">
                  <span className="text-muted fw-medium text-nowrap me-2" style={{ fontSize: '13px' }}>Mulai cepat dengan:</span>
                  <button 
                    className="btn btn-sm btn-light bg-white border border-light rounded-pill px-3 py-2 d-flex align-items-center gap-2 text-dark fw-medium text-nowrap hover-bg-light shadow-sm transition-colors" 
                    style={{ fontSize: '13px' }}
                    onClick={() => handleSendMessage('Analisis arus kas bulan ini')}
                  >
                    <Icon icon="chart-bar" size={16} className="text-primary" /> Analisis arus kas bulan ini
                  </button>
                  <button 
                    className="btn btn-sm btn-light bg-white border border-light rounded-pill px-3 py-2 d-flex align-items-center gap-2 text-dark fw-medium text-nowrap hover-bg-light shadow-sm transition-colors" 
                    style={{ fontSize: '13px' }}
                    onClick={() => handleSendMessage('Kategorikan pengeluaran saya')}
                  >
                    <Icon icon="wallet" size={16} className="text-warning" /> Kategorikan pengeluaran saya
                  </button>
                  <button 
                    className="btn btn-sm btn-light bg-white border border-light rounded-pill px-3 py-2 d-flex align-items-center gap-2 text-dark fw-medium text-nowrap hover-bg-light shadow-sm transition-colors" 
                    style={{ fontSize: '13px' }}
                    onClick={() => handleSendMessage('Rencana tabungan 12 bulan')}
                  >
                    <Icon icon="target" size={16} className="text-danger" /> Rencana tabungan 12 bulan
                  </button>
                  <button 
                    className="btn btn-sm btn-light bg-white border border-light rounded-pill px-3 py-2 d-flex align-items-center gap-2 text-dark fw-medium text-nowrap hover-bg-light shadow-sm transition-colors" 
                    style={{ fontSize: '13px' }}
                    onClick={() => handleSendMessage('Proyeksi investasi saya')}
                  >
                    <Icon icon="chart-line-up" size={16} className="text-success" /> Proyeksi investasi saya
                  </button>
                  <button className="btn btn-sm btn-light bg-white border border-light rounded-circle p-2 d-flex align-items-center justify-content-center text-dark hover-bg-light shadow-sm transition-colors ms-auto">
                    <Icon icon="arrow-right" size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-grow-1 overflow-auto p-3 p-md-4 custom-scrollbar chat-scrollbar-thin"
              >
                <div className="mx-auto w-100 d-flex flex-column max-w-768">
                  {currentMessages.map((msg) => (
                    <ChatMessageBubble key={msg.id} message={msg} />
                  ))}

                  {isTyping && (
                    <div className="d-flex justify-content-start mb-4 align-items-start">
                      <div className="flex-shrink-0 me-3 mt-1 align-self-start">
                        <div className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center text-primary w-32">
                          <Icon icon="robot" size={20} />
                        </div>
                      </div>
                      <div className="pt-2 d-flex align-items-center">
                        <div className="typing-indicator d-flex gap-1 align-items-center h-100">
                          <span className="bg-secondary rounded-circle typing-dot"></span>
                          <span className="bg-secondary rounded-circle typing-dot"></span>
                          <span className="bg-secondary rounded-circle typing-dot"></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="mt-auto px-3 pb-2 pt-2 bg-transparent position-relative">
                {showScrollButton && (
                  <div
                    className="position-absolute w-100 d-flex justify-content-center"
                    style={{ top: '-46px', left: 0, zIndex: 100 }}
                  >
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
                <div
                  className="mx-auto w-100 bg-white dark:bg-dark-card shadow-sm overflow-hidden border border-light dark:border-dark"
                  style={{ maxWidth: '768px', borderRadius: '24px' }}
                >
                  <div className="d-flex align-items-center gap-2 mt-3 mb-2 px-3">
                    <button 
                      className="btn btn-sm btn-light bg-transparent border border-light rounded-pill px-3 py-1 d-flex align-items-center gap-2 text-muted hover-bg-light transition-colors" 
                      style={{ fontSize: '13px' }}
                      onClick={() => window.alert('Mode pemilihan segera hadir!')}
                    >
                      <Icon icon="adjustments" size={14} /> Mode
                    </button>
                    <button 
                      className="btn btn-sm btn-light bg-transparent border border-light rounded-pill px-3 py-1 d-flex align-items-center gap-2 text-muted hover-bg-light transition-colors" 
                      style={{ fontSize: '13px' }}
                      onClick={() => window.alert('Mode Analisis Cepat diaktifkan!')}
                    >
                      <Icon icon="bolt" size={14} /> Analisis Cepat
                    </button>
                    <button 
                      className="btn btn-sm btn-light bg-transparent border border-light rounded-pill px-3 py-1 d-flex align-items-center gap-2 text-muted hover-bg-light transition-colors" 
                      style={{ fontSize: '13px' }}
                      onClick={() => window.alert('Mode Insight diaktifkan!')}
                    >
                      <Icon icon="bulb" size={14} /> Insight
                    </button>
                  </div>
                  <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
                </div>
                <div className="text-center mt-2 mb-1">
                  <small className="text-muted" style={{ fontSize: '12px' }}>
                    Mora AI can make mistakes. Please double-check responses.
                  </small>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
