import type { User } from '../types/auth'
import {
  findUserByUsername,
  getCurrentUser,
  saveUser,
  setCurrentUser,
} from './storage'

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function createSalt() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(salt + password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function register(
  username: string,
  password: string,
): Promise<{ user: User } | { error: string }> {
  const trimmed = username.trim()
  if (!trimmed) return { error: '请输入用户名' }
  if (trimmed.length < 2) return { error: '用户名至少 2 个字符' }
  if (password.length < 6) return { error: '密码至少 6 位' }
  if (findUserByUsername(trimmed)) return { error: '用户名已存在' }

  const salt = createSalt()
  const passwordHash = await hashPassword(password, salt)
  const user: User = {
    id: createId(),
    username: trimmed,
    createdAt: Date.now(),
  }

  saveUser({ ...user, passwordHash, salt })
  setCurrentUser(user)
  return { user }
}

export async function login(
  username: string,
  password: string,
): Promise<{ user: User } | { error: string }> {
  const trimmed = username.trim()
  const stored = findUserByUsername(trimmed)
  if (!stored) return { error: '用户名或密码错误' }

  const passwordHash = await hashPassword(password, stored.salt)
  if (passwordHash !== stored.passwordHash) return { error: '用户名或密码错误' }

  const user: User = {
    id: stored.id,
    username: stored.username,
    createdAt: stored.createdAt,
  }
  setCurrentUser(user)
  return { user }
}

export function logout() {
  setCurrentUser(null)
}

export function restoreSession(): User | null {
  return getCurrentUser()
}
