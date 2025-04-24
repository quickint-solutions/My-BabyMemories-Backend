import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { deleteKidResponseDto, KidDto, UpdateKidDto } from './dto/create-kids.dto';
import { IKids } from './kids.interface';


@Injectable()
export class KidsService {
  constructor(
    @InjectModel('Kids') private readonly kidsModel: Model<IKids>,
  ) {}

  async create(kidDto: KidDto): Promise<KidDto> {
    const kid = new this.kidsModel(kidDto);
    await kid.save();
    return kid;
  }

  async findAll(): Promise<KidDto[]> {
    return this.kidsModel.find();
  }

  async findById(id: string): Promise<IKids> {
    const kid = await this.kidsModel.findById(id);
    if (!kid) {
      throw new NotFoundException('Kid not found');
    }
    return kid;
  }

  async update(id: string, kidDto:UpdateKidDto): Promise<IKids> {
    const updated = await this.kidsModel.findByIdAndUpdate(id, kidDto, {
      new: true,
    });
    if (!updated) {
      throw new NotFoundException('Kid not found');
    }
    return updated;
  }

  async delete(id: string): Promise<deleteKidResponseDto> {
    const deleted = await this.kidsModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Kid not found');
    }
    return { message: 'Kid deleted successfully' };
  }
}
