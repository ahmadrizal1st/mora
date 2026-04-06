// src/pages/LightboxPage.tsx
import { useState } from 'react'
import FsLightbox from 'fslightbox-react'
import BaseLayout from '../layouts/BaseLayout'
import photosData from '../data/photos.json'
import { Photo } from '../components/ui'

export default function LightboxPage() {
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1
  })

  // Filter for horizontal photos as requested
  const photos = (photosData as any[]).filter(p => p.horizontal)

  const openLightboxOnSlide = (number: number) => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: number
    })
  }

  return (
    <BaseLayout pageTitle="Lightbox">
      <div className="row row-cols-3 row-cols-md-4 row-cols-lg-6 g-3">
        {photos.map((photo, index) => (
          <div key={photo.file} className="col">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                openLightboxOnSlide(index + 1)
              }}
            >
              <Photo
                src={`/static/photos/${photo.file}`}
                alt={photo.title}
                ratio="1x1"
                className="rounded border"
              />
            </a>
          </div>
        ))}
      </div>

      <FsLightbox
        toggler={lightboxController.toggler}
        sources={photos.map(p => `/static/photos/${p.file}`)}
        slide={lightboxController.slide}
      />
    </BaseLayout>
  )
}
