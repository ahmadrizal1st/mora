import { createFileRoute } from '@tanstack/react-router'
import TrackerImagePage from '@/features/tracker/pages/TrackerImagePage'

export const Route = createFileRoute('/tracker/image')({
  component: TrackerImagePage,
})
