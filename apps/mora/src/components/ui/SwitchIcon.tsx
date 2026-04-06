import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { Icon } from './Icon'

export interface SwitchIconProps {
  icon?: string
  iconB?: string
  colorA?: string
  colorB?: string
  iconBClass?: string
  variant?: string
  active?: boolean
  className?: string
  onClick?: () => void
}

export function SwitchIcon({
  icon = 'heart',
  iconB,
  colorA = 'muted',
  colorB = 'red',
  iconBClass,
  variant,
  active: initialActive = false,
  className,
  onClick,
}: SwitchIconProps) {
  const [isActive, setIsActive] = useState(initialActive)

  useEffect(() => {
    setIsActive(initialActive)
  }, [initialActive])

  const handleClick = () => {
    setIsActive(!isActive)
    onClick?.()
  }

  const resolvedIconB = iconB ?? icon
  const isFilled = icon === 'star' || icon === 'heart'
  const filledClass = isFilled ? 'icon-filled' : iconBClass

  const btnClass = clsx(
    'switch-icon',
    variant && `switch-icon-${variant}`,
    isActive && 'active',
    className
  )

  return (
    <button
      className={btnClass}
      data-bs-toggle="switch-icon"
      onClick={handleClick}
      type="button"
    >
      <span className={clsx('switch-icon-a', `text-${colorA}`)}>
        <Icon icon={icon} />
      </span>
      <span className={clsx('switch-icon-b', `text-${colorB}`)}>
        <Icon 
          icon={resolvedIconB} 
          className={filledClass} 
          filled={isFilled}
        />
      </span>
    </button>
  )
}
