import api from './client'

export interface Notification {
  id: string
  type: string
  data: {
    status: 'success' | 'error'
    title: string
    message: string
    url?: string
    extra_data?: Record<string, unknown>
  }
  read_at: string | null
  is_starred: boolean
  label?: string
  created_at: string
}

export interface PaginatedNotifications {
  data: Notification[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const notificationApi = {
  getNotifications: async (params?: { page?: number; per_page?: number; filter?: string }) => {
    const { data } = await api.get<PaginatedNotifications>('/notifications', { params })
    return data
  },

  getUnreadCount: async () => {
    const { data } = await api.get<{ unread_count: number }>('/notifications/unread-count')
    return data
  },

  markAsRead: async (id: string) => {
    const { data } = await api.post(`/notifications/${id}/read`)
    return data
  },

  markAllAsRead: async () => {
    const { data } = await api.post('/notifications/read-all')
    return data
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/notifications/${id}`)
    return data
  },

  toggleStar: async (id: string) => {
    const { data } = await api.post(`/notifications/${id}/star`)
    return data
  },
}
