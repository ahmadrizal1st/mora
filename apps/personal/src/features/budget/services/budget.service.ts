import api from '@/shared/api/client';
import { 
  type BudgetPlan, 
  type BudgetUtilization, 
  type CreateBudgetPlanDTO, 
  type UpdateBudgetPlanDTO 
} from '../types/budget.types';

export const budgetService = {
  async getPlans(): Promise<BudgetPlan[]> {
    const response = await api.get<{ data: BudgetPlan[] }>('/budgets');
    return response.data.data;
  },

  async getUtilization(planId?: string): Promise<BudgetUtilization> {
    const response = await api.get<{ data: BudgetUtilization }>('/budgets-utilization', { 
      params: { plan_id: planId } 
    });
    return response.data.data;
  },

  async createPlan(data: CreateBudgetPlanDTO): Promise<BudgetPlan> {
    const response = await api.post<{ data: BudgetPlan }>('/budgets', data);
    return response.data.data;
  },

  async updatePlan(id: string, data: UpdateBudgetPlanDTO): Promise<BudgetPlan> {
    const response = await api.put<{ data: BudgetPlan }>(`/budgets/${id}`, data);
    return response.data.data;
  },

  async deletePlan(id: string): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },
};
