import axios from 'axios'

const base = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080'

export const api = axios.create({ baseURL: base })

// attach token from localStorage if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers = config.headers ?? {}
      config.headers['Authorization'] = `Bearer ${token}`
    }
  }
  return config
})

export function setAccessToken(token: string | null) {
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('accessToken', token)
    else localStorage.removeItem('accessToken')
  }
}

export default api
