import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginDto } from 'src/dto/user/create-user.dto';
import { IUser } from 'src/interface/user.interface';
import { IKids } from 'src/interface/kids.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @InjectModel('Kids') private readonly kidsModel: Model<IKids>,
    private readonly jwtService: JwtService,
  ) { }

  // Signup
  async signup(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, children = [] } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      name: createUserDto.name,
      email,
      password: hashedPassword,
      relation: createUserDto.relation,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await user.save();

    const kidDocs = await Promise.all(
      children.map(async (child: any) => {
        const kid = new this.kidsModel({
          name: child.name,
          dob: new Date(child.dob),
          gender: child.gender,
          parent_user: user._id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await kid.save();
        return kid;
      })
    );
    user.children = kidDocs;
    await user.save();


    return {
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        relation: user.relation,
        children: kidDocs,
      }
    }
  }

  // Login
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user._id, email: user.email, name: user.name, relation: user.relation, role: user.role, children: user.children });
    return { token };
  }
}
