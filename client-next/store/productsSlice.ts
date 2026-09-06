import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export interface Product { id: number; name: string; sku: string; price: number }

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const base = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080'
  const res = await axios.get<Product[]>(`${base}/api/products`)
  return res.data
})

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [] as Product[], loading: false, error: null as string | null },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchProducts.pending, state => { state.loading = true; state.error = null })
    builder.addCase(fetchProducts.fulfilled, (state, action) => { state.items = action.payload; state.loading = false })
    builder.addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Failed' })
  }
})

export default productsSlice.reducer
