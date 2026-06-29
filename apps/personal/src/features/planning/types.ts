export interface Goal {
  id: string
  name: string
  target: number
  saved: number
  eta: string
  rawEta?: string
  monthlyDeposit: number
  icon: string
  color: string
  imageUrl?: string
}

export interface GoalMilestone {
  date: string
  label: string
  type: 'achievement' | 'target'
}

export interface GoalsData {
  totalSaved: number
  totalTarget: number
  goals: Goal[]
  milestones: GoalMilestone[]
}

export interface Subscription {
  id: string
  name: string
  amount: number
  dueDate: string
  status: 'paid' | 'unpaid' | 'upcoming'
  icon: string
  color?: string
}

export interface SubscriptionsData {
  totalMonthly: number
  paidThisMonth: number
  subscriptions: Subscription[]
}

export interface BudgetCategory {
  id: string
  name: string
  limit: number
  spent: number
  percentage_used: number
  type?: string
  icon: string
  color: string
}

export interface BudgetData {
  totalBudget: number
  spent: number
  safeToSpendPerDay: number
  categories: BudgetCategory[]
}
