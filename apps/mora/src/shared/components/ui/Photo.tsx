import { clsx } from 'clsx'
import photosData from '../../data/photos.json'
import { Svg } from './Svg'

export interface PhotoProps {
  id?: number
  horizontal?: boolean
  src?: string
  alt?: string
  background?: boolean
  ratio?: string
  className?: string
  width?: number
  height?: number
}

export function Photo({
  id,
  horizontal,
  src: srcProp,
  alt: altProp,
  background,
  ratio,
  className,
  width,
  height,
}: PhotoProps) {
  let finalSrc = srcProp
  let finalAlt = altProp

  if (id !== undefined) {
    let photos = photosData as any[]
    if (horizontal) {
      photos = photos.filter((p) => p.horizontal)
    }
    const photo = photos[id]

    if (photo) {
      finalSrc = `/static/photos/${photo.file}`
      finalAlt = finalAlt || photo.title
    } else {
      return (
        <Svg
          width={width || 640}
          height={height || 480}
          border
          className={className}
        />
      )
    }
  }

  if (!finalSrc) {
    return (
      <Svg
        width={width || 640}
        height={height || 480}
        border
        className={className}
      />
    )
  }

  if (background) {
    return (
      <div
        className={className}
        style={{ backgroundImage: `url(${finalSrc})` }}
      />
    )
  }

  if (ratio) {
    return (
      <div
        className={clsx('img-responsive', `img-responsive-${ratio}`, className)}
        style={{ backgroundImage: `url(${finalSrc})` }}
      />
    )
  }

  return (
    <img
      src={finalSrc}
      alt={finalAlt || ''}
      className={className}
      width={width}
      height={height}
    />
  )
}

export interface ResponsiveImageProps {
  src: string
  alt?: string
  width?: number
  height?: number
  className?: string
}

export function ResponsiveImage({
  src,
  alt = '',
  width = 507,
  height,
  className,
}: ResponsiveImageProps) {
  const src2x = src.replace(/\.png$/, '@2x.png')

  return (
    <picture>
      <img
        src={src}
        srcSet={`${src} 1x, ${src2x} 2x`}
        alt={alt}
        className={clsx('img-fluid', className)}
        width={width}
        height={height}
        loading="lazy"
      />
    </picture>
  )
}
