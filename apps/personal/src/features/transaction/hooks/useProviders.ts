import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providerService, type CreateProviderDTO } from '../services/provider.service';

export const useProviders = () => {
  return useQuery({
    queryKey: ['providers'],
    queryFn: () => providerService.getProviders(),
  });
};

export const useCreateProvider = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProviderDTO) => providerService.createProvider(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
  });
};
