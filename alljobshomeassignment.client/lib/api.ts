import axios from 'axios'
import type { AxiosRequestHeaders, AxiosError } from 'axios'

const base = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080'

export const api = axios.create({ baseURL: base })

// attach token from localStorage if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) {
      const headers = (config.headers ?? {}) as AxiosRequestHeaders
      headers['Authorization'] = `Bearer ${token}`
      config.headers = headers
    }
  }
  return config
})

// Retry interceptor with exponential backoff for transient network errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as any
    if (!config) {
      return Promise.reject(error)
    }

    // Don't retry if we've already retried this request
    config.retryCount = config.retryCount ?? 0

    // Retry on network errors and 5xx errors, but not 4xx (auth, validation, etc)
    const isNetworkError = !error.response
    const isServerError = error.response?.status && error.response.status >= 500
    const isTransientError = error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT'

    if ((isNetworkError || isServerError || isTransientError) && config.retryCount < 3) {
      config.retryCount += 1
      // Exponential backoff: 500ms, 1000ms, 2000ms
      const delay = Math.pow(2, config.retryCount - 1) * 500
      await new Promise(resolve => setTimeout(resolve, delay))
      return api(config)
    }

    return Promise.reject(error)
  }
)

export function setAccessToken(token: string | null) {
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('accessToken', token)
    else localStorage.removeItem('accessToken')
  }
}

export default api
