import { create } from 'zustand'

export type Role = 'user' | 'ai'

export interface Message {
  id: string
  role: Role
  content: string
  timestamp: string
  isGenerating?: boolean
  variants?: string[]
  activeVariantIndex?: number
  // For user messages: stores subsequent messages for each variant index
  variantBranches?: Record<number, Message[]>
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
  isTyping: boolean
  createNewSession: () => void
  loadSession: (id: string) => void
  sendMessage: (content: string) => void
  editMessage: (messageId: string, newContent: string) => void
  retryMessage: (messageId: string) => void
  switchVariant: (messageId: string, direction: 'prev' | 'next') => void
  deleteSessions: (ids: string[]) => void
}

const MOCK_INITIAL_SESSIONS: ChatSession[] = [
  { id: '1', title: 'SOA Framework', updatedAt: new Date().toISOString() },
]

const MOCK_INITIAL_MESSAGES: Record<string, Message[]> = {
  '1': [
    { 
      id: 'm1', 
      role: 'user', 
      content: 'berikan jawaban singkat namun sesuai dengan soal tidak perlu dibuat dalam bentuk file\nJawab bagian A terlebih dahulu', 
      timestamp: new Date(Date.now() - 60000).toISOString() 
    },
    { 
      id: 'm2', 
      role: 'ai', 
      content: `# Panduan Lengkap Markdown

## Apa itu Markdown?

Markdown adalah bahasa markup ringan yang memungkinkan kamu memformat teks dengan sintaks sederhana. Diciptakan oleh John Gruber pada 2004, Markdown kini digunakan di GitHub, Reddit, Notion, dan banyak platform lainnya.

---

## Heading

\`\`\`markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
\`\`\`

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

## Teks Formatting

\`\`\`markdown
**tebal**
*miring*
~~coret~~
\`inline code\`
**_tebal dan miring_**
\`\`\`

**tebal** — untuk penekanan kuat
*miring* — untuk istilah atau penekanan
~~coret~~ — untuk teks yang dihapus
\`inline code\` — untuk kode pendek
***tebal dan miring*** — kombinasi keduanya

---

## List

### Unordered List
\`\`\`markdown
- Item A
  - Sub-item A1
  - Sub-item A2
- Item B
- Item C
\`\`\`

- Item A
  - Sub-item A1
  - Sub-item A2
- Item B
- Item C

### Ordered List
\`\`\`markdown
1. Langkah pertama
2. Langkah kedua
3. Langkah ketiga
\`\`\`

1. Langkah pertama
2. Langkah kedua
3. Langkah ketiga

### Task List
\`\`\`markdown
- [x] Tugas selesai
- [ ] Tugas belum selesai
- [x] Review kode
\`\`\`

- [x] Tugas selesai
- [ ] Tugas belum selesai
- [x] Review kode

---

## Tabel

\`\`\`markdown
| Nama    | Umur | Kota       |
|---------|------|------------|
| Andi    | 25   | Jakarta    |
| Budi    | 30   | Bandung    |
| Citra   | 22   | Surabaya   |
\`\`\`

| Nama  | Umur | Kota     |
|-------|------|----------|
| Andi  | 25   | Jakarta  |
| Budi  | 30   | Bandung  |
| Citra | 22   | Surabaya |

### Tabel dengan Alignment

\`\`\`markdown
| Kiri       | Tengah     | Kanan      |
|:-----------|:----------:|-----------:|
| teks kiri  | teks tengah| teks kanan |
| 100        | 200        | 300        |
\`\`\`

| Kiri      |   Tengah    |      Kanan |
|:----------|:-----------:|-----------:|
| teks kiri | teks tengah | teks kanan |
| 100       |     200     |        300 |

---

## Blockquote

\`\`\`markdown
> Ini adalah sebuah kutipan.
> Bisa multi-baris.
>
> > Kutipan bersarang.
\`\`\`

> Ini adalah sebuah kutipan.
> Bisa multi-baris.
>
> > Kutipan bersarang.

---

## Kode

### Inline Code
\`\`\`markdown
Gunakan fungsi \`print()\` untuk output.
\`\`\`

Gunakan fungsi \`print()\` untuk output.

### Block Code
\`\`\`\`markdown
\`\`\`python
def halo(nama):
    print(f"Halo, {nama}!")

halo("Dunia")
\`\`\`
\`\`\`\`

\`\`\`python
def halo(nama):
    print(f"Halo, {nama}!")

halo("Dunia")
\`\`\`

---

## Link & Gambar

\`\`\`markdown
[Teks Link](https://example.com)
[Link dengan Tooltip](https://example.com "Ini tooltipnya")
![Alt Gambar](https://example.com/gambar.jpg)
\`\`\`

[Teks Link](https://example.com)
[Link dengan Tooltip](https://example.com "Ini tooltipnya")

---

## Garis Horizontal

\`\`\`markdown
---
***
___
\`\`\`

---

## Footnote

\`\`\`markdown
Ini teks dengan catatan kaki.[^1]

[^1]: Ini isi catatan kakinya.
\`\`\`

Ini teks dengan catatan kaki.[^1]

[^1]: Ini isi catatan kakinya.

---

## Escape Character

Gunakan backslash \`\\\` untuk menampilkan karakter khusus:

\`\`\`markdown
\\*bukan italic\\*
\\# bukan heading
\\[bukan link\\]
\`\`\`

\\*bukan italic\\*
\\# bukan heading
\\[bukan link\\]

---

## Ringkasan Sintaks

| Elemen        | Sintaks                   |
|---------------|---------------------------|
| Heading       | \`# H1\` hingga \`###### H6\` |
| Tebal         | \`**teks**\`                |
| Miring        | \`*teks*\`                  |
| Coret         | \`~~teks~~\`                |
| Link          | \`[teks](url)\`             |
| Gambar        | \`![alt](url)\`             |
| Kode Inline   | \`\` \`kode\` \`\`              |
| Blockquote    | \`> teks\`                  |
| List          | \`- item\` atau \`1. item\`   |
| Tabel         | \`\\| col \\| col \\|\`        |
| Garis Bawah   | \`---\`                     |`,
      timestamp: new Date().toISOString() 
    }
  ]
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: MOCK_INITIAL_SESSIONS,
  activeSessionId: '1',
  messages: MOCK_INITIAL_MESSAGES,
  isTyping: false,

  createNewSession: () => {
    set((state) => {
      const currentActiveId = state.activeSessionId
      const currentMessages = currentActiveId ? state.messages[currentActiveId] || [] : []
      
      // If currently on an empty session, just return
      if (currentActiveId && currentMessages.length === 0) {
        return state
      }

      const newId = 'new-' + Date.now().toString()
      
      return {
        activeSessionId: newId,
        messages: {
          ...state.messages,
          [newId]: []
        }
      }
    })
  },

  loadSession: (id) => {
    set({ activeSessionId: id })
  },

  sendMessage: (content) => {
    const { activeSessionId } = get()
    if (!activeSessionId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }

    set((state) => {
      const currentMessages = state.messages[activeSessionId] || []
      let sessions = [...state.sessions]
      
      const isNewSession = !sessions.some(s => s.id === activeSessionId)
      
      if (isNewSession) {
        sessions.push({
          id: activeSessionId,
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          updatedAt: new Date().toISOString()
        })
      } else {
        sessions = sessions.map(s => {
          if (s.id === activeSessionId && s.title === 'New Conversation') {
            return { ...s, title: content.slice(0, 30) + (content.length > 30 ? '...' : ''), updatedAt: new Date().toISOString() }
          }
          if (s.id === activeSessionId) {
            return { ...s, updatedAt: new Date().toISOString() }
          }
          return s
        })
      }

      // Sort sessions by updatedAt descending
      sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

      return {
        messages: {
          ...state.messages,
          [activeSessionId]: [...currentMessages, userMessage],
        },
        sessions,
        isTyping: true,
      }
    })

    // Mock AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `This is a mock AI response to: "${content}". In a real app, this would be an API call to an AI service like OpenAI.`,
        timestamp: new Date().toISOString(),
      }
      
      set((state) => ({
        messages: {
          ...state.messages,
          [activeSessionId]: [...(state.messages[activeSessionId] || []), aiMessage],
        },
        isTyping: false,
      }))
    }, 1500)
  },

  editMessage: (messageId, newContent) => {
    const { activeSessionId } = get()
    if (!activeSessionId) return
    set((state) => {
      const msgs = state.messages[activeSessionId] || []
      const targetIndex = msgs.findIndex(m => m.id === messageId)
      if (targetIndex === -1) return state

      const target = msgs[targetIndex]
      const currentVariantIndex = target.activeVariantIndex ?? 0

      // Save the current branch (messages after this user message) to the current variant
      const currentBranch = msgs.slice(targetIndex + 1)
      const updatedBranches: Record<number, Message[]> = {
        ...(target.variantBranches || {}),
        [currentVariantIndex]: currentBranch
      }

      // Add new variant
      const variants = target.variants || [target.content]
      const newVariants = [...variants, newContent]
      const newVariantIndex = newVariants.length - 1

      // Truncate messages after target, new variant starts with empty branch
      const newMsgs = [
        ...msgs.slice(0, targetIndex),
        {
          ...target,
          content: newContent,
          variants: newVariants,
          activeVariantIndex: newVariantIndex,
          variantBranches: updatedBranches
        }
      ]
      return { messages: { ...state.messages, [activeSessionId]: newMsgs }, isTyping: true }
    })

    // Generate new AI response after edit
    const userContent = newContent
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'ai',
        content: `This is a mock AI response to: "${userContent}". In a real app, this would be an API call to an AI service like OpenAI.`,
        timestamp: new Date().toISOString(),
      }
      set((state) => ({
        messages: {
          ...state.messages,
          [activeSessionId]: [...(state.messages[activeSessionId] || []), aiMessage],
        },
        isTyping: false,
      }))
    }, 1500)
  },

  retryMessage: (messageId) => {
    const { activeSessionId } = get()
    if (!activeSessionId) return
    
    // Immediate state update to hide old response or create new branch
    set((state) => {
      const msgs = state.messages[activeSessionId] || []
      const targetIndex = msgs.findIndex(m => m.id === messageId)
      if (targetIndex === -1) return state
      
      const target = msgs[targetIndex]
      let newMsgs = [...msgs]
      
      if (target.role === 'ai') {
        // For AI messages: add an empty variant slot while regenerating
        newMsgs = newMsgs.map(m => {
          if (m.id === messageId) {
            const variants = m.variants || [m.content]
            const newVariants = [...variants, ''] // empty loading state
            return { ...m, content: '', variants: newVariants, activeVariantIndex: newVariants.length - 1, isGenerating: true }
          }
          return m
        })
      } else {
        // For user messages: just truncate after, don't touch user message object
        newMsgs = newMsgs.slice(0, targetIndex + 1)
      }
      return { 
        messages: { ...state.messages, [activeSessionId]: newMsgs }, 
        isTyping: target.role === 'user' 
      }
    })
    
    setTimeout(() => {
      set((state) => {
        const msgs = state.messages[activeSessionId] || []
        const aiTarget = msgs.find(m => m.id === messageId)
        let newMsgs = [...msgs]

        if (aiTarget?.role === 'ai') {
          // Fill the empty variant slot with regenerated content
          newMsgs = newMsgs.map(m => {
            if (m.id === messageId) {
              const variants = [...(m.variants || [])]
              const newContent = `*(Regenerated Variant ${variants.length})*: Berikut adalah sudut pandang tambahan mengenai topik tersebut...`
              variants[variants.length - 1] = newContent
              return { ...m, content: newContent, variants, isGenerating: false }
            }
            return m
          })
        } else {
          // User message retry: append a new AI message after the (now-truncated) user message
          const userMsg = msgs.find(m => m.id === messageId)
          newMsgs.push({
            id: Date.now().toString(),
            role: 'ai',
            content: `This is a mock AI response to: "${userMsg?.content}". In a real app, this would be an API call to an AI service like OpenAI.`,
            timestamp: new Date().toISOString()
          })
        }
        
        return {
          messages: { ...state.messages, [activeSessionId]: newMsgs },
          isTyping: false
        }
      })
    }, 1500)
  },

  switchVariant: (messageId, direction) => {
    const { activeSessionId } = get()
    if (!activeSessionId) return
    set((state) => {
      const msgs = state.messages[activeSessionId] || []
      const targetIndex = msgs.findIndex(m => m.id === messageId)
      if (targetIndex === -1) return state

      const target = msgs[targetIndex]
      const variants = target.variants || [target.content]
      const currentIndex = target.activeVariantIndex ?? 0
      let nextIndex = currentIndex
      if (direction === 'prev' && currentIndex > 0) nextIndex = currentIndex - 1
      if (direction === 'next' && currentIndex < variants.length - 1) nextIndex = currentIndex + 1
      if (nextIndex === currentIndex) return state

      if (target.role === 'user') {
        // Save current branch (messages after this one) to current variant
        const currentBranch = msgs.slice(targetIndex + 1)
        const updatedBranches: Record<number, Message[]> = {
          ...(target.variantBranches || {}),
          [currentIndex]: currentBranch
        }

        // Restore the target variant's branch
        const targetBranch = updatedBranches[nextIndex] || []

        const newMsgs = [
          ...msgs.slice(0, targetIndex),
          {
            ...target,
            content: variants[nextIndex],
            activeVariantIndex: nextIndex,
            variantBranches: updatedBranches
          },
          ...targetBranch
        ]
        return { messages: { ...state.messages, [activeSessionId]: newMsgs } }
      } else {
        // AI message: just switch variant content (no branch switching needed)
        const newMsgs = msgs.map(m => {
          if (m.id === messageId) {
            return { ...m, content: variants[nextIndex], activeVariantIndex: nextIndex }
          }
          return m
        })
        return { messages: { ...state.messages, [activeSessionId]: newMsgs } }
      }
    })
  },

  deleteSessions: (ids) => {
    set((state) => {
      const remainingSessions = state.sessions.filter(s => !ids.includes(s.id))
      const newMessages = { ...state.messages }
      ids.forEach(id => {
        delete newMessages[id]
      })
      
      let newActiveSessionId = state.activeSessionId
      if (newActiveSessionId && ids.includes(newActiveSessionId)) {
        newActiveSessionId = remainingSessions.length > 0 ? remainingSessions[0].id : null
      }
      
      return {
        sessions: remainingSessions,
        messages: newMessages,
        activeSessionId: newActiveSessionId
      }
    })
  },
}))
