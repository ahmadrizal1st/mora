import { createFileRoute } from '@tanstack/react-router'
import TrackerFilePage from '@/features/tracker/pages/TrackerFilePage'

export const Route = createFileRoute('/tracker/file')({
  component: TrackerFilePage,
})
