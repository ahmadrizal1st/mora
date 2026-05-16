import { createFileRoute } from '@tanstack/react-router'
import { ComingSoonPage } from '@/features/gamification/pages/ComingSoonPage'

export const Route = createFileRoute('/gamification/streak')({
  component: () => <ComingSoonPage title="Daily Streak" />,
})
