import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/credit/kpr')({
  component: lazyRouteComponent(() =>
    import('@/features/credit/pages/CreditKPRPage').then((m) => ({ default: m.CreditKPRPage }))
  ),
})
