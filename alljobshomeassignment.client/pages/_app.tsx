import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import Layout from '../components/Layout'
import { useEffect } from 'react'
import api from '../lib/api'
import { setAuth } from '../store/authSlice'
import { useAppDispatch } from '../store/hooks'

function AppContent({ Component, pageProps }: AppProps) {
  // hydrate auth on client start
  const dispatch = useAppDispatch()
  useEffect(() => {
    let mounted = true
    async function hydrate() {
      try {
        const res = await api.get('/api/auth/me')
        if (!mounted) return
        // the /me endpoint only returns basic info; token came from cookie/localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        if (!token) return
        dispatch(setAuth({ token, userId: res.data.userId, email: res.data.email, role: res.data.role }))
      } catch {
        // clear any stale client-side token or cookie
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          document.cookie = `accessToken=; path=/; max-age=0`
        }
      }
    }
    hydrate()
    return () => { mounted = false }
  }, [dispatch])

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default function App(props: AppProps) {
  return (
    <Provider store={store}>
      <AppContent {...props} />
    </Provider>
  )
}
