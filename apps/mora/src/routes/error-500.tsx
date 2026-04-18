import { createFileRoute } from '@tanstack/react-router'
import { ErrorLayout } from '@/shared/components/layout'

export const Route = createFileRoute('/error-500')({
  component: () => (
    <ErrorLayout
      errorCode="500"
      illustration="500"
      subtitle="We are sorry but the server encountered an internal error and was unable to complete your request"
    />
  ),
})
