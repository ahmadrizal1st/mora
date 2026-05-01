import api from '@/shared/api/client';
import { type PaginatedResponse } from '@/shared/types/common.types';
import { type Notification, type NotificationParams } from '../types/notification.types';

export interface NotificationListResponse {
  data: Notification[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const notificationService = {
  /**
   * Fetch paginated notifications with optional filter.
   * Flattens the nested meta into root level to match PaginatedResponse<T>.
   */
  async getNotifications(params?: NotificationParams): Promise<PaginatedResponse<Notification>> {
    // Don't send 'all' to the API — omit the filter param entirely
    const apiParams: Record<string, unknown> = { ...params };
    if (apiParams.filter === 'all') delete apiParams.filter;

    const response = await api.get<NotificationListResponse>('/notifications', { params: apiParams });
    const { data, meta } = response.data;

    return {
      data,
      current_page: meta.current_page,
      last_page: meta.last_page,
      per_page: meta.per_page,
      total: meta.total,
      from: ((meta.current_page - 1) * meta.per_page) + 1,
      to: Math.min(meta.current_page * meta.per_page, meta.total),
      prev_page_url: null,
      next_page_url: null,
      path: '/notifications',
    };
  },

  async getUnreadCount(): Promise<{ unread_count: number }> {
    const { data } = await api.get<{ unread_count: number }>('/notifications/unread-count');
    return data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.post(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all');
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },

  async toggleStar(id: string): Promise<{ is_starred: boolean }> {
    const { data } = await api.post<{ is_starred: boolean; message: string }>(`/notifications/${id}/star`);
    return data;
  },
};
