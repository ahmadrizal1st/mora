import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transaction.service';
import { type TransactionFilters, type CreateTransactionDTO, type UpdateTransactionDTO } from '../types/transaction.types';

export const useTransactions = (filters?: TransactionFilters) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionService.getTransactions(filters),
  });
};

export const useTransactionChartData = (filters?: TransactionFilters) => {
  return useQuery({
    queryKey: ['transactions-chart', filters],
    queryFn: () => transactionService.getChartData(filters),
  });
};

export const useTransactionHistory = (params?: { date_from?: string; date_to?: string; account_id?: number }) => {
  return useQuery({
    queryKey: ['transaction-history', params],
    queryFn: () => transactionService.getHistory(params),
  });
};

export const useTransaction = (id: number) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionService.getTransaction(id),
    enabled: !!id,
  });
};

export const useTransactionSummary = (params?: { date_from?: string; date_to?: string; account_id?: number }) => {
  return useQuery({
    queryKey: ['transaction-summary', params],
    queryFn: () => transactionService.getSummary(params),
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTransactionDTO) => transactionService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-summary'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTransactionDTO }) => 
      transactionService.updateTransaction(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['transaction-summary'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-summary'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};
