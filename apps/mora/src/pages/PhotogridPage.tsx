// src/pages/PhotogridPage.tsx
import React, { useState } from 'react'
import BaseLayout from '../layouts/BaseLayout'
import { Svg } from '../components/ui/Svg'
import { Photo } from '../components/ui/Photo'
import photosData from '../data/photos.json'
// @ts-ignore
import FsLightbox from 'fslightbox-react'

export default function PhotogridPage() {
  const photos = photosData as any[]
  
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1
  })

  // Maintain the exact order of images displayed in the template grid
  const galleryIndices = [5, 6, 7, 8, 9, 10, 16, 14, 15, 12, 13, 1, 4, 17]
  const sources = galleryIndices.map(i => `/static/photos/${photos[i].file}`)

  const openLightbox = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: index + 1 // 1-indexed
    })
  }

  return (
    <BaseLayout pageTitle="Photogrid">
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={sources}
        slide={lightboxController.slide}
      />

      <div className="mb-4 d-none">
        <Svg width={640} height={480} border={true} />
      </div>

      <div className="row g-2 g-md-3">
        <div className="col-lg-6">
          <div className="row g-2 g-md-3">
            <div className="col-12">
              <a href={`/static/photos/${photos[5].file}`} onClick={e => openLightbox(e, 0)}>
                <Photo id={5} className="rounded-3 border" ratio="3x1" />
              </a>
            </div>
            <div className="col-6">
              <a href={`/static/photos/${photos[6].file}`} onClick={e => openLightbox(e, 1)}>
                <Photo id={6} className="rounded-3 border" ratio="1x1" />
              </a>
            </div>
            <div className="col-6">
              <div className="row g-2 g-md-3">
                <div className="col-6">
                  <a href={`/static/photos/${photos[7].file}`} onClick={e => openLightbox(e, 2)}>
                    <Photo id={7} className="rounded-3 border" ratio="1x1" />
                  </a>
                </div>
                <div className="col-6">
                  <a href={`/static/photos/${photos[8].file}`} onClick={e => openLightbox(e, 3)}>
                    <Photo id={8} className="rounded-3 border" ratio="1x1" />
                  </a>
                </div>
                <div className="col-6">
                  <a href={`/static/photos/${photos[9].file}`} onClick={e => openLightbox(e, 4)}>
                    <Photo id={9} className="rounded-3 border" ratio="1x1" />
                  </a>
                </div>
                <div className="col-6">
                  <a href={`/static/photos/${photos[10].file}`} onClick={e => openLightbox(e, 5)}>
                    <Photo id={10} className="rounded-3 border" ratio="1x1" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-12">
              <a href={`/static/photos/${photos[16].file}`} onClick={e => openLightbox(e, 6)}>
                <Photo id={16} className="rounded-3 border" ratio="4x1" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="row g-2 g-md-3">
            <div className="col-6">
              <div className="row g-2 g-md-3">
                <div className="col-6">
                  <a href={`/static/photos/${photos[14].file}`} onClick={e => openLightbox(e, 7)}>
                    <Photo id={14} className="rounded-3 border" ratio="1x1" />
                  </a>
                </div>
                <div className="col-6">
                  <a href={`/static/photos/${photos[15].file}`} onClick={e => openLightbox(e, 8)}>
                    <Photo id={15} className="rounded-3 border" ratio="1x1" />
                  </a>
                </div>
                <div className="col-6">
                  <a href={`/static/photos/${photos[12].file}`} onClick={e => openLightbox(e, 9)}>
                    <Photo id={12} className="rounded-3 border" ratio="1x1" />
                  </a>
                </div>
                <div className="col-6">
                  <a href={`/static/photos/${photos[13].file}`} onClick={e => openLightbox(e, 10)}>
                    <Photo id={13} className="rounded-3 border" ratio="1x1" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-6">
              <a href={`/static/photos/${photos[1].file}`} onClick={e => openLightbox(e, 11)}>
                <Photo id={1} className="rounded-3 border" ratio="1x1" />
              </a>
            </div>
            <div className="col-12">
              <a href={`/static/photos/${photos[4].file}`} onClick={e => openLightbox(e, 12)}>
                <Photo id={4} className="rounded-3 border" ratio="4x1" />
              </a>
            </div>
            <div className="col-12">
              <a href={`/static/photos/${photos[17].file}`} onClick={e => openLightbox(e, 13)}>
                <Photo id={17} className="rounded-3 border" ratio="3x1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
