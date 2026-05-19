import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/credit/')({
  beforeLoad: () => {
    throw redirect({
      to: '/credit/overview',
    })
  },
})
