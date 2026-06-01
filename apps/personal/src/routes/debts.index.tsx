import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/debts/')({
  component: lazyRouteComponent(() =>
    import('@/features/debts/pages/DebtsPage').then((m) => ({ default: m.DebtsPage }))
  ),
})
