import { clsx } from 'clsx'

export interface IllustrationProps {
  image: string
  height?: number
  alt?: string
  className?: string
}

export function Illustration({
  image,
  height = 128,
  alt = '',
  className,
}: IllustrationProps) {
  const name = image.replace(/\.svg$/, '')
  const theme = document.documentElement.getAttribute('data-bs-theme') || 'light'

  return (
    <img
      src={`/static/illustrations/${theme}/${name}.png`}
      className={clsx('img', className)}
      style={{ height, width: 'auto' }}
      alt={alt}
      loading="lazy"
    />
  )
}
