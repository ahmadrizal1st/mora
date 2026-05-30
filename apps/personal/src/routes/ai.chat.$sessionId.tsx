import { createFileRoute } from '@tanstack/react-router'
import ChatPage from '@/features/chat/pages/ChatPage'

export const Route = createFileRoute('/ai/chat/$sessionId')({
  component: ChatPage,
})
