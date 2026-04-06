// src/components/cards/CoinestCard.tsx
import { useState } from 'react';
import { Icon } from '../ui/Icon';

interface CoinestCardProps {
  balance?: string;
  name?: string;
}

export function CoinestCard({
  balance = '$12,540,000',
  name = 'Oliver Bennet',
}: CoinestCardProps) {
  const [visible, setVisible] = useState(true);

  const blobStyles: React.CSSProperties[] = [
    { width: 220, height: 220, background: 'rgba(255,255,255,0.15)', top: -60, left: -40 },
    { width: 180, height: 180, background: 'rgba(0,0,0,0.12)', top: 20, right: -50 },
    { width: 160, height: 160, background: 'rgba(255,255,255,0.10)', bottom: -40, left: 40 },
    { width: 140, height: 140, background: 'rgba(0,0,0,0.08)', bottom: 20, right: 30 },
  ];

  return (
    <div
      className="card text-white border-0 overflow-hidden shadow-sm"
      style={{
        width: '100%',
        background: 'var(--tblr-primary)',
        position: 'relative',
      }}
    >
      {/* Mesh background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {blobStyles.map((style, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              filter: 'blur(45px)',
              ...style,
            }}
          />
        ))}
        {/* Diagonal shimmer */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: -80,
            width: 300,
            height: 180,
            background: 'rgba(255,255,255,0.04)',
            transform: 'rotate(-30deg)',
            borderRadius: 'calc(var(--tblr-border-radius) * 4)',
          }}
        />
        {/* Bottom-right gloss */}
        <div
          style={{
            position: 'absolute',
            bottom: -30,
            right: -30,
            width: 160,
            height: 160,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '50%',
            filter: 'blur(20px)',
          }}
        />
      </div>

      {/* Content */}
      <div className="card-body p-3" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <div>
            <div style={{ fontSize: '0.6rem', opacity: 0.6, lineHeight: 1, marginBottom: 2 }}>
              Good Day!
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.01em' }}>
              {name}
            </div>
          </div>
        </div>

        {/* Balance */}
        <div>
          <div className="d-flex align-items-center mb-1" style={{ gap: 6 }}>
            <span style={{ fontSize: '0.6rem', opacity: 0.6, letterSpacing: '0.3px' }}>
              Account Balance
            </span>
            <button
              onClick={() => setVisible(v => !v)}
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <Icon
                icon={visible ? 'eye' : 'eye-off'}
                style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.8)' }}
              />
            </button>
          </div>

          <div
            className="text-mobile-lg"
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
              opacity: visible ? 1 : 0.4,
              transition: 'opacity 0.25s ease',
            }}
          >
            {visible ? balance : '$ ••• ••• •••'}
          </div>
        </div>

      </div>
    </div>
  );
}