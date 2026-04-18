import { createFileRoute } from '@tanstack/react-router'
import { ErrorLayout } from '@/shared/components/layout'

export const Route = createFileRoute('/error-404')({
  component: () => (
    <ErrorLayout
      errorCode="404"
      illustration="not-found"
      subtitle="We are sorry but the page you are looking for was not found"
    />
  ),
})
