import api from '@/shared/api/client';
import { type Category, type Tag, type Currency, type Status, type RecurringType, type CreateTagDTO } from '../types/transaction.types';

export const lookupService = {
  /**
   * Fetch all categories, optionally filtered by transaction type.
   */
  async getCategories(txType?: 'income' | 'expense' | 'transfer'): Promise<Category[]> {
    const response = await api.get<{ data: Category[] }>('/categories', { 
      params: { tx_type: txType } 
    });
    return response.data.data;
  },

  /**
   * Fetch all user tags.
   */
  async getTags(): Promise<Tag[]> {
    const response = await api.get<{ data: Tag[] }>('/tags');
    return response.data.data;
  },

  /**
   * Create a new user tag.
   */
  async createTag(data: CreateTagDTO): Promise<Tag> {
    const response = await api.post<{ data: Tag }>('/tags', data);
    return response.data.data;
  },

  /**
   * Fetch all active currencies.
   */
  async getCurrencies(): Promise<Currency[]> {
    const response = await api.get<{ data: Currency[] }>('/currencies');
    return response.data.data;
  },

  /**
   * Fetch all transaction statuses.
   */
  async getStatuses(): Promise<Status[]> {
    const response = await api.get<{ data: Status[] }>('/statuses');
    return response.data.data;
  },

  /**
   * Fetch all recurring types.
   */
  async getRecurringTypes(): Promise<RecurringType[]> {
    const response = await api.get<{ data: RecurringType[] }>('/recurring-types');
    return response.data.data;
  },
};
