import { type FC, useEffect, useState, useRef, useCallback } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { useNavigate } from '@tanstack/react-router'
import { useTransactionModalStore } from '../store/useTransactionModalStore'

const TRACKER_METHODS = [
  { id: 'manual', label: 'Manual', icon: 'pencil', bgColor: '#f76707' },
  { id: 'text', label: 'Text', icon: 'message-2', bgColor: '#4299e1', path: '/tracker/text' },
  { id: 'scan', label: 'Scan', icon: 'scan', bgColor: '#206bc4', path: '/tracker/photo' },
  { id: 'image', label: 'Photo', icon: 'photo', bgColor: '#2fb344', path: '/tracker/image' },
  {
    id: 'file',
    label: 'File',
    icon: 'file-description',
    bgColor: '#d63939',
    path: '/tracker/file',
  },
  { id: 'audio', label: 'Voice', icon: 'microphone', bgColor: '#f59f00', path: '/tracker/audio' },
]

export const DesktopRadialMenu: FC = () => {
  const { isMethodModalOpen, closeMethodModal, openForm } = useTransactionModalStore()
  const [activeId, setActiveId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const closeButtonRef = useRef<HTMLDivElement>(null)
  const activeIdRef = useRef<string | null>(null)
  const navigate = useNavigate()

  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isMethodModalOpen) {
      const timer = setTimeout(() => {
        setIsAnimating(true)
      }, 10)
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
      activeIdRef.current = null
      setActiveId(null)
    }
  }, [isMethodModalOpen])

  const handleAction = useCallback(
    (methodId: string) => {
      if (methodId === 'close' || !methodId) {
        closeMethodModal()
        return
      }

      const method = TRACKER_METHODS.find((m) => m.id === methodId)
      if (!method) {
        closeMethodModal()
        return
      }

      if (method.id === 'manual') {
        openForm()
      } else if (method.path) {
        navigate({ to: method.path })
      }
      closeMethodModal()
    },
    [openForm, closeMethodModal, navigate]
  )

  useEffect(() => {
    const detectIdAtPoint = (x: number, y: number) => {
      if (closeButtonRef.current) {
        const rect = closeButtonRef.current.getBoundingClientRect()
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          return 'close'
        }
      }

      for (const id in buttonRefs.current) {
        const ref = buttonRefs.current[id]
        if (ref) {
          const rect = ref.getBoundingClientRect()
          const buffer = 20
          if (
            x >= rect.left - buffer &&
            x <= rect.right + buffer &&
            y >= rect.top - buffer &&
            y <= rect.bottom + buffer
          ) {
            return id
          }
        }
      }
      return null
    }

    const onPointerMove = (e: PointerEvent) => {
      const foundId = detectIdAtPoint(e.clientX, e.clientY)
      if (foundId !== activeIdRef.current) {
        activeIdRef.current = foundId
        setActiveId(foundId)
        if (foundId && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(10)
        }
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      if (isMethodModalOpen) {
        const x = e.clientX
        const y = e.clientY
        const finalId = detectIdAtPoint(x, y)
        handleAction(finalId || activeIdRef.current || 'close')
      }
    }

    if (isMethodModalOpen) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('pointerup', onPointerUp, { capture: true })
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp, { capture: true })
    }
  }, [isMethodModalOpen, handleAction])

  const shouldDisplay = isMethodModalOpen || isAnimating

  return (
    <div
      className="fixed-top w-100 h-100 align-items-center justify-content-center d-none d-md-flex"
      style={{
        zIndex: 2000,
        pointerEvents: isMethodModalOpen ? 'auto' : 'none',
        display: shouldDisplay ? undefined : 'none',
        backgroundColor: isAnimating ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0)',
        opacity: isAnimating ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        touchAction: 'none',
      }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) closeMethodModal()
      }}
    >
      <div
        ref={containerRef}
        className="position-absolute w-100 h-100"
        style={{ bottom: 0, right: 0 }}
      >
        <div
          className="position-absolute"
          style={{ width: '400px', height: '400px', bottom: 0, right: 0 }}
        >
          {TRACKER_METHODS.map((method, index) => {
            const total = TRACKER_METHODS.length

            const step = 80
            const offset = 85

            const x = -(offset + index * step)
            const y = 0

            const isActive = activeId === method.id
            const delay = isAnimating ? index * 15 : (total - index) * 5

            return (
              <div
                key={method.id}
                ref={(el) => { buttonRefs.current[method.id] = el }}
                className="position-absolute d-flex align-items-center justify-content-center"
                style={{
                  right: `calc(38px - ${x}px)`,
                  bottom: `calc(38px + ${y}px)`,
                  transitionDelay: `${delay}ms`,
                  zIndex: isActive ? 10 : 1,
                  width: '60px',
                  height: '60px',
                  cursor: 'pointer',
                  transform: isAnimating ? 'scale(1)' : 'scale(0)',
                  opacity: isAnimating ? 1 : 0,
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none',
                }}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  setActiveId(method.id)
                  activeIdRef.current = method.id
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction(method.id)
                }}
              >
                <div
                  className="rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: isActive ? method.bgColor : 'var(--tblr-bg-surface)',
                    cursor: 'pointer',
                    boxShadow: isActive
                      ? `0 8px 16px ${method.bgColor}44`
                      : '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <Icon
                    icon={method.icon}
                    size={28}
                    stroke={2.5}
                    style={{ color: isActive ? '#fff' : method.bgColor }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div
          ref={closeButtonRef}
          className="position-absolute p-0"
          style={{
            width: '72px',
            height: '72px',
            bottom: '32px',
            right: '32px',
            borderRadius: '50%',
            boxShadow: 'none',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: activeId === 'close' ? '#d9480f' : '#f76707',
            color: 'white',
            cursor: 'pointer',
            border: 'none',
            zIndex: 2001,
            lineHeight: 1,
            transform: isAnimating ? 'scale(1) rotate(45deg)' : 'scale(0.5) rotate(0deg)',
            opacity: isAnimating ? 1 : 0,
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ width: '100%', height: '100%' }}
          >
            <Icon icon="plus" size={32} stroke={3} />
          </div>
        </div>
      </div>
    </div>
  )
}
