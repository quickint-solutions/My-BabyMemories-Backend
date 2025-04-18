import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/interface/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
  ) {}


  async getProfile(user: { userId: string; email: string }) {
    return this.userModel.findById(user.userId).select('-password');
  }
}
