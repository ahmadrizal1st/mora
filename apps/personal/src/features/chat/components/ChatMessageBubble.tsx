import { clsx } from 'clsx'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState, useRef, useEffect } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { type Message, useChatStore } from '../store/useChatStore'

interface ChatMessageBubbleProps {
  message: Message
}

const CodeBlock = ({ className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : 'text'

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-3 my-3 chat-bubble-code-block">
      <div className="d-flex align-items-center justify-content-between px-3 pt-2 pb-1">
        <span className="text-muted" style={{ fontSize: 12 }}>{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="bg-transparent border-0 p-1 d-flex align-items-center gap-1 text-muted"
          style={{ fontSize: 12, borderRadius: 4 }}
        >
          <Icon icon={copied ? 'check' : 'copy'} size={13} className={copied ? 'text-success' : ''} />
          {copied ? 'Tersalin' : 'Salin'}
        </button>
      </div>
      <div className="px-3 pb-3 pt-1 overflow-auto">
        <code className={clsx(className, 'chat-bubble-code-text')} {...props}>
          {children}
        </code>
      </div>
    </div>
  )
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(message.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const [displayedContent, setDisplayedContent] = useState('')
  const [isTypingAnimation, setIsTypingAnimation] = useState(false)
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  const editMessage = useChatStore((state) => state.editMessage)
  const switchVariant = useChatStore((state) => state.switchVariant)
  const activeSessionId = useChatStore((state) => state.activeSessionId)
  const getSiblings = useChatStore((state) => state.getSiblings)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveEdit = () => {
    if (editValue.trim() !== '') {
      editMessage(message.id, editValue)
    }
    setIsEditing(false)
  }

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      textareaRef.current.focus()
    }
  }, [isEditing, editValue])
  
  const isUser = message.role === 'user'
  const isAIMessage = !isUser && !message.isGenerating && message.content
  
  // Typing animation for new AI messages
  useEffect(() => {
    if (isAIMessage) {
      setDisplayedContent('')
      setIsTypingAnimation(true)
      let index = 0
      
      const animate = () => {
        if (index < message.content.length) {
          setDisplayedContent(message.content.slice(0, index + 1))
          index++
          const speed = Math.random() * 20 + 10 // Random speed between 10-30ms
          animationRef.current = setTimeout(animate, speed)
        } else {
          setIsTypingAnimation(false)
        }
      }
      
      // Start animation after a tiny delay
      animationRef.current = setTimeout(animate, 50)
    } else {
      setDisplayedContent(message.content)
      setIsTypingAnimation(false)
    }
    
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current)
    }
  }, [message.id, message.content, isAIMessage])

  const renderVariantSwitcher = () => {
    if (!activeSessionId) return null
    const siblings = getSiblings(activeSessionId, message.parent_id)
    if (siblings.length <= 1) return null

    const current = siblings.findIndex(s => s.id === message.id) + 1
    const total = siblings.length

    return (
      <div className="d-flex align-items-center gap-1 text-muted">
        <button
          type="button"
          onClick={() => switchVariant(message.id, 'prev')}
          disabled={current <= 1}
          className="btn btn-sm btn-ghost btn-icon p-0 text-muted"
          style={{ width: 22, height: 22, opacity: current <= 1 ? 0.35 : 1 }}
        >
          <Icon icon="chevron-left" size={13} />
        </button>
        <span style={{ fontSize: 11, minWidth: 28, textAlign: 'center' }}>
          {current}/{total}
        </span>
        <button
          type="button"
          onClick={() => switchVariant(message.id, 'next')}
          disabled={current >= total}
          className="btn btn-sm btn-ghost btn-icon p-0 text-muted"
          style={{ width: 22, height: 22, opacity: current >= total ? 0.35 : 1 }}
        >
          <Icon icon="chevron-right" size={13} />
        </button>
      </div>
    )
  }

  return (
    <div className={clsx('d-flex mb-5 align-items-start', isUser ? 'justify-content-end' : 'justify-content-start')}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="position-relative me-3" style={{ marginTop: 1 }}>
          <div
            className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
            style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #ff7a00, #ffb347)' }}
          >
            <Icon icon="sparkles" size={13} className="text-white" />
          </div>
          {/* Sparkle icons around avatar */}
          {isTypingAnimation && (
            <>
              <div className="position-absolute" style={{ top: -6, right: -6 }}>
                <Icon icon="sparkles" size={10} style={{ color: '#ff7a00' }} />
              </div>
              <div className="position-absolute" style={{ bottom: -4, left: -4 }}>
                <Icon icon="sparkle-highlight" size={8} style={{ color: '#ffb347' }} />
              </div>
            </>
          )}
        </div>
      )}

      <div
        className={clsx(!isUser && 'markdown text-body')}
        style={{
          maxWidth: isUser ? '72%' : 'calc(100% - 46px)',
          fontSize: 14.5,
          lineHeight: 1.65,
        }}
      >
        {isUser ? (
          /* ── User Bubble ── */
          <div className="d-flex flex-column align-items-end">
            {isEditing ? (
              <div className="w-100 rounded-4 p-3" style={{ background: '#1f2937', color: '#fff' }}>
                <div
                  className="border border-primary rounded-3 px-3 py-2 mb-3"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <textarea
                    ref={textareaRef}
                    className="bg-transparent border-0 p-0 m-0 w-100"
                    style={{
                      color: '#fff',
                      minHeight: 40,
                      resize: 'none',
                      outline: 'none',
                      boxShadow: 'none',
                      fontSize: 'inherit',
                      lineHeight: 'inherit',
                      fontFamily: 'inherit',
                    }}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                </div>
                <div className="d-flex align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-start gap-2" style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.4 }}>
                    <Icon icon="info-circle" size={13} className="flex-shrink-0 mt-1" />
                    <span>Edit akan membuat cabang percakapan baru.</span>
                  </div>
                  <div className="d-flex gap-2 flex-shrink-0">
                    <button
                      className="btn btn-sm px-3 rounded-3"
                      style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none', fontSize: 13 }}
                      onClick={() => { setIsEditing(false); setEditValue(message.content) }}
                    >
                      Batal
                    </button>
                    <button
                      className="btn btn-sm px-3 rounded-3"
                      style={{ background: '#ff7a00', color: '#fff', border: 'none', fontSize: 13 }}
                      onClick={handleSaveEdit}
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="px-3 py-2 rounded-4 chat-bubble-text"
                style={{ background: '#1f2937', color: '#fff', fontSize: 14.5 }}
              >
                {message.content}
              </div>
            )}

            {/* User actions — always visible */}
            {!isEditing && (
              <div className="d-flex align-items-center gap-1 mt-2">
                {renderVariantSwitcher()}
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn btn-sm btn-ghost btn-icon text-muted p-1 rounded-2"
                  title="Edit"
                  style={{ width: 26, height: 26 }}
                >
                  <Icon icon="pencil" size={13} />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn btn-sm btn-ghost btn-icon text-muted p-1 rounded-2"
                  title="Salin"
                  style={{ width: 26, height: 26 }}
                >
                  <Icon icon={copied ? 'check' : 'copy'} size={13} className={copied ? 'text-success' : ''} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── AI Bubble ── */
          <>
            {message.isGenerating ? (
              <div className="d-flex gap-1 align-items-center" style={{ height: 30 }}>
                <span className="rounded-circle typing-dot" />
                <span className="rounded-circle typing-dot" />
                <span className="rounded-circle typing-dot" />
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  pre: ({ children }) => <div className="my-3">{children}</div>,
                  code: ({ node, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '')
                    const isBlock = match || String(children).includes('\n')
                    if (isBlock) {
                      return <CodeBlock className={className} {...props}>{children}</CodeBlock>
                    }
                    return (
                      <code className="chat-bubble-inline-code rounded px-1" {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {displayedContent}
              </ReactMarkdown>
            )}
            {/* Sparkle indicator at end of message while typing */}
            {isTypingAnimation && (
              <span className="ms-1">
                <Icon icon="sparkle-2" size={12} style={{ color: '#ff7a00' }} />
              </span>
            )}

            {/* AI actions — always visible */}
            {!message.isGenerating && (
              <div className="d-flex align-items-center gap-1 mt-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn btn-sm btn-ghost btn-icon text-muted p-1 rounded-2"
                  title="Salin"
                  style={{ width: 28, height: 28 }}
                >
                  <Icon icon={copied ? 'check' : 'copy'} size={14} className={copied ? 'text-success' : ''} />
                </button>
                <button
                  type="button"
                  onClick={() => setFeedback(f => f === 'up' ? null : 'up')}
                  className={clsx('btn btn-sm btn-ghost btn-icon p-1 rounded-2', feedback === 'up' ? 'text-primary' : 'text-muted')}
                  title="Respons bagus"
                  style={{ width: 28, height: 28 }}
                >
                  <Icon icon="thumb-up" size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setFeedback(f => f === 'down' ? null : 'down')}
                  className={clsx('btn btn-sm btn-ghost btn-icon p-1 rounded-2', feedback === 'down' ? 'text-danger' : 'text-muted')}
                  title="Respons kurang baik"
                  style={{ width: 28, height: 28 }}
                >
                  <Icon icon="thumb-down" size={14} />
                </button>
                {renderVariantSwitcher()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
