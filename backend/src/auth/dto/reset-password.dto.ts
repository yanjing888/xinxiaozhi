import { IsString, MinLength } from 'class-validator'

export class ResetPasswordDto {
  @IsString()
  @MinLength(2)
  username!: string

  @IsString()
  @MinLength(1)
  newPassword!: string
}
