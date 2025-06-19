import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Kids } from 'src/schema/kids.schema'
import { deleteKidResponseDto, KidDto, UpdateKidDto } from './dto/create-kids.dto'
import { v4 as uuid } from 'uuid'
import { Readable } from 'stream'
import * as mime from 'mime-types'
import { bucketName, minioClient } from 'src/utils/minio.client'

@Injectable()
export class KidsService {
  constructor(@InjectModel(Kids.name) private readonly kidsModel: Model<Kids>) {}

  async create(kidDto: KidDto, file: Express.Multer.File): Promise<Kids> {
    let profileUrl = ''
    if (file) {
      const ext = mime.extension(file.mimetype) || 'bin'
      const filename = `${uuid()}.${ext}`

      await minioClient.putObject(bucketName, filename, Readable.from(file.buffer), file.size, {
        'Content-Type': file.mimetype
      })

      profileUrl = filename
    }
    const kid = new this.kidsModel({
      ...kidDto,
      profile: profileUrl
    })
    return kid.save()
  }

  async findAll(userId: string): Promise<any[]> {
    const kids = await this.kidsModel.find({ userId, isDeleted: false }).populate('userId').sort({ createdAt: -1 })

    const result = await Promise.all(
      kids.map(async kid => {
        const kidObj = kid.toObject()
        kidObj.profile = kid.profile ? await minioClient.presignedGetObject(bucketName, kid.profile, 60 * 60) : null
        return kidObj
      })
    )
    return result
  }

  async findById(id: string): Promise<Kids> {
    const kid = await this.kidsModel.findById(id).populate('userId')
    const kidsProfile = kid.profile ? await minioClient.presignedGetObject(bucketName, kid.profile, 60 * 60) : null
    kid.profile = kidsProfile
    return kid
  }

  async update(id: string, kidDto: UpdateKidDto, file?: Express.Multer.File): Promise<Kids> {
    const kid = await this.kidsModel.findById(id)
    if (!kid) {
      throw new NotFoundException('Kid not found')
    }
    if (file) {
      const ext = mime.extension(file.mimetype) || 'bin'
      const filename = `${uuid()}.${ext}`

      await minioClient.putObject(bucketName, filename, Readable.from(file.buffer), file.size, {
        'Content-Type': file.mimetype
      })
      kid.profile = filename
    }
    Object.assign(kid, kidDto)

    return await kid.save()
  }

  async delete(id: string): Promise<deleteKidResponseDto> {
    const deleted = await this.kidsModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
    if (!deleted) {
      throw new NotFoundException('Kid not found')
    }
    return { message: 'Kid deleted successfully' }
  }
}
