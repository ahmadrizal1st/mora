import api from '@/shared/api/client'
import type { Account } from '../../transaction/types/transaction.types'

export const creditService = {
  async getCredits(type?: string): Promise<Account[]> {
    const url = type ? `/credits?type=${type}&per_page=1000` : '/credits?per_page=1000'
    const response = await api.get(url)
    // If it's a paginated response wrapped in { data: { current_page, data: [] } }
    if (response.data?.data?.data) {
      return response.data.data.data
    }
    // Fallback if not wrapped
    return response.data.data || []
  },

  async saveCredit(accountId: string, data: any): Promise<any> {
    const response = await api.post(`/accounts/${accountId}/credit`, data)
    return response.data
  },

  async deleteCredit(accountId: string): Promise<any> {
    const response = await api.delete(`/accounts/${accountId}/credit`)
    return response.data
  },
}
