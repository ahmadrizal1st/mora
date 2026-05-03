import api from '@/shared/api/client';
import { type Provider } from '../types/transaction.types';

export interface CreateProviderDTO {
  name: string;
  type: 'bank' | 'ewallet' | 'investment' | 'other';
  logo_url?: string;
  color?: string;
}

export const providerService = {
  /**
   * Fetch all providers (global + custom).
   */
  async getProviders(): Promise<Provider[]> {
    const response = await api.get<{ data: Provider[] }>('/providers');
    return response.data.data;
  },

  /**
   * Create a custom provider.
   */
  async createProvider(data: CreateProviderDTO): Promise<Provider> {
    const response = await api.post<{ data: Provider }>('/providers', data);
    return response.data.data;
  },
};
