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
  const [shouldRender, setShouldRender] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isMethodModalOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
        setActiveId(null);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isMethodModalOpen]);

  const handleAction = useCallback((methodId: string) => {
    const method = TRACKER_METHODS.find(m => m.id === methodId);
    if (!method) return;

    if (method.id === 'manual') {
      openForm();
    } else if (method.path) {
      navigate({ to: method.path });
    }
    closeMethodModal();
  }, [openForm, closeMethodModal, navigate]);

  useEffect(() => {
    const onGlobalPointerMove = (e: PointerEvent) => {
      if (!isMethodModalOpen) return;
      
      const { clientX: x, clientY: y } = e;
      
      let foundId: string | null = null;
      for (const id in buttonRefs.current) {
        const ref = buttonRefs.current[id];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const buffer = 20;
          if (
            x >= rect.left - buffer &&
            x <= rect.right + buffer &&
            y >= rect.top - buffer &&
            y <= rect.bottom + buffer
          ) {
            foundId = id;
            break;
          }
        }
      }
      
      if (foundId !== activeId) {
        setActiveId(foundId);
        if (foundId && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(12);
        }
      }
    };

    const onGlobalPointerUp = () => {
      if (activeId && isMethodModalOpen) {
        handleAction(activeId);
      }
    };

    if (isMethodModalOpen) {
      window.addEventListener('pointermove', onGlobalPointerMove);
      window.addEventListener('pointerup', onGlobalPointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', onGlobalPointerMove);
      window.removeEventListener('pointerup', onGlobalPointerUp);
    };
  }, [isMethodModalOpen, activeId, handleAction]);

  if (!shouldRender) return null;

  return (
    <div 
      className={clsx(
        "fixed-top w-100 h-100 transition-all d-flex align-items-center justify-content-center",
        isMethodModalOpen ? "opacity-100" : "opacity-0"
      )}
      style={{ 
        zIndex: 2000, 
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px) saturate(180%)',
        pointerEvents: isMethodModalOpen ? 'auto' : 'none'
      }}
      onClick={closeMethodModal}
    >
      <div 
        ref={containerRef}
        className="position-relative w-100 h-100 d-flex align-items-end justify-content-center pb-5 mb-5"
      >
        <div className="radial-menu-container position-relative" style={{ width: '280px', height: '280px' }}>
          {TRACKER_METHODS.map((method, index) => {
            const total = TRACKER_METHODS.length;
            const angle = (Math.PI / (total - 1)) * index;
            const radius = 120; // More compact radius
            
            const x = -Math.cos(angle) * radius;
            const y = -Math.sin(angle) * radius;

            const isActive = activeId === method.id;
            const delay = index * 15;

            return (
              <div
                key={method.id}
                ref={el => buttonRefs.current[method.id] = el}
                className={clsx(
                  "position-absolute transition-all d-flex align-items-center justify-content-center",
                  isMethodModalOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
                style={{
                  left: `calc(50% + ${x}px - 30px)`,
                  bottom: `calc(15px - ${y}px)`,
                  transitionDelay: `${isMethodModalOpen ? delay : (total - index) * 10}ms`,
                  transitionDuration: '300ms',
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                  zIndex: isActive ? 10 : 1,
                  width: '60px',
                  height: '60px'
                }}
              >
                <div
                  className={clsx(
                    "rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center transition-all"
                  )}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: isActive ? method.bgColor : '#ffffff',
                    cursor: 'pointer',
                    boxShadow: isActive ? `0 8px 16px ${method.bgColor}44` : '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(method.id);
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
          className="rounded-circle shadow-lg position-absolute p-0"
          style={{ 
            width: '60px', 
            height: '60px', 
            bottom: '24px', 
            display: 'grid',
            placeItems: 'center',
            transform: isMethodModalOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            backgroundColor: '#f76707',
            color: 'white',
            cursor: 'pointer',
            border: 'none',
            zIndex: 2001,
            lineHeight: 1
          }}
          onClick={(e) => {
            e.stopPropagation();
            closeMethodModal();
          }}
        >
          <div className="d-flex align-items-center justify-content-center" style={{ width: '100%', height: '100%' }}>
            <Icon icon="plus" size={32} stroke={3} />
          </div>
        </div>
      </div>

      <style>{`
        .scale-100 { transform: scale(1); }
        .scale-0 { transform: scale(0); }
        .scale-125 { 
          transform: scale(1.25);
          box-shadow: 0 15px 30px rgba(0,0,0,0.3) !important;
        }
      `}</style>
    </div>
  );
};
