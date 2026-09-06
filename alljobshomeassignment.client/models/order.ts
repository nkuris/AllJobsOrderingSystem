export type OrderStatus = 'NEW' | 'PAID' | 'CANCELLED'

export interface OrderItem {
  id?: number
  orderId?: number
  productId: number
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface Order {
  id: number
  customerName: string
  customerEmail: string
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateOrderRequest {
  customerName: string
  customerEmail: string
  items: { productId: number; quantity: number }[]
}
