import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { ChatModule } from './chat/chat.module'
import { ChatMessage } from './entities/chat-message.entity'
import { ChatSession } from './entities/chat-session.entity'
import { User } from './entities/user.entity'
import { SessionsModule } from './sessions/sessions.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<string>('DB_PORT', '3306')),
        username: config.get<string>('DB_USER', 'root'),
        password: config.get<string>('DB_PASSWORD', 'root'),
        database: config.get<string>('DB_NAME', 'xinxiaozhi'),
        entities: [User, ChatSession, ChatMessage],
        synchronize: true,
      }),
    }),
    AuthModule,
    SessionsModule,
    ChatModule,
  ],
})
export class AppModule {}
