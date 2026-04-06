import BaseLayout from '../layouts/BaseLayout'
import { CarouselCard } from '../components/cards/CarouselCard'

export default function CarouselPage() {
  return (
    <BaseLayout pageTitle="Carousel" pagePretitle="Base">
      <div className="row row-cards">
        <div className="col-md-6">
          <CarouselCard id="default" interval={2000} />
        </div>
        <div className="col-md-6">
          <CarouselCard
            id="indicators"
            title="Carousel with indicators"
            indicators={true}
            offset={5}
            interval={3000}
          />
        </div>
        <div className="col-md-6">
          <CarouselCard
            id="controls"
            title="Carousel with controls"
            controls={true}
            offset={10}
            interval={4000}
          />
        </div>
        <div className="col-md-6">
          <CarouselCard
            id="captions"
            title="Carousel with captions"
            captions={true}
            controls={true}
            offset={15}
            interval={5000}
          />
        </div>
        <div className="col-md-6">
          <CarouselCard
            id="indicators-dot"
            title="Carousel with dot indicators"
            indicators={true}
            indicatorsDot={true}
            offset={20}
            fade={true}
            interval={2500}
          />
        </div>
        <div className="col-md-6">
          <CarouselCard
            id="indicators-thumb"
            title="Carousel with thumbnail indicators"
            indicators={true}
            indicatorsThumb={true}
            indicatorsThumbRatio={true}
            offset={25}
            fade={true}
            interval={3500}
          />
        </div>
        <div className="col-md-6">
          <CarouselCard
            id="indicators-dot-vertical"
            title="Carousel with vertical dot indicators"
            indicators={true}
            indicatorsVertical={true}
            indicatorsDot={true}
            offset={30}
            fade={true}
            interval={4500}
          />
        </div>
        <div className="col-md-6">
          <CarouselCard
            id="indicators-thumb-vertical"
            title="Carousel with vertical thumbnail indicators"
            indicators={true}
            indicatorsVertical={true}
            indicatorsThumb={true}
            indicatorsThumbRatio={true}
            offset={22}
            fade={true}
            interval={5500}
          />
        </div>
      </div>
    </BaseLayout>
  )
}
