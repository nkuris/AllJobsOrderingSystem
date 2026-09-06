import { useEffect } from 'react'
import { useRouter } from 'next/router'
import api from '../lib/api'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/authSlice'

// Hook to protect client-side pages. If token missing or invalid, redirects to /login
export default function useRequireAuth() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const auth = useAppSelector(s => s.auth)

  useEffect(() => {
    // If no token, redirect immediately
    if (!auth.token) {
      router.replace('/login')
      return
    }

    // Validate token by calling /api/auth/me
    let mounted = true
    api.get('/api/auth/me')
      .then(() => {
        // valid
      })
      .catch((err) => {
        if (!mounted) return
        // On 401/403, clear auth and redirect to login
        dispatch(logout())
        router.replace('/login')
      })

    return () => { mounted = false }
  }, [auth.token, dispatch, router])
}
