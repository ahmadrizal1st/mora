// src/components/cards/WeatherCard.tsx
import { Icon } from '../ui/Icon'

interface WeatherCardProps {
  city?: string
  description?: string
  temperature?: number
  icon?: string
  color?: string
}

export function WeatherCard({
  city = 'Warsaw',
  description = 'Cloudy morning',
  temperature = 20,
  icon = 'cloud-rain',
  color = 'blue',
}: WeatherCardProps) {
  return (
    <div className={`card card-gradient card-gradient-${color} card-gradient-end`}>
      <div className="card-body">
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="col-auto">
                <h3 className="card-title mb-2">{city}</h3>
              </div>
              <div className="col">
                <Icon icon={icon} />
              </div>
            </div>
            <div className="text-secondary">{description}</div>
          </div>
          <div className="col-auto">
            <div className="display-5 lh-1 fw-lighter">{temperature}&deg;</div>
          </div>
        </div>
      </div>
    </div>
  )
}