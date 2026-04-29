import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Ensure we have the /api prefix for the absolute URL
const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`

const api = axios.create({
  // In development, use window.location.origin to ensure leading slashes in 
  // service calls (e.g. '/transactions') are correctly relative to our proxy.
  baseURL: import.meta.env.DEV ? '/api' : API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY': import.meta.env.VITE_API_KEY,
  },
})

// Add a request interceptor to include the auth token and log requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle 401 errors and log responses
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (import.meta.env.DEV) {
      console.error(`❌ [API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message)
    }

    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      
      try {
        // Attempt to refresh token
        // Use a clean axios call or ensure this doesn't trigger the interceptor again
        const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const { access_token } = response.data.data;
        
        if (access_token) {
          localStorage.setItem('token', access_token);
          // Update the original request with new token
          error.config.headers.Authorization = `Bearer ${access_token}`;
          return api(error.config);
        }
      } catch {
        // Refresh failed, logout and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('auth-storage');
        
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/sign-in') && !currentPath.startsWith('/sign-up')) {
          window.location.href = `/sign-in?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }

    if (error.response?.status === 503 || error.response?.data?.error_code === 'DATABASE_CONNECTION_ERROR') {
      if (window.location.pathname !== '/error-maintenance') {
        window.location.href = '/error-maintenance'
      }
    }
    return Promise.reject(error)
  }
)

export default api
