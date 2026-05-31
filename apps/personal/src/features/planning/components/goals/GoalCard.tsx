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
  const [imgError, setImgError] = React.useState(false)
  const percentage = Math.round((goal.saved / goal.target) * 100)

  return (
    <div
      className="card border-0 transition-all overflow-hidden h-100 hover-scale-up"
      onClick={onClick}
      style={{ borderRadius: '16px', minHeight: '300px', cursor: 'pointer', position: 'relative' }}
    >
      <div className="position-absolute top-0 start-0 w-100 h-100">
        {goal.imageUrl && !imgError ? (
          <img
            src={goal.imageUrl}
            className="w-100 h-100 object-fit-cover"
            alt={goal.name}
            style={{ transition: 'transform 0.6s ease' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-100 h-100"
            style={{ background: `linear-gradient(135deg, #ff6b00 0%, #ff8c3b 100%)` }}
          ></div>
        )}

        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.85) 100%)',
          }}
        ></div>
      </div>

      <div
        className="card-body p-4 d-flex flex-column justify-content-between position-relative h-100"
        style={{ zIndex: 2 }}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div
            className="p-2 rounded-circle d-flex align-items-center justify-content-center"
            style={{
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(10px)',
              width: '40px',
              height: '40px',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <Icon icon={goal.icon as string} size="sm" className="text-white" />
          </div>
          <div
            className="py-1 px-3 rounded-pill text-white fw-bold shadow-none"
            style={{
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)',
              fontSize: '10px',
              border: '1px solid rgba(255,255,255,0.2)',
              letterSpacing: '0.05em',
            }}
          >
            {goal.eta}
          </div>
        </div>

        <div className="text-white">
          <h3 className="fw-bold mb-1 fs-2 text-white">{goal.name}</h3>
          <div className="d-flex align-items-baseline gap-2 mb-3">
            <span className="fs-3 fw-bold text-white">{formatCurrency(goal.saved)}</span>
            <span className="small opacity-75" style={{ fontSize: '11px' }}>
              / {formatCurrency(goal.target)}
            </span>
          </div>

          <div className="progress-container">
            <div className="d-flex justify-content-between mb-2 small fw-bold">
              <span className="opacity-75">Progress</span>
              <span>{percentage}%</span>
            </div>
            <div
              className="progress overflow-visible"
              style={{
                height: '6px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '10px',
              }}
            >
              <div
                className="progress-bar bg-white"
                role="progressbar"
                style={{
                  width: `${percentage}%`,
                  borderRadius: '10px',
                  boxShadow: '0 0 15px rgba(255,255,255,0.3)',
                  transition: 'width 1s ease-in-out',
                }}
              ></div>
            </div>
          </div>

          {goal.monthlyDeposit && (
            <div className="mt-3 pt-3 border-top border-white-subtle">
              <div className="d-flex align-items-center gap-2">
                <Icon icon="bulb" size="xs" className="text-warning" />
                <span className="small fw-medium opacity-90" style={{ fontSize: '11px' }}>
                  Saran: {formatCurrency(goal.monthlyDeposit)}/bln
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
