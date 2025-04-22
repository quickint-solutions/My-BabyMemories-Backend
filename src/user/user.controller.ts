import {
    Controller,
    Get,
    Req,
    UseGuards,
  } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { UserService } from 'src/user/user.service';
import { AuthenticatedRequest } from 'src/types/express-request';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: AuthenticatedRequest) {
    return this.userService.getProfile(req.user as any);
  }
  }
  