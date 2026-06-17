import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { ChatSession } from './chat-session.entity'

export type MessageRole = 'user' | 'assistant'

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string

  @Column({ type: 'varchar', length: 36 })
  sessionId!: string

  @ManyToOne(() => ChatSession, (session) => session.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionId' })
  session!: ChatSession

  @Column({ type: 'enum', enum: ['user', 'assistant'] })
  role!: MessageRole

  @Column({ type: 'longtext' })
  content!: string

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date
}
