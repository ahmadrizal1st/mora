// src/components/parts/TasksBoard.tsx
import { Icon } from '../ui/Icon'

interface Subtask {
  name: string
  done?: boolean
}

interface Task {
  name: string
  color?: string
  starred?: boolean
  description?: string
  image?: string
  dueDate?: string
  favorite?: boolean
  likes?: number
  comments?: number
  subtasks?: Subtask[]
}

interface TaskColumn {
  name: string
  tasks: Task[]
}

interface TasksBoardProps {
  columns?: TaskColumn[]
  className?: string
}

export function TasksBoard({ columns = [], className }: TasksBoardProps) {
  return (
    <div className={`row${className ? ` ${className}` : ''}`}>
      {columns.map((column) => (
        <div key={column.name} className="col-12 col-md-6 col-lg">
          <h2 className="mb-3">{column.name}</h2>
          <div className="mb-4">
            <div className="row row-cards">
              {column.tasks.map((task, i) => (
                <div key={i} className="col-12">
                  <div className="card card-sm">
                    {task.color && (
                      <div className={`card-status-top bg-${task.color}`} />
                    )}
                    {task.starred && (
                      <div className="ribbon ribbon-top ribbon-bookmark bg-yellow">
                        <Icon icon="star" />
                      </div>
                    )}
                    <div className="card-body">
                      <h3 className="card-title">{task.name}</h3>
                      {task.description && (
                        <div className="text-secondary">{task.description}</div>
                      )}
                      {task.image && (
                        <div className="ratio ratio-16x9">
                          <img src={task.image} className="rounded object-cover" alt={task.name} />
                        </div>
                      )}
                      <div className="mt-4">
                        <div className="row">
                          <div className="col-auto text-secondary">
                            {task.likes !== undefined && (
                              <>
                                <Icon icon="heart" />
                                {task.likes}
                              </>
                            )}
                          </div>
                          {task.dueDate && (
                            <div className="col-auto">
                              <a href="#" className="link-warning">
                                <Icon icon="calendar" />
                                {task.dueDate}
                              </a>
                            </div>
                          )}
                          {task.comments !== undefined && (
                            <div className="col-auto">
                              <a href="#" className="link-secondary">
                                <Icon icon="message" /> {task.comments}
                              </a>
                            </div>
                          )}
                          <div className="col-auto">
                            <a href="#" className="link-secondary">
                              <Icon icon="share" />
                            </a>
                          </div>
                        </div>
                      </div>
                      {task.subtasks && (
                        <div className="divide-y-2 mt-4">
                          {task.subtasks.map((sub, j) => (
                            <div key={j}>
                              <Icon icon="check" color={sub.done ? 'muted' : 'green'} />
                              {sub.done
                                ? <span className="text-secondary text-decoration-line-through">{sub.name}</span>
                                : sub.name
                              }
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}