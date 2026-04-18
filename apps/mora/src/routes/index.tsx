import { createFileRoute } from '@tanstack/react-router'

import Welcome from '@/features/auth/pages/Welcome'

export const Route = createFileRoute('/')({
  component: Welcome,
})
