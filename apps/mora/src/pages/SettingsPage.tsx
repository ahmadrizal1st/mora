// src/pages/SettingsPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import peopleData from '../data/people.json'

export default function SettingsPage() {
  const person = (peopleData as any[])[0]

  return (
    <BaseLayout pageTitle="Account Settings">
      <div className="card">
        <div className="row g-0">
          <div className="col-12 col-md-3 border-end">
            <div className="card-body">
              <h4 className="subheader mb-3">Business Settings</h4>
              <div className="list-group list-group-transparent">
                <a href="#" className="list-group-item list-group-item-action d-flex align-items-center active">My Account</a>
                <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">My Notifications</a>
                <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">Connected Apps</a>
                <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">Plans</a>
                <a href="#" className="list-group-item list-group-item-action d-flex align-items-center">Billing & Invoices</a>
              </div>
              <h4 className="subheader mt-4 mb-3">Experience</h4>
              <div className="list-group list-group-transparent">
                <a href="#" className="list-group-item list-group-item-action flex-column align-items-start">Give Feedback</a>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-9 d-flex flex-column">
            <div className="card-body">
              <h2 className="mb-4">My Account</h2>

              <h3 className="card-title">Profile Details</h3>

              <div className="row align-items-center">
                <div className="col-auto">
                  <Avatar size="xl" personId={1} people={peopleData as any[]} />
                </div>
                <div className="col-auto">
                  <Button>Change avatar</Button>
                </div>
                <div className="col-auto">
                  <Button color="danger" ghost>Delete avatar</Button>
                </div>
              </div>

              <h3 className="card-title mt-4">Business Profile</h3>

              <div className="row g-3">
                <div className="col-md">
                  <label className="form-label" htmlFor="business-name">Business Name</label>
                  <input type="text" className="form-control" id="business-name" name="business-name" defaultValue={person.company} />
                </div>
                <div className="col-md">
                  <label className="form-label" htmlFor="business-id">Business ID</label>
                  <input type="text" className="form-control" id="business-id" name="business-id" defaultValue="560afc32" />
                </div>
                <div className="col-md">
                  <label className="form-label" htmlFor="location">Location</label>
                  <input type="text" className="form-control" id="location" name="location" defaultValue={`${person.city}, ${person.country}`} />
                </div>
              </div>

              <h3 className="card-title mt-4">Email</h3>
              <p className="card-subtitle">This contact will be shown to others publicly, so choose it carefully.</p>

              <div>
                <div className="row g-2">
                  <div className="col-auto">
                    <label htmlFor="email" className="form-label visually-hidden">Email</label>
                    <input type="text" className="form-control w-auto" id="email" name="email" defaultValue={person.email} />
                  </div>
                  <div className="col-auto">
                    <Button>Change</Button>
                  </div>
                </div>
              </div>

              <h3 className="card-title mt-4">Password</h3>
              <p className="card-subtitle">You can set a permanent password if you don't want to use temporary login codes.</p>
              <div>
                <Button>Set new password</Button>
              </div>

              <h3 className="card-title mt-4">Public profile</h3>
              <p className="card-subtitle">Making your profile public means that anyone on the Dashkit network will be able to find you.</p>
              <div>
                <label className="form-check form-switch form-switch-lg">
                  <input className="form-check-input" type="checkbox" defaultChecked />
                  <span className="form-check-label form-check-label-on">You{"'"}re currently visible</span>
                  <span className="form-check-label form-check-label-off">You{"'"}re currently invisible</span>
                </label>
              </div>
            </div>
            <div className="card-footer bg-transparent mt-auto">
              <div className="btn-list justify-content-end">
                <Button>Cancel</Button>
                <Button color="primary">Submit</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
