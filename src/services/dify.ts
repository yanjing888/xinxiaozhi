import { getDifyConfig, DIFY_USER_ID } from '../config/dify'
import type { DifyStreamEvent } from '../types/chat'

export interface SendMessageOptions {
  query: string
  conversationId?: string
  onChunk: (text: string) => void
  onConversationId: (id: string) => void
  signal?: AbortSignal
}

export async function sendChatMessage({
  query,
  conversationId,
  onChunk,
  onConversationId,
  signal,
}: SendMessageOptions): Promise<void> {
  const { apiBase, apiKey } = getDifyConfig()

  if (!apiKey) {
    throw new Error('未配置 VITE_DIFY_API_KEY，请检查 .env.local 文件')
  }

  const response = await fetch(`${apiBase}/chat-messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: {},
      query,
      response_mode: 'streaming',
      conversation_id: conversationId || '',
      user: DIFY_USER_ID,
    }),
    signal,
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Dify API 错误 (${response.status}): ${errText}`)
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
      if (!raw || raw === '[DONE]') continue

      try {
        const event: DifyStreamEvent = JSON.parse(raw)

        if (event.event === 'error') {
          throw new Error(event.message || '流式响应出错')
        }

        if (event.conversation_id) {
          onConversationId(event.conversation_id)
        }

        if (event.answer) {
          onChunk(event.answer)
        }
      } catch (e) {
        if (e instanceof SyntaxError) continue
        throw e
      }
    }
  }
}
