// src/components/cards/NavbarApps.tsx
import { Icon } from '../ui/Icon'
import socialsData from '../../data/socials.json'

const icons = import.meta.glob(
  '/node_modules/@tabler/core/dist/img/social/*.svg',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>

function getSocialIcon(file: string): string {
  return icons[`/node_modules/@tabler/core/dist/img/social/${file}.svg`] ?? ''
}

interface Social {
  name: string
  file: string
}

interface NavbarAppsProps {
  apps?: Social[]
  limit?: number
}

export function NavbarApps({
  apps = socialsData as Social[],
  limit = 12,
}: NavbarAppsProps) {
  const items = apps.slice(0, limit)

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">My Apps</div>
        <div className="card-actions btn-actions">
          <a href="#" className="btn-action" title="Manage apps">
            <Icon icon="settings" />
          </a>
        </div>
      </div>
      <div className="card-body scroll-y p-2" style={{ maxHeight: '50vh' }}>
        <div className="row g-0">
          {items.map((app) => (
            <div key={app.file} className="col-4">
              <a
                href="#"
                className="d-flex flex-column flex-center text-center text-secondary py-2 px-2 link-hoverable"
              >
                <img
                  src={getSocialIcon(app.file)}
                  className="w-6 h-6 mx-auto mb-2"
                  width={24}
                  height={24}
                  alt={app.name}
                />
                <span className="h5">{app.name}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}