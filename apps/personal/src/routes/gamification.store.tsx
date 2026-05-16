import { createFileRoute } from '@tanstack/react-router'
import { ComingSoonPage } from '@/features/gamification/pages/ComingSoonPage'

export const Route = createFileRoute('/gamification/store')({
  component: () => <ComingSoonPage title="Reward Store" />,
})
