// src/pages/TasksPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { Tasks } from '../components/parts/Tasks'
import tasksData from '../data/tasks.json'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'

export default function TasksPage() {
  return (
    <BaseLayout
      pageTitle="Tabler Inc. Tasks"
      pageActions={
        <div className="btn-list">
          <Button color="primary" className="d-none d-sm-inline-block">
            <Icon icon="plus" />
            Add board
          </Button>
          <Button color="primary" className="d-sm-none btn-icon" aria-label="Add board">
            <Icon icon="plus" />
          </Button>
        </div>
      }
    >
      <ul className="nav nav-bordered mb-4">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">View all</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Marketing</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Development</a>
        </li>
      </ul>

      <Tasks data={tasksData} />
    </BaseLayout>
  )
}
