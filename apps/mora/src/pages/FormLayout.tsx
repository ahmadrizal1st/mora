// src/pages/FormLayout.tsx
// Converted from preview/pages/form-layout.html

import BaseLayout from '../layouts/BaseLayout'
import { Button } from '../components/ui/Button'
import { InputIcon } from '../components/ui/InputIcon'
import { FormCheck } from '../components/ui/FormCheck'
import { Datepicker } from '../components/ui/Datepicker'
import { Select } from '../components/ui/Select'
import flags from '../data/flags.json'

// ── Inline card components ──────────────────────────────────────────────────
// Converted from shared/includes/cards/form/layout.html


// Converted from shared/includes/cards/form/payment.html
function PaymentCard() {
  return (
    <form className="card">
      <div className="card-body">
        <h3 className="card-title">Payment Method</h3>
        <p className="card-subtitle mb-4">All transactions are secure and encrypted</p>

        <div className="mb-3">
          <label className="form-label">Name on Card</label>
          <input type="text" className="form-control" placeholder="John Doe" />
        </div>

        <div className="row">
          <div className="col-8">
            <div className="mb-3">
              <label className="form-label">Card Number</label>
              <input type="text" className="form-control" placeholder="1234 5678 9012 3456" />
              <small className="form-hint">Enter your 16-digit number.</small>
            </div>
          </div>
          <div className="col-4">
            <div className="mb-3">
              <label className="form-label">CVV</label>
              <input type="text" className="form-control" placeholder="123" />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="mb-3">
              <label className="form-label">Month</label>
              <Select 
                options={[
                  { value: '', label: 'MM' },
                  { value: '1', label: 'January' },
                  { value: '2', label: 'February' },
                  { value: '3', label: 'March' },
                  { value: '4', label: 'April' },
                  { value: '5', label: 'May' },
                  { value: '6', label: 'June' },
                  { value: '7', label: 'July' },
                  { value: '8', label: 'August' },
                  { value: '9', label: 'September' },
                  { value: '10', label: 'October' },
                  { value: '11', label: 'November' },
                  { value: '12', label: 'December' },
                ]}
                defaultValue=""
              />
            </div>
          </div>
          <div className="col-6">
            <div className="mb-3">
              <label className="form-label">Year</label>
              <Select 
                options={[
                  { value: '', label: 'YYYY' },
                  { value: '2025', label: '2025' },
                  { value: '2026', label: '2026' },
                  { value: '2027', label: '2027' },
                  { value: '2028', label: '2028' },
                  { value: '2029', label: '2029' },
                  { value: '2030', label: '2030' },
                ]}
                defaultValue=""
              />
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <h3 className="card-title">Billing Address</h3>
        <p className="card-subtitle mb-4">The billing address associated with your payment method</p>

        <div className="mb-3">
          <FormCheck title="Same as shipping address" defaultChecked />
        </div>

        <hr className="my-4" />

        <div className="mb-3">
          <label className="form-label">Comments</label>
          <textarea className="form-control" rows={3} placeholder="Add any additional comments"></textarea>
        </div>

        <div className="mt-4">
          <div className="btn-list">
            <Button text="Submit" color="primary" type="button" />
            <Button text="Cancel" type="button" />
          </div>
        </div>
      </div>
    </form>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function FormLayout() {
  return (
    <BaseLayout pageTitle="Form Layout">
      {/* Top Row: 3 Columns */}
      <div className="row row-cards">
        {/* Column 1 */}
        <div className="col-lg-4">
          <div className="row row-cards">
            {/* Basic Form */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Basic Form</h3>
                </div>
                <div className="card-body">
                  <form>
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label visually-hidden" htmlFor="basic-name">Name</label>
                        <input type="text" placeholder="Name" className="form-control" id="basic-name" name="name" />
                      </div>
                      <div className="col-6">
                        <label className="form-label visually-hidden" htmlFor="basic-email">Email address</label>
                        <input type="email" placeholder="Email address" className="form-control" id="basic-email" name="email" />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label visually-hidden" htmlFor="basic-password">Password</label>
                      <input type="password" placeholder="Password" className="form-control" id="basic-password" name="password" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label visually-hidden" htmlFor="basic-password-confirm">Confirm Password</label>
                      <input type="password" placeholder="Confirm Password" className="form-control" id="basic-password-confirm" name="password_confirm" />
                    </div>
                    <div>
                      <Button color="primary" block text="Submit" type="button" />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Example Form */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Example Form</h3>
                </div>
                <div className="card-body">
                  <form>
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label" htmlFor="example-first-name">First Name</label>
                        <input type="text" placeholder="Enter first name" className="form-control" id="example-first-name" name="first_name" />
                      </div>
                      <div className="col-6">
                        <label className="form-label" htmlFor="example-last-name">Last Name</label>
                        <input type="text" placeholder="Enter last name" className="form-control" id="example-last-name" name="last_name" />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="example-email">Email</label>
                      <input type="email" placeholder="Enter email address" className="form-control" id="example-email" name="email" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="example-subject">Select Subject</label>
                      <Select
                        options={['Option 1', 'Option 2', 'Option 3', 'Option 4'].map(o => ({ value: o, label: o }))}
                        defaultValue="Option 1"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="example-message">Message</label>
                      <textarea placeholder="Enter your message" rows={6} className="form-control" id="example-message" name="message" />
                    </div>
                    <div>
                      <Button color="primary" block text="Send Message" iconEnd="arrow-right" type="button" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="col-lg-4">
          <div className="row row-cards">
            {/* Form with Icons */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Example Form with Icons</h3>
                </div>
                <div className="card-body">
                  <form>
                    <div className="mb-3">
                      <InputIcon icon="user" placeholder="Username" prepend />
                    </div>
                    <div className="mb-3">
                      <InputIcon icon="mail" placeholder="Email address" prepend type="email" />
                    </div>
                    <div className="mb-3">
                      <InputIcon icon="lock" placeholder="Password" prepend type="password" />
                    </div>
                    <div className="mb-3">
                      <InputIcon icon="lock" placeholder="Confirm Password" prepend type="password" />
                    </div>
                    <div className="mt-4">
                      <div className="row align-items-center">
                        <div className="col">
                          <FormCheck title="Remember me" className="m-0" />
                        </div>
                        <div className="col-auto">
                          <Button color="primary" text="Create Account" iconEnd="arrow-right" type="button" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Form with Icons and Validation */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Form with Icons and Validation</h3>
                </div>
                <div className="card-body">
                  <form>
                    <div className="mb-3">
                      <InputIcon icon="user" placeholder="Username" prepend state="invalid" />
                      <div className="text-danger mt-1 small">
                        This throws the icon out of bounds when input element contains contains is-invalid class.
                      </div>
                    </div>
                    <div className="mb-3">
                      <InputIcon icon="mail" placeholder="Email" prepend state="valid" />
                      <div className="text-success mt-1 small">
                        This email looks good!
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Horizontal Form */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Horizontal form</h3>
                </div>
                <div className="card-body pb-0">
                   <div className="row mb-3">
                      <label className="col-3 col-form-label required">Email address</label>
                      <div className="col">
                        <input type="email" className="form-control" placeholder="Enter email" />
                        <small className="form-hint">We'll never share your email with anyone else.</small>
                      </div>
                   </div>
                   <div className="row mb-3">
                      <label className="col-3 col-form-label required">Password</label>
                      <div className="col">
                        <input type="password" placeholder="Password" className="form-control" />
                        <small className="form-hint">Your password must be 8-20 characters long.</small>
                      </div>
                   </div>
                   <div className="row mb-3">
                      <label className="col-3 col-form-label">Select</label>
                      <div className="col">
                         <Select options={['Option 1', 'Option 2'].map(o => ({ value: o, label: o }))} defaultValue="Option 1" />
                      </div>
                   </div>
                   <div className="row mb-3">
                      <label className="col-3 col-form-label pt-0">Checkboxes</label>
                      <div className="col">
                        <FormCheck title="Option 1" defaultChecked />
                        <FormCheck title="Option 2" />
                        <FormCheck title="Option 3" />
                      </div>
                   </div>
                </div>
                <div className="card-footer text-end">
                   <Button color="primary" text="Submit" type="button" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="col-lg-4">
          <PaymentCard />
        </div>
      </div>

      {/* Bottom Row: Wide Detailed Form */}
      <div className="row row-cards mt-2">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Example Form</h3>
            </div>
            <div className="card-body">
              <form>
                <div className="space-y">
                  <div><h4>Personal Info</h4></div>

                  <div className="row row-cols-1 row-cols-md-2 g-4">
                    <div>
                      <label className="form-label">First Name</label>
                      <input type="text" placeholder="Enter first name" className="form-control" />
                    </div>
                    <div>
                      <label className="form-label">Last Name</label>
                      <input type="text" placeholder="Enter last name" className="form-control" />
                    </div>
                    <div>
                      <label className="form-label">Gender</label>
                      <Select 
                        options={['Male', 'Female', 'Others'].map(o => ({ value: o, label: o }))}
                        defaultValue="Male"
                      />
                    </div>
                    <div>
                      <label className="form-label">Date of Birth</label>
                      <Datepicker layout="icon" id="birth-date" value="2020-06-20" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="form-label">Category</label>
                    <Select 
                      options={['Category 1', 'Category 2', 'Category 3'].map(o => ({ value: o, label: o }))}
                      defaultValue="Category 1"
                    />
                  </div>

                  <div className="mt-5"><h4>Address</h4></div>

                  <div className="mt-3">
                    <label className="form-label">Street</label>
                    <input type="text" className="form-control" />
                  </div>

                  <div className="row row-cols-1 row-cols-md-2 g-3 mt-1">
                    <div className="mb-3">
                      <label className="form-label">First Name</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Last Name</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Gender</label>
                      <Select 
                        options={['Male', 'Female', 'Other'].map(o => ({ value: o, label: o }))}
                        defaultValue="Male"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Date of Birth</label>
                      <Datepicker layout="icon" id="birth-date" value="2020-06-20" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Category</label>
                    <Select 
                      options={['Category 1', 'Category 2', 'Category 3'].map(o => ({ value: o, label: o }))}
                      defaultValue="Category 1"
                    />
                  </div>

                  <div className="mt-5"><h4>Address</h4></div>

                  <div className="mt-3">
                    <div className="mb-3">
                      <label className="form-label">Street</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>

                  <div className="row row-cols-1 row-cols-md-2 g-3 mt-1">
                    <div className="mb-3">
                      <label className="form-label">City</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">State</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Post Code</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Country</label>
                      <Select 
                        options={[
                          { value: '', label: '--Select Country--' },
                          ...flags.map(c => ({ value: c.name, label: c.name, flag: c.flag }))
                        ]}
                        indicator="flag"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="form-label">Membership</label>
                    <div className="d-flex flex-row gap-4">
                      <FormCheck title="Free" type="radio" name="membership_bottom" defaultChecked />
                      <FormCheck title="Paid" type="radio" name="membership_bottom" />
                    </div>
                  </div>

                  <div className="mt-4 border-top pt-4">
                    <div className="btn-list ms-auto justify-content-end">
                      <Button text="Cancel" type="button" />
                      <Button color="primary" text="Save Changes" type="button" />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
