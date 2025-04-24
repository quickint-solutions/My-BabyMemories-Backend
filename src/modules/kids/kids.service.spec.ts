import { Test, TestingModule } from '@nestjs/testing'
import { KidsService } from './kids.service'
import { getModelToken } from '@nestjs/mongoose'

const mockUserModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn()
}

describe('KidsService', () => {
  let service: KidsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KidsService,
        {
          provide: getModelToken('Kids'),
          useValue: mockUserModel
        }
      ]
    }).compile()

    service = module.get<KidsService>(KidsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
