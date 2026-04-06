// src/pages/EmailsPage.tsx
import { useState, useEffect, useRef } from 'react'
import BaseLayout from '../layouts/BaseLayout'
import { Icon } from '../components/ui/Icon'
import emailsData from '../data/emails.json'

interface EmailInfo {
  descriptionShort: string
  descriptionLong: string
  width: number
  height: number
  widthFull: number
  heightFull: number
}

const emails = Object.entries(emailsData as Record<string, EmailInfo>)

export default function EmailsPage() {
  const [selectedEmail, setSelectedEmail] = useState<{
    key: string
    info: EmailInfo
  } | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal on backdrop click or close button
  useEffect(() => {
    if (!selectedEmail) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEmail(null)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [selectedEmail])

  return (
    <BaseLayout
      pageTitle="Email templates"
      pagePretitle="Addons"
    >
      <div className="row row-cards">
        {/* Banner Card */}
        <div className="col-12">
          <div className="card card-md">
            <div className="card-stamp card-stamp-lg">
              <div className="card-stamp-icon bg-primary">
                <Icon icon="mail" />
              </div>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-10">
                  <h3 className="h1">Tabler Emails</h3>
                  <div className="prose text-secondary fs-3">
                    {emails.length} eye-catching, customizable and responsive email templates to
                    improve your email communication. No coding skills needed.
                  </div>
                  <div className="mt-3">
                    <a
                      href="https://tabler.io/emails"
                      className="btn btn-primary"
                      target="_blank"
                      rel="noopener"
                    >
                      Buy all emails for $49
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Grid */}
        <div className="col-12">
          <div className="row row-cards">
            {emails.map(([key, info]) => (
              <div className="col-4" key={key}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedEmail({ key, info })
                  }}
                >
                  <img
                    src={`/static/emails/${key}.jpg`}
                    className="img-fluid rounded"
                    alt={info.descriptionShort || key}
                    width={info.width}
                    height={info.height}
                    loading="lazy"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email Preview Modal */}
      {selectedEmail && (
        <div
          className="modal fade show d-block"
          id="email-modal"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedEmail(null)
          }}
          ref={modalRef}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setSelectedEmail(null)}
              />
              <div className="modal-body p-0">
                <div className="row g-0">
                  <div className="col-6">
                    <div className="p-6 bg-surface-secondary rounded-start">
                      <img
                        src={`/static/emails/${selectedEmail.key}.jpg`}
                        className="img-fluid rounded-start"
                        alt={selectedEmail.info.descriptionShort || selectedEmail.key}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-7">
                      <div className="prose">
                        <h3>{selectedEmail.info.descriptionShort || selectedEmail.key}</h3>
                        <p>{selectedEmail.info.descriptionLong}</p>
                      </div>
                      <div className="mt-6">
                        <a
                          href="https://tabler.io/emails"
                          className="btn btn-primary w-100"
                          target="_blank"
                          rel="noopener"
                        >
                          Buy {emails.length} emails for $49
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseLayout>
  )
}
