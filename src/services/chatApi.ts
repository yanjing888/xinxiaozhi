import { getApiBase, getToken } from './api'

export interface StreamChatOptions {
  sessionId: string
  query: string
  prefix?: string
  signal?: AbortSignal
  onStarted?: (data: {
    userMessageId: string
    assistantMessageId: string
  }) => void
  onChunk: (chunk: string, assistantMessageId: string) => void
  onConversationId: (id: string) => void
  onDone?: (content: string, assistantMessageId: string) => void
  onError?: (message: string, content?: string, assistantMessageId?: string) => void
}

export async function streamChatMessage(options: StreamChatOptions) {
  const token = getToken()
  if (!token) throw new Error('未登录，请先登录')

  const response = await fetch(`${getApiBase()}/chat/stream`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId: options.sessionId,
      query: options.query,
      prefix: options.prefix,
    }),
    signal: options.signal,
  })

  if (!response.ok) {
    throw new Error(`发送失败 (${response.status})`)
  }

  if (!response.body) {
    throw new Error('响应体为空')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data:')) continue
      const raw = line.slice(5).trim()
      if (!raw) continue

      try {
        const event = JSON.parse(raw) as {
          type: string
          answer?: string
          conversationId?: string
          userMessageId?: string
          assistantMessageId?: string
          content?: string
          message?: string
        }

        if (event.type === 'started' && event.userMessageId && event.assistantMessageId) {
          options.onStarted?.({
            userMessageId: event.userMessageId,
            assistantMessageId: event.assistantMessageId,
          })
        }

        if (event.type === 'chunk' && event.answer && event.assistantMessageId) {
          options.onChunk(event.answer, event.assistantMessageId)
        }

        if (event.type === 'conversation_id' && event.conversationId) {
          options.onConversationId(event.conversationId)
        }

        if (event.type === 'done' && event.assistantMessageId) {
          options.onDone?.(event.content ?? '', event.assistantMessageId)
        }

        if (event.type === 'error') {
          options.onError?.(
            event.message ?? '发送失败',
            event.content,
            event.assistantMessageId,
          )
        }
      } catch (e) {
        if (e instanceof SyntaxError) continue
        throw e
      }
    }
  }
}
