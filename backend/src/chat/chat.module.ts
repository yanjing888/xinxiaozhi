import { Module } from '@nestjs/common'
import { DifyService } from '../dify/dify.service'
import { SessionsModule } from '../sessions/sessions.module'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'

@Module({
  imports: [SessionsModule],
  controllers: [ChatController],
  providers: [ChatService, DifyService],
})
export class ChatModule {}
