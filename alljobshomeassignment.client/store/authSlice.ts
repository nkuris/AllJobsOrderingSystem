import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api, { setAccessToken } from '../lib/api'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth'

export interface AuthState { token: string | null; userId?: number; email?: string; role?: string; loading: boolean; error?: string | null }

const initialState: AuthState = { token: null, loading: false, error: null }

function setAuthCookie(token: string | null) {
  if (typeof document === 'undefined') return
  if (token) {
    // set cookie for SSR checks (not HttpOnly for demo)
    document.cookie = `accessToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
  } else {
    document.cookie = `accessToken=; path=/; max-age=0`
  }
}

export const login = createAsyncThunk('auth/login', async (req: LoginRequest, { rejectWithValue }) => {
  try {
    const res = await api.post<AuthResponse>('/api/auth/login', req)
    return res.data
  } catch (err: any) {
    // Forward full error info with status and message
    return rejectWithValue({
      status: err.response?.status,
      message: err.response?.data?.message || err.message
    })
  }
})

export const register = createAsyncThunk('auth/register', async (req: RegisterRequest) => {
  const res = await api.post('/api/auth/register', req)
  return res.data
})

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.userId = undefined
      state.email = undefined
      state.role = undefined
      setAccessToken(null)
      setAuthCookie(null)
    },
    setAuth(state, action) {
      const payload = action.payload as Partial<AuthState>
      state.token = payload.token ?? state.token
      state.userId = payload.userId ?? state.userId
      state.email = payload.email ?? state.email
      state.role = payload.role ?? state.role
      if (payload.token) {
        setAccessToken(payload.token)
        setAuthCookie(payload.token)
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(login.pending, state => { state.loading = true; state.error = null })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.token = action.payload.accessToken
      state.userId = action.payload.userId
      state.email = action.payload.email
      state.role = action.payload.role
      setAccessToken(action.payload.accessToken)
      setAuthCookie(action.payload.accessToken)
    })
    builder.addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Login failed' })

    builder.addCase(register.pending, state => { state.loading = true; state.error = null })
    builder.addCase(register.fulfilled, state => { state.loading = false })
    builder.addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Register failed' })
  }
})

export const { logout, setAuth } = slice.actions
export default slice.reducer
