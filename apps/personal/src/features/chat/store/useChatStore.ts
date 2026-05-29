import { create } from 'zustand'

export type Role = 'user' | 'ai'

export interface Message {
  id: string
  role: Role
  content: string
  timestamp: string
  variants?: string[]
  activeVariantIndex?: number
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
    const newId = Date.now().toString()
    const newSession: ChatSession = {
      id: newId,
      title: 'New Conversation',
      updatedAt: new Date().toISOString(),
    }
    
    set((state) => ({
      sessions: [newSession, ...state.sessions],
      activeSessionId: newId,
      messages: {
        ...state.messages,
        [newId]: [
          {
            id: Date.now().toString() + '-init',
            role: 'ai',
            content: 'Hi! How can I assist you today?',
            timestamp: new Date().toISOString()
          }
        ]
      }
    }))
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
      
      // Update session title if it's the first user message
      const sessions = state.sessions.map(s => {
        if (s.id === activeSessionId && s.title === 'New Conversation') {
          return { ...s, title: content.slice(0, 30) + (content.length > 30 ? '...' : ''), updatedAt: new Date().toISOString() }
        }
        if (s.id === activeSessionId) {
          return { ...s, updatedAt: new Date().toISOString() }
        }
        return s
      })

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
      const newMsgs = msgs.map(m => {
        if (m.id === messageId) {
          const variants = m.variants || [m.content]
          const newVariants = [...variants, newContent]
          return { ...m, content: newContent, variants: newVariants, activeVariantIndex: newVariants.length - 1 }
        }
        return m
      })
      return { messages: { ...state.messages, [activeSessionId]: newMsgs } }
    })
  },

  retryMessage: (messageId) => {
    const { activeSessionId } = get()
    if (!activeSessionId) return
    
    // Immediate state update to hide old response or create new branch
    set((state) => {
      const msgs = state.messages[activeSessionId] || []
      const target = msgs.find(m => m.id === messageId)
      let newMsgs = [...msgs]
      
      let shouldSetGlobalTyping = false
      if (target?.role === 'ai') {
        newMsgs = newMsgs.map(m => {
          if (m.id === messageId) {
            const variants = m.variants || [m.content]
            const newVariants = [...variants, ''] // Empty loading state
            return { ...m, content: '', variants: newVariants, activeVariantIndex: newVariants.length - 1, isGenerating: true }
          }
          return m
        })
        shouldSetGlobalTyping = false
      } else {
        newMsgs = newMsgs.map(m => {
          if (m.id === messageId) {
            const variants = m.variants || [m.content]
            const newVariants = [...variants, m.content]
            return { ...m, content: m.content, variants: newVariants, activeVariantIndex: newVariants.length - 1 }
          }
          return m
        })
        shouldSetGlobalTyping = true
      }
      return { messages: { ...state.messages, [activeSessionId]: newMsgs }, isTyping: shouldSetGlobalTyping }
    })
    
    setTimeout(() => {
      set((state) => {
        const msgs = state.messages[activeSessionId] || []
        const target = msgs.find(m => m.id === messageId)
        
        let newMsgs = [...msgs]
        if (target?.role === 'ai') {
          // Fill the empty variant
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
          // Generate new AI message
          newMsgs.push({
            id: Date.now().toString(),
            role: 'ai',
            content: `*(Retried)*: Berdasarkan pertanyaan Anda sebelumnya "${target?.content?.substring(0, 20)}...", ini adalah respon baru saya.`,
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
      const newMsgs = msgs.map(m => {
        if (m.id === messageId) {
          const variants = m.variants || [m.content]
          const currentIndex = m.activeVariantIndex ?? 0
          let nextIndex = currentIndex
          if (direction === 'prev' && currentIndex > 0) nextIndex = currentIndex - 1
          if (direction === 'next' && currentIndex < variants.length - 1) nextIndex = currentIndex + 1
          
          return { ...m, content: variants[nextIndex], activeVariantIndex: nextIndex }
        }
        return m
      })
      return { messages: { ...state.messages, [activeSessionId]: newMsgs } }
    })
  },
}))
