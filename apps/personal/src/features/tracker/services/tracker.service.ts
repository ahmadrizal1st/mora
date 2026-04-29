import api from '@/shared/api/client';

export const TrackerService = {
  // Untuk File, Image, Audio
  uploadDocument: async (file: File, docType: string = 'expense') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_type', docType);

    const response = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Untuk Text (langsung ke LLM, bypass OCR)
  processText: async (text: string, docType: string = 'expense') => {
    const response = await api.post('/documents/text', {
      text,
      doc_type: docType,
    });
    return response.data;
  }
};
