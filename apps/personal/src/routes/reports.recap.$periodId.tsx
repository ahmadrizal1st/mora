import { createFileRoute } from '@tanstack/react-router'
import { ReportRecapPage } from '../pages/ReportRecapPage'

export const Route = createFileRoute('/reports/recap/$periodId')({
  component: ReportRecapPage,
})
