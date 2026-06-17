import type { User } from '../types/auth'
import {
  apiFetch,
  clearAuth,
  getStoredUser,
  getToken,
  setAuth,
} from './api'

interface AuthResponse {
  user: User
  token: string
}

export async function register(
  username: string,
  password: string,
): Promise<{ user: User } | { error: string }> {
  try {
    const data = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    setAuth(data.token, data.user)
    return { user: data.user }
  } catch (e) {
    return { error: e instanceof Error ? e.message : '注册失败' }
  }
}

export async function login(
  username: string,
  password: string,
): Promise<{ user: User } | { error: string }> {
  try {
    const data = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    setAuth(data.token, data.user)
    return { user: data.user }
  } catch (e) {
    return { error: e instanceof Error ? e.message : '登录失败' }
  }
}

export async function resetPassword(
  username: string,
  newPassword: string,
): Promise<{ message: string } | { error: string }> {
  try {
    const data = await apiFetch<{ success: boolean; message: string }>(
      '/auth/reset-password',
      {
        method: 'POST',
        body: JSON.stringify({ username, newPassword }),
      },
    )
    return { message: data.message }
  } catch (e) {
    return { error: e instanceof Error ? e.message : '密码重置失败' }
  }
}

export function logout() {
  clearAuth()
}

export async function restoreSession(): Promise<User | null> {
  const token = getToken()
  if (!token) return null

  try {
    const data = await apiFetch<{ user: User }>('/auth/me')
    setAuth(token, data.user)
    return data.user
  } catch {
    clearAuth()
    return getStoredUser<User>()
  }
}
