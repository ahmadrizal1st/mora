import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboard.service'

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: () => dashboardService.getSummary(),
  })
}
