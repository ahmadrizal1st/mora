// src/components/cards/IconsBannerCard.tsx
import { Icon } from '../ui/Icon'

interface IconsBannerCardProps {
  iconsCount?: number
  iconsUrl?: string
  className?: string
}

export function IconsBannerCard({
  iconsCount = 5765,
  iconsUrl = 'https://tabler-icons.io',
  className,
}: IconsBannerCardProps) {
  return (
    <div className={`card card-md${className ? ` ${className}` : ''}`}>
      <div className="card-stamp card-stamp-lg">
        <div className="card-stamp-icon bg-primary">
          <Icon icon="ghost" />
        </div>
      </div>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-10">
            <h3 className="h1">Tabler Icons</h3>
            <div className="prose">
              All icons come from the Tabler Icons set and are MIT-licensed. Visit{' '}
              <a href={iconsUrl} target="_blank" rel="noopener">
                Tabler Icons Website
              </a>
              , download any of the {iconsCount} icons in SVG, PNG or&nbsp;React and use them in
              your favourite design tools.
            </div>
            <div className="mt-3">
              <a
                href={iconsUrl}
                className="btn btn-primary"
                target="_blank"
                rel="noopener"
              >
                <Icon icon="download" />
                Download icons
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
