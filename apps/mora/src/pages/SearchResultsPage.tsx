// src/pages/SearchResultsPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { GalleryPhotoCard } from '../components/cards/GalleryPhotoCard'
import { Button } from '../components/ui/Button'
import type { Person, Photo } from '../types'

interface SearchResultsPageProps {
  people?: Person[]
  photos?: Photo[]
}

export default function SearchResultsPage({ people = [], photos = [] }: SearchResultsPageProps) {
  const filteredPhotos = photos
    .filter(photo => photo.horizontal)
    .slice(0, 18)

  return (
    <BaseLayout 
      pageTitle="Search results" 
      pageDescription="About 2,410 result (0.19 seconds)"
    >
      <div className="row g-4">
        <div className="col-md-3">
          <form action="" method="get">
            <div className="form-label">Category</div>
            <div className="mb-4">
              <div className="list-group list-group-transparent">
                <a href="#" className="list-group-item list-group-item-action d-flex align-items-center active">
                  Games
                  <small className="text-secondary ms-auto">24</small>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">
                  Clothing
                  <small className="text-secondary ms-auto">11</small>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">
                  Jewelery
                  <small className="text-secondary ms-auto">11</small>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">
                  Toys
                  <small className="text-secondary ms-auto">54</small>
                </a>
              </div>
            </div>

            <div className="form-label">Rating</div>
            <div className="mb-4">
              <label className="form-check">
                <input type="radio" className="form-check-input" name="form-rating" defaultChecked />
                <span className="form-check-label">5 stars</span>
              </label>
              <label className="form-check">
                <input type="radio" className="form-check-input" name="form-rating" />
                <span className="form-check-label">4 stars</span>
              </label>
              <label className="form-check">
                <input type="radio" className="form-check-input" name="form-rating" />
                <span className="form-check-label">3 stars</span>
              </label>
              <label className="form-check mb-0">
                <input type="radio" className="form-check-input" name="form-rating" />
                <span className="form-check-label">2 and less stars</span>
              </label>
            </div>

            <div className="form-label">Tags</div>
            <div className="mb-4">
              <label className="form-check">
                <input type="checkbox" className="form-check-input" defaultChecked />
                <span className="form-check-label">business</span>
              </label>
              <label className="form-check">
                <input type="checkbox" className="form-check-input" />
                <span className="form-check-label">evening</span>
              </label>
              <label className="form-check">
                <input type="checkbox" className="form-check-input" />
                <span className="form-check-label">leisure</span>
              </label>
              <label className="form-check mb-0">
                <input type="checkbox" className="form-check-input" />
                <span className="form-check-label">party</span>
              </label>
            </div>

            <div className="form-label">Price</div>
            <div className="mb-4">
              <div className="row g-2 align-items-center">
                <div className="col">
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input type="text" className="form-control" defaultValue="3" />
                  </div>
                </div>
                <div className="col-auto text-secondary">—</div>
                <div className="col">
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input type="text" className="form-control" placeholder="to" />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-label">Shipping</div>
            <div className="mb-4">
              <select className="form-select">
                <option>United Kingdom</option>
                <option>United States</option>
                <option>Germany</option>
                <option>Poland</option>
              </select>
            </div>

            <div className="mt-5">
              <Button color="primary" className="w-100 mb-2">Confirm changes</Button>
              <a href="#" className="btn btn-link w-100">Reset to defaults</a>
            </div>
          </form>
        </div>
        <div className="col-md-9">
          <div className="row row-cards">
            {filteredPhotos.map((photo, index) => {
              const person = people[index % people.length] || people[0]
              return (
                <div key={index} className="col-sm-6 col-lg-4">
                  <GalleryPhotoCard
                    imageSrc={`/static/photos/${photo.file}`}
                    authorName={person.full_name}
                    authorAvatarSrc={person.photo ? `/tabler/${person.photo}` : undefined}
                    date="2 days ago"
                    hideLikes={true}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
