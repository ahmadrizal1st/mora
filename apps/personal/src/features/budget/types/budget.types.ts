import type { Category } from "../../transaction/types/transaction.types";

export type BudgetMethod = 
  | '50_30_20' 
  | 'zero_based' 
  | 'envelope' 
  | 'pay_yourself_first' 
  | 'line_item' 
  | 'incremental' 
  | 'activity_based' 
  | 'rolling' 
  | 'value_proposition' 
  | 'cash_flow'
  | 'custom';

export type BudgetDuration = 'monthly' | 'weekly' | 'yearly';

export interface BudgetItem {
  id: number;
  budget_plan_id: number;
  name: string;
  percentage?: number;
  amount_limit?: number;
  color?: string;
  icon?: string;
  categories?: Category[];
}

export interface BudgetPlan {
  id: number;
  user_id: number;
  name: string;
  method: BudgetMethod;
  income_baseline: number;
  duration: BudgetDuration;
  start_date: string;
  end_date: string;
  is_active: boolean;
  items?: BudgetItem[];
}

export interface BudgetUtilizationItem {
  id: number;
  name: string;
  spent: number;
  limit: number;
  percentage_used: number;
  color?: string;
  icon?: string;
}

export interface BudgetUtilization {
  id: number;
  plan: string;
  method: BudgetMethod;
  duration: BudgetDuration;
  period_start: string;
  period_end: string;
  income_baseline: number;
  items: BudgetUtilizationItem[];
}

export interface CreateBudgetPlanDTO {
  name: string;
  method: BudgetMethod;
  income_baseline: number;
  duration: BudgetDuration;
  start_date: string;
  end_date: string;
  is_active: boolean;
  items: Array<{
    name: string;
    percentage?: number;
    amount_limit?: number;
    color?: string;
    icon?: string;
    category_ids: number[];
  }>;
}

export type UpdateBudgetPlanDTO = Partial<CreateBudgetPlanDTO>;
