import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TrackerService } from '../services/tracker.service';

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, docType = 'expense' }: { file: File; docType?: string }) =>
      TrackerService.uploadDocument(file, docType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useProcessText = () => {
  return useMutation({
    mutationFn: ({ text, docType = 'expense' }: { text: string; docType?: string }) => 
      TrackerService.processText(text, docType),
  });
};
