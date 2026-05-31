import React, { type ReactNode } from 'react'
import { Icon } from '../ui/Icon'

interface BaseProps {
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
}

export const Card: React.FC<BaseProps & { as?: React.ElementType; [key: string]: unknown }> = ({
  children,
  className,
  as: Component = 'div',
  ...props
}) => (
  <Component className={`card${className ? ` ${className}` : ''}`} {...props}>
    {children}
  </Component>
)

export const CardGroup: React.FC<BaseProps> = ({ children, className }) => (
  <div className={`card-group${className ? ` ${className}` : ''}`}>{children}</div>
)

interface CardHeaderProps extends BaseProps {
  light?: boolean
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className, light }) => (
  <div
    className={`card-header${light ? ' card-header-light' : ''}${className ? ` ${className}` : ''}`}
  >
    {children}
  </div>
)

export const CardBody: React.FC<BaseProps> = ({ children, className }) => (
  <div className={`card-body${className ? ` ${className}` : ''}`}>{children}</div>
)

interface CardFooterProps extends BaseProps {
  transparent?: boolean
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className, transparent }) => (
  <div
    className={`card-footer${transparent ? ' card-footer-transparent' : ''}${className ? ` ${className}` : ''}`}
  >
    {children}
  </div>
)

interface CardTitleProps extends BaseProps {
  subtitle?: ReactNode
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className, subtitle }) => (
  <h3 className={`card-title${className ? ` ${className}` : ''}`}>
    {children}
    {subtitle && (
      <>
        {' '}
        <span className="card-subtitle">{subtitle}</span>
      </>
    )}
  </h3>
)

interface CardImageProps extends BaseProps {
  src: string
  alt?: string
  position?: 'top' | 'bottom' | 'start' | 'end'
}

export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt = '',
  position = 'top',
  className,
}) => (
  <img src={src} alt={alt} className={`card-img-${position}${className ? ` ${className}` : ''}`} />
)

interface CardRibbonProps extends BaseProps {
  color?: string
  position?: 'top' | 'start' | 'end' | 'bottom'
  bookmark?: boolean
}

export const CardRibbonText: React.FC<CardRibbonProps> = ({
  children,
  color = 'primary',
  position = 'end',
  bookmark,
  className,
}) => {
  const classes = [
    'ribbon',
    `bg-${color}`,
    position === 'start' ? 'ribbon-start' : '',
    position === 'top' ? 'ribbon-top' : '',
    position === 'bottom' ? 'ribbon-bottom' : '',
    bookmark ? 'ribbon-bookmark' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}

export const CardRibbonTop: React.FC<CardRibbonProps> = (props) => (
  <CardRibbonText {...props} position="top" />
)

interface CardTabsProps extends BaseProps {
  bottom?: boolean
}

export const CardTabs: React.FC<CardTabsProps> = ({ children, className, bottom }) => (
  <div
    className={`card-tabs${bottom ? ' card-tabs-bottom' : ''}${className ? ` ${className}` : ''}`}
  >
    {children}
  </div>
)

interface CardBackgroundIconProps extends BaseProps {
  icon: React.ReactNode
}

export const CardBackgroundIcon: React.FC<CardBackgroundIconProps> = ({
  icon,
  children,
  className,
}) => (
  <div className={`card card-background-icon${className ? ` ${className}` : ''}`}>
    <div className="card-body">
      {icon && <div className="card-background-icon-svg">{icon}</div>}
      {children}
    </div>
  </div>
)

interface CardStatusProps {
  position?: 'top' | 'bottom' | 'start'
  color?: string
}

export const CardStatus: React.FC<CardStatusProps> = ({ position = 'top', color = 'primary' }) => (
  <div className={`card-status-${position} bg-${color}`} />
)

interface CardStampProps extends BaseProps {
  color?: string
  icon: string
  iconClass?: string
}

export const CardStamp: React.FC<CardStampProps> = ({
  color = 'yellow',
  icon,
  className,
  iconClass,
  style,
}) => (
  <div className={`card-stamp${className ? ` ${className}` : ''}`} style={style}>
    <div className={`card-stamp-icon ${iconClass || `bg-${color}`}`}>
      <Icon icon={icon} />
    </div>
  </div>
)

interface CardProgressProps {
  value: number
  color?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

export const CardProgress: React.FC<CardProgressProps> = ({
  value,
  color = 'primary',
  size = 'sm',
}) => (
  <div className={`progress card-progress progress-${size}`}>
    <div className={`progress-bar bg-${color}`} style={{ width: `${value}%` }} />
  </div>
)
