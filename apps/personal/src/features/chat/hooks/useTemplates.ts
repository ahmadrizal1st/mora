import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  templateService,
  type CreateTemplatePayload,
  type UpdateTemplatePayload,
} from '../services/templateService'

const QK = ['prompt-templates'] as const

export function useTemplates() {
  return useQuery({
    queryKey: QK,
    queryFn: templateService.list,
  })
}

export function useCreateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTemplatePayload) => templateService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  })
}

export function useUpdateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTemplatePayload }) =>
      templateService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  })
}

export function useDeleteTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => templateService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  })
}

export function useUseTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => templateService.use(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  })
}
