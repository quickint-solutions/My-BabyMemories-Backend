import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'
import { JwtAuthGuard } from './jwt-auth.guard'
import { GoogleStrategy } from '../utils/google.strategy'
import { FacebookStrategy } from '../utils/facebook.strategy'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from '../schema/user.schema'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1d' }
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, GoogleStrategy, FacebookStrategy],
  exports: [AuthService]
})
export class AuthModule {}
