import type { ChatSession } from '../types/chat'
import { apiFetch } from './api'

export async function fetchSessions() {
  return apiFetch<ChatSession[]>('/sessions')
}

export async function createSession() {
  return apiFetch<ChatSession>('/sessions', { method: 'POST' })
}

export async function deleteSession(sessionId: string) {
  return apiFetch<{ ok: boolean }>(`/sessions/${sessionId}`, {
    method: 'DELETE',
  })
}
