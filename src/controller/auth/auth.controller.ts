import {
    Body,
    Controller,
    HttpStatus,
    Post,
    Res,
  } from '@nestjs/common';
  import { Response  } from 'express';
  import { CreateUserDto , LoginDto } from 'src/dto/user/create-user.dto';
  import { AuthService } from 'src/service/auth/auth.service';
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('signup')
    async signupUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
      try {
        const result = await this.authService.signup(createUserDto);
        return res.status(HttpStatus.CREATED).json({
          message: 'User registered successfully',
          result
        });
      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: error.message || 'Signup failed',
        });
      }
    }
  
    @Post('login')
    async loginUser(@Body() loginDto: LoginDto, @Res() res: Response) {
      try {
        const result = await this.authService.login(loginDto);
        return res.status(HttpStatus.OK).json({
          message: 'Login successful',
          token: result.token,
        });
      } catch (error) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: error.message || 'Login failed',
        });
      }
    }
  }
  