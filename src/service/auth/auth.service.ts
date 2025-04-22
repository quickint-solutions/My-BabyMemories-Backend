import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto, ForgotPasswordDto, LoginDto, UpdatePasswordDto } from 'src/dto/user/create-user.dto'
import { IUser } from 'src/interface/user.interface'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private readonly jwtService: JwtService
  ) {}

  // Signup
  async signup(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, firstName, lastName } = createUserDto

    const existingUser = await this.userModel.findOne({ email })
    if (existingUser) {
      throw new UnauthorizedException('Email already in use')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new this.userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword
    })

    await user.save()

    return {
      message: 'User created successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  }

  // Login
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto

    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    })
    return { token }
  }

  // Inside AuthService

  async validateOAuthLogin({
    email,
    firstName,
    lastName,
    provider,
    providerId
  }: {
    email: string
    firstName: string
    lastName: string
    provider: string
    providerId: string
  }) {
    let user = await this.userModel.findOne({ email })

    if (!user) {
      user = new this.userModel({
        email,
        firstName,
        lastName,
        password: null,
        provider,
        providerId
      })

      try {
        await user.save()
        console.log('User saved successfully')
      } catch (err) {
        console.error('Error saving user:', err)
      }
    } else {
      console.log('User already exists:', user.email)
    }

    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    })

    return { token, user }
  }

  async updatePassword(user: { userId: string; email: string }, dto: UpdatePasswordDto): Promise<any> {
    try {
      const { current_password, new_password } = dto

      const existingUser = await this.userModel.findById(user.userId)
      if (!existingUser) {
        throw new NotFoundException('User not found')
      }

      const isPasswordValid = await bcrypt.compare(current_password, existingUser.password)
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials')
      }
      if (current_password === new_password) {
        throw new UnauthorizedException('New password should be different from current password')
      }
      const hashedPassword = await bcrypt.hash(new_password, 10)
      existingUser.password = hashedPassword
      await existingUser.save()
      return { message: 'Password updated successfully' }
    } catch (error) {
      throw error
    }
  }

  async forgotPassword(data: ForgotPasswordDto): Promise<any> {
    const user = await this.userModel.findOne({ email: data.email })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    })
    return { token }
  }
  async resetPassword(token: string, new_password: string): Promise<any> {
    try {
      const decodedToken = this.jwtService.verify(token)
      const user = await this.userModel.findById(decodedToken.id)
      if (!user) {
        throw new NotFoundException('User not found')
      }
      const hashedPassword = await bcrypt.hash(new_password, 10)
      user.password = hashedPassword
      await user.save()
      return { message: 'Password updated successfully' }
    } catch (error) {
      throw error
    }
  }
}
