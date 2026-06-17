import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'
import { ChatSession } from './chat-session.entity'

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string

  @Column({ type: 'varchar', length: 64, unique: true })
  username!: string

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date

  @OneToMany(() => ChatSession, (session) => session.user)
  sessions!: ChatSession[]
}
