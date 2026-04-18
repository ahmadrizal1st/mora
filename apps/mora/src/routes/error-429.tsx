import { createFileRoute } from '@tanstack/react-router'
import Error429 from '@/pages/Error429'

export const Route = createFileRoute('/error-429')({
  component: Error429,
})
