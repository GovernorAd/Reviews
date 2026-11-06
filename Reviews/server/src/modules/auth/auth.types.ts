export type UserRole = 'user' | 'admin'

export interface User {
  id: string
  username: string
  email: string
  passwordHash: string
  role: UserRole
  createdAt: string
}

export type AuthUser = Omit<User, 'passwordHash'>

export const toAuthUser = (user: User): AuthUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
})
