import BaseLayout from '../layouts/BaseLayout'
import { Avatar } from '../components/ui/Avatar'
import { Pagination } from '../components/ui/Pagination'
import { Icon } from '../components/ui/Icon'

import type { Person } from '../types'

interface UsersProps {
  people?: Person[]
}

export default function Users({ people = [] }: UsersProps) {
  const displayPeople = people.slice(0, 18)

  return (
    <BaseLayout
      pageTitle="Users"
      pageDescription="1-18 of 413 people"
    >
      <div className="row row-cards">
        {displayPeople.map((person, index) => (
          <div className="col-md-6 col-lg-3" key={person.id ?? index}>
            <div className="card">
              <div className="card-body p-4 text-center">
                <Avatar
                  person={person}
                  size="xl"
                  shape="rounded"
                  className="mb-3 mx-auto"
                />
                <h3 className="m-0 mb-1">
                  <a href="#">{person.full_name}</a>
                </h3>
                <div className="text-secondary">{person.job_title}</div>

                <div className="mt-3">
                  {index === 0 ? (
                    <span className="badge bg-purple-lt">Owner</span>
                  ) : index < 4 ? (
                    <span className="badge bg-green-lt">Admin</span>
                  ) : null}
                </div>
              </div>
              <div className="d-flex">
                <a href="#" className="card-btn">
                  <Icon icon="mail" className="me-2 text-muted" /> Email
                </a>
                <a href="#" className="card-btn">
                  <Icon icon="phone" className="me-2 text-muted" /> Call
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex mt-4">
        <Pagination className="ms-auto" />
      </div>
    </BaseLayout>
  )
}