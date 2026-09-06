import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import Layout from '../components/Layout'
import { useEffect } from 'react'
import api from '../lib/api'
import { setAuth } from '../store/authSlice'
import { useStore } from 'react-redux'

export default function App({ Component, pageProps }: AppProps) {
  // hydrate auth on client start
  const storeHook = store
  useEffect(() => {
    let mounted = true
    async function hydrate() {
      try {
        const res = await api.get('/api/auth/me')
        if (!mounted) return
        // the /me endpoint only returns basic info; token came from cookie/localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        if (!token) return
        storeHook.dispatch(setAuth({ token, userId: res.data.userId, email: res.data.email, role: res.data.role }))
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
  }, [])

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}
