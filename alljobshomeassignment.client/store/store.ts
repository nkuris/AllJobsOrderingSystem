import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './productsSlice'
import authReducer from './authSlice'
import ordersReducer from './ordersSlice'
import usersReducer from './usersSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    orders: ordersReducer,
    users: usersReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
