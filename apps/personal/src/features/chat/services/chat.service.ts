import api from '@/shared/api/client'
import { ChatSession, Message } from '../store/useChatStore'

export const chatService = {
  async getSessions(): Promise<ChatSession[]> {
    const response = await api.get('/chat/sessions')
    return response.data.data
  },

  async createSession(title?: string): Promise<ChatSession> {
    const response = await api.post('/chat/sessions', { title })
    return response.data.data
  },

  async deleteSessions(sessionIds: string[]): Promise<void> {
    await api.delete('/chat/sessions', { data: { session_ids: sessionIds } })
  },

  async getMessages(sessionId: string): Promise<Message[]> {
    const response = await api.get(`/chat/sessions/${sessionId}/messages`)
    return response.data.data
  },

  async sendMessage(sessionId: string, message: string, parentId?: string): Promise<{ user_message: Message; ai_message: Message }> {
    const response = await api.post('/chat/send', { session_id: sessionId, message, parent_id: parentId })
    return response.data.data
  },
}
