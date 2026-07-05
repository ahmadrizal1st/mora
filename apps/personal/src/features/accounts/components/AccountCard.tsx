import { clsx } from 'clsx'
import { Icon } from '@/shared/components/ui/Icon'
import { getAccountVisualMeta, getContrastYIQ } from '@/shared/utils/accountVisuals'

interface AccountCardProps {
  isActive?: boolean
  type: string
  name: string
  balance: string
  delta: string
  chgPos?: boolean
  logo?: string
  color?: string
  onClick: () => void
}

export function AccountCard({
  isActive,
  type,
  name,
  balance,
  delta,
  chgPos,
  logo,
  color,
  onClick,
}: AccountCardProps) {
  const { icon, isBank, isCash, isInvest, logo: resolvedLogo, color: resolvedColor } = getAccountVisualMeta(type, color, logo)
  
  const isHex = resolvedColor?.startsWith('#')
  const textColor = isHex ? getContrastYIQ(resolvedColor!) : 'white'

  const badgeStyle = { 
    width: '26px', 
    height: '26px', 
    color: textColor,
    backgroundColor: isHex ? resolvedColor : undefined,
  }

  return (
    <div
      className={clsx(
        'card cursor-pointer transition-all h-100',
        isActive ? 'border-primary shadow-sm' : 'border-transparent shadow-sm'
      )}
      style={{
        minWidth: '220px',
        backgroundColor: isActive ? 'var(--tblr-primary-lt)' : undefined,
      }}
      onClick={onClick}
    >
      <div className="card-body p-3 d-flex flex-column h-100">
        <div className="d-flex align-items-center justify-content-between mb-3">
          {resolvedLogo ? (
            <img
              src={resolvedLogo}
              alt={type}
              style={{
                width: '48px',
                height: '28px',
                objectFit: 'contain',
                objectPosition: 'left',
              }}
            />
          ) : (
            <div
              className={clsx(
                'd-flex align-items-center justify-content-center shadow-sm',
                !isHex && resolvedColor ? `bg-${resolvedColor}` : !isHex ? 'bg-primary' : ''
              )}
              style={{ 
                borderRadius: '10px', 
                width: '32px', 
                height: '32px',
                color: textColor,
                backgroundColor: isHex ? resolvedColor : undefined
              }}
            >
              <Icon icon={isBank ? 'building-bank' : 'wallet'} size="sm" />
            </div>
          )}
          <span
            className={clsx(
              'badge d-flex align-items-center justify-content-center rounded-circle p-1 shadow-sm',
              !isHex && resolvedColor ? `bg-${resolvedColor}` : !isHex ? 'bg-primary' : ''
            )}
            style={badgeStyle}
          >
            <Icon icon={icon} size={14} />
          </span>
        </div>
        <div className="fw-bold text-body text-truncate mb-0">{name}</div>
        <div className="text-secondary small mb-3">{type}</div>
        <div className="mt-auto">
          <div className="h2 fw-bold mb-1">{balance}</div>
          <div
            className={clsx(
              'small fw-medium d-flex align-items-center gap-1',
              chgPos ? 'text-success' : 'text-danger'
            )}
          >
            <Icon icon={chgPos ? 'trending-up' : 'trending-down'} size="xxs" />
            {delta} bulan ini
          </div>
        </div>
      </div>
    </div>
  )
}
