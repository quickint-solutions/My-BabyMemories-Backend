import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto'

export class SignupUserResponseDto {
  _id: string
  firstName: string
  lastName: string
  email: string
  createdAt: Date
  updatedAt: Date
}
export class verficationResponseDto {
  email: string
  code: string
  expiryAt: number
}
export class SignupResponseDto {
  message: string
  user: CreateUserDto
  token: string
  verification: verficationResponseDto
}

export class LoginResponseDto {
  token: string
  user: CreateUserDto
}
export class OAuthLoginUserDto {
  _id: string
  email: string
  firstName: string
  lastName: string
  provider?: string
  providerId?: string
  createdAt?: Date
  updatedAt?: Date
}

export class OAuthLoginResponseDto {
  token: string
  user: OAuthLoginUserDto
}
export class OAuthLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsString()
  @IsNotEmpty()
  provider: string

  @IsString()
  @IsNotEmpty()
  providerId: string
}
export class UpdatePasswordResponseDto {
  message: string
}
export class ForgotPasswordResponseDto {
  message: string
  verification: verficationResponseDto
}
export class ResetPasswordResponseDto {
  message: string
  token: string
  user: CreateUserDto
}
export class JwtStrategyResponseDto {
  id: string
  email: string
}
