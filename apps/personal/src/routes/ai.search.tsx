import { createFileRoute } from '@tanstack/react-router'
import { ChatSearchPage } from '@/features/chat/pages/ChatSearchPage'

export const Route = createFileRoute('/ai/search')({
  component: ChatSearchPage,
})
