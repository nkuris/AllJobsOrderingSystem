import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../lib/api'
import type { User } from '../models/user'

export const fetchUsers = createAsyncThunk('users/fetch', async () => {
  const res = await api.get<User[]>('/api/users')
  return res.data
})

export const updateUserRole = createAsyncThunk('users/updateRole', async ({ id, role }: { id: number; role: string }) => {
  await api.put(`/api/users/${id}/role`, { role })
  return { id, role }
})

export const deleteUser = createAsyncThunk('users/delete', async (id: number) => {
  await api.delete(`/api/users/${id}`)
  return id
})

const slice = createSlice({
  name: 'users',
  initialState: { items: [] as User[], loading: false, error: null as string | null },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUsers.pending, state => { state.loading = true; state.error = null })
    builder.addCase(fetchUsers.fulfilled, (state, action) => { state.items = action.payload; state.loading = false })
    builder.addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed' })

    builder.addCase(updateUserRole.fulfilled, (state, action) => {
      const u = state.items.find(x => x.id === action.payload.id)
      if (u) u.role = action.payload.role as any
    })

    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.items = state.items.filter(x => x.id !== action.payload)
    })
  }
})

export default slice.reducer
