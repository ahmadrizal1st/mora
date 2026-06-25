import api from '@/shared/api/client'
import type { Account } from '../../transaction/types/transaction.types'

export const creditService = {
  async getCredits(type?: string): Promise<Account[]> {
    const url = type ? `/credits?type=${type}` : '/credits'
    const response = await api.get(url)
    // If it's a paginated response wrapped in { data: { current_page, data: [] } }
    if (response.data?.data?.data) {
      return response.data.data.data
    }
    // Fallback if not wrapped
    return response.data.data || []
  },
}
