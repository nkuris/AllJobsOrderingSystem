import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../lib/api'
import type { Order, CreateOrderRequest } from '../models/order'

export const fetchOrders = createAsyncThunk('orders/fetch', async (status?: string) => {
  const url = status ? `/api/orders?status=${encodeURIComponent(status)}` : '/api/orders'
  const res = await api.get<Order[]>(url)
  return res.data
})

export const createOrder = createAsyncThunk('orders/create', async (req: CreateOrderRequest) => {
  const res = await api.post<Order>('/api/orders', req)
  return res.data
})

const slice = createSlice({
  name: 'orders',
  initialState: { items: [] as Order[], loading: false, error: null as string | null },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchOrders.pending, state => { state.loading = true; state.error = null })
    builder.addCase(fetchOrders.fulfilled, (state, action) => { state.items = action.payload; state.loading = false })
    builder.addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed' })

    builder.addCase(createOrder.pending, state => { state.loading = true; state.error = null })
    builder.addCase(createOrder.fulfilled, (state, action) => { state.items.unshift(action.payload); state.loading = false })
    builder.addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed' })
  }
})

export default slice.reducer
