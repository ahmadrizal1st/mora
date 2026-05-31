import { useRef } from 'react'
import { Icon } from './Icon'

interface AvatarUploadProps {
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  onChange?: (file: File) => void
  src?: string
}

export function AvatarUpload({ size, className, onChange, src }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const classes = [
    'avatar',
    !src ? 'avatar-upload' : 'border-0',
    size ? `avatar-${size}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onChange) {
      onChange(file)
    }
  }

  return (
    <div className="position-relative d-inline-block">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="d-none"
        accept="image/*"
      />
      <a
        href="#"
        className={classes}
        onClick={handleClick}
        style={src ? { backgroundImage: `url(${src})`, backgroundSize: 'cover' } : {}}
      >
        {!src && <Icon icon="plus" />}
      </a>
    </div>
  )
}
