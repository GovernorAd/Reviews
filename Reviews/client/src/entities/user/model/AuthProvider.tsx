import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'

import { authApi } from '../api/authApi'
import { AuthContext, type AuthContextValue } from './auth-context'
import type { LoginPayload, RegisterPayload } from './types'

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthContextValue['user']>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false

    const restoreSession = async () => {
      try {
        const currentUser = await authApi.me()

        if (!isCancelled) {
          setUser(currentUser)
        }
      } catch {
        if (!isCancelled) {
          setUser(null)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void restoreSession()

    return () => {
      isCancelled = true
    }
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    setUser(await authApi.login(payload))
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    setUser(await authApi.register(payload))
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
