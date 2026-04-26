// src/components/cards/TabsCard.tsx
import { useState } from 'react'
import { Icon } from '../ui/Icon'
import { DropdownMenu } from '../ui/DropdownMenu'

interface TabsCardProps {
  id: string
  settings?: boolean
  reverse?: boolean
  icons?: boolean
  dropdown?: boolean
  justified?: boolean
  activity?: boolean
  disabled?: boolean
  animation?: boolean
}

export function TabsCard({
  id,
  settings,
  reverse,
  icons,
  dropdown,
  justified,
  activity,
  disabled,
  animation,
}: TabsCardProps) {
  const [activeTab, setActiveTab] = useState('home')

  const navClass = [
    'nav',
    'nav-tabs',
    'card-header-tabs',
    reverse ? 'flex-row-reverse' : '',
    justified ? 'nav-fill' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const paneClass = (tab: string) =>
    [
      'tab-pane',
      animation ? 'fade' : '',
      activeTab === tab ? 'active show' : '',
    ]
      .filter(Boolean)
      .join(' ')

  const handleTabClick = (e: React.MouseEvent, tab: string) => {
    e.preventDefault()
    setActiveTab(tab)
  }

  return (
    <div className="card">
      <div className="card-header">
        <ul className={navClass} data-bs-toggle="tabs">
          <li className="nav-item">
            <a
              href={`#tabs-home-${id}`}
              className={['nav-link', activeTab === 'home' ? 'active' : ''].join(' ')}
              data-bs-toggle="tab"
              onClick={(e) => handleTabClick(e, 'home')}
            >
              {icons && <Icon icon="home" className="me-2" />}
              Home
            </a>
          </li>
          <li className="nav-item">
            <a
              href={`#tabs-profile-${id}`}
              className={['nav-link', activeTab === 'profile' ? 'active' : ''].join(' ')}
              data-bs-toggle="tab"
              onClick={(e) => handleTabClick(e, 'profile')}
            >
              {icons && <Icon icon="user" className="me-2" />}
              Profile
            </a>
          </li>

          {activity && (
            <li className="nav-item">
              <a
                href={`#tabs-activity-${id}`}
                className={['nav-link', activeTab === 'activity' ? 'active' : ''].join(' ')}
                data-bs-toggle="tab"
                onClick={(e) => handleTabClick(e, 'activity')}
              >
                {icons && <Icon icon="activity" className="me-2" />}
                Activity
              </a>
            </li>
          )}

          {disabled && (
            <li className="nav-item">
              <a
                href="#"
                className="nav-link disabled"
                data-bs-toggle="tab"
                onClick={(e) => e.preventDefault()}
              >
                {icons && <Icon icon="x" className="me-2" />}
                Disabled
              </a>
            </li>
          )}

          {dropdown && (
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Dropdown
              </a>
              <DropdownMenu triggerless />
            </li>
          )}

          {settings && (
            <li className={['nav-item', reverse ? 'me-auto' : 'ms-auto'].join(' ')}>
              <a
                href={`#tabs-settings-${id}`}
                className={['nav-link', activeTab === 'settings' ? 'active' : ''].join(' ')}
                title="Settings"
                data-bs-toggle="tab"
                onClick={(e) => handleTabClick(e, 'settings')}
              >
                <Icon icon="settings" />
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="card-body">
        <div className="tab-content">
          <div className={paneClass('home')} id={`tabs-home-${id}`}>
            <h4>Home tab</h4>
            <div>
              Cursus turpis vestibulum, dui in pharetra vulputate id sed non turpis ultricies fringilla at sed facilisis
              lacus pellentesque purus nibh
            </div>
          </div>
          <div className={paneClass('profile')} id={`tabs-profile-${id}`}>
            <h4>Profile tab</h4>
            <div>
              Fringilla egestas nunc quis tellus diam rhoncus ultricies tristique enim at diam, sem nunc amet,
              pellentesque id egestas velit sed
            </div>
          </div>
          {settings && (
            <div className={paneClass('settings')} id={`tabs-settings-${id}`}>
              <h4>Settings tab</h4>
              <div>
                Donec ac vitae diam amet vel leo egestas consequat rhoncus in luctus amet, facilisi sit mauris accumsan
                nibh habitant senectus
              </div>
            </div>
          )}
          {activity && (
            <div className={paneClass('activity')} id={`tabs-activity-${id}`}>
              <h4>Activity tab</h4>
              <div>
                Donec ac vitae diam amet vel leo egestas consequat rhoncus in luctus amet, facilisi sit mauris accumsan
                nibh habitant senectus
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}