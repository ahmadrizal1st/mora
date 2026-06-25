import { createFileRoute } from '@tanstack/react-router'
import { ChatTemplatesPage } from '@/features/chat/pages/ChatTemplatesPage'

export const Route = createFileRoute('/ai/templates')({
  component: ChatTemplatesPage,
})
