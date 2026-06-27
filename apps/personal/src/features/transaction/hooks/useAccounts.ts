import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { accountService } from '../services/account.service'
import {
  type CreateAccountDTO,
  type UpdateAccountDTO,
  type AccountFilters,
} from '../types/transaction.types'

export const useAccounts = (filters?: AccountFilters) => {
  return useQuery({
    queryKey: ['accounts', filters],
    queryFn: () => accountService.getAccounts(filters),
  })
}

export const useAccount = (id: string) => {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => accountService.getAccount(id),
    enabled: !!id,
  })
}

export const useCreateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAccountDTO) => accountService.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export const useUpdateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountDTO }) =>
      accountService.updateAccount(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['account', variables.id] })
    },
  })
}

export const useDeleteAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => accountService.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export const useAccountSummary = () => {
  return useQuery({
    queryKey: ['accountSummary'],
    queryFn: () => accountService.getAccountSummary(),
  })
}

export const useAccountAnalytics = (accountId?: string, month?: number, year?: number) => {
  return useQuery({
    queryKey: ['accountAnalytics', accountId, month, year],
    queryFn: () => accountService.getAccountAnalytics(accountId, month, year),
  })
}
