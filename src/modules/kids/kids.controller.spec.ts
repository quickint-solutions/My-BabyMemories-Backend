import { Test, TestingModule } from '@nestjs/testing'
import { KidsController } from './kids.controller'
import { KidsService } from './kids.service'
import { getModelToken } from '@nestjs/mongoose'

describe('KidsController', () => {
  let controller: KidsController
  let service: KidsService

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
      controllers: [KidsController],
      providers: [
        {
          provide: KidsService,
          useValue: mockUserService
        },
        {
          provide: getModelToken('Kids'),
          useValue: mockUserModel
        }
      ]
    }).compile()

    controller = module.get<KidsController>(KidsController)
    service = module.get<KidsService>(KidsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
