import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { ChatMessage } from '../entities/chat-message.entity'
import { ChatSession } from '../entities/chat-session.entity'

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(ChatSession)
    private readonly sessions: Repository<ChatSession>,
    @InjectRepository(ChatMessage)
    private readonly messages: Repository<ChatMessage>,
  ) {}

  private toClientSession(session: ChatSession) {
    return {
      id: session.id,
      title: session.title,
      conversationId: session.difyConversationId ?? undefined,
      updatedAt: session.updatedAt.getTime(),
      messages: (session.messages ?? [])
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        })),
    }
  }

  async listByUser(userId: string) {
    const rows = await this.sessions.find({
      where: { userId },
      relations: ['messages'],
      order: { updatedAt: 'DESC' },
    })
    return rows.map((s) => this.toClientSession(s))
  }

  async create(userId: string, title = '新对话') {
    const session = this.sessions.create({
      id: uuidv4(),
      userId,
      title,
      difyConversationId: null,
      messages: [],
    })
    await this.sessions.save(session)
    return this.toClientSession({ ...session, messages: [] })
  }

  async getForUser(userId: string, sessionId: string) {
    const session = await this.sessions.findOne({
      where: { id: sessionId, userId },
      relations: ['messages'],
    })
    if (!session) throw new NotFoundException('对话不存在')
    return session
  }

  async remove(userId: string, sessionId: string) {
    const session = await this.getForUser(userId, sessionId)
    await this.sessions.remove(session)
    return { ok: true }
  }

  async updateTitle(sessionId: string, title: string) {
    await this.sessions.update(sessionId, { title })
  }

  async updateDifyConversationId(sessionId: string, conversationId: string) {
    await this.sessions.update(sessionId, {
      difyConversationId: conversationId,
    })
  }

  async addMessage(
    sessionId: string,
    role: 'user' | 'assistant',
    content: string,
    id = uuidv4(),
  ) {
    const message = this.messages.create({
      id,
      sessionId,
      role,
      content,
    })
    await this.messages.save(message)
    await this.sessions.update(sessionId, { updatedAt: new Date() })
    return message
  }

  async updateMessageContent(messageId: string, content: string) {
    await this.messages.update(messageId, { content })
  }
}
