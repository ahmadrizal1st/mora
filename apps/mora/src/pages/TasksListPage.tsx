// src/pages/TasksListPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { Modal } from '../components/ui/Modal'
import tasksData from '../data/tasks.json'

// Use the same types or inline them
import type { Person } from '../types'

interface Task {
  name: string
  assigned_to?: number
  due_date?: string
  'due-date'?: string
  priority?: string
}

interface TasksListPageProps {
  people?: Person[]
}

export default function TasksListPage({ people = [] }: TasksListPageProps) {
  return (
    <BaseLayout pageTitle="Task List">
      <div className="row">
        <div className="col-12">
          {tasksData.columns.map((section, idx) => (
            <div key={idx} className="card mb-4">
              <div className="card-header">
                <h3 className="card-title mb-0">{section.name}</h3>
                <div className="card-actions">
                  <Button size="sm" data-bs-toggle="modal" data-bs-target="#add-task">
                    <Icon icon="plus" />
                    New Task
                  </Button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-vcenter card-table table-selectable">
                  <thead>
                    <tr>
                      <th className="w-1">
                        <input
                          type="checkbox"
                          className="form-check-input align-middle table-selectable-check"
                          aria-label="Select all tasks"
                        />
                      </th>
                      <th className="w-50">Name</th>
                      <th className="d-none d-xl-table-cell">Assigned To</th>
                      <th className="d-none d-xxl-table-cell">Due Date</th>
                      <th>Priority</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.tasks.map((task: Task, taskIdx: number) => {
                      const person = task.assigned_to
                        ? people[task.assigned_to - 1]
                        : null
                      
                      const dueDate = task.due_date || task['due-date']

                      return (
                        <tr key={taskIdx}>
                          <td>
                            <input
                              type="checkbox"
                              className="form-check-input align-middle table-selectable-check"
                              aria-label="Select task"
                            />
                          </td>
                          <td>{task.name}</td>
                          <td className="d-none d-xl-table-cell">
                            {person ? (
                              <div className="d-flex align-items-center">
                                <Avatar person={person} size="xs" className="me-2" />
                                <span>{person.full_name || person.name || `User ${person.id}`}</span>
                              </div>
                            ) : (
                              <span className="text-secondary">Unassigned</span>
                            )}
                          </td>
                          <td className="text-secondary d-none d-xxl-table-cell">
                            {dueDate ? (
                              <>
                                <Icon icon="calendar" className="me-1" />
                                {dueDate}
                              </>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td>
                            {task.priority === 'High' ? (
                              <Badge color="red" light>High</Badge>
                            ) : task.priority === 'Medium' ? (
                              <Badge color="yellow" light>Medium</Badge>
                            ) : task.priority === 'Low' ? (
                              <Badge color="blue" light>Low</Badge>
                            ) : (
                              <Badge light>—</Badge>
                            )}
                          </td>
                          <td className="text-end">
                            <Button size="sm">View</Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal id="add-task">
        <div className="modal-header">
          <h5 className="modal-title">Add Task</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>Modal content goes here.</p>
        </div>
      </Modal>
    </BaseLayout>
  )
}
