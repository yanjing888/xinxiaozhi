import { IsOptional, IsString, MinLength } from 'class-validator'

export class SendChatDto {
  @IsString()
  sessionId!: string

  @IsString()
  @MinLength(1)
  query!: string

  @IsOptional()
  @IsString()
  prefix?: string
}
