import { useCallback, useState } from 'react'
import * as authService from '../services/auth'
import type { User } from '../types/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => authService.restoreSession())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    const result = await authService.login(username, password)
    setLoading(false)
    if ('error' in result) {
      setError(result.error)
      return false
    }
    setUser(result.user)
    return true
  }, [])

  const register = useCallback(async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    const result = await authService.register(username, password)
    setLoading(false)
    if ('error' in result) {
      setError(result.error)
      return false
    }
    setUser(result.user)
    return true
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setError(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { user, loading, error, login, register, logout, clearError }
}

export type AuthState = ReturnType<typeof useAuth>
