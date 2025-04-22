import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { FacebookAuthGuard } from 'src/auth/facebook-auth.guard'
import { GoogleAuthGuard } from 'src/auth/google-auth.guard'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CreateUserDto, ForgotPasswordDto, LoginDto, UpdatePasswordDto } from 'src/dto/user/create-user.dto'
import { AuthService } from 'src/service/auth/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signupUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.authService.signup(createUserDto)
      return res.status(HttpStatus.CREATED).json(result)
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Signup failed'
      })
    }
  }

  @Post('login')
  async loginUser(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginDto)
      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
        token: result.token
      })
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: error.message || 'Login failed'
      })
    }
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { token } = req.user
    return res.status(HttpStatus.OK).json({
      message: 'Google login successful',
      token
    })
  }

  // Facebook Authentication
  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookAuth() {}

  @Get('facebook/redirect')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthRedirect(@Req() req, @Res() res: Response) {
    const { token } = req.user
    return res.status(HttpStatus.OK).json({
      message: 'Facebook login successful',
      token
    })
  }
  @UseGuards(JwtAuthGuard)
  @Post('update-password')
  async updatePassword(@Req() req, @Body() dto: UpdatePasswordDto, @Res() res) {
    try {
      const result = await this.authService.updatePassword(req.user as any, dto)
      return res.status(HttpStatus.OK).json({
        message: 'Password updated successfully',
        result
      })
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Password update failed'
      })
    }
  }
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Res() res) {
    try {
      const result = await this.authService.forgotPassword(dto)
      return res.status(HttpStatus.OK).json(result)
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Password reset link failed'
      })
    }
  }
  @Post('reset-password')
  async resetPassword(@Query('token') token: string, @Body('new_password') new_password: string, @Res() res) {
    try {
      const result = await this.authService.resetPassword(token, new_password)
      return res.status(HttpStatus.OK).json(result)
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Password reset failed'
      })
    }
  }
}
