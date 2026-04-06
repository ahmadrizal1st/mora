import { Carousel, type CarouselProps } from '../ui/Carousel'
import photosData from '../../data/photos.json'

interface CarouselCardProps extends CarouselProps {
  title?: string
}

export function CarouselCard({
  title = 'Carousel',
  interval,
  ...carouselProps
}: CarouselCardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body">
        <Carousel photos={photosData} interval={interval} {...carouselProps} />
      </div>
    </div>
  )
}
