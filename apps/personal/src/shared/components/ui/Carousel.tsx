import { clsx } from 'clsx'

export interface CarouselPhoto {
  file: string
  horizontal?: boolean
  alt?: string
  captionTitle?: string
  captionText?: string
}

export interface CarouselProps {
  id?: string
  photos?: CarouselPhoto[]
  limit?: number
  offset?: number
  fade?: boolean
  indicators?: boolean
  indicatorsVertical?: boolean
  indicatorsDot?: boolean
  indicatorsThumb?: boolean
  indicatorsThumbRatio?: boolean
  controls?: boolean
  captions?: boolean
  interval?: number
  className?: string
}

export function Carousel({
  id = 'carousel',
  photos = [],
  limit = 5,
  offset = 0,
  fade,
  indicators,
  indicatorsVertical,
  indicatorsDot,
  indicatorsThumb,
  indicatorsThumbRatio,
  controls,
  captions,
  interval = 5000,
  className,
}: CarouselProps) {
  const filteredPhotos = photos
    .filter((p) => p.horizontal !== false)
    .slice(offset, offset + limit)

  const carouselId = `carousel-${id}`

  const indicatorClasses = clsx(
    'carousel-indicators',
    indicatorsVertical && 'carousel-indicators-vertical',
    indicatorsDot ? 'carousel-indicators-dot' : indicatorsThumb && 'carousel-indicators-thumb'
  )

  return (
    <div
      id={carouselId}
      className={clsx('carousel slide', fade && 'carousel-fade', className)}
      data-bs-ride="carousel"
      data-bs-interval={interval}
    >
      {indicators && (
        <div className={indicatorClasses}>
          {filteredPhotos.map((photo, i) => (
            <button
              key={i}
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide-to={i}
              className={clsx(indicatorsThumbRatio && 'ratio ratio-4x3', i === 0 && 'active')}
              style={indicatorsThumb ? { backgroundImage: `url(/static/photos/${photo.file})` } : undefined}
            />
          ))}
        </div>
      )}

      <div className="carousel-inner">
        {filteredPhotos.map((photo, i) => (
          <div key={i} className={clsx('carousel-item', i === 0 && 'active')}>
            <img
              className="d-block w-100"
              alt={photo.alt ?? ''}
              src={`/static/photos/${photo.file}`}
            />
            {captions && (photo.captionTitle || photo.captionText) && (
              <>
                <div className="carousel-caption-background d-none d-md-block" />
                <div className="carousel-caption d-none d-md-block">
                  {photo.captionTitle && <h3>{photo.captionTitle}</h3>}
                  {photo.captionText && <p>{photo.captionText}</p>}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {controls && (
        <>
          <a
            className="carousel-control-prev"
            href={`#${carouselId}`}
            role="button"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </a>
          <a
            className="carousel-control-next"
            href={`#${carouselId}`}
            role="button"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </a>
        </>
      )}
    </div>
  )
}
