import {
    Controller,
    Get,
    Req,
    UseGuards,
  } from '@nestjs/common';

import { AuthenticatedRequest } from 'src/types/express-request';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: AuthenticatedRequest) {
    return this.userService.getProfile(req.user as any);
  }
  }
  