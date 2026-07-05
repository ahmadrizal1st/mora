import { createFileRoute } from '@tanstack/react-router'
import { ReportRecapPage } from '../features/reports/pages/ReportRecapPage'

export const Route = createFileRoute('/reports/recap/$periodId')({
  component: ReportRecapPage,
})
