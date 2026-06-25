import api from '@/shared/api/client'

export const dashboardService = {
  async getSummary() {
    const response = await api.get('/dashboard-summary')
    return response.data.data
  },
}
