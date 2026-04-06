// src/components/cards/ProjectProgress.tsx
import { Icon } from '../ui/Icon'

import type { Project } from '../../types'

interface ProjectProgressProps {
  project?: Project
  projectId?: number
  progress?: number
  daysAgo?: number
}

export function ProjectProgress({
  project,
  progress = 25,
  daysAgo = 2,
}: ProjectProgressProps) {
  const title = project?.title ?? 'Project Title'
  const image = project?.image

  return (
    <div className="card">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-3">
            {image && (
              <img src={image} alt={title} className="rounded" />
            )}
          </div>
          <div className="col">
            <h3 className="card-title mb-1">
              <a href="#" className="text-reset">{title}</a>
            </h3>
            <div className="text-secondary">
              Updated {daysAgo} {daysAgo === 1 ? 'day' : 'days'} ago
            </div>
            <div className="mt-3">
              <div className="row g-2 align-items-center">
                <div className="col-auto">{progress}%</div>
                <div className="col">
                  <div className="progress progress-sm">
                    <div
                      className="progress-bar"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <div className="dropdown">
              <a href="#" className="btn-action" data-bs-toggle="dropdown">
                <Icon icon="dots-vertical" />
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                <a href="#" className="dropdown-item">Edit</a>
                <a href="#" className="dropdown-item">Delete</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}