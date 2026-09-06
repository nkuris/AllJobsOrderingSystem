import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { register, login } from '../store/authSlice'

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const auth = useAppSelector(s => s.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pwError, setPwError] = useState<string | null>(null)

  useEffect(() => {
    // Pre-fill email when redirected from login
    const e = router.query.email
    if (typeof e === 'string' && e.length > 0) setEmail(e)
  }, [router.query])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPwError(null)
    // Client-side password validation
    const pw = password || ''
    const pwValid = pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)
    if (!pwValid) {
      setPwError('Password must be at least 8 characters and include upper, lower, number and symbol')
      return
    }
    try {
      await dispatch(register({ email, password, firstName, lastName, phone, address })).unwrap()
      // Automatically sign in the newly registered user and navigate to the app
      await dispatch(login({ email, password })).unwrap()
      router.push('/')
    } catch (err: any) {
      const status = err?.response?.status || err?.status
      const msg = err?.response?.data?.message || err?.message
      if (status === 409 || msg === 'Email already registered') {
        setError('Email already registered. Please login instead.')
        return
      }
      setError(msg ?? 'Registration failed')
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Register</h1>
      <form onSubmit={submit} style={{ maxWidth: 500 }}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
          {pwError && <div style={{ color: 'red' }}>{pwError}</div>}
        </div>
        <div>
          <label>First name</label>
          <input value={firstName} onChange={e => setFirstName(e.target.value)} required />
        </div>
        <div>
          <label>Last name</label>
          <input value={lastName} onChange={e => setLastName(e.target.value)} required />
        </div>
        <div>
          <label>Phone</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} required />
        </div>
        <div>
          <label>Address</label>
          <input value={address} onChange={e => setAddress(e.target.value)} required />
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="submit">{auth.loading ? 'Registering...' : 'Register'}</button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </main>
  )
}
