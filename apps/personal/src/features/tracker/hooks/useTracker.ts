import { useMutation } from '@tanstack/react-query';
import { TrackerService } from '../services/tracker.service';

export const useUploadDocument = () => {
  return useMutation({
    mutationFn: ({ file, docType = 'expense' }: { file: File; docType?: string }) => 
      TrackerService.uploadDocument(file, docType),
  });
};

export const useProcessText = () => {
  return useMutation({
    mutationFn: ({ text, docType = 'expense' }: { text: string; docType?: string }) => 
      TrackerService.processText(text, docType),
  });
};
