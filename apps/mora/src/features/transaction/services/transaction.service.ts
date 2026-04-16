import api from '@/shared/api/client';
import { type PaginatedResponse } from '@/shared/types/common.types';
import { 
  type Transaction, 
  type TransactionFilters, 
  type TransactionSummary, 
  type CreateTransactionDTO, 
  type UpdateTransactionDTO 
} from '../types/transaction.types';

export const transactionService = {
  /**
   * Fetch paginated list of transactions with optional filters.
   */
  async getTransactions(params?: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
    const response = await api.get<PaginatedResponse<Transaction>>('/transactions', { params });
    return response.data;
  },

  /**
   * Fetch a single transaction by ID.
   */
  async getTransaction(id: number): Promise<Transaction> {
    const response = await api.get<{ data: Transaction }>(`/transactions/${id}`);
    return response.data.data;
  },

  /**
   * Create a new transaction.
   */
  async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
    const response = await api.post<{ data: Transaction }>('/transactions', data);
    return response.data.data;
  },

  /**
   * Update an existing transaction.
   */
  async updateTransaction(id: number, data: UpdateTransactionDTO): Promise<Transaction> {
    const response = await api.put<{ data: Transaction }>(`/transactions/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a transaction.
   */
  async deleteTransaction(id: number): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },

  /**
   * Fetch transaction summary (income, expense, net) for a period.
   */
  async getSummary(params?: { date_from?: string; date_to?: string; account_id?: number }): Promise<TransactionSummary> {
    const response = await api.get<{ data: TransactionSummary }>('/transactions-summary', { params });
    return response.data.data;
  },
};
