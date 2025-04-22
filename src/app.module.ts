import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { UserSchema } from './schema/user.schema'
import { JwtStrategy } from './auth/jwt.strategy'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { AuthService } from './service/auth/auth.service'
import { AuthController } from './controller/auth/auth.controller'
import { UserController } from './controller/user/user.controller'
import { UserService } from './service/user/user.service'
import { kidsSchema } from './schema/kids.schema'
import { KidsController } from './controller/kids/kids.controller'
import { KidsService } from './service/kids/kids.service'
import { GoogleStrategy } from './utils/google.strategy'
import { FacebookStrategy } from './utils/facebook.strategy'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Kids', schema: kidsSchema }
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [AppController, AuthController, UserController, KidsController],
  providers: [
    AppService,
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    GoogleStrategy,
    FacebookStrategy,
    UserService,
    KidsService
  ]
})
export class AppModule {}
