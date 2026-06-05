import type { ChatSession } from '../types/chat'
import type { SessionStore, StoredUser, User } from '../types/auth'

const USERS_KEY = 'xinxiaozhi_users'
const CURRENT_USER_KEY = 'xinxiaozhi_current_user'
const SESSIONS_PREFIX = 'xinxiaozhi_sessions_'

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as StoredUser[]) : []
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getStoredUsers(): StoredUser[] {
  return readUsers()
}

export function saveUser(user: StoredUser) {
  const users = readUsers()
  users.push(user)
  writeUsers(users)
}

export function findUserByUsername(username: string): StoredUser | undefined {
  return readUsers().find((u) => u.username === username)
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function sanitizeSessions(sessions: ChatSession[]): ChatSession[] {
  return sessions.map((s) => ({
    ...s,
    messages: s.messages.map((m) => {
      const { streaming, ...rest } = m
      return rest
    }),
  }))
}

export function loadUserSessions(userId: string): SessionStore | null {
  try {
    const raw = localStorage.getItem(`${SESSIONS_PREFIX}${userId}`)
    if (!raw) return null
    return JSON.parse(raw) as SessionStore
  } catch {
    return null
  }
}

export function saveUserSessions(userId: string, store: SessionStore) {
  localStorage.setItem(
    `${SESSIONS_PREFIX}${userId}`,
    JSON.stringify({
      sessions: sanitizeSessions(store.sessions),
      activeSessionId: store.activeSessionId,
    }),
  )
}
