import { createFileRoute } from '@tanstack/react-router'
import TrackerTextPage from '@/features/tracker/pages/TrackerTextPage'

export const Route = createFileRoute('/tracker/text')({
  component: TrackerTextPage,
})
