import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IUser } from './user.interface'
import { getProfileResponse, updateProfile } from './dto/create-user.dto'
import { bucketName, minioClient } from 'src/utils/minio.client'
import { Readable } from 'stream'
import { v4 as uuid } from 'uuid'
import * as mime from 'mime-types'

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}
  async getProfile(user: getProfileResponse) {
    const userDoc = await this.userModel.findById(user.userId).select('-password')
    if (!userDoc) throw new Error('User not found')

    const userDetails = userDoc.toObject()

    const userProfile = userDetails.profile
      ? await minioClient.presignedGetObject(bucketName, userDetails.profile, 60 * 60)
      : null

    userDetails.profile = userProfile

    return userDetails
  }

  async updateProfile(user: getProfileResponse, userProfile: updateProfile, file?: Express.Multer.File) {
    const userDetails = await this.userModel.findById(user.userId)
    if (!userDetails) throw new Error('User not found')

    let profile = userDetails.profile

    if (file) {
      const ext = mime.extension(file.mimetype) || 'bin'
      const filename = `${uuid()}.${ext}`

      await minioClient.putObject(bucketName, filename, Readable.from(file.buffer), file.size, {
        'Content-Type': file.mimetype
      })

      profile = filename
    }

    if (userProfile.firstName) userDetails.firstName = userProfile.firstName
    if (userProfile.lastName) userDetails.lastName = userProfile.lastName
    if (userProfile.email) userDetails.email = userProfile.email

    userDetails.profile = profile
    await userDetails.save()

    const updatedUser = userDetails.toObject()
    delete updatedUser.password

    const profileUrl = profile ? await minioClient.presignedGetObject(bucketName, profile, 60 * 60) : null

    return {
      ...updatedUser,
      profile: profileUrl
    }
  }
}

//  async updateProfile(user: getProfileResponse, userProfile: any, file?: Express.Multer.File) {
//     const userDetails = await this.userModel.findById(user.userId)
//     if (!userDetails) throw new Error('User not found')

//     let profile = userDetails.profile

//     if (file) {
//       const ext = mime.extension(file.mimetype) || 'bin'
//       const filename = `${uuid()}.${ext}`

//       await minioClient.putObject(bucketName, filename, Readable.from(file.buffer), file.size, {
//         'Content-Type': file.mimetype
//       })

//       profile = filename
//     }

//     userDetails.profile = profile
//     await userDetails.save()

//     const updatedUser = userDetails.toObject()
//     delete updatedUser.password

//     const profileUrl = profile ? await minioClient.presignedGetObject(bucketName, profile, 60 * 60) : null

//     return {
//       ...updatedUser,
//       profile: profileUrl
//     }
//   }

// in this i want to a update the full profile like firstName , lastName , email also
