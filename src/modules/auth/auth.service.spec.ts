import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'

const mockUserModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn()
}

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn()
}

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
