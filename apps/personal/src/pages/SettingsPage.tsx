import BaseLayout from '@/shared/layouts/BaseLayout'
import { Avatar, Button, Icon } from '@/shared/components/ui'
import peopleData from '@/shared/data/people.json'
import type { Person } from '@/shared/types/common.types'
import { useState } from 'react'
import { clsx } from 'clsx'

const people = peopleData as Person[]

export default function SettingsPage() {
  const person = people[0] ?? {}
  const [activeTab, setActiveTab] = useState('account')

  const navItems = [
    { id: 'account', label: 'My Account' },
    { id: 'notifications', label: 'My Notifications' },
    { id: 'apps', label: 'Connected Apps' },
    { id: 'plan', label: 'Plan', subheader: 'Experience' },
    { id: 'billing', label: 'Billing & Invoices' },
  ]

  return (
    <BaseLayout 
      pageTitle="Account Settings" 
      pagePretitle="Overview"
      containerFlushMobile
    >
      <div className="container-xl">
        <div className="card">
          <div className="row g-0">
            {/* Sidebar Navigation */}
            <div className="col-12 col-md-3 border-end">
              <div className="card-body">
                <h4 className="subheader">Business settings</h4>
                <div className="list-group list-group-transparent">
                  {navItems.map((item, index) => (
                    <div key={item.id}>
                      {item.subheader && (
                        <h4 className="subheader mt-4">{item.subheader}</h4>
                      )}
                      <a
                        href="#"
                        className={clsx(
                          "list-group-item list-group-item-action d-flex align-items-center",
                          activeTab === item.id && "active"
                        )}
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveTab(item.id)
                        }}
                      >
                        {item.label}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-12 col-md-9 d-flex flex-column">
              <div className="card-body">
                <h2 className="mb-4">My Account</h2>

                <h3 className="card-title">Profile Details</h3>
                <div className="row align-items-center mb-4">
                  <div className="col-auto">
                    <Avatar size="xl" person={person as any} shape="rounded" />
                  </div>
                  <div className="col-auto">
                    <Button text="Change avatar" />
                  </div>
                  <div className="col-auto">
                    <Button text="Delete avatar" color="danger" ghost />
                  </div>
                </div>

                <h3 className="card-title mt-4">Business Profile</h3>
                <div className="row g-3 mb-4">
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
                <div className="row g-2 mb-4">
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
                <div className="mb-4">
                  <Button text="Set new password" />
                </div>

                <h3 className="card-title mt-4">Public profile</h3>
                <p className="card-subtitle">
                  Making your profile public means that anyone on the Visatamora network will be able to find you.
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
                  <Button text="Cancel" ghost />
                  <Button text="Submit" color="primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
