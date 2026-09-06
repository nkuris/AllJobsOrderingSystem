export type ProductStatus = 'ACTIVE' | 'INACTIVE'

export interface Product {
  id: number
  name: string
  sku: string
  description?: string
  price: number
  stockQuantity: number
  status: ProductStatus
  createdAt: string
  updatedAt: string
}
