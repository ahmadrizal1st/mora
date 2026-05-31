import api from '@/shared/api/client'
import {
  type Account,
  type AccountFilters,
  type AccountResponse,
  type CreateAccountDTO,
  type UpdateAccountDTO,
} from '../types/transaction.types'

export const accountService = {
  async getAccounts(filters?: AccountFilters): Promise<AccountResponse> {
    const response = await api.get<AccountResponse>('/accounts', { params: filters })
    return response.data
  },

  async getAccount(id: string): Promise<Account> {
    const response = await api.get<{ data: Account }>(`/accounts/${id}`)
    return response.data.data
  },

  async createAccount(data: CreateAccountDTO): Promise<Account> {
    const response = await api.post<{ data: Account }>('/accounts', data)
    return response.data.data
  },

  async updateAccount(id: string, data: UpdateAccountDTO): Promise<Account> {
    const response = await api.put<{ data: Account }>(`/accounts/${id}`, data)
    return response.data.data
  },

  async deleteAccount(id: string): Promise<void> {
    await api.delete(`/accounts/${id}`)
  },
}
