import { useRef, useEffect, useState } from 'react'
import { Icon } from '@/shared/components/ui/Icon'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isTyping?: boolean
  onAudioUpload?: (file: File) => void
}

export function ChatInput({ onSendMessage, isTyping, onAudioUpload }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()
  const audioHistoryRef = useRef<number[]>([])

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

  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i]
      }
      const average = sum / dataArray.length
      
      if (!canvasRef.current) return
      const canvas = canvasRef.current
      const barWidth = 4
      const spacing = 4
      const maxBars = Math.floor(canvas.width / (barWidth + spacing))
      
      const history = audioHistoryRef.current
      history.push(average)
      if (history.length > maxBars) history.shift()

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const startX = canvas.width - (history.length * (barWidth + spacing))
      ctx.fillStyle = '#ff7e1d'
      
      for (let i = 0; i < history.length; i++) {
        const value = history[i]
        const percent = Math.min(value / 128, 1)
        let barHeight = Math.max(percent * canvas.height, 4)
        const x = startX + i * (barWidth + spacing)
        const y = (canvas.height - barHeight) / 2
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barHeight, 2)
        ctx.fill()
      }
    }
    draw()
  }

  const cleanupAudio = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close().catch(console.error)
    }
    audioContextRef.current = null
    analyserRef.current = null
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      audioHistoryRef.current = []
      
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const audioCtx = new AudioContext()
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 64
      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(analyser)
      
      audioContextRef.current = audioCtx
      analyserRef.current = analyser

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const file = new File([audioBlob], 'voice-record.webm', { type: 'audio/webm' })
        if (onAudioUpload) onAudioUpload(file)
        stream.getTracks().forEach(track => track.stop())
        cleanupAudio()
      }

      mediaRecorder.start()
      setIsRecording(true)
      setIsDropdownOpen(false)
      
      setTimeout(() => drawWaveform(), 50)
    } catch (err) {
      console.error('Microphone access denied:', err)
      alert('Gagal mengakses mikrofon.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }
  
  const cancelRecording = () => {
     if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      mediaRecorderRef.current.onstop = null
      mediaRecorderRef.current = null
      setIsRecording(false)
      cleanupAudio()
    }
  }

  return (
    <>
      <input type="file" accept="image/jpeg,image/png,image/webp,image/heic" className="d-none" ref={imageInputRef} />
      <input type="file" accept="application/pdf,text/csv" className="d-none" ref={docInputRef} />

      <div className="w-100 position-relative d-flex flex-column">
        {isRecording ? (
          <div className="d-flex align-items-center justify-content-between gap-2" style={{ minHeight: '56px', padding: '4px 8px' }}>
            <button 
              type="button"
              className="bg-transparent text-danger p-0 m-0 border-0 flex-shrink-0 d-flex justify-content-center align-items-center" 
              onClick={cancelRecording}
              style={{ width: '36px', height: '36px', outline: 'none' }}
            >
              <Icon icon="x" size={20} stroke={2} />
            </button>
            
            <div className="flex-grow-1 d-flex align-items-center justify-content-center overflow-hidden px-2">
              <canvas ref={canvasRef} width={200} height={34} className="w-100" />
            </div>
            
            <button 
              type="button"
              className="btn btn-icon rounded-circle p-0 m-0 border-0 flex-shrink-0 d-flex justify-content-center align-items-center" 
              onClick={stopRecording}
              style={{ 
                backgroundColor: '#ff7e1d', 
                color: 'white', 
                width: '40px', 
                height: '40px', 
                minWidth: '40px',
                minHeight: '40px',
                aspectRatio: '1/1'
              }}
            >
              <Icon icon="check" size={18} stroke={2.5} />
            </button>
          </div>
        ) : (
          <>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleChange}
              className="form-control chat-input-textarea bg-transparent border-0 px-2 py-1 shadow-none text-body w-100"
              placeholder="Tanya apa saja tentang keuanganmu..."
              rows={1}
              style={{
                resize: 'none',
                maxHeight: '120px',
                fontSize: '0.95rem',
                lineHeight: '1.4',
                outline: 'none',
                boxShadow: 'none',
              }}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />

            <div className="d-flex justify-content-between align-items-center mt-2 px-1">
              <div className="position-relative">
                <button 
                  type="button"
                  className="btn btn-icon btn-light rounded-circle p-0 m-0 border-0 flex-shrink-0 d-flex justify-content-center align-items-center" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  disabled={isTyping} 
                  title="Lampirkan"
                  style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px', aspectRatio: '1/1', backgroundColor: '#f3f4f6' }}
                >
                  <Icon icon="plus" size={20} className="text-secondary" />
                </button>
                
                {isDropdownOpen && (
                  <>
                    <div 
                      className="position-fixed top-0 start-0 w-100 h-100" 
                      style={{ zIndex: 1050 }} 
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div 
                      className="position-absolute shadow-lg border-0 rounded-3 py-2"
                      style={{ 
                        bottom: '120%', 
                        left: '0', 
                        minWidth: '220px', 
                        zIndex: 1051,
                        backgroundColor: '#2d2d2d'
                      }}
                    >
                      <button 
                        type="button"
                        className="dropdown-item d-flex align-items-center gap-3 px-3 py-2 text-white w-100 border-0 bg-transparent text-start"
                        onClick={() => {
                          setIsDropdownOpen(false)
                          imageInputRef.current?.click()
                        }}
                      >
                        <Icon icon="photo" size={18} className="text-light opacity-75" />
                        <span style={{ fontSize: '0.9rem' }}>Unggah Gambar</span>
                      </button>
                      <button 
                        type="button"
                        className="dropdown-item d-flex align-items-center gap-3 px-3 py-2 text-white w-100 border-0 bg-transparent text-start"
                        onClick={() => {
                          setIsDropdownOpen(false)
                          docInputRef.current?.click()
                        }}
                      >
                        <Icon icon="file-description" size={18} className="text-light opacity-75" />
                        <span style={{ fontSize: '0.9rem' }}>Unggah Dokumen</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="d-flex gap-1 align-items-center flex-shrink-0">
                <button
                  type="button"
                  className="p-0 m-0 border-0 d-flex justify-content-center align-items-center flex-shrink-0 bg-transparent"
                  style={{ 
                    width: '40px', 
                    height: '40px',
                    outline: 'none',
                    boxShadow: 'none'
                  }}
                  disabled={isTyping}
                  title="Rekam Suara"
                  onClick={startRecording}
                >
                  <Icon icon="microphone" size={22} className="text-secondary" />
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isTyping || !inputValue.trim()}
                  className="btn btn-icon rounded-circle p-0 m-0 border-0 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    minHeight: '40px',
                    aspectRatio: '1/1',
                    backgroundColor: inputValue.trim() && !isTyping ? '#ff7e1d' : '#e5e7eb',
                    color: inputValue.trim() && !isTyping ? 'white' : '#9ca3af',
                    transition: 'all 0.2s ease',
                  }}
                  title="Kirim pesan"
                >
                  {isTyping ? (
                    <span
                      className="spinner-border"
                      style={{ width: 16, height: 16, borderWidth: '0.15em', color: '#fff' }}
                    />
                  ) : (
                    <Icon icon="arrow-up" size={18} stroke={2.5} />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
