import { createFileRoute } from '@tanstack/react-router'
import TrackerPage from '@/features/tracker/pages/TrackerPage'

export const Route = createFileRoute('/tracker/')({
  component: TrackerPage,
})
