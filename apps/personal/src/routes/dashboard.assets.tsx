import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/assets')({
  beforeLoad: () => {
    throw redirect({
      to: '/assets',
      replace: true,
    })
  },
})
