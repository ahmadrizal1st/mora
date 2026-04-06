// src/pages/Settings.tsx
import SettingsLayout from '../layouts/SettingsLayout'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'

interface Person {
  id?: number
  full_name?: string
  photo?: string
  company?: string
  city?: string
  country?: string
  email?: string
}

interface SettingsProps {
  people?: Person[]
}

export default function Settings({ people = [] }: SettingsProps) {
  const person = people[0] ?? {}

  return (
    <SettingsLayout>
      <div className="card-body">
        <h2 className="mb-4">My Account</h2>

        <h3 className="card-title">Profile Details</h3>
        <div className="row align-items-center">
          <div className="col-auto">
            <Avatar size="xl" personId={0} people={people} />
          </div>
          <div className="col-auto">
            <Button text="Change avatar" />
          </div>
          <div className="col-auto">
            <Button text="Delete avatar" color="danger" ghost />
          </div>
        </div>

        <h3 className="card-title mt-4">Business Profile</h3>
        <div className="row g-3">
          <div className="col-md">
            <label className="form-label" htmlFor="business-name">Business Name</label>
            <input
              type="text"
              className="form-control"
              id="business-name"
              name="business-name"
              defaultValue={person.company ?? ''}
            />
          </div>
          <div className="col-md">
            <label className="form-label" htmlFor="business-id">Business ID</label>
            <input
              type="text"
              className="form-control"
              id="business-id"
              name="business-id"
              defaultValue="560afc32"
            />
          </div>
          <div className="col-md">
            <label className="form-label" htmlFor="location">Location</label>
            <input
              type="text"
              className="form-control"
              id="location"
              name="location"
              defaultValue={[person.city, person.country].filter(Boolean).join(', ')}
            />
          </div>
        </div>

        <h3 className="card-title mt-4">Email</h3>
        <p className="card-subtitle">
          This contact will be shown to others publicly, so choose it carefully.
        </p>
        <div className="row g-2">
          <div className="col-auto">
            <label htmlFor="email" className="form-label visually-hidden">Email</label>
            <input
              type="text"
              className="form-control w-auto"
              id="email"
              name="email"
              defaultValue={person.email ?? ''}
            />
          </div>
          <div className="col-auto">
            <Button text="Change" />
          </div>
        </div>

        <h3 className="card-title mt-4">Password</h3>
        <p className="card-subtitle">
          You can set a permanent password if you don't want to use temporary login codes.
        </p>
        <div>
          <Button text="Set new password" />
        </div>

        <h3 className="card-title mt-4">Public profile</h3>
        <p className="card-subtitle">
          Making your profile public means that anyone on the Dashkit network will be able to find you.
        </p>
        <div>
          <label className="form-check form-check-single form-switch form-switch-lg">
            <input className="form-check-input" type="checkbox" defaultChecked />
            <span className="form-check-label form-check-label-on">You're currently visible</span>
            <span className="form-check-label form-check-label-off">You're currently invisible</span>
          </label>
        </div>
      </div>

      <div className="card-footer bg-transparent mt-auto">
        <div className="btn-list justify-content-end">
          <Button text="Cancel" />
          <Button text="Submit" color="primary" />
        </div>
      </div>
    </SettingsLayout>
  )
}