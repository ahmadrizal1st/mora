import { createFileRoute } from '@tanstack/react-router'
import ErrorMaintenance from '@/pages/ErrorMaintenance'

export const Route = createFileRoute('/error-maintenance')({
  component: ErrorMaintenance,
})
