import api from '@/shared/api/client'
import type { DebtRecord } from '../types/debt.types'

export const debtsService = {
  async getDebts(): Promise<DebtRecord[]> {
    const response = await api.get('/debts')
    
    // Map snake_case from backend to camelCase for frontend
    return response.data.data.map((item: any) => ({
      id: item.id,
      personName: item.person_name,
      description: item.description || '',
      type: item.type.charAt(0).toUpperCase() + item.type.slice(1), // 'utang' -> 'Utang'
      amount: Number(item.amount),
      amountPaid: Number(item.amount_paid),
      status: item.status,
      priority: item.priority,
      dueDate: item.due_date,
      createdAt: item.created_at,
    }))
  }
}
