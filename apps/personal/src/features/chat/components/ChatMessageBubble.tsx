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
  const [isHovered, setIsHovered] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : 'text'

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="rounded-3 my-3 position-relative chat-bubble-code-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="d-flex align-items-center justify-content-between px-3 pt-2 pb-1 text-12 text-muted">
        <span>{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="bg-transparent border-0 p-0 d-flex align-items-center justify-content-center text-muted cursor-pointer w-20"
          style={{ opacity: isHovered || copied ? 1 : 0, transition: 'opacity 0.2s' }}
          title="Copy code"
        >
          <Icon icon={copied ? 'check' : 'copy'} size={16} />
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
  const [isHovered, setIsHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(message.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const renderVariantSwitcher = () => {
    if (!activeSessionId) return null
    const siblings = getSiblings(activeSessionId, message.parent_id)
    if (siblings.length <= 1) return null
    
    const current = siblings.findIndex(s => s.id === message.id) + 1
    const total = siblings.length

    return (
      <div className="d-flex align-items-center gap-1 mx-1 text-muted text-12">
        <button
          type="button"
          onClick={() => switchVariant(message.id, 'prev')}
          disabled={current <= 1}
          className="text-muted bg-transparent border-0 p-0 d-flex align-items-center justify-content-center w-20"
          style={{ opacity: current <= 1 ? 0.3 : 1 }}
        >
          <Icon icon="chevron-left" size={14} />
        </button>
        <span className="user-select-none mx-1">
          {current} / {total}
        </span>
        <button
          type="button"
          onClick={() => switchVariant(message.id, 'next')}
          disabled={current >= total}
          className="text-muted bg-transparent border-0 p-0 d-flex align-items-center justify-content-center w-20"
          style={{ opacity: current >= total ? 0.3 : 1 }}
        >
          <Icon icon="chevron-right" size={14} />
        </button>
      </div>
    )
  }

  const isUser = message.role === 'user'

  return (
    <div
      className={clsx(
        'd-flex mb-4 align-items-start',
        isUser ? 'justify-content-end' : 'justify-content-start'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={clsx(!isUser && 'text-body pt-1 markdown')}
        style={{
          maxWidth: isUser ? '75%' : '100%',
          lineHeight: '1.6',
          fontSize: '15px',
        }}
      >
        {isUser ? (
          <div className="d-flex flex-column align-items-end w-100">
            {isEditing ? (
              <div className="p-3 rounded-4 bg-dark dark:bg-light text-white dark:text-dark shadow-sm w-100">
                <div className="border border-primary rounded-3 px-3 py-2 mb-3 chat-bubble-reply-wrapper">
                  <textarea
                    ref={textareaRef}
                    className="bg-transparent text-white dark:text-dark border-0 p-0 m-0"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={{
                      minHeight: '40px',
                      width: '100%',
                      resize: 'none',
                      outline: 'none',
                      boxShadow: 'none',
                      fontSize: 'inherit',
                      lineHeight: 'inherit',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
                  <div className="d-flex gap-2 text-13 opacity-75" style={{ lineHeight: '1.4' }}>
                    <Icon icon="info-circle" size={16} className="flex-shrink-0 mt-1 mt-sm-0" />
                    <span>
                      Editing this message will create a new conversation branch. You can switch
                      between branches using the arrow navigation buttons.
                    </span>
                  </div>
                  <div className="d-flex gap-2 flex-shrink-0 align-self-end align-self-sm-auto">
                    <button
                      className="btn btn-sm border-0 px-3 py-2 fw-medium rounded-3 chat-bubble-reply-user"
                      onClick={() => {
                        setIsEditing(false)
                        setEditValue(message.content)
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-sm border-0 px-3 py-2 fw-medium rounded-3 chat-bubble-reply-ai"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-3 py-2 rounded-4 bg-dark dark:bg-light text-white dark:text-dark shadow-sm chat-bubble-text">
                {message.content}
              </div>
            )}

            {!isEditing && (
              <div
                className="d-flex align-items-center gap-1 mt-1 text-muted text-12 min-h-24"
                style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}
              >
                <span className="me-2">Today</span>
                {renderVariantSwitcher()}
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-muted bg-transparent border-0 p-1 hover-text-primary transition-colors d-flex align-items-center justify-content-center w-26"
                  title="Edit"
                >
                  <Icon icon="pencil" size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-muted bg-transparent border-0 p-1 hover-text-primary transition-colors d-flex align-items-center justify-content-center w-26"
                  title="Copy"
                >
                  <Icon
                    icon={copied ? 'check' : 'copy'}
                    size={14}
                    className={copied ? 'text-success' : ''}
                  />
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {message.isGenerating ? (
              <div className="typing-indicator d-flex gap-1 align-items-center pt-2 pb-1 min-h-30">
                <span className="bg-secondary rounded-circle typing-dot"></span>
                <span className="bg-secondary rounded-circle typing-dot"></span>
                <span className="bg-secondary rounded-circle typing-dot"></span>
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
                      return (
                        <CodeBlock className={className} {...props}>
                          {children}
                        </CodeBlock>
                      )
                    }

                    return (
                      <code className="rounded px-1 py-0.5 chat-bubble-inline-code" {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}

            {!message.isGenerating && (
              <div className="d-flex align-items-center gap-1 mt-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-muted bg-transparent border-0 p-1 hover-text-primary transition-colors d-flex align-items-center justify-content-center w-28"
                  title="Copy"
                >
                  <Icon
                    icon={copied ? 'check' : 'copy'}
                    size={16}
                    className={copied ? 'text-success' : ''}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setFeedback((f) => (f === 'up' ? null : 'up'))}
                  className={`bg-transparent border-0 p-1 transition-colors d-flex align-items-center justify-content-center w-28 ${feedback === 'up' ? 'text-primary' : 'text-muted hover-text-primary'}`}
                  title="Good response"
                >
                  <Icon icon="thumb-up" size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setFeedback((f) => (f === 'down' ? null : 'down'))}
                  className={`bg-transparent border-0 p-1 transition-colors d-flex align-items-center justify-content-center w-28 ${feedback === 'down' ? 'text-danger' : 'text-muted hover-text-danger'}`}
                  title="Bad response"
                >
                  <Icon icon="thumb-down" size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => retryMessage(message.id)}
                  className="text-muted bg-transparent border-0 p-1 hover-text-primary transition-colors d-flex align-items-center justify-content-center w-28"
                  title="Regenerate"
                >
                  <Icon icon="refresh" size={16} />
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
