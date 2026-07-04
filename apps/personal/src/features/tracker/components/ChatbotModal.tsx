import { useState, useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Icon } from '@/shared/components/ui/Icon'
import { Button } from '@/shared/components/ui/Button'
import { AutosizeTextarea } from '@/shared/components/ui/AutosizeTextarea'
import { Select } from '@/shared/components/ui/Select'
import { Datepicker } from '@/shared/components/ui/Datepicker'
import { useProcessText, useProcessMedia } from '../hooks/useTracker'
import { useCreateTransaction } from '../../transaction/hooks/useTransactions'
import { clsx } from 'clsx'
import { ReviewCard } from './ReviewCard'
import { useTransactionModalStore } from '../../transaction/store/useTransactionModalStore'

interface ChatbotModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
  parsedData?: any[]
  mediaType?: 'image' | 'audio'
}

export function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: 'Halo, saya Morapi AI. Ada pengeluaran atau pemasukan yang ingin dicatat hari ini?',
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [stagedFiles, setStagedFiles] = useState<{file: File, url: string, type: 'image' | 'audio' | 'document'}[]>([])
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const { scannedImage, setScannedImage, openChatbotModal } = useTransactionModalStore()
  
  useEffect(() => {
    if (scannedImage) {
      setStagedFiles(prev => [...prev, {
        file: scannedImage,
        url: URL.createObjectURL(scannedImage),
        type: 'image'
      }])
      setScannedImage(null)
      if (!isOpen) {
        openChatbotModal()
      }
    }
  }, [scannedImage, setScannedImage, isOpen, openChatbotModal])
  
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartY = useRef(0)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const audioHistoryRef = useRef<number[]>([])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const processTextMutation = useProcessText()
  const processMediaMutation = useProcessMedia()
  const createMutation = useCreateTransaction()

  const isPending = processTextMutation.isPending || processMediaMutation.isPending

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('chatbot-open')
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.body.classList.remove('chatbot-open')
    }
    
    return () => {
      document.body.classList.remove('chatbot-open')
    }
  }, [isOpen, messages])


  const handleSend = async () => {
    if (!inputText.trim() && stagedFiles.length === 0) return

    const currentText = inputText
    const currentFiles = [...stagedFiles]

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentText || (currentFiles.length > 0 ? `Mengirim ${currentFiles.length} lampiran...` : ''),
      mediaType: currentFiles.length > 0 ? (currentFiles[0].type === 'image' ? 'image' : 'audio') : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setStagedFiles([])
    setUploadProgress(0)

    try {
      let response;
      if (currentFiles.length > 0) {
        response = await processMediaMutation.mutateAsync({
          files: currentFiles.map(f => f.file),
          text: currentText,
          reviewOnly: true,
          onProgress: (progress) => setUploadProgress(progress)
        })
      } else {
        response = await processTextMutation.mutateAsync({
          text: currentText,
          reviewOnly: true,
        })
      }

      if (response && response.transactions && response.transactions.length > 0) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: response.reply || 'Berikut transaksi yang berhasil saya tangkap. Silakan periksa kembali sebelum disimpan.',
          parsedData: response.transactions,
        }
        setMessages((prev) => [...prev, botMessage])
      } else if (response && response.data && response.data.length > 0) {
        // Fallback for text extraction API returning data array
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: response.reply || 'Berikut transaksi yang berhasil saya tangkap. Silakan periksa kembali sebelum disimpan.',
          parsedData: response.data,
        }
        setMessages((prev) => [...prev, botMessage])
      } else if (response && response.reply) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: response.reply,
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: 'Maaf, saya tidak menemukan data transaksi di pesan Anda. Bisa dicoba dengan kata-kata lain?',
        }
        setMessages((prev) => [...prev, botMessage])
      }
    } catch (error: any) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: `Oops, gagal memproses: ${error.response?.data?.message || error.message || 'Error'}`,
      }
      setMessages((prev) => [...prev, botMessage])
    } finally {
      setUploadProgress(null)
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

      // Calculate average volume for this frame
      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i]
      }
      const average = sum / dataArray.length
      
      // Store in history
      if (!canvasRef.current) return
      const canvas = canvasRef.current
      const barWidth = 4
      const spacing = 4
      const maxBars = Math.floor(canvas.width / (barWidth + spacing))
      
      const history = audioHistoryRef.current
      history.push(average)
      if (history.length > maxBars) {
        history.shift()
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const startX = canvas.width - (history.length * (barWidth + spacing))

      ctx.fillStyle = '#ff7e1d'
      
      for (let i = 0; i < history.length; i++) {
        const value = history[i]
        // value is typically 0-100 for average. Map it to canvas height
        const percent = Math.min(value / 128, 1) // boost a bit
        let barHeight = Math.max(percent * canvas.height, 4) // min height 4px
        
        const x = startX + i * (barWidth + spacing)
        const y = (canvas.height - barHeight) / 2
        
        // Draw rounded rectangle
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newStaged = Array.from(files).map(file => {
      let type: 'image' | 'audio' | 'document' = 'document'
      if (file.type.startsWith('image/')) type = 'image'
      else if (file.type.startsWith('audio/')) type = 'audio'
      
      return {
        file,
        url: URL.createObjectURL(file),
        type
      }
    })

    setStagedFiles(prev => [...prev, ...newStaged])
    setIsDropdownOpen(false)

    if (e.target) e.target.value = ''
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      audioHistoryRef.current = [] // reset history
      
      // Setup audio context for visualization
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

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const file = new File([audioBlob], 'voice-record.webm', { type: 'audio/webm' })
        
        setStagedFiles(prev => [...prev, {
          file,
          url: URL.createObjectURL(file),
          type: 'audio'
        }])
        
        // Cleanup stream
        stream.getTracks().forEach(track => track.stop())
        cleanupAudio()
      }

      mediaRecorder.start()
      setIsRecording(true)
      setIsDropdownOpen(false)
      
      // Slight delay to allow canvas to render in the DOM
      setTimeout(() => {
        drawWaveform()
      }, 50)
    } catch (err) {
      console.error('Microphone access denied:', err)
      alert('Gagal mengakses mikrofon. Pastikan Anda telah memberikan izin.')
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
      mediaRecorderRef.current.onstop = null // Prevent triggering staging
      mediaRecorderRef.current = null
      setIsRecording(false)
      cleanupAudio()
    }
  }

  const removeStagedFile = (index: number) => {
    setStagedFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].url)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handleBotResponse = (response: any) => {
      if (response && response.transactions && response.transactions.length > 0) {
        const botMessage: Message = {
          id: Date.now().toString(),
          role: 'bot',
          content: response.reply || 'Berikut transaksi yang berhasil saya tangkap. Silakan periksa kembali sebelum disimpan.',
          parsedData: response.transactions,
        }
        setMessages((prev) => [...prev, botMessage])
      } else if (response && response.reply) {
        const botMessage: Message = {
          id: Date.now().toString(),
          role: 'bot',
          content: response.reply,
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        const botMessage: Message = {
          id: Date.now().toString(),
          role: 'bot',
          content: 'Maaf, saya tidak menemukan data transaksi. Bisa dicoba lagi?',
        }
        setMessages((prev) => [...prev, botMessage])
      }
  }

  const handleBotError = (error: any) => {
      const botMessage: Message = {
        id: Date.now().toString(),
        role: 'bot',
        content: `Oops, gagal memproses: ${error.response?.data?.message || error.message || 'Error'}`,
      }
      setMessages((prev) => [...prev, botMessage])
  }
    const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if ((e.target as HTMLElement).closest('button')) return // Biarkan tombol diklik
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    dragStartY.current = e.clientY
    setIsDragging(true)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const currentY = e.clientY
    const delta = currentY - dragStartY.current
    if (delta > 0) { // Only allow drag down
      setDragY(delta)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    
    const currentDrag = dragY
    setIsDragging(false)
    
    // Wait for the next frame so 'isDragging' false (and its transition) applies BEFORE we change transform
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (currentDrag > 150) {
          onClose()
        }
        setDragY(0)
      })
    })
  }

  return (
    <div
      className={clsx(
        "chatbot-modal-wrapper shadow-lg d-flex flex-column border-0",
        // Using classes for styling responsiveness
      )}
      style={{
        position: 'fixed',
        zIndex: 1050,
        overflow: 'hidden',
        pointerEvents: isOpen || isDragging || dragY > 0 ? 'auto' : 'none',
        backgroundColor: '#ffffff',
        transform: dragY > 0 ? `translateY(${dragY}px)` : (isOpen ? 'translateY(0)' : 'translateY(120%)'),
        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.4s ease',
        opacity: isOpen || isDragging || dragY > 0 ? 1 : 0
      }}
    >
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        {/* Drag Handle for Mobile */}
        <div className="d-md-none w-100 d-flex justify-content-center pt-3 pb-1" style={{ cursor: 'grab' }}>
          <div style={{ width: '40px', height: '5px', backgroundColor: '#d1d5db', borderRadius: '4px' }}></div>
        </div>
        <style>{`
          .chatbot-modal-wrapper {
            bottom: 0;
            right: 0;
            width: 100%;
            height: 93dvh;
            max-height: 93dvh;
            border-radius: 1.5rem 1.5rem 0 0;
          }
          @media (min-width: 768px) {
            .chatbot-modal-wrapper {
              bottom: 80px;
              right: 20px;
              width: 380px;
              height: 600px;
              max-height: calc(100vh - 100px);
              border-radius: 1rem;
            }
          }
        `}</style>
        <div className="card-header px-3 pb-3 pt-2 pt-md-3 border-0 d-flex justify-content-between align-items-center bg-white">
          <div className="d-flex align-items-center">
            <h5 className="card-title m-0 fw-semibold" style={{ color: '#4a4a4a' }}>
              Morapi AI
            </h5>
          </div>
          <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
        </div>
      </div>
      
      <div className="card-body p-0 d-flex flex-column bg-white flex-grow-1 overflow-hidden">
        <div className="flex-grow-1 overflow-auto hide-scrollbar px-0 py-2 px-md-4 py-md-4 d-flex flex-column gap-3">
          {messages.map((msg) => (
            <div key={msg.id} className={clsx('d-flex flex-column', msg.role === 'user' ? 'align-items-end' : 'align-items-start')}>
              {msg.role === 'bot' && (
                <div className="d-flex align-items-center gap-2 mb-1" style={{ color: '#9ca3af' }}>
                  <Icon icon="robot" size={16} />
                  <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>Morapi AI</span>
                </div>
              )}
              
              <div
                className={clsx(
                  'px-3 py-2',
                  msg.role === 'user' ? 'text-white' : 'text-dark'
                )}
                style={{ 
                  maxWidth: '90%', 
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  backgroundColor: msg.role === 'user' ? '#1f1a17' : 'transparent',
                  borderRadius: msg.role === 'user' ? '1.25rem 1.25rem 0.25rem 1.25rem' : '0',
                  paddingLeft: msg.role === 'bot' ? '0' : undefined
                }}
              >
                {msg.content}
              </div>

              {msg.parsedData && msg.parsedData.map((tx, idx) => (
                <ReviewCard key={idx} tx={tx} createMutation={createMutation} onSaved={() => {
                    setMessages((prev) => [...prev, {
                        id: Date.now().toString(),
                        role: 'bot',
                        content: 'Transaksi berhasil disimpan! Menutup chatbot...'
                    }])
                    setTimeout(() => {
                      onClose()
                    }, 1500)
                }} />
              ))}
            </div>
          ))}
          
          {isPending && (
            <div className="d-flex flex-column align-items-start">
                <div className="d-flex align-items-center gap-2 mb-1" style={{ color: '#9ca3af' }}>
                  <Icon icon="robot" size={16} />
                  <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>Morapi AI</span>
                </div>
                <div className="px-3 py-2 d-flex gap-1">
                    <div className="typing-dot bg-secondary rounded-circle" style={{width: '6px', height: '6px', animation: 'typing 1s infinite 0.1s'}}></div>
                    <div className="typing-dot bg-secondary rounded-circle" style={{width: '6px', height: '6px', animation: 'typing 1s infinite 0.2s'}}></div>
                    <div className="typing-dot bg-secondary rounded-circle" style={{width: '6px', height: '6px', animation: 'typing 1s infinite 0.3s'}}></div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {previewImageUrl && (
        <div 
          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
          style={{ zIndex: 1060 }}
          onClick={() => setPreviewImageUrl(null)}
        >
          <div className="position-relative" style={{ maxWidth: '90%', maxHeight: '90%' }}>
            <button 
              className="btn btn-dark position-absolute rounded-circle p-1"
              style={{ top: '-15px', right: '-15px', zIndex: 1061 }}
              onClick={() => setPreviewImageUrl(null)}
            >
              <Icon icon="x" size={24} />
            </button>
            <img src={previewImageUrl} alt="Full preview" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }} />
          </div>
        </div>
      )}
      
      <div className="card-footer p-3 bg-white border-0 d-flex flex-column align-items-center position-relative">
        {uploadProgress !== null && (
          <div className="progress w-100 position-absolute" style={{ top: 0, left: 0, height: '3px', borderRadius: 0 }}>
            <div className="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
        
        {stagedFiles.length > 0 && (
          <div className="d-flex w-100 gap-2 mb-2 overflow-auto py-2 px-1">
            {stagedFiles.map((file, idx) => (
              <div key={idx} className="position-relative bg-white d-flex align-items-center justify-content-center border shadow-sm" style={{ width: '64px', height: '64px', minWidth: '64px', borderRadius: '14px' }}>
                <button 
                  className="btn btn-sm btn-icon rounded-circle btn-danger position-absolute d-flex justify-content-center align-items-center" 
                  style={{ top: '-8px', right: '-8px', width: '22px', height: '22px', padding: 0, zIndex: 10 }}
                  onClick={() => removeStagedFile(idx)}
                >
                  <Icon icon="x" size={12} stroke={2.5} />
                </button>
                {file.type === 'image' ? (
                  <img 
                    src={file.url} 
                    alt="preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit', cursor: 'pointer' }} 
                    onClick={() => setPreviewImageUrl(file.url)}
                  />
                ) : file.type === 'audio' ? (
                  <Icon icon="microphone" className="text-secondary" size={24} />
                ) : (
                  <Icon icon="file-description" className="text-secondary" size={24} />
                )}
              </div>
            ))}
          </div>
        )}

        {isRecording ? (
          <div className="d-flex w-100 bg-white rounded-4 p-2 align-items-center justify-content-between gap-3 border border-light-subtle shadow-sm" style={{ minHeight: '60px' }}>
            <button 
              className="bg-transparent text-danger p-0 m-0 border-0 flex-shrink-0 d-flex justify-content-center align-items-center ms-2" 
              onClick={() => {
                cancelRecording()
              }}
              style={{ width: '30px', height: '30px', outline: 'none' }}
            >
              <Icon icon="x" size={20} stroke={2} />
            </button>
            
            <div className="flex-grow-1 d-flex align-items-center justify-content-center overflow-hidden px-2">
              <canvas ref={canvasRef} width={200} height={30} className="w-100" />
            </div>
            
            <button 
              className="btn btn-icon rounded-circle p-0 m-0 border-0 flex-shrink-0 d-flex justify-content-center align-items-center me-1" 
              onClick={stopRecording}
              style={{ 
                backgroundColor: '#ff7e1d', 
                color: 'white', 
                width: '30px', 
                height: '30px', 
                minWidth: '30px',
                minHeight: '30px',
                aspectRatio: '1/1'
              }}
            >
              <Icon icon="check" size={18} stroke={2.5} />
            </button>
          </div>
        ) : (
          <div className="w-100 bg-white rounded-4 p-2 border border-light-subtle shadow-sm position-relative d-flex flex-column">
            <input 
              type="file" 
              ref={imageInputRef} 
              className="d-none" 
              multiple 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
            <input 
              type="file" 
              ref={docInputRef} 
              className="d-none" 
              multiple 
              accept="application/pdf,text/csv" 
              onChange={handleFileUpload} 
            />
            
            <AutosizeTextarea
              className="chatbot-input bg-transparent border-0 shadow-none px-2 py-1 m-0 text-dark w-100"
              placeholder="Ketik sesuatu..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ 
                resize: 'none', 
                maxHeight: '120px',
                fontSize: '0.95rem', 
                lineHeight: '1.4',
                outline: 'none',
                boxShadow: 'none'
              }}
              disabled={isPending}
            />
            
            <div className="d-flex justify-content-between align-items-center mt-2 px-1">
              <div className="position-relative">
                <button 
                  className="btn btn-icon btn-light rounded-circle p-0 m-0 border-0 flex-shrink-0 d-flex justify-content-center align-items-center" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  disabled={isPending} 
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
                        className="dropdown-item d-flex align-items-center gap-3 px-3 py-2 text-white w-100 border-0 bg-transparent text-start"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          imageInputRef.current?.click();
                        }}
                      >
                        <Icon icon="photo" size={18} className="text-light opacity-75" />
                        <span style={{ fontSize: '0.9rem' }}>Unggah Gambar</span>
                      </button>
                      <button 
                        className="dropdown-item d-flex align-items-center gap-3 px-3 py-2 text-white w-100 border-0 bg-transparent text-start"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          docInputRef.current?.click();
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
                  className="p-0 m-0 border-0 bg-transparent d-flex justify-content-center align-items-center flex-shrink-0"
                  style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px', outline: 'none', boxShadow: 'none' }}
                  onClick={startRecording}
                  disabled={isPending}
                  title="Rekam Suara"
                >
                  <Icon icon="microphone" size={22} className="text-secondary" />
                </button>

                <button
                  className="btn btn-icon rounded-circle p-0 m-0 border-0 d-flex justify-content-center align-items-center flex-shrink-0"
                  style={{ 
                    backgroundColor: (inputText.trim() || stagedFiles.length > 0) ? '#ff7e1d' : '#e5e7eb', 
                    color: (inputText.trim() || stagedFiles.length > 0) ? 'white' : '#9ca3af', 
                    width: '40px', 
                    height: '40px', 
                    minWidth: '40px',
                    minHeight: '40px',
                    aspectRatio: '1/1',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={handleSend}
                  disabled={(!inputText.trim() && stagedFiles.length === 0) || isPending}
                >
                  <Icon icon="arrow-up" size={18} stroke={2.5} />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="text-muted text-center w-100 mt-2" style={{ fontSize: '0.75rem' }}>
          Visata mungkin melakukan kesalahan. Harap verifikasi info
        </div>
      </div>
      
      <style>{`
        @keyframes typing {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scaleY(0.5); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  )
}

function ReviewCard({ tx, createMutation, onSaved }: { tx: any; createMutation: any; onSaved: () => void }) {
  const [formData, setFormData] = useState({ ...tx })
  const [isSaved, setIsSaved] = useState(false)

  const handleSubmit = async () => {
    try {
      await createMutation.mutateAsync({ ...formData, input_method: 'ai_chat' })
      setIsSaved(true)
      onSaved()
    } catch (error) {
      alert('Gagal menyimpan transaksi.')
    }
  }

  if (isSaved) {
    return (
      <div className="card mt-2 shadow-sm border-success w-100 rounded-4" style={{ maxWidth: '300px' }}>
        <div className="card-body p-2 text-center text-success">
          <Icon icon="check" className="me-1" /> Tersimpan
        </div>
      </div>
    )
  }

  return (
    <div className="card mt-2 shadow-sm w-100 border-light-subtle rounded-4" style={{ maxWidth: '300px' }}>
      <div className="card-body p-3">
        <div className="mb-2 text-start">
          <label className="text-secondary small fw-medium mb-1 d-block" style={{ fontSize: '0.85rem' }}>Tipe</label>
          <Select
            options={[
              { value: 'expense', label: 'Pengeluaran' },
              { value: 'income', label: 'Pemasukan' }
            ]}
            value={formData.type}
            onChange={(val) => setFormData({ ...formData, type: val as string })}
            className="form-control"
          />
        </div>
        <div className="mb-2 text-start">
          <label className="text-secondary small fw-medium mb-1 d-block" style={{ fontSize: '0.85rem' }}>Jumlah</label>
          <div className="input-group">
            <span className="input-group-text bg-light text-secondary border-end-0">Rp</span>
            <input
              type="number"
              className="form-control border-start-0 ps-0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        <div className="mb-2 text-start">
          <label className="text-secondary small fw-medium mb-1 d-block" style={{ fontSize: '0.85rem' }}>Merchant / Catatan</label>
          <input
            type="text"
            className="form-control"
            value={formData.merchant || formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, merchant: e.target.value, notes: e.target.value })}
          />
        </div>
        <div className="mb-3 text-start">
          <label className="text-secondary small fw-medium mb-1 d-block" style={{ fontSize: '0.85rem' }}>Tanggal</label>
          <Datepicker
            value={formData.tx_date}
            onChange={(val) => setFormData({ ...formData, tx_date: val })}
            layout="icon"
            className="form-control"
          />
        </div>
        <Button
          text={createMutation.isPending ? 'Menyimpan...' : 'Simpan Transaksi'}
          color="primary"
          className="w-100 rounded-3"
          onClick={handleSubmit}
          loading={createMutation.isPending}
          disabled={createMutation.isPending}
        />
      </div>
    </div>
  )
}
