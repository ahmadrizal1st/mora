// src/pages/ListsPage.tsx
import { UsersList } from '../components/cards/UsersList'
import { UsersList2 } from '../components/cards/UsersList2'
import { UsersListHeaders } from '../components/cards/UsersListHeaders'
import DefaultLayout from '../layouts/DefaultLayout'

import type { Person, Commit } from '../types'

interface ListsPageProps {
  people: Person[]
  commits: Commit[]
}

export default function ListsPage({ people, commits }: ListsPageProps) {
  return (
    <DefaultLayout pageTitle="Lists">
      <div className="row row-cards">
        <div className="col-md-6">
          <div className="row row-cards">
            <div className="col-12">
              <UsersList2 people={people} />
            </div>
            <div className="col-12">
              <UsersList
                people={people}
                commits={commits}
                offset={8}
                checkbox={true}
                hoverable={true}
                checkedIds={[2, 5, 8]}
                title="Contacts"
              />
            </div>
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Links and buttons</h3>
                </div>
                <div className="list-group list-group-flush">
                  <a
                    href="#"
                    className="list-group-item list-group-item-action active"
                    aria-current="true"
                  >
                    The current link item
                  </a>
                  <a href="#" className="list-group-item list-group-item-action">
                    A second link item
                  </a>
                  <a href="#" className="list-group-item list-group-item-action">
                    A third link item
                  </a>
                  <a href="#" className="list-group-item list-group-item-action">
                    A fourth link item
                  </a>
                  <a className="list-group-item list-group-item-action disabled">
                    A disabled link item
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row row-cards">
            <div className="col-12">
              <UsersList people={people} commits={commits} hoverable={true} />
            </div>
            <div className="col-12">
              <UsersListHeaders people={people} commits={commits} />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
