// src/components/cards/UserInfoCard.tsx
import { Icon } from '../ui/Icon'
import { Flag } from '../ui/Flag'

import type { Person } from '../../types'

interface UserInfoCardProps {
  person?: Person
  title?: string
}

interface InfoRowProps {
  icon: string
  label: string
  value?: string
  children?: React.ReactNode
}

function InfoRow({ icon, label, value, children }: InfoRowProps) {
  return (
    <div className="mb-2">
      <Icon icon={icon} className="me-2 text-secondary" />
      {label}: <strong>{children || value}</strong>
    </div>
  )
}

export function UserInfoCard({ person, title = 'Basic info' }: UserInfoCardProps) {
  if (!person) return null

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-title">{title}</div>

        <InfoRow icon="book" label="Went to" value={person.university} />
        <InfoRow icon="briefcase" label="Worked at" value={person.company} />
        <InfoRow icon="home" label="Lives in" value={`${person.city}, ${person.country}`} />

        <div className="mb-2">
          <Icon icon="map-pin" className="me-2 text-secondary" />
          From:{' '}
          <strong>
            <Flag size="xs" flag={person.country_code} />{' '}
            {person.country}
          </strong>
        </div>

        <InfoRow icon="calendar" label="Birth date" value={person.birth_date} />

        <div>
          <Icon icon="clock" className="me-2 text-secondary" />
          Time zone: <strong>{person.time_zone}</strong>
        </div>
      </div>
    </div>
  )
}