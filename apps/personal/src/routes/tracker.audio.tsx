import { createFileRoute } from '@tanstack/react-router'
import TrackerAudioPage from '@/features/tracker/pages/TrackerAudioPage'

export const Route = createFileRoute('/tracker/audio')({
  component: TrackerAudioPage,
})
