export type UserRole = 'ADMIN' | 'VIEWER'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  role: UserRole
  createdAt: string
  updatedAt: string
}
