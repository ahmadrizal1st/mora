import api from '@/shared/api/client';
import { type Account, type AccountFilters, type AccountResponse, type CreateAccountDTO, type UpdateAccountDTO } from '../types/transaction.types';

export const accountService = {
  /**
   * Fetch all accounts for the user.
   */
  async getAccounts(filters?: AccountFilters): Promise<AccountResponse> {
    const response = await api.get<AccountResponse>('/accounts', { params: filters });
    return response.data;
  },

  /**
   * Fetch a single account.
   */
  async getAccount(id: number): Promise<Account> {
    const response = await api.get<{ data: Account }>(`/accounts/${id}`);
    return response.data.data;
  },

  /**
   * Create a new account.
   */
  async createAccount(data: CreateAccountDTO): Promise<Account> {
    const response = await api.post<{ data: Account }>('/accounts', data);
    return response.data.data;
  },

  /**
   * Update an existing account.
   */
  async updateAccount(id: number, data: UpdateAccountDTO): Promise<Account> {
    const response = await api.put<{ data: Account }>(`/accounts/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete an account.
   */
  async deleteAccount(id: number): Promise<void> {
    await api.delete(`/accounts/${id}`);
  },
};
