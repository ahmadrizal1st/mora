import BaseLayout from '../layouts/BaseLayout'
import { FormCheck, Button, Badge, Icon } from '../components/ui'
import { Breadcrumb } from '../components/ui/Breadcrumb'

import type { JobItem } from '../types'

interface JobListingPageProps {
  jobs: JobItem[]
}

const jobTypes = ['Programming', 'Design', 'Management / Finance', 'Customer Support', 'Sales / Marketing']
const salaries = ['$20K - $50K', '$50K - $100K', '> $100K']

export default function JobListingPage({ jobs }: JobListingPageProps) {
  return (
    <BaseLayout 
      pageTitle="Search for Jobs"
      pageActions={
        <div className="d-flex align-items-center gap-2">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Jobs' }]} />
          <Button color="primary" className="d-none d-sm-inline-block">
            <Icon icon="plus" className="me-2" />
            Add Job
          </Button>
        </div>
      }
    >
      <div className="container-xl">
        <div className="row g-4">
          <div className="col-md-3">
            <form action="./" method="get" autoComplete="off" noValidate className="sticky-top" style={{ top: '1rem' }}>
              <div className="form-label">Job Types</div>
              <div className="mb-4">
                {jobTypes.map((type, index) => (
                  <FormCheck 
                    key={type}
                    title={type}
                    name="form-type[]"
                    defaultChecked={index < 2}
                    className="mb-2"
                  />
                ))}
              </div>

              <div className="form-label">Remote</div>
              <div className="mb-4">
                <FormCheck 
                  type="switch"
                  title="On"
                  name="remote"
                  className="mb-2"
                />
              </div>

              <div className="form-label">Salary Range</div>
              <div className="mb-4">
                {salaries.map((salary, index) => (
                  <FormCheck 
                    key={salary}
                    type="radio"
                    title={salary}
                    name="form-salary"
                    defaultChecked={index < 2}
                    className="mb-2"
                  />
                ))}
              </div>

              <div className="form-label">Immigration</div>
              <div className="mb-4">
                <FormCheck 
                  type="switch"
                  title="On"
                  name="immigration"
                  className="mb-1"
                />
                <div className="small text-secondary">Only show companies that can sponsor a visa</div>
              </div>

              <label className="form-label" htmlFor="job-location">Location</label>
              <div className="mb-4">
                <select className="form-select" id="job-location" name="location">
                  <option>Anywhere</option>
                  <option>London</option>
                  <option>San Francisco</option>
                  <option>New York</option>
                  <option>Berlin</option>
                </select>
              </div>

              <div className="mt-5">
                <Button color="primary" className="w-100 mb-2">
                  Confirm changes
                </Button>
                <Button link className="w-100 text-secondary">
                  Reset to defaults
                </Button>
              </div>
            </form>
          </div>

          <div className="col-md-9">
            <div className="row row-cards">
              <div className="space-y-3">
                {jobs.map((job, index) => (
                  <div className="card shadow-sm" key={index}>
                    <div className="row g-0">
                      <div className="col-auto">
                        <div className="card-body">
                          <div 
                            className="avatar avatar-md border" 
                            style={{ 
                              backgroundImage: `url(/static/jobs/${job.image})`,
                              backgroundColor: '#fff',
                              backgroundSize: 'contain'
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="card-body ps-0">
                          <div className="row">
                            <div className="col">
                              <h3 className="mb-1">
                                <a href="#" className="text-reset">{job.title}</a>
                              </h3>
                            </div>
                            {job.salary && (
                              <div className="col-auto fs-3 text-green fw-medium">
                                {job.salary}
                              </div>
                            )}
                          </div>
                          <div className="row">
                            <div className="col-md">
                              {/* Desktop List */}
                              <div className="mt-2 list-inline list-inline-dots mb-0 text-secondary d-none d-sm-block">
                                <div className="list-inline-item">
                                  <Icon icon="building-community" className="icon-inline me-1" /> {job.company}
                                </div>
                                <div className="list-inline-item">
                                  <Icon icon="license" className="icon-inline me-1" /> {job.type}
                                </div>
                                <div className="list-inline-item">
                                  <Icon icon="map-pin" className="icon-inline me-1" /> {job.location}
                                </div>
                              </div>
                              {/* Mobile List */}
                              <div className="mt-2 list mb-0 text-secondary d-block d-sm-none">
                                <div className="list-item mb-1">
                                  <Icon icon="building-community" className="icon-inline me-1" /> {job.company}
                                </div>
                                <div className="list-item mb-1">
                                  <Icon icon="license" className="icon-inline me-1" /> {job.type}
                                </div>
                                <div className="list-item">
                                  <Icon icon="map-pin" className="icon-inline me-1" /> {job.location}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-auto">
                              <div className="mt-3 badges">
                                {(job.tags || []).map(tag => (
                                  <Badge 
                                    key={tag} 
                                    outline 
                                    pill 
                                    className="text-secondary fw-normal me-1 mb-1"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
