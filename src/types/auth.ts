export interface User {
  id: string
  username: string
  createdAt: number
}

export interface StoredUser extends User {
  passwordHash: string
  salt: string
}

export interface SessionStore {
  sessions: import('./chat').ChatSession[]
  activeSessionId: string
}
