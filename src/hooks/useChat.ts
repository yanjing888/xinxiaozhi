import { useCallback, useRef, useState } from 'react'
import { sendChatMessage } from '../services/dify'
import type { ChatMessage, ChatSession } from '../types/chat'

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function createSession(title = '新对话'): ChatSession {
  return {
    id: createId(),
    title,
    messages: [],
    updatedAt: Date.now(),
  }
}

export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([createSession()])
  const [activeSessionId, setActiveSessionId] = useState(sessions[0].id)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? sessions[0]

  const updateSession = useCallback((sessionId: string, updater: (s: ChatSession) => ChatSession) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? updater(s) : s)),
    )
  }, [])

  const newSession = useCallback(() => {
    const session = createSession()
    setSessions((prev) => [session, ...prev])
    setActiveSessionId(session.id)
    setError(null)
    return session.id
  }, [])

  const selectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId)
    setError(null)
  }, [])

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsLoading(false)
  }, [])

  const sendMessage = useCallback(
    async (query: string, options?: { prefix?: string; startChat?: boolean }) => {
      const trimmed = query.trim()
      if (!trimmed || isLoading) return

      const fullQuery = options?.prefix ? `${options.prefix}\n\n${trimmed}` : trimmed
      const sessionId = activeSessionId

      const userMsg: ChatMessage = {
        id: createId(),
        role: 'user',
        content: fullQuery,
      }

      const assistantMsg: ChatMessage = {
        id: createId(),
        role: 'assistant',
        content: '',
        streaming: true,
      }

      let conversationId: string | undefined

      updateSession(sessionId, (s) => {
        conversationId = s.conversationId
        return {
          ...s,
          title: s.messages.length === 0 ? trimmed.slice(0, 20) : s.title,
          messages: [...s.messages, userMsg, assistantMsg],
          updatedAt: Date.now(),
        }
      })

      setIsLoading(true)
      setError(null)

      const controller = new AbortController()
      abortRef.current = controller

      let accumulated = ''

      try {
        await sendChatMessage({
          query: fullQuery,
          conversationId,
          signal: controller.signal,
          onChunk: (chunk) => {
            accumulated += chunk
            updateSession(sessionId, (s) => ({
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantMsg.id ? { ...m, content: accumulated } : m,
              ),
              updatedAt: Date.now(),
            }))
          },
          onConversationId: (conversationId) => {
            updateSession(sessionId, (s) => ({ ...s, conversationId }))
          },
        })

        updateSession(sessionId, (s) => ({
          ...s,
          messages: s.messages.map((m) =>
            m.id === assistantMsg.id ? { ...m, streaming: false } : m,
          ),
        }))
      } catch (e) {
        if (controller.signal.aborted) return

        const message = e instanceof Error ? e.message : '发送失败，请稍后重试'
        setError(message)
        updateSession(sessionId, (s) => ({
          ...s,
          messages: s.messages.map((m) =>
            m.id === assistantMsg.id
              ? { ...m, content: `⚠️ ${message}`, streaming: false }
              : m,
          ),
        }))
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [activeSessionId, isLoading, updateSession],
  )

  return {
    sessions,
    activeSession,
    activeSessionId,
    isLoading,
    error,
    newSession,
    selectSession,
    sendMessage,
    stopGeneration,
  }
}

export type ChatState = ReturnType<typeof useChat>
