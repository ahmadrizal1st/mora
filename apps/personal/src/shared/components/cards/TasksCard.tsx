import { Icon } from '../ui/Icon'
import { Avatar } from '../ui/Avatar'
import { type Person } from '@/shared/types/common.types'

// ── Static mock data (deterministic – no random) ────────────────────────────
interface Task { name: string; checked?: boolean; assigned_to?: number; [key: string]: unknown }

const DEFAULT_TASKS: Task[] = []
const DEFAULT_PEOPLE: Person[] = []

// Deterministic fake dates per index
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
function fakeDate(i: number) {
  const month = MONTHS[(i * 3) % 12]
  const day = ((i * 7 + 3) % 28) + 1
  return `${month} ${String(day).padStart(2, '0')}, 2024`
}

function fakeCheckCount(i: number) { return (i * 3 + 1) % 7 }
function fakeTotalCount(i: number) { return (i * 2 + 5) % 6 + 5 }
function fakeMsgCount(i: number) { return (i * 5 + 2) % 13 }

export function TasksCard({
  title = 'Tasks',
  tasks = DEFAULT_TASKS,
  people = DEFAULT_PEOPLE,
}: {
  title?: string
  tasks?: Task[]
  people?: Person[]
}) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="table-responsive">
        <table className="table table-selectable card-table table-vcenter">
          <tbody>
            {tasks.slice(0, 6).map((task, index) => {
              const person = people[task.assigned_to ? task.assigned_to % (people.length || 1) : index % (people.length || 1)]
              return (
                <tr key={index}>
                  {/* Checkbox - same style as InvoicesCard */}
                  <td className="w-1 pe-0">
                    <input
                      type="checkbox"
                      className="form-check-input m-0 align-middle table-selectable-check"
                      aria-label="Select task"
                      defaultChecked={task.checked}
                    />
                  </td>
                  {/* Task name */}
                  <td className="w-100">
                    <a href="#" className="text-reset">{task.name}</a>
                  </td>
                  {/* Due date */}
                  <td className="text-nowrap text-secondary">
                    <Icon icon="calendar" className="me-1" />
                    {fakeDate(index)}
                  </td>
                  {/* Subtask progress */}
                  <td className="text-nowrap">
                    <a href="#" className="text-secondary">
                      <Icon icon="check" className="me-1" />
                      {fakeCheckCount(index)}/{fakeTotalCount(index)}
                    </a>
                  </td>
                  {/* Messages */}
                  <td className="text-nowrap">
                    <a href="#" className="text-secondary">
                      <Icon icon="message" className="me-1" />
                      {fakeMsgCount(index)}
                    </a>
                  </td>
                  {/* Avatar */}
                  <td>
                    <Avatar
                      person={person}
                      placeholder={person?.full_name?.split(' ').map(n => n[0]).join('')}
                      size="sm"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
