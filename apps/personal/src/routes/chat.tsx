import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/ai/chat')({
  beforeLoad: () => {
    throw redirect({ to: '/ai/chat' })
  },
})
