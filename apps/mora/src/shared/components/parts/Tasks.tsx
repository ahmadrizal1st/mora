// src/components/parts/Tasks.tsx
import { AvatarList } from '../ui/AvatarList'
import { Icon } from '../ui/Icon'
import { SwitchIcon } from '../ui/SwitchIcon'
import peopleData from '../../data/people.json'

interface Subtask {
  name: string
  done?: boolean
}

interface Task {
  name: string
  description?: string
  image?: string
  color?: string
  starred?: boolean
  users?: number
  'users-offset'?: number
  due_date?: string
  favorite?: boolean
  likes?: number
  comments?: number
  subtasks?: Subtask[]
}

interface Column {
  name: string
  tasks: Task[]
}

interface TasksProps {
  data: {
    columns: Column[]
  }
}

export function Tasks({ data }: TasksProps) {
  return (
    <div className="row">
      {data.columns.map((column, colIdx) => (
        <div key={colIdx} className="col-12 col-md-6 col-lg">
          <h2 className="mb-3">{column.name}</h2>
          <div className="mb-4">
            <div className="row row-cards">
              {column.tasks.map((task, taskIdx) => (
                <div key={taskIdx} className="col-12">
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
                        <div
                          className="text-secondary"
                          dangerouslySetInnerHTML={{ __html: task.description }}
                        />
                      )}

                      {task.image && (
                        <div className="ratio ratio-16x9">
                          <img
                            src={`/tabler/${task.image}`}
                            className="rounded object-cover"
                            alt={task.name}
                          />
                        </div>
                      )}

                      <div className="mt-4">
                        <div className="row">
                          <div className="col">
                            {task.users && (
                              <AvatarList
                                size="xs"
                                stacked
                                people={(peopleData as any[]).slice(
                                  task['users-offset'] || 0,
                                  (task['users-offset'] || 0) + task.users
                                )}
                              />
                            )}
                          </div>

                          {task.due_date && (
                            <div className="col-auto">
                              <a href="#" className="link-warning text-decoration-none d-flex align-items-center gap-1">
                                <Icon icon="calendar" />
                                {task.due_date}
                              </a>
                            </div>
                          )}

                          <div className="col-auto text-secondary d-flex align-items-center gap-1">
                            <SwitchIcon
                              icon="heart"
                              colorB="red"
                              variant="scale"
                              active={task.favorite}
                            />
                            {task.likes && <span>{task.likes}</span>}
                          </div>

                          {task.subtasks && (
                            <div className="col-auto">
                              <a href="#" className="link-secondary text-decoration-none d-flex align-items-center gap-1">
                                <Icon icon="activity" />
                                {task.subtasks.filter(s => s.done).length}/{task.subtasks.length}
                              </a>
                            </div>
                          )}

                          {task.comments && (
                            <div className="col-auto">
                              <a href="#" className="link-secondary text-decoration-none d-flex align-items-center gap-1">
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
                          {task.subtasks.map((subtask, subIdx) => (
                            <div key={subIdx}>
                              {subtask.done ? (
                                <>
                                  <Icon icon="check" className="text-muted me-2" />
                                  <span className="text-secondary text-decoration-line-through">
                                    {subtask.name}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Icon icon="check" className="text-green me-2" />
                                  {subtask.name}
                                </>
                              )}
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
