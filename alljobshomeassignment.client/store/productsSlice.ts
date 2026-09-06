import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../lib/api'
import type { Product } from '../models/product'

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const res = await api.get<Product[]>('/api/products')
  return res.data
})

export const createProduct = createAsyncThunk('products/create', async (req: Partial<Product>, { rejectWithValue }) => {
  try {
    const res = await api.post<Product>('/api/products', req)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message ?? err.message)
  }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, body }: { id: number; body: Partial<Product> }, { rejectWithValue }) => {
  try {
    const res = await api.put<Product>(`/api/products/${id}`, body)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message ?? err.message)
  }
})

export const toggleProductStatus = createAsyncThunk('products/toggleStatus', async (id: number, { rejectWithValue }) => {
  try {
    const res = await api.patch<Product>(`/api/products/${id}/toggle-status`)
    return res.data
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message ?? err.message)
  }
})

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [] as Product[], loading: false, error: null as string | null },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchProducts.pending, state => { state.loading = true; state.error = null })
    builder.addCase(fetchProducts.fulfilled, (state, action) => { state.items = action.payload; state.loading = false })
    builder.addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed' })

    builder.addCase(createProduct.pending, state => { state.loading = true; state.error = null })
    builder.addCase(createProduct.fulfilled, (state, action) => { state.items.unshift(action.payload); state.loading = false })
    builder.addCase(createProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload as string ?? action.error.message ?? 'Failed' })

    builder.addCase(updateProduct.pending, state => { state.loading = true; state.error = null })
    builder.addCase(updateProduct.fulfilled, (state, action) => { const idx = state.items.findIndex(i => i.id === action.payload.id); if (idx >= 0) state.items[idx] = action.payload; state.loading = false })
    builder.addCase(updateProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload as string ?? action.error.message ?? 'Failed' })

    builder.addCase(toggleProductStatus.pending, state => { state.loading = true; state.error = null })
    builder.addCase(toggleProductStatus.fulfilled, (state, action) => { const idx = state.items.findIndex(i => i.id === action.payload.id); if (idx >= 0) state.items[idx] = action.payload; state.loading = false })
    builder.addCase(toggleProductStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload as string ?? action.error.message ?? 'Failed' })
  }
})

export default productsSlice.reducer
