import { create } from 'zustand'
import { chatService } from '../services/chat.service'

export type Role = 'user' | 'ai'

export interface Message {
  id: string
  role: Role
  content: string
  timestamp: string
  parent_id?: string | null
  isGenerating?: boolean
}

export interface ChatSession {
  id: string
  title: string
  updatedAt: string
}

interface ChatState {
  sessions: ChatSession[]
  activeSessionId: string | null
  messages: Record<string, Message[]>
  loadedSessions: Record<string, boolean>
  activeLeafId: Record<string, string | null>
  isTyping: boolean
  hasFetchedSessions: boolean
  isLoadingSessions: boolean
  
  fetchSessions: (force?: boolean) => Promise<void>
  loadSession: (id: string) => Promise<void>
  createNewSession: () => void
  sendMessage: (content: string, parentId?: string | null) => Promise<void>
  deleteSessions: (ids: string[]) => Promise<void>
  
  editMessage: (messageId: string, newContent: string) => Promise<void>
  setActiveLeaf: (sessionId: string, leafId: string) => void
  getActiveThread: (sessionId: string) => Message[]
  getSiblings: (sessionId: string, parentId: string | null | undefined) => Message[]
  switchVariant: (messageId: string, direction: 'prev' | 'next') => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  messages: {},
  loadedSessions: {},
  activeLeafId: {},
  isTyping: false,
  isLoadingSessions: false,
  hasFetchedSessions: false,

  fetchSessions: async (force = false) => {
    const state = get()
    if (!force && state.hasFetchedSessions) return;
    if (state.isLoadingSessions) return;

    set({ isLoadingSessions: true })
    try {
      const data = await chatService.getSessions()
      const formattedSessions = data.map((s: any) => ({
        id: s.id,
        title: s.title,
        updatedAt: s.updated_at,
      }))
      set({ sessions: formattedSessions, isLoadingSessions: false, hasFetchedSessions: true })
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
      set({ isLoadingSessions: false, hasFetchedSessions: true })
    }
  },

  loadSession: async (id) => {
    set({ activeSessionId: id })
    // If messages aren't loaded yet, fetch them
    const state = get()
    if (!state.loadedSessions[id]) {
      try {
        const msgs = await chatService.getMessages(id)
        const formattedMsgs = msgs.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          parent_id: m.parent_id,
          timestamp: m.created_at,
        }))
        set((state) => ({
          messages: {
            ...state.messages,
            [id]: formattedMsgs,
          },
          loadedSessions: {
            ...state.loadedSessions,
            [id]: true,
          },
          activeLeafId: {
            ...state.activeLeafId,
            [id]: formattedMsgs.length > 0 ? formattedMsgs[formattedMsgs.length - 1].id : null
          }
        }))
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      }
    }
  },

  createNewSession: () => {
    const newId = crypto.randomUUID()
    set((state) => ({
      activeSessionId: newId,
      messages: {
        ...state.messages,
        [newId]: [],
      },
      loadedSessions: {
        ...state.loadedSessions,
        [newId]: true,
      },
      activeLeafId: {
        ...state.activeLeafId,
        [newId]: null,
      }
    }))
  },

  sendMessage: async (content, parentId) => {
    const { activeSessionId, sessions } = get()
    let currentSessionId = activeSessionId

    if (!currentSessionId) return

    // Create session in backend if it's new (not in state)
    const isNewSession = !sessions.some((s) => s.id === currentSessionId)
    if (isNewSession) {
      try {
        const title = content.slice(0, 30) + (content.length > 30 ? '...' : '')
        const newSession = await chatService.createSession(title)
        
        // We replace the local random UUID with the real database UUID
        set((state) => {
          const oldMessages = state.messages[currentSessionId!] || []
          const updatedMessages = { ...state.messages, [newSession.id]: oldMessages }
          delete updatedMessages[currentSessionId!]
          
          return {
            activeSessionId: newSession.id,
            sessions: [
              { id: newSession.id, title: newSession.title, updatedAt: newSession.updated_at },
              ...state.sessions,
            ],
            messages: updatedMessages,
          }
        })
        currentSessionId = newSession.id
      } catch (error) {
        console.error('Failed to create session:', error)
        return
      }
    }

    const activeLeaf = parentId !== undefined ? parentId : get().activeLeafId[currentSessionId!];
    
    // Get the real AI message from API immediately
    try {
      const data = await chatService.sendMessage(currentSessionId!, content, activeLeaf ?? undefined)
      
      // Create real messages from API response
      const finalUserMsg: Message = {
        id: data.user_message.id,
        role: data.user_message.role,
        content: data.user_message.content,
        parent_id: data.user_message.parent_id,
        timestamp: data.user_message.timestamp,
      };
      
      const aiMessage: Message = {
        id: data.ai_message.id,
        role: data.ai_message.role,
        content: data.ai_message.content,
        parent_id: data.ai_message.parent_id,
        timestamp: data.ai_message.timestamp,
      }

      set((state) => ({
        messages: {
          ...state.messages,
          [currentSessionId!]: [...(state.messages[currentSessionId!] || []), finalUserMsg, aiMessage],
        },
        activeLeafId: {
          ...state.activeLeafId,
          [currentSessionId!]: aiMessage.id,
        },
        isTyping: false,
      }))
    } catch (err) {
      // If API fails, still show user message and error
      const tempUserMsgId = `temp-${Date.now()}`
      const userMessage: Message = {
        id: tempUserMsgId,
        role: 'user',
        content,
        parent_id: activeLeaf,
        timestamp: new Date().toISOString(),
      };
      
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'ai',
        content: `Sorry, there was an error processing your request.`,
        parent_id: tempUserMsgId,
        timestamp: new Date().toISOString(),
      }
      
      set((state) => ({
        messages: {
          ...state.messages,
          [currentSessionId!]: [...(state.messages[currentSessionId!] || []), userMessage, errorMessage],
        },
        activeLeafId: {
          ...state.activeLeafId,
          [currentSessionId!]: errorMessage.id,
        },
        isTyping: false,
      }))
    }
  },

  deleteSessions: async (ids) => {
    try {
      await chatService.deleteSessions(ids)
      set((state) => {
        const remainingSessions = state.sessions.filter((s) => !ids.includes(s.id))
        const newMessages = { ...state.messages }
        ids.forEach((id) => delete newMessages[id])

        let newActiveSessionId = state.activeSessionId
        if (newActiveSessionId && ids.includes(newActiveSessionId)) {
          newActiveSessionId = remainingSessions.length > 0 ? remainingSessions[0].id : null
        }

        return {
          sessions: remainingSessions,
          messages: newMessages,
          activeSessionId: newActiveSessionId,
        }
      })
    } catch (error) {
      console.error('Failed to delete sessions:', error)
    }
  },

  editMessage: async (messageId, newContent) => {
    const { messages, activeSessionId, sendMessage } = get()
    if (!activeSessionId) return
    const msg = messages[activeSessionId]?.find(m => m.id === messageId)
    if (!msg) return
    
    // Send a new message that attaches to the parent of the edited message
    await sendMessage(newContent, msg.parent_id)
  },

  setActiveLeaf: (sessionId, leafId) => {
    set((state) => ({
      activeLeafId: {
        ...state.activeLeafId,
        [sessionId]: leafId,
      }
    }))
  },

  getActiveThread: (sessionId) => {
    const { messages, activeLeafId } = get()
    const allMessages = messages[sessionId] || []
    let leafId = activeLeafId[sessionId]
    
    if (!leafId && allMessages.length > 0) {
      leafId = allMessages[allMessages.length - 1].id
    }

    if (!leafId) return []

    const thread: Message[] = []
    let currentId: string | null | undefined = leafId

    // Map for fast lookup
    const msgMap = new Map(allMessages.map(m => [m.id, m]))

    // Avoid infinite loops just in case
    const visited = new Set<string>()

    while (currentId && msgMap.has(currentId) && !visited.has(currentId)) {
      visited.add(currentId)
      const msg = msgMap.get(currentId)!
      thread.unshift(msg)
      currentId = msg.parent_id
    }

    return thread
  },

  getSiblings: (sessionId, parentId) => {
    const { messages } = get()
    const allMessages = messages[sessionId] || []
    
    // Siblings are all messages that share the same parent_id
    // Sort them by created_at so they appear in chronological order
    return allMessages.filter(m => (m.parent_id || null) === (parentId || null))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  },

  switchVariant: (messageId, direction) => {
    const { activeSessionId, messages, setActiveLeaf } = get()
    if (!activeSessionId) return
    const allMessages = messages[activeSessionId] || []
    const msg = allMessages.find(m => m.id === messageId)
    if (!msg) return

    const siblings = get().getSiblings(activeSessionId, msg.parent_id)
    if (siblings.length <= 1) return

    const currentIndex = siblings.findIndex(s => s.id === messageId)
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    
    if (nextIndex < 0 || nextIndex >= siblings.length) return

    const selectedSibling = siblings[nextIndex]

    // We must find the deepest descendant of this selected sibling to set as active leaf
    let deepestLeaf = selectedSibling.id
    let currentChildren = allMessages.filter(m => m.parent_id === deepestLeaf)
    
    while (currentChildren.length > 0) {
      // Pick the most recent child
      currentChildren.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      deepestLeaf = currentChildren[0].id
      currentChildren = allMessages.filter(m => m.parent_id === deepestLeaf)
    }

    setActiveLeaf(activeSessionId, deepestLeaf)
  }
}))
