import { createFileRoute } from '@tanstack/react-router'
import ScannerPage from '@/features/scanner/pages/ScannerPage'

export const Route = createFileRoute('/tracker/photo')({
  component: ScannerPage,
})
