import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api, { setAccessToken } from '../lib/api'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth'

export interface AuthState { token: string | null; userId?: number; email?: string; role?: string; loading: boolean; error?: string | null }

const initialState: AuthState = { token: null, loading: false, error: null }

export const login = createAsyncThunk('auth/login', async (req: LoginRequest) => {
  const res = await api.post<AuthResponse>('/api/auth/login', req)
  return res.data
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
    })
    builder.addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Login failed' })

    builder.addCase(register.pending, state => { state.loading = true; state.error = null })
    builder.addCase(register.fulfilled, state => { state.loading = false })
    builder.addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Register failed' })
  }
})

export const { logout } = slice.actions
export default slice.reducer
