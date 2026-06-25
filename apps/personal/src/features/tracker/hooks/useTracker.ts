import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TrackerService } from '../services/tracker.service'


export const useProcessText = () => {
  return useMutation({
    mutationFn: ({ text, docType = 'expense' }: { text: string; docType?: string }) =>
      TrackerService.processText(text, docType),
  })
}
