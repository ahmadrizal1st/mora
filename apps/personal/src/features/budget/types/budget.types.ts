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

export type BudgetPeriod = 'monthly' | 'weekly' | 'yearly';

export interface BudgetItem {
  id: string;
  budget_plan_id: string;
  name: string;
  percentage?: number;
  amount_limit?: number;
  color?: string;
  icon?: string;
  categories?: Category[];
}

export interface BudgetPlan {
  id: string;
  user_id: string;
  name: string;
  budget_method: BudgetMethod;
  income_baseline: number;
  period: BudgetPeriod;
  start_date: string;
  end_date: string;
  is_active: boolean;
  rollover_enabled: boolean;
  items?: BudgetItem[];
}

export interface BudgetUtilizationItem {
  id: string;
  name: string;
  spent: number;
  limit: number;
  percentage_used: number;
  color?: string;
  icon?: string;
}

export interface BudgetUtilization {
  id: string;
  plan: string;
  budget_method: BudgetMethod;
  period: BudgetPeriod;
  period_start: string;
  period_end: string;
  income_baseline: number;
  items: BudgetUtilizationItem[];
}

export interface CreateBudgetPlanDTO {
  name: string;
  budget_method: BudgetMethod;
  income_baseline: number;
  period: BudgetPeriod;
  start_date: string;
  end_date: string;
  is_active: boolean;
  rollover_enabled: boolean;
  items: Array<{
    name: string;
    percentage?: number;
    amount_limit?: number;
    color?: string;
    icon?: string;
    category_ids: string[];
  }>;
}

export type UpdateBudgetPlanDTO = Partial<CreateBudgetPlanDTO>;
