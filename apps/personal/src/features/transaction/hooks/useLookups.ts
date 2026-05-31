import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { lookupService } from '../services/lookup.service'
import { type CreateTagDTO } from '../types/transaction.types'

export const useCategories = (txType?: 'income' | 'expense' | 'transfer') => {
  return useQuery({
    queryKey: ['categories', txType],
    queryFn: () => lookupService.getCategories(txType),
  })
}

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => lookupService.getTags(),
  })
}

export const useCreateTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTagDTO) => lookupService.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export const useCurrencies = () => {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: () => lookupService.getCurrencies(),
  })
}

export const useStatuses = () => {
  return useQuery({
    queryKey: ['statuses'],
    queryFn: () => lookupService.getStatuses(),
  })
}

export const useRecurringTypes = () => {
  return useQuery({
    queryKey: ['recurring-types'],
    queryFn: () => lookupService.getRecurringTypes(),
  })
}
