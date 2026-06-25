import { useQuery } from '@tanstack/react-query'
import { planningService } from '../services/planning.service'

export const useGoals = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: planningService.getGoals,
  })
}

export const useSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: planningService.getSubscriptions,
  })
}

export const useBudgets = () => {
  return useQuery({
    queryKey: ['budgets-utilization'],
    queryFn: planningService.getBudgets,
  })
}
