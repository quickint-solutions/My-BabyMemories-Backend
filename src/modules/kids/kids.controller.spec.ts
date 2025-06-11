import { Test } from '@nestjs/testing'
import { KidsController } from './kids.controller'
import { KidsService } from './kids.service'
import { AuthenticatedRequest } from 'src/types/express-request'

describe('KidsController', () => {
  let kidsController: KidsController
  let kidService: KidsService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [KidsController],
      providers: [
        {
          provide: KidsService,
          useValue: {
            findAll: jest.fn()
          }
        }
      ]
    }).compile()

    kidService = moduleRef.get<KidsService>(KidsService)
    kidsController = moduleRef.get<KidsController>(KidsController)
  })

  describe('findAll', () => {
    it('should return an array of kids', async (req: any) => {
      const result = [{ name: 'test kid' }]
      jest.spyOn(kidService, 'findAll').mockResolvedValue(result as any)

      expect(await kidsController.findAll(req.user.userId)).toBe(result)
    })
  })
})
