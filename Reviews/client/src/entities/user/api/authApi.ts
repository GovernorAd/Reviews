import { http } from '@/shared/api'

import type { LoginPayload, RegisterPayload, User } from '../model/types'

interface AuthResponse {
  user: User
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<User> => {
    const data = await http.post<AuthResponse>('/auth/register', payload)

    return data.user
  },

  login: async (payload: LoginPayload): Promise<User> => {
    const data = await http.post<AuthResponse>('/auth/login', payload)

    return data.user
  },

  logout: () => http.post<void>('/auth/logout', {}),

  me: async (): Promise<User> => {
    const data = await http.get<AuthResponse>('/auth/me')

    return data.user
  },
}
