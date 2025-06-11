import {
  Controller,
  Post as HttpPost,
  UploadedFile,
  Body,
  UseInterceptors,
  UseGuards,
  Req,
  Get,
  Query,
  Param,
  Delete,
  Put
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { PostService } from './post.service'
import { postDto } from './dto/post.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/types/express-request'

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpPost()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() body: postDto, @UploadedFile() file: Express.Multer.File, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId
    if (!userId) {
      throw new Error('User not found')
    }
    const bodyData = { ...body, userId }
    return this.postService.create({ ...bodyData, file })
  }
  @UseGuards(JwtAuthGuard)
  @Get('get-all')
  async getAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId
    if (!userId) {
      throw new Error('User not found')
    }
    const posts = await this.postService.getAll(userId)
    return {
      message: 'All posts fetched successfully',
      data: posts
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('get-by-id/:id')
  async getById(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.userId
    if (!userId) {
      throw new Error('User not found')
    }
    const post = await this.postService.getById(id)
    return {
      message: 'Post fetched successfully',
      data: post
    }
  }
  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Req() req: AuthenticatedRequest,
    @Body() body: postDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string
  ) {
    const userId = req.user.userId
    if (!userId) {
      throw new Error('User not found')
    }
    const post = await this.postService.update(id, { ...body, file })
    return {
      message: 'Post updated successfully',
      data: post
    }
  }
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user.userId
    if (!userId) {
      throw new Error('User not found')
    }
    const post = await this.postService.delete(id)
    return {
      message: 'Post deleted successfully',
      data: post
    }
  }
}
