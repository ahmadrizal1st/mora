import { useRef, useEffect, useState } from 'react'
import { Icon } from '@/shared/components/ui/Icon'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isTyping?: boolean
}

export function ChatInput({ onSendMessage, isTyping }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = '40px'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    adjustHeight()
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const message = inputValue.trim()
    if (message && !isTyping) {
      onSendMessage(message)
      setInputValue('')
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = '40px'
        }
      }, 0)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="d-flex align-items-end gap-2 chat-input-form">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleChange}
        className="form-control chat-input-textarea bg-transparent border-0 px-0 py-2 shadow-none text-body flex-grow-1"
        placeholder="Tanya apa saja tentang keuanganmu..."
        rows={1}
        style={{
          resize: 'none',
          minHeight: '40px',
          maxHeight: '200px',
          fontSize: '14px',
          lineHeight: '22px',
        }}
        onKeyDown={handleKeyDown}
        disabled={isTyping}
      />

      <div className="d-flex align-items-center gap-1 flex-shrink-0 pb-1">
        <button
          type="submit"
          disabled={isTyping || !inputValue.trim()}
          className="btn btn-icon btn-sm rounded-circle border-0 d-flex align-items-center justify-content-center text-white transition-colors"
          style={{
            width: 34,
            height: 34,
            background: inputValue.trim() && !isTyping ? '#ff7a00' : 'rgba(128,128,128,0.25)',
            transition: 'background 0.2s',
          }}
          title="Kirim pesan"
        >
          {isTyping ? (
            <span
              className="spinner-border"
              style={{ width: 14, height: 14, borderWidth: '0.15em', color: '#fff' }}
            />
          ) : (
            <Icon icon="arrow-up" size={16} />
          )}
        </button>
      </div>
    </form>
  )
}
