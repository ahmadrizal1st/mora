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

export const useBudgetInsights = () => {
  return useQuery({
    queryKey: ['budgets-insights'],
    queryFn: planningService.getBudgetInsights,
  })
}

export const useBudgetHistory = (months: number = 6) => {
  return useQuery({
    queryKey: ['budgets-history', months],
    queryFn: () => planningService.getBudgetHistory(months),
  })
}
