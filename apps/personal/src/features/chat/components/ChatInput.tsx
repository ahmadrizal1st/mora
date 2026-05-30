import { useRef, useEffect, useState } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { VoiceRecorder } from './VoiceRecorder'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isTyping?: boolean
}

export function ChatInput({ onSendMessage, isTyping }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = '32px'
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
      // reset height slightly after value clears
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = '32px'
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
    <>
      <style>{`
        .chat-input-textarea:focus {
          box-shadow: none !important;
          outline: none !important;
          border-color: transparent !important;
        }
        @keyframes waveformAnim {
          0% { transform: scaleY(0.2); opacity: 0.5; }
          100% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
      <div className="p-2 bg-white dark:bg-dark-card">
      <form
        onSubmit={handleSubmit}
        className="d-flex align-items-end gap-2 position-relative bg-light dark:bg-dark px-3 py-2"
        style={{ minHeight: '52px', borderRadius: '16px' }}
      >
        {isRecording ? (
          <VoiceRecorder 
            onCancel={() => setIsRecording(false)}
            onSend={(blob) => {
              setIsRecording(false)
              // We'll simulate that the voice was transcribed to text
              setInputValue('Halo, ini adalah simulasi rekaman suara otomatis...')
            }}
          />
        ) : (
          <>
            <div className="dropdown dropup flex-shrink-0">
          <button 
            type="button" 
            className="btn btn-icon btn-sm rounded-circle text-muted bg-transparent border-0" 
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ width: '32px', height: '32px' }}
          >
            <Icon icon="plus" size={20} />
          </button>
          <ul className="dropdown-menu shadow border border-light dark:border-dark rounded-4 py-2 mb-2 bg-white dark:bg-dark-card" style={{ minWidth: '240px' }}>
            <li>
              <button type="button" className="dropdown-item d-flex align-items-center gap-2 py-2">
                <Icon icon="paperclip" size={18} className="text-muted" />
                Add photos & files
              </button>
            </li>
            <li>
              <button type="button" className="dropdown-item d-flex align-items-center gap-2 py-2">
                <Icon icon="file" size={18} className="text-muted" />
                Recent files
                <Icon icon="chevron-right" size={14} className="ms-auto text-muted" />
              </button>
            </li>
            <li><hr className="dropdown-divider my-1" /></li>
            <li>
              <button type="button" className="dropdown-item py-2">
                <div className="d-flex align-items-center gap-2">
                  <Icon icon="photo" size={18} className="text-muted" />
                  <div>
                    <div className="text-body fw-medium">Create image</div>
                    <div className="text-muted small" style={{ fontSize: '11px' }}>0 images left until 7:24 PM</div>
                  </div>
                </div>
              </button>
            </li>
            <li><hr className="dropdown-divider my-1" /></li>
            <li>
              <button type="button" className="dropdown-item d-flex align-items-center gap-2 py-2">
                <Icon icon="bulb" size={18} className="text-muted" />
                Thinking
              </button>
            </li>
            <li>
              <button type="button" className="dropdown-item d-flex align-items-center gap-2 py-2">
                <Icon icon="microscope" size={18} className="text-muted" />
                Deep research
              </button>
            </li>
            <li>
              <button type="button" className="dropdown-item d-flex align-items-center gap-2 py-2">
                <Icon icon="world-search" size={18} className="text-muted" />
                Web search
              </button>
            </li>
            <li>
              <button type="button" className="dropdown-item d-flex align-items-center gap-2 py-2">
                <Icon icon="dots" size={18} className="text-muted" />
                More
                <Icon icon="chevron-right" size={14} className="ms-auto text-muted" />
              </button>
            </li>
          </ul>
        </div>

        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleChange}
          className="form-control chat-input-textarea bg-transparent border-0 px-0 py-1 shadow-none text-body"
          placeholder="Ask anything"
          rows={1}
          style={{
            resize: 'none',
            minHeight: '32px',
            maxHeight: '200px',
            fontSize: '15px',
            lineHeight: '24px'
          }}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
        />
        
        <div className="d-flex align-items-center gap-1 flex-shrink-0">
          <button 
            type="button" 
            className="btn btn-icon btn-sm text-muted bg-transparent border-0 rounded-circle hover-bg-light" 
            style={{ width: '32px', height: '32px' }}
            title="Voice Record"
            onClick={() => setIsRecording(true)}
          >
            <Icon icon="microphone" size={20} />
          </button>
          {inputValue.trim() ? (
            <button
              type="submit"
              disabled={isTyping}
              className="btn btn-icon btn-sm rounded-circle border-0 shadow-sm"
              style={{ width: '32px', height: '32px', backgroundColor: '#ffffff', color: '#000000' }}
            >
              <Icon icon="arrow-up" size={18} />
            </button>
          ) : (
            <button 
              type="button" 
              className="btn btn-icon btn-sm rounded-circle border-0 shadow-sm" 
              style={{ width: '32px', height: '32px', backgroundColor: '#ffffff', color: '#000000' }}
              title="Voice Mode"
            >
              <Icon icon="headphones" size={18} />
            </button>
          )}
        </div>
          </>
        )}
      </form>
    </div>
    </>
  )
}
