import { type FC, useEffect, useState, useRef, useCallback } from 'react';
import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';
import { useNavigate } from '@tanstack/react-router';
import { useTransactionModalStore } from '../store/useTransactionModalStore';

const TRACKER_METHODS = [
  { id: 'manual', label: 'Manual', icon: 'pencil', bgColor: '#f76707' },
  { id: 'text', label: 'Text', icon: 'message-2', bgColor: '#206bc4', path: '/tracker/text' },
  { id: 'scan', label: 'Scan', icon: 'scan', bgColor: '#206bc4', path: '/tracker/photo' },
  { id: 'image', label: 'Photo', icon: 'photo', bgColor: '#2fb344', path: '/tracker/image' },
  { id: 'file', label: 'File', icon: 'file-description', bgColor: '#d63939', path: '/tracker/file' },
  { id: 'audio', label: 'Voice', icon: 'microphone', bgColor: '#f59f00', path: '/tracker/audio' },
];

export const RadialTransactionMenu: FC = () => {
  const { isMethodModalOpen, closeMethodModal, openForm } = useTransactionModalStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const closeButtonRef = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef<string | null>(null);
  const navigate = useNavigate();

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isMethodModalOpen) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      activeIdRef.current = null;
      setActiveId(null);
    }
  }, [isMethodModalOpen]);

  const handleAction = useCallback((methodId: string) => {
    if (methodId === 'close' || !methodId) {
      closeMethodModal();
      return;
    }
    
    const method = TRACKER_METHODS.find(m => m.id === methodId);
    if (!method) {
      closeMethodModal();
      return;
    }

    if (method.id === 'manual') {
      openForm();
    } else if (method.path) {
      navigate({ to: method.path });
    }
    closeMethodModal();
  }, [openForm, closeMethodModal, navigate]);

  useEffect(() => {
    const detectIdAtPoint = (x: number, y: number) => {
      if (closeButtonRef.current) {
        const rect = closeButtonRef.current.getBoundingClientRect();
        const buffer = 40;
        if (x >= rect.left - buffer && x <= rect.right + buffer && y >= rect.top - buffer && y <= rect.bottom + buffer) {
          return 'close';
        }
      }

      for (const id in buttonRefs.current) {
        const ref = buttonRefs.current[id];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const buffer = 20;
          if (x >= rect.left - buffer && x <= rect.right + buffer && y >= rect.top - buffer && y <= rect.bottom + buffer) {
            return id;
          }
        }
      }
      return null;
    };

    const onPointerMove = (e: PointerEvent) => {
      const foundId = detectIdAtPoint(e.clientX, e.clientY);
      if (foundId !== activeIdRef.current) {
        activeIdRef.current = foundId;
        setActiveId(foundId);
        if (foundId && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(10);
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isMethodModalOpen) {
        const x = e.clientX;
        const y = e.clientY;
        const finalId = detectIdAtPoint(x, y);
        handleAction(finalId || activeIdRef.current || 'close');
      }
    };

    if (isMethodModalOpen) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerup', onPointerUp, { capture: true });
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp, { capture: true });
    };
  }, [isMethodModalOpen, handleAction]);

  const shouldDisplay = isMethodModalOpen || isAnimating;

  return (
    <div 
      className={clsx(
        "fixed-top w-100 h-100 d-flex align-items-center justify-content-center radial-menu-backdrop",
        isAnimating ? "active" : ""
      )}
      style={{ 
        zIndex: 2000, 
        pointerEvents: isMethodModalOpen ? 'auto' : 'none',
        display: shouldDisplay ? 'flex' : 'none'
      }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) closeMethodModal();
      }}
    >
      <div 
        ref={containerRef}
        className="position-relative w-100 h-100 d-flex align-items-end justify-content-center pb-5 mb-5"
      >
        <div className="radial-menu-container position-relative" style={{ width: '280px', height: '280px' }}>
          {TRACKER_METHODS.map((method, index) => {
            const total = TRACKER_METHODS.length;
            const angle = (Math.PI / (total - 1)) * index;
            const radius = 120;
            const x = -Math.cos(angle) * radius;
            const y = -Math.sin(angle) * radius;
            const isActive = activeId === method.id;
            const delay = isAnimating ? index * 15 : (total - index) * 5;

            return (
              <div
                key={method.id}
                ref={el => buttonRefs.current[method.id] = el}
                className={clsx(
                  "position-absolute d-flex align-items-center justify-content-center radial-menu-item",
                  isAnimating ? "active" : ""
                )}
                style={{
                  left: `calc(50% + ${x}px - 30px)`,
                  bottom: `calc(15px - ${y}px)`,
                  transitionDelay: `${delay}ms`,
                  zIndex: isActive ? 10 : 1,
                  width: '60px',
                  height: '60px'
                }}
              >
                <div
                  className="rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center transition-all"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: isActive ? method.bgColor : '#ffffff',
                    cursor: 'pointer',
                    boxShadow: isActive ? `0 8px 16px ${method.bgColor}44` : '0 4px 12px rgba(0,0,0,0.1)'
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
            );
          })}
        </div>

        <div 
          ref={closeButtonRef}
          className={clsx(
            "rounded-circle shadow-lg position-absolute p-0 radial-menu-close",
            isAnimating ? "active" : ""
          )}
          style={{ 
            width: '60px', 
            height: '60px', 
            bottom: '24px', 
            display: 'grid',
            placeItems: 'center',
            backgroundColor: activeId === 'close' ? '#d9480f' : '#f76707',
            color: 'white',
            cursor: 'pointer',
            border: 'none',
            zIndex: 2001,
            lineHeight: 1
          }}
        >
          <div className="d-flex align-items-center justify-content-center" style={{ width: '100%', height: '100%' }}>
            <Icon icon="plus" size={32} stroke={3} />
          </div>
        </div>
      </div>

      <style>{`
        .radial-menu-backdrop {
          background-color: rgba(0, 0, 0, 0);
          backdrop-filter: blur(0px) saturate(100%);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
        }
        .radial-menu-backdrop.active {
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px) saturate(180%);
          opacity: 1;
        }
        .radial-menu-item {
          transform: scale(0) translateY(40px);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .radial-menu-item.active {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
        .radial-menu-close {
          transform: scale(0) rotate(0deg);
          opacity: 0;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .radial-menu-close.active {
          transform: scale(1) rotate(45deg);
          opacity: 1;
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
        
        /* Disable browser focus outlines (the "blue bug") and tap highlights */
        .radial-menu-item, .radial-menu-close, .radial-menu-item *, .radial-menu-close * {
          outline: none !important;
          -webkit-tap-highlight-color: transparent !important;
          user-select: none !important;
        }
      `}</style>
    </div>
  );
};
