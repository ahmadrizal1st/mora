import api from '@/shared/api/client'

export const chatService = {
  async sendMessage(message: string): Promise<{ role: 'ai', content: string, timestamp: string }> {
    const response = await api.post('/chat/send', { message })
    return response.data.data
  },
}
