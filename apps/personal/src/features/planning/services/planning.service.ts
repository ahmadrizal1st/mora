import api from '@/shared/api/client'
import type { Goal, Subscription, GoalsData, SubscriptionsData, BudgetData } from '../types'

export const planningService = {
  async getGoals(): Promise<GoalsData> {
    const response = await api.get('/goals')
    
    const rawData = response.data?.data || []
    
    const goals: Goal[] = rawData.map((item: any) => {
      let eta = ''
      if (item.deadline_date) {

        const date = new Date(item.deadline_date)
        eta = date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
      }
      
      return {
        id: item.id,
        name: item.name,
        target: Number(item.target_amount),
        saved: Number(item.current_amount || 0),
        eta,
        rawEta: item.deadline_date ? item.deadline_date.substring(0, 10) : '',
        monthlyDeposit: Number(item.monthly_deposit || 0),
        icon: item.icon || 'star',
        color: item.color || '#000000',
        imageUrl: item.image_url,
      }
    })

    const totalSaved = goals.reduce((acc, curr) => acc + curr.saved, 0)
    const totalTarget = goals.reduce((acc, curr) => acc + curr.target, 0)

    const milestones = goals
      .filter((g) => g.eta && g.rawEta)
      .map((g) => {
        const isAchieved = g.saved > 0 && g.saved >= g.target
        return {
          date: g.eta,
          label: isAchieved ? `Impian ${g.name} tercapai!` : `Target: ${g.name}`,
          type: isAchieved ? 'achievement' : 'target',
          rawEta: g.rawEta,
        }
      })
      .sort((a, b) => new Date(a.rawEta).getTime() - new Date(b.rawEta).getTime())
      .map((m) => ({ date: m.date, label: m.label, type: m.type as 'achievement' | 'target' }))

    return {
      totalSaved,
      totalTarget,
      goals,
      milestones,
    }
  },

  async createGoal(goal: Partial<Goal>): Promise<Goal> {
    const payload = {
      name: goal.name,
      target_amount: goal.target,
      current_amount: goal.saved,
      monthly_deposit: goal.monthlyDeposit,
      deadline_date: goal.eta,
      icon: goal.icon,
      color: goal.color,
      image_url: goal.imageUrl,
    }
    const response = await api.post('/goals', payload)
    return response.data.data
  },

  async updateGoal(id: string, goal: Partial<Goal>): Promise<Goal> {
    const payload = {
      name: goal.name,
      target_amount: goal.target,
      current_amount: goal.saved,
      monthly_deposit: goal.monthlyDeposit,
      deadline_date: goal.eta,
      icon: goal.icon,
      color: goal.color,
      image_url: goal.imageUrl,
    }
    const response = await api.put(`/goals/${id}`, payload)
    return response.data.data
  },

  async deleteGoal(id: string): Promise<void> {
    await api.delete(`/goals/${id}`)
  },

  async getSubscriptions(): Promise<SubscriptionsData> {
    const response = await api.get('/subscriptions')
    
    const subscriptions: Subscription[] = response.data.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      amount: Number(item.amount),
      dueDate: item.next_billing_date,
      status: item.status || 'upcoming',
      icon: item.icon || 'box',
      color: item.color || '#000000',
    }))

    const totalMonthly = subscriptions.reduce((acc, curr) => acc + curr.amount, 0)
    const paidThisMonth = subscriptions
      .filter((s) => s.status === 'paid')
      .reduce((acc, curr) => acc + curr.amount, 0)

    return {
      totalMonthly,
      paidThisMonth,
      subscriptions,
    }
  },

  async createSubscription(sub: Partial<Subscription>): Promise<Subscription> {
    const payload = {
      name: sub.name,
      amount: sub.amount,
      next_billing_date: sub.dueDate,
      status: sub.status,
      icon: sub.icon,
      color: sub.color,
    }
    const response = await api.post('/subscriptions', payload)
    return response.data.data
  },

  async updateSubscription(id: string, sub: Partial<Subscription>): Promise<Subscription> {
    const payload = {
      name: sub.name,
      amount: sub.amount,
      next_billing_date: sub.dueDate,
      status: sub.status,
      icon: sub.icon,
      color: sub.color,
    }
    const response = await api.put(`/subscriptions/${id}`, payload)
    return response.data.data
  },

  async deleteSubscription(id: string): Promise<void> {
    await api.delete(`/subscriptions/${id}`)
  },

  async getBudgets(): Promise<BudgetData> {
    const response = await api.get('/budgets-utilization')
    const data = response.data.data
    
    if (!data) {
      return {
        totalBudget: 0,
        spent: 0,
        safeToSpendPerDay: 0,
        categories: []
      }
    }

    const totalBudget = data.income_baseline || 0
    const spent = data.items.reduce((acc: number, item: any) => acc + item.spent, 0)
    
    // safeToSpendPerDay logic (simplified)
    const today = new Date()
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const daysLeft = daysInMonth - today.getDate() + 1
    const safeToSpendPerDay = daysLeft > 0 ? (totalBudget - spent) / daysLeft : 0

    const categories = data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      limit: item.limit,
      spent: item.spent,
      percentage_used: item.percentage_used,
      type: item.type,
      icon: item.icon || 'box',
      color: item.color || '#000000',
    }))

    return {
      totalBudget,
      spent,
      safeToSpendPerDay,
      categories
    }
  },

  async getBudgetInsights(): Promise<any> {
    const response = await api.get('/budgets/insights')
    return response.data.data
  },

  async getBudgetHistory(months: number = 6): Promise<any[]> {
    const response = await api.get(`/budgets/history?months=${months}`)
    return response.data.data
  }
}
