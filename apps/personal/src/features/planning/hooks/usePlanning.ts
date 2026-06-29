import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { planningService } from '../services/planning.service'

export const useGoals = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: planningService.getGoals,
  })
}

export const useCreateGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: planningService.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

export const useUpdateGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      planningService.updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

export const useDeleteGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: planningService.deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

export const useSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: planningService.getSubscriptions,
  })
}

export const useCreateSubscription = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: planningService.createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    },
  })
}

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      planningService.updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    },
  })
}

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: planningService.deleteSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    },
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
