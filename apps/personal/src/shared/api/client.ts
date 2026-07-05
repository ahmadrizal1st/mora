import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-API-KEY': import.meta.env.VITE_API_KEY,
  },
})

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

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (import.meta.env.DEV) {
      console.error(
        `❌ [API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        error.response?.data || error.message
      )
    }

    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true

      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        const { access_token } = response.data.data

        if (access_token) {
          localStorage.setItem('token', access_token)

          error.config.headers.Authorization = `Bearer ${access_token}`
          return api(error.config)
        }
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('auth-storage')

        const currentPath = window.location.pathname
        if (!currentPath.startsWith('/sign-in') && !currentPath.startsWith('/sign-up')) {
          window.location.href = `/sign-in?redirect=${encodeURIComponent(currentPath)}`
        }
      }
    }

    if (
      error.response?.status === 503 ||
      error.response?.data?.error_code === 'DATABASE_CONNECTION_ERROR'
    ) {
      if (window.location.pathname !== '/error-maintenance') {
        window.location.href = '/error-maintenance'
      }
    }
    return Promise.reject(error)
  }
)

export default api
