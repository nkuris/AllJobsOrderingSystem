import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { login } from '../store/authSlice'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const auth = useAppSelector(s => s.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pwError, setPwError] = useState<string | null>(null)

  useEffect(() => {
    if (auth.token) {
      router.replace('/')
    }
  }, [auth.token, router])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPwError(null)

    try {
      await dispatch(login({ email, password })).unwrap()
      router.push('/')
    } catch (err: any) {
      // Check if error is 404 "Email not found" - redirect to register
      const status = err?.status
      const msg = err?.message
      const code = err?.code

      // Check for network/connection errors
      if (!status && (code === 'ERR_NETWORK' || msg?.includes('Network') || msg?.includes('ECONNREFUSED'))) {
        setError('Unable to connect to server. Please check your connection and try again.')
        return
      }

      if (status === 404 || msg === 'Email not found') {
        router.push(`/register?email=${encodeURIComponent(email)}`)
        return
      }
      // Password validation errors from backend
      if (msg?.includes('Password must be') || msg?.includes('least 8 characters')) {
        setPwError(msg)
        return
      }
      setError(msg ?? 'Login failed')
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Login</h1>
      <form onSubmit={submit} style={{ maxWidth: 400 }}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
          {pwError && <div style={{ color: 'red' }}>{pwError}</div>}
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="submit">{auth.loading ? 'Signing in...' : 'Sign in'}</button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </main>
  )
}
