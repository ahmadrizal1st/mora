import { useState } from 'react'
import BaseLayout from '../layouts/BaseLayout'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { GalleryPhotoCard } from '../components/cards'
import { Pagination } from '../components/ui/Pagination'
import { InputIcon } from '../components/ui/InputIcon'
import { Icon } from '../components/ui/Icon'
import { Button } from '../components/ui/Button'

import type { Person, Photo } from '../types'

interface GalleryPageProps {
  photos: Photo[]
  people: Person[]
}

export default function GalleryPage({ photos, people }: GalleryPageProps) {
  const [photoData, setPhotoData] = useState(() => 
    photos.filter(photo => photo.horizontal).slice(0, 15).map((photo) => ({
      ...photo,
      liked: false,
      likes: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 1000)
    }))
  )

  const handleLike = (index: number) => {
    setPhotoData(prev => prev.map((p, i) => {
      if (i === index) {
        return {
          ...p,
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1
        }
      }
      return p
    }))
  }

  return (
    <BaseLayout
      pageTitle="Gallery"
      pagePretitle={<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]} />}
      pageDescription="1-15 of 241 photos"
      pageActions={
        <div className="d-flex align-items-center">
          <InputIcon 
            className="d-none d-md-flex me-3" 
            placeholder="Search photo…"
          />
          <Button color="primary">
            <Icon icon="plus" className="icon" />
            Add event
          </Button>
        </div>
      }
    >
      <div className="row row-cards">
        {photoData.map((photo, index) => {
          const person = people[index] || people[0]
          return (
            <div key={index} className="col-sm-6 col-lg-4">
              <GalleryPhotoCard
                imageSrc={`/static/photos/${photo.file}`}
                authorName={person.full_name}
                authorAvatarSrc={person.photo ? `/tabler/${person.photo}` : undefined}
                date="2 days ago"
                liked={photo.liked}
                likes={photo.likes}
                views={photo.views}
                onLike={() => handleLike(index)}
              />
            </div>
          )
        })}
      </div>
      <div className="d-flex mt-5">
        <Pagination className="ms-auto" count={5} />
      </div>
    </BaseLayout>
  )
}
