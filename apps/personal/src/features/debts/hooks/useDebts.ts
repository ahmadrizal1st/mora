import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { debtsService } from '../services/debts.service'

export const useDebts = () => {
  return useQuery({
    queryKey: ['debts'],
    queryFn: debtsService.getDebts,
  })
}

export const useCreateDebt = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: debtsService.createDebt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}

export const useUpdateDebt = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof debtsService.updateDebt>[1] }) =>
      debtsService.updateDebt(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}

export const useDeleteDebt = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: debtsService.deleteDebt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}
