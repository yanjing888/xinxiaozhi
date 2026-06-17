import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { User } from '../entities/user.entity'
import { ChatService } from './chat.service'
import { SendChatDto } from './dto/send-chat.dto'

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post('stream')
  async stream(
    @Req() req: Request & { user: User },
    @Body() dto: SendChatDto,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders?.()

    const abortController = new AbortController()
    req.on('close', () => abortController.abort())

    const send = (payload: Record<string, unknown>) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`)
    }

    try {
      await this.chat.streamMessage(
        req.user.id,
        dto,
        send,
        abortController.signal,
      )
      res.end()
    } catch (e) {
      if (!abortController.signal.aborted) {
        const message = e instanceof Error ? e.message : '发送失败'
        send({ type: 'error', message })
      }
      res.end()
    }
  }
}
