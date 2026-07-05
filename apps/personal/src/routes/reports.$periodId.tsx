import { createFileRoute } from '@tanstack/react-router'
import { ReportDetailPage } from '../features/reports/pages/ReportDetailPage'

export const Route = createFileRoute('/reports/$periodId')({
  component: ReportDetailPage,
})
