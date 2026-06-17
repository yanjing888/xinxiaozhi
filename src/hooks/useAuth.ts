import { useCallback, useEffect, useState } from 'react'
import * as authService from '../services/auth'
import type { User } from '../types/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [bootstrapping, setBootstrapping] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    authService.restoreSession().then((restored) => {
      setUser(restored)
      setBootstrapping(false)
    })
  }, [])

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

  const resetPassword = useCallback(
    async (username: string, newPassword: string) => {
      setLoading(true)
      setError(null)
      const result = await authService.resetPassword(username, newPassword)
      setLoading(false)
      if ('error' in result) {
        setError(result.error)
        return null
      }
      return result.message
    },
    [],
  )

  const clearError = useCallback(() => setError(null), [])

  return {
    user,
    bootstrapping,
    loading,
    error,
    login,
    register,
    resetPassword,
    logout,
    clearError,
  }
}

export type AuthState = ReturnType<typeof useAuth>
