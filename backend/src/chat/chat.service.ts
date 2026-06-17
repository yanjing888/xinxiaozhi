import { Injectable } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { DifyService } from '../dify/dify.service'
import { SessionsService } from '../sessions/sessions.service'
import { SendChatDto } from './dto/send-chat.dto'

@Injectable()
export class ChatService {
  constructor(
    private readonly sessions: SessionsService,
    private readonly dify: DifyService,
  ) {}

  async streamMessage(
    userId: string,
    dto: SendChatDto,
    emit: (payload: Record<string, unknown>) => void,
    signal?: AbortSignal,
  ) {
    const session = await this.sessions.getForUser(userId, dto.sessionId)
    const fullQuery = dto.prefix
      ? `${dto.prefix}\n\n${dto.query.trim()}`
      : dto.query.trim()

    if (session.messages.length === 0) {
      await this.sessions.updateTitle(session.id, dto.query.trim().slice(0, 20))
    }

    const userMessageId = uuidv4()
    const assistantMessageId = uuidv4()

    await this.sessions.addMessage(session.id, 'user', fullQuery, userMessageId)
    await this.sessions.addMessage(session.id, 'assistant', '', assistantMessageId)

    emit({
      type: 'started',
      userMessageId,
      assistantMessageId,
    })

    let accumulated = ''
    let conversationId = session.difyConversationId ?? undefined

    try {
      await this.dify.streamChat(fullQuery, userId, conversationId, {
        signal,
        onChunk: (chunk) => {
          accumulated += chunk
          emit({ type: 'chunk', assistantMessageId, answer: chunk })
        },
        onConversationId: (id) => {
          conversationId = id
          emit({ type: 'conversation_id', conversationId: id })
        },
      })

      await this.sessions.updateMessageContent(assistantMessageId, accumulated)
      if (conversationId) {
        await this.sessions.updateDifyConversationId(session.id, conversationId)
      }

      emit({ type: 'done', assistantMessageId, content: accumulated })
    } catch (e) {
      const message =
        e instanceof Error ? e.message : '发送失败，请稍后重试'
      const content = accumulated || `⚠️ ${message}`
      await this.sessions.updateMessageContent(assistantMessageId, content)
      emit({ type: 'error', assistantMessageId, message, content })
      throw e
    }
  }
}
