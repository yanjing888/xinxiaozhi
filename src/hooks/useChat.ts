import { useCallback, useEffect, useRef, useState } from 'react'
import { sendChatMessage } from '../services/dify'
import { loadUserSessions, saveUserSessions } from '../services/storage'
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

function getInitialState(userId: string | undefined) {
  if (!userId) {
    const session = createSession()
    return { sessions: [session], activeSessionId: session.id }
  }
  const stored = loadUserSessions(userId)
  if (stored && stored.sessions.length > 0) {
    const activeExists = stored.sessions.some((s) => s.id === stored.activeSessionId)
    return {
      sessions: stored.sessions,
      activeSessionId: activeExists ? stored.activeSessionId : stored.sessions[0].id,
    }
  }
  const session = createSession()
  return { sessions: [session], activeSessionId: session.id }
}

export function useChat(userId: string | undefined) {
  const initialRef = useRef(getInitialState(userId))
  const [sessions, setSessions] = useState<ChatSession[]>(initialRef.current.sessions)
  const [activeSessionId, setActiveSessionId] = useState(initialRef.current.activeSessionId)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const streamingMsgRef = useRef<{ sessionId: string; messageId: string } | null>(null)
  const userIdRef = useRef(userId)

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? sessions[0]

  useEffect(() => {
    if (userId !== userIdRef.current) {
      userIdRef.current = userId
      const initial = getInitialState(userId)
      setSessions(initial.sessions)
      setActiveSessionId(initial.activeSessionId)
      setError(null)
      setIsLoading(false)
      abortRef.current?.abort()
      abortRef.current = null
    }
  }, [userId])

  useEffect(() => {
    if (!userId || isLoading) return
    saveUserSessions(userId, { sessions, activeSessionId })
  }, [userId, sessions, activeSessionId, isLoading])

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

  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => {
        const next = prev.filter((s) => s.id !== sessionId)
        if (next.length === 0) {
          const session = createSession()
          setActiveSessionId(session.id)
          return [session]
        }
        if (sessionId === activeSessionId) {
          setActiveSessionId(next[0].id)
        }
        return next
      })
    },
    [activeSessionId],
  )

  const clearStreamingFlag = useCallback(
    (sessionId: string, messageId: string) => {
      updateSession(sessionId, (s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m.id === messageId ? { ...m, streaming: false } : m,
        ),
      }))
    },
    [updateSession],
  )

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsLoading(false)

    const streaming = streamingMsgRef.current
    if (streaming) {
      clearStreamingFlag(streaming.sessionId, streaming.messageId)
      streamingMsgRef.current = null
    }
  }, [clearStreamingFlag])

  const sendMessage = useCallback(
    async (query: string, options?: { prefix?: string; sessionId?: string }) => {
      const trimmed = query.trim()
      if (!trimmed || isLoading) return

      const fullQuery = options?.prefix ? `${options.prefix}\n\n${trimmed}` : trimmed
      const sessionId = options?.sessionId ?? activeSessionId

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
      streamingMsgRef.current = { sessionId, messageId: assistantMsg.id }

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
          onConversationId: (id) => {
            updateSession(sessionId, (s) => ({ ...s, conversationId: id }))
          },
        })

        clearStreamingFlag(sessionId, assistantMsg.id)
      } catch (e) {
        if (controller.signal.aborted) {
          clearStreamingFlag(sessionId, assistantMsg.id)
          return
        }

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
        streamingMsgRef.current = null
      }
    },
    [activeSessionId, isLoading, updateSession, clearStreamingFlag],
  )

  return {
    sessions,
    activeSession,
    activeSessionId,
    isLoading,
    error,
    newSession,
    selectSession,
    deleteSession,
    sendMessage,
    stopGeneration,
  }
}

export type ChatState = ReturnType<typeof useChat>
