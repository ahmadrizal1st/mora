// src/pages/CardActions.tsx
import BaseLayout from '../layouts/BaseLayout'
import { Card, CardHeader, CardBody, CardTitle } from '../components/cards'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { Icon } from '../components/ui/Icon'

import type { Person } from '../types'

interface CardActionsProps {
  people?: Person[]
}

export default function CardActions({ people = [] }: CardActionsProps) {
  const person1 = people.length > 0 ? people[0] : { full_name: 'Paweł Kuna', job_title: 'UI Designer' }
  const person4 = people.length > 3 ? people[3] : { full_name: 'Egan Poetz', job_title: 'Research Nurse' }

  return (
    <BaseLayout pageTitle="Card actions" pagePretitle="Components">
      <div className="row row-cards">
        <div className="col-md-6">
          <Card>
            <CardHeader>
              <CardTitle>Sample card</CardTitle>
            </CardHeader>
            <CardBody>
              <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="400" height="200" viewBox="0 0 400 200" fill="transparent" stroke="var(--tblr-border-color, #b8cef1)" className="w-100 border rounded"><line x1="0" y1="0" x2="400" y2="200" /><line x1="0" y1="200" x2="400" y2="0" /></svg>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-6">
          <Card>
            <CardHeader>
              <CardTitle>Card with action</CardTitle>
              <div className="card-actions">
                <Button color="primary" icon="plus" text="Add new" />
              </div>
            </CardHeader>
            <CardBody>
              <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="400" height="200" viewBox="0 0 400 200" fill="transparent" stroke="var(--tblr-border-color, #b8cef1)" className="w-100 border rounded"><line x1="0" y1="0" x2="400" y2="200" /><line x1="0" y1="200" x2="400" y2="0" /></svg>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-6">
          <Card>
            <CardHeader>
              <CardTitle>Cart title</CardTitle>
              <div className="card-actions">
                <Button icon="phone" text="Phone" />
                <Button icon="mail" text="Email" className="ms-2" />
              </div>
            </CardHeader>
            <CardBody>
              <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="400" height="200" viewBox="0 0 400 200" fill="transparent" stroke="var(--tblr-border-color, #b8cef1)" className="w-100 border rounded"><line x1="0" y1="0" x2="400" y2="200" /><line x1="0" y1="200" x2="400" y2="0" /></svg>

            </CardBody>
          </Card>
        </div>

        <div className="col-md-6">
          <Card>
            <CardHeader>
              <div>
                <div className="row align-items-center">
                  <div className="col-auto">
                    <Avatar person={person1} />
                  </div>
                  <div className="col">
                    <div className="card-title">{person1.full_name}</div>
                    <div className="card-subtitle">{person1.job_title}</div>
                  </div>
                </div>
              </div>
              <div className="card-actions">
                <Button icon="phone" text="Phone" />
                <Button icon="mail" text="Email" className="ms-2" />
              </div>
            </CardHeader>
            <CardBody>
              <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="400" height="200" viewBox="0 0 400 200" fill="transparent" stroke="var(--tblr-border-color, #b8cef1)" className="w-100 border rounded"><line x1="0" y1="0" x2="400" y2="200" /><line x1="0" y1="200" x2="400" y2="0" /></svg>

            </CardBody>
          </Card>
        </div>

        <div className="col-md-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>With description</CardTitle>
                <p className="card-subtitle">
                  Lorem ipsum dolor sit amet consectetur adipisicing.
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="400" height="200" viewBox="0 0 400 200" fill="transparent" stroke="var(--tblr-border-color, #b8cef1)" className="w-100 border rounded"><line x1="0" y1="0" x2="400" y2="200" /><line x1="0" y1="200" x2="400" y2="0" /></svg>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>With description and action</CardTitle>
                <p className="card-subtitle">
                  Lorem ipsum dolor sit amet consectetur adipisicing.
                </p>
              </div>
              <div className="card-actions">
                <Button color="primary" text="Create new job" />
              </div>
            </CardHeader>
            <CardBody>
              <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="400" height="200" viewBox="0 0 400 200" fill="transparent" stroke="var(--tblr-border-color, #b8cef1)" className="w-100 border rounded"><line x1="0" y1="0" x2="400" y2="200" /><line x1="0" y1="200" x2="400" y2="0" /></svg>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-6">
          <Card>
            <CardHeader>
              <div>
                <div className="row align-items-center">
                  <div className="col-auto">
                    <Avatar person={person4} />
                  </div>
                  <div className="col">
                    <div className="card-title">{person4.full_name}</div>
                    <div className="card-subtitle">{person4.job_title}</div>
                  </div>
                </div>
              </div>
              <div className="card-actions">
                <div className="dropdown">
                  <a href="#" className="btn-action dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <Icon icon="dots-vertical" />
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a className="dropdown-item" href="#">Edit user</a>
                    <a className="dropdown-item" href="#">Change permissions</a>
                    <a className="dropdown-item text-danger" href="#">Delete user</a>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="400" height="200" viewBox="0 0 400 200" fill="transparent" stroke="var(--tblr-border-color, #b8cef1)" className="w-100 border rounded"><line x1="0" y1="0" x2="400" y2="200" /><line x1="0" y1="200" x2="400" y2="0" /></svg>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-6">
          <Card>
            <CardHeader>
              <CardTitle>Card actions</CardTitle>
              <div className="card-actions btn-actions">
                <a href="#" className="btn-action">
                  <Icon icon="refresh" />
                </a>
                <a href="#" className="btn-action">
                  <Icon icon="chevron-up" />
                </a>
                <a href="#" className="btn-action">
                  <Icon icon="dots-vertical" />
                </a>
                <a href="#" className="btn-action">
                  <Icon icon="x" />
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="400" height="200" viewBox="0 0 400 200" fill="transparent" stroke="var(--tblr-border-color, #b8cef1)" className="w-100 border rounded"><line x1="0" y1="0" x2="400" y2="200" /><line x1="0" y1="200" x2="400" y2="0" /></svg>
            </CardBody>
          </Card>
        </div>
      </div>
    </BaseLayout>
  )
}
