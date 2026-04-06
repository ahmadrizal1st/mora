// src/components/cards/ProjectSummary.tsx
import { Avatar } from '../ui/Avatar'

import type { Person } from '../../types'

interface ProjectSummaryProps {
  title?: string
  date?: string
  stage?: string
  stageColor?: string
  projectColor?: string
  percentage?: number
  percentageColor?: string
  people?: Person[]
  avatarOffset?: number
  avatarLimit?: number
}

export function ProjectSummary({
  title = 'New website',
  date = '28 Aug 2019',
  stage = 'Waiting',
  stageColor = 'green',
  projectColor,
  percentage,
  percentageColor,
  people = [],
  avatarOffset = 0,
  avatarLimit = 4,
}: ProjectSummaryProps) {
  const avatars = people.slice(avatarOffset, avatarOffset + avatarLimit)

  return (
    <div className="card">
      <div className="card-body p-4 py-5 text-center">
        <Avatar
          size="xl"
          placeholder="W"
          className="mb-4"
          color={projectColor}
          shape="rounded"
        />
        <h3 className="mb-0">{title}</h3>
        <p className="text-secondary">Due to: {date}</p>
        <p className="mb-3">
          <span className={`badge bg-${stageColor}-lt`}>{stage}</span>
        </p>
        {avatars.length > 0 && (
          <div className="avatar-list avatar-list-stacked">
            {avatars.map((person, i) => (
              <Avatar key={i} person={person} size="sm" />
            ))}
          </div>
        )}
      </div>
      {percentage !== undefined && (
        <div className="card-progress">
          <div className="progress progress-sm card-progress">
            <div
              className={`progress-bar${percentageColor ? ` bg-${percentageColor}` : ''}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}