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
  },

  async createDebt(data: Omit<DebtRecord, 'id' | 'createdAt'>): Promise<DebtRecord> {
    const payload = {
      person_name: data.personName,
      description: data.description,
      type: data.type.toLowerCase(),
      amount: data.amount,
      amount_paid: data.amountPaid || 0,
      status: data.status,
      priority: data.priority || 'Sedang',
      due_date: data.dueDate,
    }
    const response = await api.post('/debts', payload)
    return response.data.data
  },

  async updateDebt(id: string, data: Partial<Omit<DebtRecord, 'id' | 'createdAt'>>): Promise<DebtRecord> {
    const payload: any = {}
    if (data.personName !== undefined) payload.person_name = data.personName
    if (data.description !== undefined) payload.description = data.description
    if (data.type !== undefined) payload.type = data.type.toLowerCase()
    if (data.amount !== undefined) payload.amount = data.amount
    if (data.amountPaid !== undefined) payload.amount_paid = data.amountPaid
    if (data.status !== undefined) payload.status = data.status
    if (data.priority !== undefined) payload.priority = data.priority
    if (data.dueDate !== undefined) payload.due_date = data.dueDate

    const response = await api.put(`/debts/${id}`, payload)
    return response.data.data
  },

  async deleteDebt(id: string): Promise<void> {
    await api.delete(`/debts/${id}`)
  }
}
