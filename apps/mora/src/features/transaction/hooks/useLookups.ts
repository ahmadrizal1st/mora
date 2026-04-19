import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { lookupService } from '../services/lookup.service';
import { type CreateTagDTO } from '../types/transaction.types';

export const useCategories = (txType?: 'income' | 'expense' | 'transfer') => {
  return useQuery({
    queryKey: ['categories', txType],
    queryFn: async () => [
      { id: 1, name: 'Food & Dining', icon: 'pizza' },
      { id: 2, name: 'Transportation', icon: 'car' },
      { id: 3, name: 'Shopping', icon: 'shopping-bag' },
      { id: 4, name: 'Housing', icon: 'home' },
      { id: 5, name: 'Salary', icon: 'cash' },
    ] as any[],
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => [
      { id: 1, name: 'Personal', color: '#206bc4' },
      { id: 2, name: 'Work', color: '#ff922b' },
      { id: 3, name: 'Urgent', color: '#f03e3e' },
      { id: 4, name: 'Family', color: '#2fb344' },
    ] as any[],
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagDTO) => lookupService.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useCurrencies = () => {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: async () => [
      { id: 1, code: 'IDR', name: 'Indonesian Rupiah', is_default: true },
      { id: 2, code: 'USD', name: 'US Dollar', is_default: false },
      { id: 3, code: 'EUR', name: 'Euro', is_default: false },
    ] as any[],
  });
};

export const useStatuses = () => {
  return useQuery({
    queryKey: ['statuses'],
    queryFn: () => lookupService.getStatuses(),
  });
};

export const useRecurringTypes = () => {
  return useQuery({
    queryKey: ['recurring-types'],
    queryFn: () => lookupService.getRecurringTypes(),
  });
};
