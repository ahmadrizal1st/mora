// src/pages/PaginationPage.tsx
import DefaultLayout from '../layouts/DefaultLayout'
import { Pagination } from '../components/ui/Pagination'

export default function PaginationPage() {
  return (
    <DefaultLayout pageTitle="Pagination">
      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <Pagination />
              <div className="mt-3">
                <Pagination text />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <Pagination count={0} prevDescription="Getting started" nextDescription="Breadcrumbs" />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
