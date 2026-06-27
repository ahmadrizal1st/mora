import { createFileRoute } from '@tanstack/react-router'
import { ReportDetailPage } from '../pages/ReportDetailPage'

export const Route = createFileRoute('/reports/$periodId')({
  component: ReportDetailPage,
})
