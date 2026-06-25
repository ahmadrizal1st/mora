import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/shared/api/client'

export interface Asset {
  id: string
  name: string
  category?: string
  value: number
  purchase_date?: string
  notes?: string
}

export const useAssets = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await api.get<{ data: Asset[] }>('/assets')
      return response.data.data
    },
  })
}

export const useCreateAsset = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Asset>) => {
      const response = await api.post('/assets', data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

export const useUpdateAsset = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Asset> }) => {
      const response = await api.put(`/assets/${id}`, data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}

export const useDeleteAsset = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/assets/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}
