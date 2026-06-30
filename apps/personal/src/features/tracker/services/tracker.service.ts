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

  getExtractionStatus: async (extractionId: number) => {
    const response = await api.get(`/extractions/${extractionId}`)
    return response.data
  },

  processText: async (text: string, extractionType: string = 'expense') => {
    const response = await api.post('/extractions/text', {
      text,
      extraction_type: extractionType,
    })
    return response.data
  },
}
