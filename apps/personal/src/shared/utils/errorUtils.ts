/**
 * Extracts error message from API response or fallback to default message.
 */
export const getApiErrorMessage = (error: unknown, fallback: string = 'Terjadi kesalahan sistem.'): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message ?? fallback;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return fallback;
};
