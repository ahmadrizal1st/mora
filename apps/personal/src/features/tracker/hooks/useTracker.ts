import { useMutation } from '@tanstack/react-query'
import { TrackerService } from '../services/tracker.service'
import api from '@/shared/api/client'


export const useProcessText = () => {
  return useMutation({
    mutationFn: ({ text, docType = 'expense', reviewOnly = false }: { text: string; docType?: string; reviewOnly?: boolean }) =>
      TrackerService.processText(text, docType, reviewOnly),
  })
}

export function useProcessMedia() {
  return useMutation({
    mutationFn: async ({ files, text, reviewOnly, onProgress }: { files?: File[], text?: string, reviewOnly?: boolean, onProgress?: (progress: number) => void }) => {
      const formData = new FormData()
      if (files) {
        files.forEach((f) => formData.append('files[]', f))
      }
      if (text) formData.append('text', text)
      if (reviewOnly !== undefined) formData.append('review_only', reviewOnly ? '1' : '0')
      
      const res = await api.post('/extractions/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(percentCompleted)
          }
        }
      })
      return res.data
    }
  })
}
