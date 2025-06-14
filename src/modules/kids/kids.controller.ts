import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Req } from '@nestjs/common'
import { KidsService } from './kids.service'
import { KidDto, UpdateKidDto } from './dto/create-kids.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/types/express-request'

@Controller('kids')
export class KidsController {
  constructor(private readonly kidsService: KidsService) {}
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() kidDto: KidDto, @Req() req: AuthenticatedRequest) {
    const data = {
      ...kidDto,
      userId: req.user.userId
    }
    const kid = await this.kidsService.create(data)
    return {
      message: 'Kid created successfully',
      data: kid
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('get-kids')
  async findAll(@Req() req: AuthenticatedRequest) {
    const kids = await this.kidsService.findAll(req.user.userId)
    return {
      message: 'All kids fetched successfully',
      data: kids
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const kid = await this.kidsService.findById(id)
    return {
      message: 'Kid fetched successfully',
      data: kid
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() kidDto: UpdateKidDto) {
    const updatedKid = await this.kidsService.update(id, kidDto)
    return {
      message: 'Kid updated successfully',
      data: updatedKid
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.kidsService.delete(id)
  }
}
