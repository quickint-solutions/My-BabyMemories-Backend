import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Put,
    Delete,
  } from '@nestjs/common';
  import { KidsService } from 'src/kids/kids.service';
  import { KidDto } from 'src/kids/dto/create-kids.dto';
  
  @Controller('kids')
  export class KidsController {
    constructor(private readonly kidsService: KidsService) {}
  
    @Post('create')
    async create(@Body() kidDto: KidDto) {
      const kid = await this.kidsService.create(kidDto);
      return {
        message: 'Kid created successfully',
        data: kid,
      };
    }
  
    @Get('get-kids')
    async findAll() {
      const kids = await this.kidsService.findAll();
      return {
        message: 'All kids fetched successfully',
        data: kids,
      };
    }
  
    @Get(':id')
    async findById(@Param('id') id: string) {
      const kid = await this.kidsService.findById(id);
      return {
        message: 'Kid fetched successfully',
        data: kid,
      };
    }
  
    @Put(':id')
    async update(@Param('id') id: string, @Body() kidDto: Partial<KidDto>) {
      const updatedKid = await this.kidsService.update(id, kidDto);
      return {
        message: 'Kid updated successfully',
        data: updatedKid,
      };
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.kidsService.delete(id);
    }
  }
  