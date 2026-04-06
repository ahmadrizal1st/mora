import React from 'react'
import BaseLayout from '../layouts/BaseLayout'
import { Avatar, Icon, Payment, Button, NavSegmented } from '../components/ui'

import type { Person } from '../types'

interface PayPageProps {
  people: Person[]
}

export default function PayPage({ people }: PayPageProps) {
  const person = people[0] || { full_name: 'Paweł Kuna', photo: '/static/avatars/000m.jpg' }
  const [activeTab, setActiveTab] = React.useState(1)

  return (
    <BaseLayout
      pageTitle="Pay"
      noContainer={true}
    >
      <div className="bg-dark bg-cover" style={{ backgroundImage: 'url(/static/bg-cover.jpg)', height: '20rem' }}>
        <div className="bg-dark bg-opacity-75 h-100 pt-5 bg-blur">
          <div className="container container-tight bg-overlay h-100 d-flex align-items-end">
            <img src="/static/bg-cover.jpg" alt="" className="img-fluid rounded-top" style={{ marginBottom: '-1px' }} />
          </div>
        </div>
      </div>

      <div className="container container-tight">
        <div className="card rounded-top-0 border-top-0 shadow-sm">
          <div className="card-body pt-0">
            <div className="mb-3 text-center">
              <div className="d-flex justify-content-center" style={{ marginTop: '-2.5rem' }}>
                <Avatar
                  person={person}
                  size="xl"
                  shape="rounded"
                  className="shadow-sm rounded-4"
                  style={{ border: '4px solid #fff', width: '80px', height: '80px' }}
                />
              </div>
              <div className="mt-3 mb-4">
                <h2 className="h2 mb-2">Front-End Learning</h2>
                <div className="text-secondary px-4">
                  Learn to build web apps with HTML & CSS. Get started quickly with included templates.
                </div>
              </div>
            </div>

            <div className="p-1 bg-body-tertiary rounded mb-4">
              <NavSegmented
                items={['Pay With Card', 'Pay With PayPal']}
                icons={['credit-card', 'brand-paypal']}
                fullWidth={true}
                defaultActive={activeTab}
                onChange={(index) => setActiveTab(index)}
              />
            </div>

            <div className="tab-content">
              {activeTab === 1 && (
                <div className="tab-pane active show">
                  <form>
                    <div className="space-y-3">
                      <div>
                        <label className="form-label text-secondary fw-medium">Card Number</label>
                        <div className="input-group input-group-flat border rounded">
                          <span className="input-group-text bg-transparent border-0 px-3">
                            <Payment payment="visa" size="xs" />
                          </span>
                          <input type="text" className="form-control border-0 ps-0" placeholder="0000 0000 0000 0000" />
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-sm-6">
                          <label className="form-label text-secondary fw-medium">Expiry Date</label>
                          <input type="text" className="form-control" placeholder="MM/YY" maxLength={5} />
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label text-secondary fw-medium">CVC</label>
                          <input type="text" className="form-control" placeholder="CVC" maxLength={3} />
                        </div>
                      </div>

                      <div>
                        <label className="form-label text-secondary fw-medium">Name on Card</label>
                        <input type="text" className="form-control" placeholder="Full name" />
                      </div>

                      <div>
                        <label className="form-label text-secondary fw-medium">Email</label>
                        <input type="email" className="form-control" placeholder="you@example.com" />
                      </div>

                      <div className="pt-3">
                        <Button color="primary" className="w-100 fw-bold py-2">
                          Pay $253
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 2 && (
                <div className="tab-pane active show">
                  <Button color="primary" className="w-100">
                    <Icon icon="brand-paypal" className="me-2" />
                    Pay with PayPal - $253
                  </Button>
                  <div className="text-secondary text-center small mt-3">
                    You'll be charged $253, including $48 for VAT in Poland
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
