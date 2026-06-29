import React from 'react'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { Icon } from '@/shared/components/ui/Icon'

interface GoalCardProps {
  goal: {
    id: string
    name: string
    target: number
    saved: number
    eta: string
    monthlyDeposit: number
    icon: string
    color: string
    imageUrl?: string
  }
  onClick?: () => void
}

export function GoalCard({ goal, onClick }: GoalCardProps) {
  const percentage = Math.round((goal.saved / goal.target) * 100)
  const themeColor = goal.color || '#f59f00'

  return (
    <div
      className="card shadow-none border transition-all h-100 overflow-hidden position-relative"
      onClick={onClick}
      style={{
        borderRadius: '12px',
        minHeight: '260px',
        cursor: 'pointer',
        background: '#ffffff',
      }}
    >
      <div 
        className="position-absolute" 
        style={{ 
          top: '-15px', 
          right: '-20px', 
          opacity: 0.06, 
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'rotate(-10deg)'
        }}
      >
        <Icon 
          icon={goal.icon as string} 
          style={{ width: '150px', height: '150px', color: themeColor }} 
        />
      </div>

      <div className="card-body p-4 d-flex flex-column justify-content-between h-100 position-relative z-1">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              background: themeColor,
              width: '44px',
              height: '44px',
              borderRadius: '12px',
            }}
          >
            <Icon icon={goal.icon as string} size="md" className="text-white" stroke={1.5} />
          </div>
          <div
            className="py-1 px-3 rounded-pill fw-bold"
            style={{
              background: '#f8f9fa',
              color: '#495057',
              fontSize: '11px',
              border: '1px solid #e9ecef',
            }}
          >
            {goal.eta}
          </div>
        </div>

        <div>
          <h3 className="fw-bold mb-1 text-dark" style={{ fontSize: '18px' }}>
            {goal.name}
          </h3>
          <div className="d-flex align-items-baseline gap-2 mb-4">
            <span className="fw-bold" style={{ fontSize: '20px', color: themeColor }}>
              {formatCurrency(goal.saved)}
            </span>
            <span className="small text-muted" style={{ fontSize: '12px' }}>
              / {formatCurrency(goal.target)}
            </span>
          </div>

          <div className="progress-container">
            <div className="d-flex justify-content-between mb-2 small fw-bold">
              <span className="text-secondary">Progress</span>
              <span style={{ color: themeColor }}>{percentage}%</span>
            </div>
            <div
              className="progress"
              style={{
                height: '8px',
                backgroundColor: '#f1f3f5',
                borderRadius: '10px',
              }}
            >
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: themeColor,
                  borderRadius: '10px',
                  transition: 'width 1s ease-in-out',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
