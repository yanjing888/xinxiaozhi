import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

interface DifyStreamEvent {
  event?: string
  answer?: string
  conversation_id?: string
  message?: string
}

export interface DifyStreamHandlers {
  onChunk: (text: string) => void
  onConversationId: (id: string) => void
  signal?: AbortSignal
}

@Injectable()
export class DifyService {
  constructor(private readonly config: ConfigService) {}

  async streamChat(
    query: string,
    userId: string,
    conversationId: string | undefined,
    handlers: DifyStreamHandlers,
  ) {
    const apiKey = this.config.get<string>('DIFY_API_KEY')
    const baseUrl = this.config.get<string>(
      'DIFY_BASE_URL',
      'http://188.18.18.149:5001/v1',
    )

    if (!apiKey) {
      throw new InternalServerErrorException('未配置 DIFY_API_KEY')
    }

    const difyEndpoint = `${baseUrl.replace(/\/$/, '')}/chat-messages`
    let response: Response

    try {
      response = await fetch(difyEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {},
          query,
          response_mode: 'streaming',
          conversation_id: conversationId ?? '',
          user: userId,
        }),
        signal: handlers.signal,
      })
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        throw e
      }

      throw new InternalServerErrorException(
        'Dify 应用服务连接不上，当前无法生成回答。请稍后重试，或联系管理员检查 Dify 服务状态、网络连接和 DIFY_BASE_URL 配置。',
      )
    }

    if (!response.ok) {
      const errText = await response.text()
      throw new InternalServerErrorException(
        `Dify API 错误 (${response.status}): ${errText}`,
      )
    }

    if (!response.body) {
      throw new InternalServerErrorException('Dify 响应体为空')
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
            throw new InternalServerErrorException(
              event.message || 'Dify 流式响应出错',
            )
          }
          if (event.conversation_id) {
            handlers.onConversationId(event.conversation_id)
          }
          if (event.answer) {
            handlers.onChunk(event.answer)
          }
        } catch (e) {
          if (e instanceof SyntaxError) continue
          throw e
        }
      }
    }
  }
}
