// src/pages/ModalsPage.tsx
import { Modal, ModalHeader, ModalFooter } from '../components/ui/Modal'
import DefaultLayout from '../layouts/DefaultLayout'
import { Icon } from '../components/ui/Icon'

export default function ModalsPage() {
  const modalPreviewClass = "position-relative rounded d-block bg-surface-backdrop py-6 w-auto h-auto z-0"

  return (
    <DefaultLayout pageTitle="Modals">
      <div className="card">
        <div className="card-body">
          <div className="row g-5">
            <div className="d-none d-md-block col-3">
              <div className="nav nav-vertical sticky-top pt-4">
                <a href="#modal-simple" className="nav-link">Simple modal</a>
                <a href="#modal-large" className="nav-link">Large modal</a>
                <a href="#modal-small" className="nav-link">Small modal</a>
                <a href="#modal-full-width" className="nav-link">Full width modal</a>
                <a href="#modal-scrollable" className="nav-link">Scrollable modal</a>
                <a href="#modal-report" className="nav-link">Modal with form</a>
                <a href="#modal-success" className="nav-link">Success modal</a>
                <a href="#modal-danger" className="nav-link">Danger modal</a>
                <a href="#modal-team" className="nav-link">Modal with simple form</a>
                <a href="#modal-signature" className="nav-link">Modal with signature form</a>
                <a href="#modal-new-email" className="nav-link">New email modal</a>
                <a href="#modal-new-event" className="nav-link">New event modal</a>
                <a href="#modal-new-task" className="nav-link">New task modal</a>
                <a href="#modal-edit-profile" className="nav-link">Edit profile modal</a>
                <a href="#modal-confirm-delete" className="nav-link">Confirm delete modal</a>
                <a href="#modal-change-password" className="nav-link">Change password modal</a>
              </div>
            </div>
            <div className="col">
              <div className="space-y-6">
                
                <div id="modal-simple">
                  <h3>Simple modal</h3>
                  <Modal inline className={modalPreviewClass}>
                    <ModalHeader title="Modal title" />
                    <div className="modal-body">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci animi beatae delectus doloribus eaque eligendi est eum error exertcitationem id lodaer, laboriosam magnam neque doloremque obcaecati optio repellendus sed sequi voluptas, voluptatibus.
                    </div>
                    <ModalFooter />
                  </Modal>
                </div>

                <div id="modal-large">
                  <h3>Large modal</h3>
                  <Modal inline size="lg" className={modalPreviewClass}>
                    <ModalHeader title="Large modal" />
                    <div className="modal-body">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci animi beatae delectus doloribus eaque eligendi est eum error exertcitationem id lodaer, laboriosam magnam neque doloremque obcaecati optio repellendus sed sequi voluptas, voluptatibus.
                    </div>
                    <ModalFooter />
                  </Modal>
                </div>

                <div id="modal-small">
                  <h3>Small modal</h3>
                  <Modal inline size="sm" className={modalPreviewClass}>
                    <ModalHeader title="Small modal" />
                    <div className="modal-body">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci animi beatae delectus doloribus eaque eligendi est eum error exertcitationem id lodaer, laboriosam magnam neque doloremque obcaecati optio repellendus sed sequi voluptas, voluptatibus.
                    </div>
                    <ModalFooter />
                  </Modal>
                </div>

                <div id="modal-full-width">
                  <h3>Full width modal</h3>
                  <Modal inline size="full-width" className={modalPreviewClass}>
                    <ModalHeader title="Full width modal" />
                    <div className="modal-body">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci animi beatae delectus doloribus eaque eligendi est eum error exertcitationem id lodaer, laboriosam magnam neque doloremque obcaecati optio repellendus sed sequi voluptas, voluptatibus.
                    </div>
                    <ModalFooter />
                  </Modal>
                </div>

                <div id="modal-scrollable">
                  <h3>Scrollable modal</h3>
                  <Modal inline scrollable className={modalPreviewClass} style={{ maxHeight: '30rem' }}>
                    <ModalHeader title="Scrollable modal" />
                    <div className="modal-body">
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci animi beatae delectus doloribus eaque eligendi est eum error exertcitationem id lodaer, laboriosam magnam neque doloremque obcaecati optio repellendus sed sequi voluptas, voluptatibus.</p>
                      <p>Terrible things happened in the past. But it's okay, because we can learn from them. And we can make a better future for everyone.</p>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci animi beatae delectus doloribus eaque eligendi est eum error exertcitationem id lodaer, laboriosam magnam neque doloremque obcaecati optio repellendus sed sequi voluptas, voluptatibus.</p>
                      <p>Terrible things happened in the past. But it's okay, because we can learn from them. And we can make a better future for everyone.</p>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci animi beatae delectus doloribus eaque eligendi est eum error exertcitationem id lodaer, laboriosam magnam neque doloremque obcaecati optio repellendus sed sequi voluptas, voluptatibus.</p>
                    </div>
                    <ModalFooter />
                  </Modal>
                </div>

                <div id="modal-report">
                  <h3>Modal with form</h3>
                  <Modal inline size="lg" className={modalPreviewClass}>
                    <ModalHeader title="New Report" />
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" name="example-text-input" placeholder="Your report name" />
                      </div>
                      <label className="form-label">Report type</label>
                      <div className="form-selectgroup-boxes row mb-3">
                        <div className="col-lg-6">
                          <label className="form-selectgroup-item">
                            <input type="radio" name="report-type" value="1" className="form-selectgroup-input" defaultChecked />
                            <span className="form-selectgroup-label d-flex align-items-center p-3">
                              <span className="me-3">
                                <span className="form-selectgroup-check"></span>
                              </span>
                              <span className="form-selectgroup-label-content">
                                <span className="form-selectgroup-title strong mb-1">Simple</span>
                                <span className="d-block text-secondary">Provide only basic data needed for the report</span>
                              </span>
                            </span>
                          </label>
                        </div>
                        <div className="col-lg-6">
                          <label className="form-selectgroup-item">
                            <input type="radio" name="report-type" value="1" className="form-selectgroup-input" />
                            <span className="form-selectgroup-label d-flex align-items-center p-3">
                              <span className="me-3">
                                <span className="form-selectgroup-check"></span>
                              </span>
                              <span className="form-selectgroup-label-content">
                                <span className="form-selectgroup-title strong mb-1">Advanced</span>
                                <span className="d-block text-secondary">Full control over all report settings</span>
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-8">
                          <div className="mb-3">
                            <label className="form-label">Report url</label>
                            <div className="input-group input-group-flat">
                              <span className="input-group-text">https://tabler.io/reports/</span>
                              <input type="text" className="form-control ps-0" defaultValue="report-01" autoComplete="off" />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="mb-3">
                            <label className="form-label">Visibility</label>
                            <select className="form-select" defaultValue="2">
                              <option value="1">Private</option>
                              <option value="2">Public</option>
                              <option value="3">Hidden</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label">Client name</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label">Reporting period</label>
                            <input type="date" className="form-control" />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div>
                            <label className="form-label">Additional information</label>
                            <textarea className="form-control" rows={3}></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ModalFooter submitLabel="Create new report">
                      <button type="button" className="btn btn-link link-secondary me-auto" data-bs-dismiss="modal">Cancel</button>
                      <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Create new report</button>
                    </ModalFooter>
                  </Modal>
                </div>

                <div id="modal-success">
                  <h3>Success modal</h3>
                  <Modal inline size="sm" className={modalPreviewClass}>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div className="modal-status bg-success"></div>
                    <div className="modal-body text-center py-4">
                      <Icon icon="circle-check" size="lg" color="success" className="mb-2" />
                      <h3>Payment succeeded</h3>
                      <div className="text-secondary">Your payment of $290 has been successfully submitted. Your receipt has been sent to your email.</div>
                    </div>
                    <div className="modal-footer">
                      <div className="w-100">
                        <div className="row">
                          <div className="col"><a href="#" className="btn w-100" data-bs-dismiss="modal">Go to dashboard</a></div>
                        </div>
                      </div>
                    </div>
                  </Modal>
                </div>

                <div id="modal-danger">
                  <h3>Danger modal</h3>
                  <Modal inline size="sm" className={modalPreviewClass}>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div className="modal-status bg-danger"></div>
                    <div className="modal-body text-center py-4">
                      <Icon icon="alert-triangle" size="lg" color="danger" className="mb-2" />
                      <h3>Are you sure?</h3>
                      <div className="text-secondary">Do you really want to remove 84 files? What you've done cannot be undone.</div>
                    </div>
                    <div className="modal-footer">
                      <div className="w-100">
                        <div className="row">
                          <div className="col"><a href="#" className="btn w-100" data-bs-dismiss="modal">Cancel</a></div>
                          <div className="col"><a href="#" className="btn btn-danger w-100" data-bs-dismiss="modal">Delete 84 files</a></div>
                        </div>
                      </div>
                    </div>
                  </Modal>
                </div>

                <div id="modal-team">
                  <h3>Modal with simple form</h3>
                  <Modal inline className={modalPreviewClass}>
                    <ModalHeader title="Add a new team" />
                    <div className="modal-body">
                      <div className="row mb-3 align-items-end">
                        <div className="col-auto">
                          <a href="#" className="avatar avatar-upload rounded">
                            <Icon icon="plus" />
                            <span className="avatar-upload-text">Add</span>
                          </a>
                        </div>
                        <div className="col">
                          <label className="form-label">Name</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Pick your team color</label>
                        <div className="row g-2">
                          <div className="col-auto">
                            <label className="form-colorinput">
                              <input name="color" type="radio" value="blue" className="form-colorinput-input" defaultChecked />
                              <span className="form-colorinput-color bg-blue"></span>
                            </label>
                          </div>
                          <div className="col-auto">
                            <label className="form-colorinput">
                              <input name="color" type="radio" value="purple" className="form-colorinput-input" />
                              <span className="form-colorinput-color bg-purple"></span>
                            </label>
                          </div>
                          <div className="col-auto">
                            <label className="form-colorinput">
                              <input name="color" type="radio" value="red" className="form-colorinput-input" />
                              <span className="form-colorinput-color bg-red"></span>
                            </label>
                          </div>
                          <div className="col-auto">
                            <label className="form-colorinput">
                              <input name="color" type="radio" value="orange" className="form-colorinput-input" />
                              <span className="form-colorinput-color bg-orange"></span>
                            </label>
                          </div>
                          <div className="col-auto">
                            <label className="form-colorinput">
                              <input name="color" type="radio" value="green" className="form-colorinput-input" />
                              <span className="form-colorinput-color bg-green"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Additional info</label>
                        <textarea className="form-control"></textarea>
                      </div>
                    </div>
                    <ModalFooter submitLabel="Create new team" />
                  </Modal>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
