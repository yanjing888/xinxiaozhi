import { useCallback, useEffect, useRef, useState } from 'react'
import { streamChatMessage } from '../services/chatApi'
import * as sessionsApi from '../services/sessions'
import type { ChatMessage, ChatSession } from '../types/chat'

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useChat(userId: string | undefined) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrating, setIsHydrating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const streamingMsgRef = useRef<{ sessionId: string; messageId: string } | null>(null)
  const userIdRef = useRef(userId)

  const activeSession = sessions.find((s) => s.id === activeSessionId)

  const updateSession = useCallback((sessionId: string, updater: (s: ChatSession) => ChatSession) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? updater(s) : s)),
    )
  }, [])

  const loadSessions = useCallback(async () => {
    setIsHydrating(true)
    setError(null)
    try {
      const list = await sessionsApi.fetchSessions()
      setSessions(list)
      setActiveSessionId(list[0]?.id ?? '')
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载对话失败')
      setSessions([])
      setActiveSessionId('')
    } finally {
      setIsHydrating(false)
    }
  }, [])

  useEffect(() => {
    if (userId !== userIdRef.current) {
      userIdRef.current = userId
      abortRef.current?.abort()
      abortRef.current = null
      setIsLoading(false)

      if (!userId) {
        setSessions([])
        setActiveSessionId('')
        return
      }

      void loadSessions()
    }
  }, [userId, loadSessions])

  const newSession = useCallback(async () => {
    const session = await sessionsApi.createSession()
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
    async (sessionId: string) => {
      await sessionsApi.deleteSession(sessionId)
      const remaining = sessions.filter((s) => s.id !== sessionId)
      setSessions(remaining)
      if (sessionId === activeSessionId) {
        setActiveSessionId(remaining[0]?.id ?? '')
      }
    },
    [sessions, activeSessionId],
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
      if (!trimmed || isLoading || !userId) return

      let sessionId = options?.sessionId ?? activeSessionId
      if (!sessionId) {
        const session = await sessionsApi.createSession()
        setSessions((prev) => [session, ...prev])
        setActiveSessionId(session.id)
        sessionId = session.id
      }

      const tempUserId = createId()
      const tempAssistantId = createId()

      const userMsg: ChatMessage = {
        id: tempUserId,
        role: 'user',
        content: options?.prefix ? `${options.prefix}\n\n${trimmed}` : trimmed,
      }

      const assistantMsg: ChatMessage = {
        id: tempAssistantId,
        role: 'assistant',
        content: '',
        streaming: true,
      }

      updateSession(sessionId, (s) => ({
        ...s,
        title: s.messages.length === 0 ? trimmed.slice(0, 20) : s.title,
        messages: [...s.messages, userMsg, assistantMsg],
        updatedAt: Date.now(),
      }))

      setIsLoading(true)
      setError(null)

      const controller = new AbortController()
      abortRef.current = controller

      let assistantMessageId = tempAssistantId
      streamingMsgRef.current = { sessionId, messageId: assistantMessageId }
      let accumulated = ''

      const replaceMessageId = (oldId: string, newId: string, role: 'user' | 'assistant') => {
        updateSession(sessionId, (s) => ({
          ...s,
          messages: s.messages.map((m) =>
            m.id === oldId ? { ...m, id: newId, role } : m,
          ),
        }))
        if (role === 'assistant') {
          assistantMessageId = newId
          streamingMsgRef.current = { sessionId, messageId: newId }
        }
      }

      try {
        await streamChatMessage({
          sessionId,
          query: trimmed,
          prefix: options?.prefix,
          signal: controller.signal,
          onStarted: ({ userMessageId, assistantMessageId: serverAssistantId }) => {
            replaceMessageId(tempUserId, userMessageId, 'user')
            replaceMessageId(tempAssistantId, serverAssistantId, 'assistant')
          },
          onChunk: (chunk) => {
            accumulated += chunk
            updateSession(sessionId, (s) => ({
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantMessageId ? { ...m, content: accumulated } : m,
              ),
              updatedAt: Date.now(),
            }))
          },
          onConversationId: (id) => {
            updateSession(sessionId, (s) => ({ ...s, conversationId: id }))
          },
          onDone: () => {
            clearStreamingFlag(sessionId, assistantMessageId)
          },
          onError: (message, content) => {
            if (content) {
              updateSession(sessionId, (s) => ({
                ...s,
                messages: s.messages.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content, streaming: false }
                    : m,
                ),
              }))
            } else {
              setError(message)
              clearStreamingFlag(sessionId, assistantMessageId)
            }
          },
        })

        clearStreamingFlag(sessionId, assistantMessageId)
      } catch (e) {
        if (controller.signal.aborted) {
          clearStreamingFlag(sessionId, assistantMessageId)
          return
        }

        const message = e instanceof Error ? e.message : '发送失败，请稍后重试'
        setError(message)
        updateSession(sessionId, (s) => ({
          ...s,
          messages: s.messages.map((m) =>
            m.id === assistantMessageId
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
    [activeSessionId, isLoading, userId, updateSession, clearStreamingFlag],
  )

  return {
    sessions,
    activeSession,
    activeSessionId,
    isLoading,
    isHydrating,
    error,
    newSession,
    selectSession,
    deleteSession,
    sendMessage,
    stopGeneration,
  }
}

export type ChatState = ReturnType<typeof useChat>
