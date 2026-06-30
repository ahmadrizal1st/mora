import api from '@/shared/api/client'

export type TemplateCategory =
  | 'financial-analysis'
  | 'investment'
  | 'planning'
  | 'report'
  | 'other'

export interface PromptTemplate {
  id: string
  user_id: string
  title: string
  description: string | null
  prompt: string
  category: TemplateCategory
  icon: string
  icon_color: string
  usage_count: number
  created_at: string
  updated_at: string
}

export type CreateTemplatePayload = Pick<
  PromptTemplate,
  'title' | 'description' | 'prompt' | 'category' | 'icon' | 'icon_color'
>

export type UpdateTemplatePayload = Partial<CreateTemplatePayload>

export const templateService = {
  async list(): Promise<PromptTemplate[]> {
    const res = await api.get('/prompt-templates')
    return res.data.data
  },

  async create(payload: CreateTemplatePayload): Promise<PromptTemplate> {
    const res = await api.post('/prompt-templates', payload)
    return res.data.data
  },

  async update(id: string, payload: UpdateTemplatePayload): Promise<PromptTemplate> {
    const res = await api.put(`/prompt-templates/${id}`, payload)
    return res.data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/prompt-templates/${id}`)
  },

  async use(id: string): Promise<PromptTemplate> {
    const res = await api.post(`/prompt-templates/${id}/use`)
    return res.data.data
  },
}
