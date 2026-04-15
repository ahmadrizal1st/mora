import { createFileRoute } from '@tanstack/react-router'
import TrackerInputPage from '@/features/tracker/pages/TrackerInputPage'

export const Route = createFileRoute('/tracker/input')({
  component: TrackerInputPage,
})
