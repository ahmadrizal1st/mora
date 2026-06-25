import api from '@/shared/api/client'
import type { Account } from '../../transaction/types/transaction.types'

export const creditService = {
  async getCredits(): Promise<Account[]> {
    const response = await api.get('/credits')
    // If it's a paginated response wrapped in { data: { current_page, data: [] } }
    if (response.data?.data?.data) {
      return response.data.data.data
    }
    // Fallback if not wrapped
    return response.data.data || []
  },
}
