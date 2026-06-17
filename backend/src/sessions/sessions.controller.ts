import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { User } from '../entities/user.entity'
import { SessionsService } from './sessions.service'

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @Get()
  list(@Req() req: { user: User }) {
    return this.sessions.listByUser(req.user.id)
  }

  @Post()
  create(@Req() req: { user: User }) {
    return this.sessions.create(req.user.id)
  }

  @Delete(':id')
  remove(@Req() req: { user: User }, @Param('id') id: string) {
    return this.sessions.remove(req.user.id, id)
  }
}
