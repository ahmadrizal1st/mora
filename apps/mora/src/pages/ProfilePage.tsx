import BaseLayout from '@/shared/layouts/BaseLayout'
import { 
  Avatar, 
  Button, 
  Icon, 
  Timeline, 
  TimelineItem 
} from '@/shared/components/ui'
import { UserInfoCard } from '@/shared/components/cards/UserInfoCard'
import peopleData from '@/shared/data/people.json'
import type { Person } from '@/shared/types/common.types'

const people = peopleData as Person[]

export default function ProfilePage() {
  const person = people[3] ?? {
    id: 4,
    full_name: 'Dunn Slane',
    job_title: 'Research Nurse',
    university: 'Harbin University of Civil Engineering & Architecture',
    email: 'dslane3@epa.gov',
    birth_date: '15/10/1972',
    city: 'Liutang',
    country: 'China',
  }

  return (
    <BaseLayout flush noContainer bodyClass="p-0">
      {/* Profile Page Header */}
      <div className="page-header pt-0 m-0 border-0">
        <div className="d-flex justify-content-between align-items-center d-md-none mt-0 mb-3 px-3 pt-3">
          <Button icon="plus" iconOnly ghost size="md" className="p-0 text-secondary" />
          <Button icon="menu-2" iconOnly ghost size="md" className="p-0 text-secondary" />
        </div>
        <div className="container-xl">
          <div className="row g-3 align-items-center flex-column flex-md-row text-center text-md-start">
            <div className="col-auto">
              <Avatar
                person={person as any}
                size="xl"
                shape="rounded"
              />
            </div>
            <div className="col">
              <h1 className="fw-bold m-0">{person.full_name}</h1>
              <div className="my-2 text-secondary">
                Unemployed. Building a $1M solo business while traveling the world. Currently at $400k/yr.
              </div>
              <div className="list-inline list-inline-dots text-secondary justify-content-center justify-content-md-start">
                <div className="list-inline-item">
                  <Icon icon="map-pin" />
                  {' '}{person.university}, {person.country}
                </div>
                <div className="list-inline-item">
                  <Icon icon="mail" />
                  {' '}<a href={`mailto:${person.email}`} className="text-reset">{person.email}</a>
                </div>
                <div className="list-inline-item d-none d-sm-inline-block">
                  <Icon icon="cake" />
                  {' '}{person.birth_date}
                </div>
              </div>
            </div>
            <div className="col-auto ms-md-auto w-100 w-md-auto">
              <div className="btn-list justify-content-center justify-content-md-start">
                <Button icon="dots" iconOnly />
                <Button icon="message" iconOnly />
                <Button icon="check" color="primary" text="Following" className="flex-fill flex-md-grow-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row g-3">
            {/* Left Column: Timeline */}
            <div className="col">
              <Timeline>
                <TimelineItem
                  time="10 hrs ago"
                  title="+1150 Followers"
                  description="You're getting more and more followers, keep it up!"
                  icon="brand-x"
                  iconBg="x"
                />
                <TimelineItem
                  time="2 hrs ago"
                  title="+3 New Products were added!"
                  description="Congratulations!"
                  icon="briefcase"
                />
                <TimelineItem
                  time="1 day ago"
                  title="Database backup completed!"
                  description="Download the latest backup."
                  icon="check"
                />
                <TimelineItem
                  time="1 day ago"
                  title="+290 Page Likes"
                  description="This is great, keep it up!"
                  icon="brand-facebook"
                  iconBg="facebook"
                />
                <TimelineItem
                  time="2 days ago"
                  title="+3 Friend Requests"
                  icon="user-plus"
                >
                  <div className="avatar-list mt-3">
                    {people.slice(0, 3).map((p: any, i: number) => (
                      <Avatar key={i} person={p} status="success" />
                    ))}
                  </div>
                </TimelineItem>
                <TimelineItem
                  time="3 days ago"
                  title="+3 New photos"
                  icon="photo"
                >
                  <div className="mt-3">
                    <div className="row g-2">
                      <div className="col-4">
                        <img
                          src="/static/photos/city-lights-reflected-in-the-water-at-night.jpg"
                          className="rounded w-100"
                          alt="Photo 1"
                        />
                      </div>
                      <div className="col-4">
                        <img
                          src="/static/photos/color-palette-guide-sample-colors-catalog-.jpg"
                          className="rounded w-100"
                          alt="Photo 2"
                        />
                      </div>
                      <div className="col-4">
                        <img
                          src="/static/photos/finances-us-dollars-and-bitcoins-currency-money.jpg"
                          className="rounded w-100"
                          alt="Photo 3"
                        />
                      </div>
                    </div>
                  </div>
                </TimelineItem>
                <TimelineItem
                  time="2 weeks ago"
                  title="System updated to v2.02"
                  description="Check the complete changelog at the activity page."
                  icon="settings"
                />
              </Timeline>
            </div>

            {/* Right Column: User Info & About Me */}
            <div className="col-lg-4">
              <div className="row row-cards">
                <div className="col-12">
                  <UserInfoCard person={person as any} />
                </div>
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h2 className="card-title">About Me</h2>
                      <div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aliquid beatae eaque eius
                          esse fugit, hic id illo itaque modi molestias nemo perferendis quae rerum soluta. Blanditiis
                          laborum minima molestiae molestias nemo nesciunt nisi pariatur quae sapiente ut. Aut consectetur
                          doloremque, error impedit, ipsum labore laboriosam minima non omnis perspiciatis possimus
                          praesentium provident quo recusandae suscipit tempore totam.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
