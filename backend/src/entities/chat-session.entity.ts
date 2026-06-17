import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ChatMessage } from './chat-message.entity'
import { User } from './user.entity'

@Entity('chat_sessions')
export class ChatSession {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string

  @Column({ type: 'varchar', length: 36 })
  userId!: string

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User

  @Column({ type: 'varchar', length: 120, default: '新对话' })
  title!: string

  @Column({ type: 'varchar', length: 64, nullable: true })
  difyConversationId!: string | null

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date

  @OneToMany(() => ChatMessage, (message) => message.session, {
    cascade: true,
  })
  messages!: ChatMessage[]
}
