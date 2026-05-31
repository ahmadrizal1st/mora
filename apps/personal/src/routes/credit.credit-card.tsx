import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/credit/credit-card')({
  component: lazyRouteComponent(() =>
    import('@/features/credit/pages/CreditCardPage').then((m) => ({ default: m.CreditCardPage }))
  ),
})
