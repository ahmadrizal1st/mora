import api from '@/shared/api/client';
import { type PaginatedResponse } from '@/shared/types/common.types';
import { 
  type Transaction, 
  type TransactionFilters, 
  type TransactionSummary, 
  type TransactionHistory,
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
  async getSummary(params?: { date_from?: string; date_to?: string; account_id?: number; group_by?: string }): Promise<TransactionSummary> {
    const response = await api.get<{ data: TransactionSummary }>('/transactions-summary', { params });
    return response.data.data;
  },

  /**
   * Fetch a larger set of transactions for chart visualization (less constrained by pagination).
   */
  async getChartData(params?: TransactionFilters): Promise<Transaction[]> {
    // Specifically set per_page to a high value to get more data points for the overall chart
    // while keeping it within reasonable limits for performance.
    const response = await api.get<PaginatedResponse<Transaction>>('/transactions', { 
      params: { 
        ...params, 
        per_page: 500, // Fetch up to 500 records for the historical view
        page: 1 
      } 
    });
    return response.data.data;
  },

  /**
   * Fetch historical aggregated data for charts.
   */
  async getHistory(params?: { date_from?: string; date_to?: string; account_id?: number; group_by?: string }): Promise<TransactionHistory> {
    const response = await api.get<{ data: TransactionHistory }>('/transactions-history', { params });
    return response.data.data;
  },
};
