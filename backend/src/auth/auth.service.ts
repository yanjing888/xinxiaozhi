import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { User } from '../entities/user.entity'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  toPublicUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt.getTime(),
    }
  }

  async register(dto: RegisterDto) {
    const username = dto.username.trim()
    const exists = await this.users.findOne({ where: { username } })
    if (exists) throw new ConflictException('用户名已存在')

    const passwordHash = await bcrypt.hash(dto.password, 10)
    const user = this.users.create({
      id: uuidv4(),
      username,
      passwordHash,
    })
    await this.users.save(user)

    const token = this.signToken(user)
    return { user: this.toPublicUser(user), token }
  }

  async login(dto: LoginDto) {
    const username = dto.username.trim()
    const user = await this.users.findOne({ where: { username } })
    if (!user) throw new UnauthorizedException('用户名或密码错误')

    const ok = await bcrypt.compare(dto.password, user.passwordHash)
    if (!ok) throw new UnauthorizedException('用户名或密码错误')

    const token = this.signToken(user)
    return { user: this.toPublicUser(user), token }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const username = dto.username.trim()
    const user = await this.users.findOne({ where: { username } })
    if (!user) throw new UnauthorizedException('用户名不存在')

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10)
    await this.users.save(user)

    return { success: true, message: '密码已重置，请使用新密码登录' }
  }

  private signToken(user: User) {
    return this.jwt.sign({ sub: user.id, username: user.username })
  }
}
