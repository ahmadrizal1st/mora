import { useQuery } from '@tanstack/react-query';
import { budgetService } from '../services/budget.service';

export const useBudgetPlans = () => {
  return useQuery({
    queryKey: ['budget-plans'],
    queryFn: () => budgetService.getPlans(),
  });
};

export const useBudgetUtilization = (planId?: string) => {
  return useQuery({
    queryKey: ['budget-utilization', planId],
    queryFn: () => budgetService.getUtilization(planId),
  });
};

export const useActiveBudgetItems = () => {
  return useQuery({
    queryKey: ['active-budget-items'],
    queryFn: async () => {
      const plans = await budgetService.getPlans();
      const activePlan = plans.find(p => p.is_active);
      return activePlan?.items || [];
    },
  });
};
