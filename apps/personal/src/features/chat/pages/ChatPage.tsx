import { useState, useEffect, useRef } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '@/features/auth/store/authStore'
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

  const {
    messages, activeSessionId, isTyping, sendMessage, loadSession,
    createNewSession, fetchSessions, getActiveThread,
    hasFetchedSessions, isLoadingSessions, loadedSessions,
  } = useChatStore()

  const user = useAuthStore((s) => s.user)
  const { data: accountData } = useAccountSummary()
  const { data: txSummary } = useTransactionSummary()
  const { data: goals } = useGoals()

  const formatCurrency = (value: number) =>
    `Rp ${value.toLocaleString('id-ID')}`

  // Load sessions then either open URL session or create new blank session
  useEffect(() => {
    let mounted = true
    fetchSessions().finally(() => {
      if (!mounted) return
      if (urlSessionId) {
        loadSession(urlSessionId)
      } else {
        createNewSession()
      }
    })
    return () => { mounted = false }
  }, [urlSessionId]) // eslint-disable-line react-hooks/exhaustive-deps

  // After sending: navigate to the real session URL (the store creates it in the DB, then updates activeSessionId)
  const handleSendMessage = async (content: string) => {
    const beforeId = useChatStore.getState().activeSessionId
    const isNew = !beforeId || !useChatStore.getState().sessions.some(s => s.id === beforeId)

    await sendMessage(content)

    // If session was new, the store has now replaced the temp UUID with the real DB UUID
    const afterId = useChatStore.getState().activeSessionId
    if (isNew && afterId) {
      navigate({ to: '/ai/chat/$sessionId', params: { sessionId: afterId } })
    }
  }

  // Auto-send prompt if navigated from a template
  useEffect(() => {
    const prompt = sessionStorage.getItem('morapi_template_prompt')
    if (!prompt) return
    sessionStorage.removeItem('morapi_template_prompt')
    // Wait for session to be ready before sending
    const timer = setTimeout(() => {
      handleSendMessage(prompt)
    }, 100)
    return () => clearTimeout(timer)
  }, [activeSessionId]) // eslint-disable-line react-hooks/exhaustive-deps

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
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 150)
  }

  const lastMessageId = currentMessages.length > 0
    ? currentMessages[currentMessages.length - 1].id
    : null

  useEffect(() => {
    scrollToBottom()
  }, [lastMessageId, isTyping])

  // Only show loading when we're genuinely fetching remote data
  const isLoading =
    !hasFetchedSessions ||
    isLoadingSessions ||
    (!!urlSessionId && !!activeSessionId && !loadedSessions[activeSessionId])

  // Greeting helpers
  const firstName = user?.name?.split(' ')[0] ?? 'Pengguna'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat siang' : 'Selamat malam'

  const QUICK_ACTIONS = [
    {
      icon: 'chart-bar',
      label: 'Analisis Keuangan',
      desc: 'Arus kas, pengeluaran & performa',
      bg: 'rgba(255,122,0,0.07)',
      iconBg: 'rgba(255,122,0,0.15)',
      iconColor: '#ff7a00',
      prompt: 'Bantu saya analisis arus kas dan performa keuangan saya.',
    },
    {
      icon: 'file-invoice',
      label: 'Laporan & Insight',
      desc: 'Laporan cerdas & rekomendasi',
      bg: 'rgba(32,201,151,0.07)',
      iconBg: 'rgba(32,201,151,0.15)',
      iconColor: '#20c997',
      prompt: 'Buatkan saya laporan keuangan dan insight penting.',
    },
    {
      icon: 'shield-check',
      label: 'Rencana & Anggaran',
      desc: 'Budget, tujuan & perencanaan',
      bg: 'rgba(111,66,193,0.07)',
      iconBg: 'rgba(111,66,193,0.15)',
      iconColor: '#6f42c1',
      prompt: 'Bantu saya membuat rencana anggaran dan tabungan.',
    },
  ] as const

  const QUICK_PROMPTS = [
    { icon: 'chart-bar', label: 'Analisis arus kas bulan ini', color: 'var(--tblr-primary)' },
    { icon: 'wallet', label: 'Kategorikan pengeluaran saya', color: '#ff7a00' },
    { icon: 'target', label: 'Rencana tabungan 12 bulan', color: 'var(--tblr-danger)' },
    { icon: 'chart-line-up', label: 'Proyeksi investasi saya', color: 'var(--tblr-success)' },
  ] as const

  const savingsPercent = goals?.totalTarget
    ? Math.round(((goals?.totalSaved ?? 0) / goals.totalTarget) * 100)
    : 0

  return (
    <div className="d-flex w-100 chat-page-container" style={{ background: 'var(--tblr-bg-surface)' }}>
      <ChatHistoryDrawer isOpen={isDrawerOpen} onToggle={() => setIsDrawerOpen(!isDrawerOpen)} />

      <div className="flex-grow-1 d-flex flex-column h-100 min-w-0">
        {/* Mobile sidebar toggle (only show when drawer is closed) */}
        <div className="d-flex d-md-none px-3 pt-3">
          {!isDrawerOpen && (
            <button
              className="btn btn-ghost btn-sm btn-icon rounded-3 text-muted"
              onClick={() => setIsDrawerOpen(true)}
              title="Buka sidebar"
            >
              <Icon icon="layout-sidebar" size={18} />
            </button>
          )}
        </div>

        {/* ── Main Body ── */}
        <div className="flex-grow-1 d-flex flex-column overflow-hidden">
          {isLoading ? (
            /* Loading State */
            <div className="flex-grow-1 d-flex align-items-center justify-content-center gap-3 flex-column">
              <div
                className="spinner-border"
                role="status"
                style={{ width: 28, height: 28, borderWidth: '0.18em', color: '#ff7a00' }}
              />
              <span className="text-muted" style={{ fontSize: 13 }}>Memuat percakapan...</span>
            </div>

          ) : currentMessages.length === 0 ? (
            /* ── Welcome Screen ── */
            <div className="flex-grow-1 overflow-auto chat-scrollbar-thin">
              <div className="px-3 px-md-4 py-4 mx-auto w-100" style={{ maxWidth: 800 }}>

                {/* Greeting */}
                <div className="mb-4 pt-2">
                  <h2 className="fw-bold mb-1" style={{ fontSize: 22 }}>
                    {greeting}, {firstName}! 👋
                  </h2>
                  <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                    Tanya apa saja tentang keuanganmu — Morapi AI siap membantu.
                  </p>
                </div>

                {/* Finance Stat Cards — 4 cols */}
                <div className="row g-2 mb-4">
                  {[
                    {
                      label: 'Total Saldo',
                      value: formatCurrency(accountData?.total_balance ?? 0),
                      sub: 'Semua akun',
                      valueClass: '',
                    },
                    {
                      label: 'Pemasukan',
                      value: formatCurrency(txSummary?.total_income ?? 0),
                      sub: 'Bulan ini',
                      valueClass: 'text-success',
                    },
                    {
                      label: 'Pengeluaran',
                      value: formatCurrency(txSummary?.total_expense ?? 0),
                      sub: 'Bulan ini',
                      valueClass: 'text-danger',
                    },
                    {
                      label: 'Target Tabungan',
                      value: `${savingsPercent}%`,
                      sub: goals?.totalTarget ? formatCurrency(goals.totalSaved ?? 0) + ' / ' + formatCurrency(goals.totalTarget) : 'Belum ada target',
                      valueClass: '',
                      progress: savingsPercent,
                    },
                  ].map((card) => (
                    <div key={card.label} className="col-6 col-lg-3">
                      <div className="card h-100 mb-0" style={{ borderRadius: 10 }}>
                        <div className="card-body p-3">
                          <div className="text-muted mb-2" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {card.label}
                          </div>
                          <div className={`fw-bold mb-1 ${card.valueClass}`} style={{ fontSize: 16 }}>
                            {card.value}
                          </div>
                          <div className="text-muted" style={{ fontSize: 11 }}>{card.sub}</div>
                          {card.progress !== undefined && (
                            <div className="progress mt-2" style={{ height: 3 }}>
                              <div
                                className="progress-bar"
                                style={{ width: `${card.progress}%`, background: '#ff7a00', borderRadius: 99 }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Cards — 3 cols, equal height */}
                <div className="row g-2 mb-4">
                  {QUICK_ACTIONS.map((action) => (
                    <div key={action.label} className="col-12 col-md-4">
                      <button
                        className="card w-100 text-start border-0 p-0 h-100 chat-action-card"
                        style={{ background: action.bg, borderRadius: 10 }}
                        onClick={() => handleSendMessage(action.prompt)}
                      >
                        <div className="card-body p-3 d-flex gap-3 align-items-center" style={{ minHeight: 72 }}>
                          <div
                            className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                            style={{ width: 44, height: 44, background: action.iconBg }}
                          >
                            <Icon icon={action.icon} size={22} style={{ color: action.iconColor }} />
                          </div>
                          <div className="min-w-0">
                            <div className="fw-semibold mb-1 text-truncate" style={{ fontSize: 14 }}>
                              {action.label}
                            </div>
                            <div className="text-muted" style={{ fontSize: 12, lineHeight: 1.4 }}>
                              {action.desc}
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Input Box */}
                <div className="card mb-3" style={{ borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                  <div className="card-body p-3">
                    <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
                  </div>
                </div>

                {/* Quick Prompt Chips */}
                <div className="d-flex align-items-center gap-2 overflow-x-auto chat-scrollbar-thin pb-1">
                  <span className="text-muted text-nowrap flex-shrink-0" style={{ fontSize: 12 }}>Coba:</span>
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p.label}
                      className="btn btn-sm text-nowrap flex-shrink-0 d-flex align-items-center gap-2 chat-quick-chip"
                      onClick={() => handleSendMessage(p.label)}
                    >
                      <Icon icon={p.icon} size={13} style={{ color: p.color }} />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>

                {/* Disclaimer */}
                <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: 11 }}>
                  Morapi AI dapat membuat kesalahan. Verifikasi informasi penting sebelum mengambil keputusan.
                </p>
              </div>
            </div>

          ) : (
            /* ── Chat View ── */
            <>
              {/* Message thread */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-grow-1 overflow-auto chat-scrollbar-thin"
                style={{ padding: '24px 16px' }}
              >
                <div className="mx-auto w-100" style={{ maxWidth: 720 }}>
                  {currentMessages.map((msg) => (
                    <ChatMessageBubble key={msg.id} message={msg} />
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="d-flex align-items-start gap-3 mb-4">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                        style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #ff7a00, #ffb347)', marginTop: 2 }}
                      >
                        <Icon icon="robot-face" size={16} className="text-white" />
                      </div>
                      <div className="d-flex align-items-center" style={{ height: 30 }}>
                        <div className="d-flex gap-1 align-items-center">
                          <span className="rounded-circle typing-dot" />
                          <span className="rounded-circle typing-dot" />
                          <span className="rounded-circle typing-dot" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Bottom input */}
              <div
                className="flex-shrink-0 px-3 px-md-4 pb-3 pt-2"
                style={{ background: 'var(--tblr-bg-surface)' }}
              >
                {showScrollButton && (
                  <div className="d-flex justify-content-center mb-2">
                    <button
                      onClick={scrollToBottom}
                      className="btn btn-sm btn-icon rounded-circle shadow-sm"
                      style={{
                        width: 32, height: 32,
                        border: '1px solid var(--tblr-border-color)',
                        background: 'var(--tblr-bg-surface)',
                      }}
                    >
                      <Icon icon="arrow-down" size={14} className="text-muted" />
                    </button>
                  </div>
                )}

                <div
                  className="mx-auto w-100 bg-white rounded-4 p-2 border border-light-subtle shadow-sm"
                  style={{ maxWidth: 720 }}
                >
                  <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
                </div>

                <p className="text-center text-muted mt-2 mb-0" style={{ fontSize: 11 }}>
                  Morapi AI dapat membuat kesalahan. Verifikasi informasi penting.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
