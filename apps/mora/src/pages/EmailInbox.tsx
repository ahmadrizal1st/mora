import { useState } from 'react'
import BaseLayout from '../layouts/BaseLayout'
import { Icon } from '../components/ui/Icon'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import { Modal, ModalHeader, ModalFooter } from '../components/ui/Modal'

import type { Mail } from '../types'

interface EmailInboxProps {
  mails?: Mail[]
}

const LABELS = [
  { color: 'info', name: 'Updates' },
  { color: 'warning', name: 'Friends' },
  { color: 'success', name: 'Family' },
  { color: 'primary', name: 'Social' },
  { color: 'danger', name: 'Important' },
  { color: 'purple', name: 'Promotions' },
]

export default function EmailInbox({ mails = [] }: EmailInboxProps) {
  const [checkedMails, setCheckedMails] = useState<Set<string | number>>(new Set())
  const [starredMails, setStarredMails] = useState<Set<string | number>>(
    new Set(mails.filter(m => m.starred).map(m => m.id))
  )

  const toggleCheck = (id: string | number) => {
    const next = new Set(checkedMails)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setCheckedMails(next)
  }

  const toggleStar = (id: string | number) => {
    const next = new Set(starredMails)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setStarredMails(next)
  }

  return (
    <BaseLayout pageTitle="Inbox">
      <div className="card">
        <div className="row g-0">
          <div className="col-xxl-3 email-border border-end">
            <div className="offcanvas-xxl offcanvas-start h-100 file-offcanvas" tabIndex={-1} id="emailSidebaroffcanvas">
              <div className="card-body h-100">
                <div>
                  <Button
                    icon="pencil"
                    text="Compose"
                    color="primary"
                    className="d-none d-sm-block"
                    modalId="new-email"
                  />
                </div>

                <div className="mt-3 nav nav-vertical">
                  <a href="#" className="nav-link text-danger fw-bold">
                    <Icon icon="inbox" className="me-2" />
                    Inbox<span className="badge badge-danger ms-auto">{mails.length}</span>
                  </a>
                  <a href="#" className="nav-link">
                    <Icon icon="star" className="me-2" />Starred
                  </a>
                  <a href="#" className="nav-link">
                    <Icon icon="clock" className="me-2" />Snoozed
                  </a>
                  <a href="#" className="nav-link ">
                    <Icon icon="file" className="me-2" />Draft<span className="badge badge-info ms-auto">32</span>
                  </a>
                  <a href="#" className="nav-link">
                    <Icon icon="mail-up" className="me-2" />Sent Mail
                  </a>
                  <a href="#" className="nav-link">
                    <Icon icon="trash" className="me-2" />Trash
                  </a>
                  <a href="#" className="nav-link">
                    <Icon icon="tag" className="me-2" />Important
                  </a>
                  <a href="#" className="nav-link">
                    <Icon icon="alert-octagon" className="me-2" />Spam
                  </a>
                </div>

                <div className="mt-4">
                  <h6 className="subheader">Labels</h6>
                  <div className="mt-2 nav nav-vertical">
                    {LABELS.map(label => (
                      <a key={label.name} href="#" className="nav-link">
                        <div className={`badge bg-${label.color} me-2`}></div> {label.name}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <h6 className="subheader">Storage</h6>
                  <Progress value={46} className="my-2" color="primary" />
                  <p className="text-muted font-13 mb-0">7.02 GB (46%) of 15 GB used</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-9">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <div className="d-xxl-none d-inline-flex">
                  <button
                    className="btn btn-icon"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#emailSidebaroffcanvas"
                    aria-controls="emailSidebaroffcanvas"
                  >
                    <Icon icon="menu-2" />
                  </button>
                </div>

                <div className="btn-group">
                  <Button icon="archive" iconOnly />
                  <Button icon="alert-octagon" iconOnly />
                  <Button icon="trash" iconOnly />
                </div>

                <div className="btn-group">
                  <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <Icon icon="folder" className="me-1" />
                  </button>
                  <div className="dropdown-menu">
                    <span className="dropdown-header">Move to</span>
                    <a className="dropdown-item" href="#">Social</a>
                    <a className="dropdown-item" href="#">Promotions</a>
                    <a className="dropdown-item" href="#">Updates</a>
                    <a className="dropdown-item" href="#">Forums</a>
                  </div>
                </div>

                <div className="btn-group">
                  <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <Icon icon="tag" className="me-1" />
                  </button>
                  <div className="dropdown-menu">
                    <span className="dropdown-header">Label as:</span>
                    <a className="dropdown-item" href="#">Updates</a>
                    <a className="dropdown-item" href="#">Social</a>
                    <a className="dropdown-item" href="#">Promotions</a>
                    <a className="dropdown-item" href="#">Forums</a>
                  </div>
                </div>

                <div className="btn-group">
                  <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <Icon icon="dots" /> More
                  </button>
                  <div className="dropdown-menu">
                    <span className="dropdown-header">More Options :</span>
                    <a className="dropdown-item" href="#">Mark as Unread</a>
                    <a className="dropdown-item" href="#">Add to Tasks</a>
                    <a className="dropdown-item" href="#">Add Star</a>
                    <a className="dropdown-item" href="#">Mute</a>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <ul className="email-list">
                  {mails && mails.length > 0 ? (
                    mails.map(mail => (
                      <li key={mail.id}>
                        <div className="email-sender-info">
                          <div className="checkbox-wrapper-mail">
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={`mail-${mail.id}`}
                                checked={checkedMails.has(mail.id)}
                                onChange={() => toggleCheck(mail.id)}
                              />
                              <label className="form-check-label" htmlFor={`mail-${mail.id}`}></label>
                            </div>
                          </div>
                          <span
                            className={`star-toggle${starredMails.has(mail.id) ? ' starred' : ''}`}
                            onClick={() => toggleStar(mail.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <Icon icon="star" filled={starredMails.has(mail.id)} />
                          </span>
                          <a href="#" className="email-title">{mail.sender}</a>
                        </div>

                        <div className="email-content">
                          <a href="#" className="email-subject">
                            {mail.subject} &nbsp;–&nbsp;
                            <span className="text-secondary">{mail.preview}</span>
                          </a>
                          <div className="email-date">{mail.date ? new Date(mail.date).toLocaleDateString() : ''}</div>
                        </div>

                        <div className="email-action-icons">
                          <ul className="list-inline">
                            <li className="list-inline-item">
                              <a href="#"><Icon icon="archive" /></a>
                            </li>
                            <li className="list-inline-item">
                              <a href="#"><Icon icon="trash" /></a>
                            </li>
                            <li className="list-inline-item">
                              <a href="#">
                                <Icon icon="mail-opened" className="email-action-icons-item" />
                              </a>
                            </li>
                            <li className="list-inline-item">
                              <a href="#"><Icon icon="clock" /></a>
                            </li>
                          </ul>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted">No emails</li>
                  )}
                </ul>
              </div>

              <div className="row">
                <div className="col-7 mt-1">
                  Showing 1 - {mails.length} of {mails.length}
                </div>
                <div className="col-5">
                  <div className="btn-group float-end">
                    <button type="button" className="btn btn-icon">
                      <Icon icon="chevron-left" />
                    </button>
                    <button type="button" className="btn btn-icon">
                      <Icon icon="chevron-right" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal id="modal-new-email">
        <ModalHeader title="New Email" />
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">To</label>
            <input type="text" className="form-control" placeholder="Recipient" />
          </div>
          <div className="mb-3">
            <label className="form-label">Subject</label>
            <input type="text" className="form-control" placeholder="Subject" />
          </div>
          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea className="form-control" rows={6} placeholder="Type your message..."></textarea>
          </div>
        </div>
        <ModalFooter submitLabel="Send" />
      </Modal>
    </BaseLayout>
  )
}