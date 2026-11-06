export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  createdAt: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}
