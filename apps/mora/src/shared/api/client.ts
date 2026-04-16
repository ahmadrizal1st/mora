import axios from 'axios'

let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Ensure we have the /api prefix
if (!API_URL.includes('/api')) {
  API_URL = `${API_URL}/api`
}

const api = axios.create({
  // Use relative path for Vite proxy in development
  baseURL: import.meta.env.DEV ? '/api' : API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY': import.meta.env.VITE_API_KEY,
  },
})

// Add a request interceptor to include the auth token
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

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('auth-storage')
      
      // Redirect to login if not already there
      if (!window.location.pathname.startsWith('/sign-in')) {
        window.location.href = '/sign-in'
      }
    }
    return Promise.reject(error)
  }
)

export default api
