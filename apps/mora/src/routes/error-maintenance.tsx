import { createFileRoute } from '@tanstack/react-router'
import { ErrorLayout } from '@/shared/components/layout'

export const Route = createFileRoute('/error-maintenance')({
  component: () => (
    <ErrorLayout
      header="Temporarily down for maintenance"
      illustration="computer-fix"
      subtitle="Sorry for the inconvenience but we’re performing some maintenance at the moment. We’ll be back online shortly!"
    />
  ),
})
