import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Kids } from 'src/schema/kids.schema';
import { deleteKidResponseDto, KidDto, UpdateKidDto } from './dto/create-kids.dto';


@Injectable()
export class KidsService {
  constructor(
    @InjectModel(Kids.name) private readonly kidsModel: Model<Kids>,
  ) {}

  async create(kidDto: KidDto): Promise<Kids> {
    const kid = new this.kidsModel(kidDto);
    return kid.save();
  }

  async findAll(userId:string): Promise<Kids[]> {
    return this.kidsModel.find({ userId, isDeleted: false }).exec()
  }

  async findById(id: string): Promise<Kids> {
    const kid = await this.kidsModel.findById(id);
    if (!kid) {
      throw new NotFoundException('Kid not found');
    }
    return kid;
  }

  async update(id: string, kidDto:UpdateKidDto): Promise<Kids> {
    const updated = await this.kidsModel.findByIdAndUpdate(id, kidDto, {
      new: true,
    });
    if (!updated) {
      throw new NotFoundException('Kid not found');
    }
    return updated;
  }

  async delete(id: string): Promise<deleteKidResponseDto> {
    const deleted = await this.kidsModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    if (!deleted) {
      throw new NotFoundException('Kid not found');
    }
    return { message: 'Kid deleted successfully' };
  }
}
