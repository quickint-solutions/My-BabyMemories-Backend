import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { getModelToken } from '@nestjs/mongoose'

describe('AuthController', () => {
  let controller: AuthController
  let service: AuthService

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }

  const mockUserModel = {
    find: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockUserService
        },
        {
          provide: getModelToken('User'),
          useValue: mockUserModel
        }
      ]
    }).compile()

    controller = module.get<AuthController>(AuthController)
    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
