import api from '@/shared/api/client'

export const TrackerService = {
  uploadDocument: async (file: File, extractionType: string = 'expense') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('extraction_type', extractionType)

    const response = await api.post('/extractions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  processMedia: async (file: File | Blob, extractionType: string = 'expense', reviewOnly: boolean = false) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('extraction_type', extractionType)
    formData.append('review_only', reviewOnly ? '1' : '0')

    const response = await api.post('/extractions/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  getExtractionStatus: async (extractionId: number) => {
    const response = await api.get(`/extractions/${extractionId}`)
    return response.data
  },

  processText: async (text: string, extractionType: string = 'expense', reviewOnly: boolean = false) => {
    const response = await api.post('/extractions/text', {
      text,
      extraction_type: extractionType,
      review_only: reviewOnly,
    })
    return response.data
  },
}
