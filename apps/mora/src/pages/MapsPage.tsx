// src/pages/MapsPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { MapBox } from '../components/ui'
import mapsData from '../data/maps.json'

export default function MapsPage() {
  return (
    <BaseLayout pageTitle="Maps">
      <div className="row row-cards">
        {Object.entries(mapsData).map(([id, map]) => {
          const isFullCard = (map as any).card

          if (isFullCard) {
            return (
              <div key={id} className="col-lg-12">
                <div className="card overflow-hidden">
                  <div className="ratio ratio-21x9">
                    <MapBox
                      id={id}
                      center={(map as any).center}
                      zoom={(map as any).zoom}
                      style={(map as any).style}
                      markers={(map as any).markers}
                      card={true}
                      minHeight="100%"
                    />
                  </div>
                </div>
              </div>
            )
          }

          return (
            <div key={id} className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <div className="card-title">{(map as any).title}</div>
                  <div className="ratio ratio-16x9">
                    <MapBox
                      id={id}
                      center={(map as any).center}
                      zoom={(map as any).zoom}
                      style={(map as any).style}
                      markers={(map as any).markers}
                      minHeight="100%"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </BaseLayout>
  )
}
