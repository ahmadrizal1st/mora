// src/pages/Badges.tsx
// Converted from preview/pages/badges.html

import BaseLayout from '../layouts/BaseLayout'
import { Icon } from '../components/ui/Icon'
import { DropdownMenu } from '../components/ui/DropdownMenu'
import siteData from '../data/site.json'

const badgeColors = ['default', ...Object.keys(siteData.colors), 'dark', 'light'];

// Capitalize first letter — mirrors Liquid's `uc_first` filter
const ucFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const sizes = ['sm', 'md', 'lg'] as const

export default function Badges() {
  return (
    <BaseLayout pageTitle="Badges">
      <div className="row row-cards">

        {/* Left column */}
        <div className="col-4">
          <div className="row row-cards">

            {/* Heading badges */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map(Tag => (
                    <Tag key={Tag}>
                      Example heading <span className="badge">New</span>
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            {/* Badge sizes */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Badge sizes</h3>
                  <div className="space-y">
                    {sizes.map(size => (
                      <div key={size} className="badges-list">
                        <span className={`badge${size !== 'md' ? ` badge-${size}` : ''}`}>
                          Default
                        </span>
                        <span className={`badge${size !== 'md' ? ` badge-${size}` : ''}`}>
                          <Icon icon="check" /> Left icon
                        </span>
                        <span className={`badge${size !== 'md' ? ` badge-${size}` : ''}`}>
                          Right icon <Icon icon="arrow-right" />
                        </span>
                        <span className={`badge badge-icononly${size !== 'md' ? ` badge-${size}` : ''}`}>
                          <Icon icon="star" filled />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Positioned badges */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Positioned badges</h3>
                  <div className="btn-list">
                    <button type="button" className="btn">
                      Notifications <span className="badge text-bg-secondary ms-2">4</span>
                    </button>
                    <button type="button" className="btn">
                      Inbox
                      <span className="badge bg-red badge-notification text-red-fg">
                        9+
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    </button>
                    <button type="button" className="btn">
                      Profile
                      <span className="badge badge-dot bg-red badge-notification" />
                    </button>
                    <button type="button" className="btn">
                      Settings
                      <span className="badge badge-dot bg-red badge-notification badge-blink" />
                    </button>
                    <button type="button" className="btn btn-icon">
                      <Icon icon="bell" />
                      <span className="badge badge-dot bg-red badge-notification badge-blink" />
                    </button>
                    <button type="button" className="btn btn-icon btn-action">
                      <Icon icon="bell" />
                      <span className="badge badge-dot bg-red badge-notification" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right wide column */}
        <div className="col-8">
          <div className="row row-cards">

            {/* Basic badges */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Basic badges</h3>
                  <div className="badges-list">
                    {badgeColors.map(color => (
                      <span key={color} className={`badge bg-${color} text-${color}-fg`}>
                        {ucFirst(color)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Light badges */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Light badges</h3>
                  <div className="badges-list">
                    {badgeColors.map(color => (
                      <span key={color} className={`badge bg-${color}-lt`}>
                        {ucFirst(color)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Outline badges */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Outline badges</h3>
                  <div className="badges-list">
                    {badgeColors.map(color => (
                      <span key={color} className={`badge badge-outline text-${color}`}>
                        {ucFirst(color)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges with icons */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Badges with icons</h3>
                  <div className="badges-list">
                    {badgeColors.map(color => (
                      <span key={color} className={`badge bg-${color} text-${color}-fg`}>
                        <Icon icon="star" filled /> {ucFirst(color)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Dropdown with badge */}
        <div className="col-sm-6 col-lg-3">
          <DropdownMenu show badge arrow />
        </div>

        {/* Badge in buttons */}
        <div className="col-sm-6 col-lg-9">
          <div className="row row-cards">

            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="btn-list">
                    {badgeColors.map((color, index) => (
                      <button key={color} className="btn">
                        {ucFirst(color)} badge{' '}
                        <span className={`badge bg-${color} text-${color}-fg ms-2`}>
                          {index + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="btn-list">
                    {badgeColors.map((color, index) => (
                      <button key={color} className="btn position-relative">
                        {ucFirst(color)} badge{' '}
                        <span className={`badge bg-${color} text-${color}-fg badge-notification badge-pill`}>
                          {index + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="btn-list">
                    {badgeColors.map(color => (
                      <button key={color} className="btn position-relative">
                        {ucFirst(color)} badge{' '}
                        <span className={`badge bg-${color} badge-notification badge-blink`} />
                      </button>
                    ))}
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
