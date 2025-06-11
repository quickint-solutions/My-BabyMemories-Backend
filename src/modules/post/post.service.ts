import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Post } from 'src/schema/post.schema'
import { Media, MediaType } from 'src/schema/media.schema'
import { updatePostDto, postDto, deleteResponseDto } from './dto/post.dto'
import { minioClient, bucketName } from 'src/utils/minio.client'
import { v4 as uuid } from 'uuid'
import * as mime from 'mime-types'
import { Readable } from 'stream'

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>
  ) {}
  async create(postDto: postDto & { file?: Express.Multer.File }): Promise<Post> {
    const { file, ...postData } = postDto

    const post = await this.postModel.create(postData)

    if (file) {
      const ext = mime.extension(file.mimetype) || 'bin'
      const filename = `${uuid()}.${ext}`

      await minioClient.putObject(bucketName, filename, Readable.from(file.buffer), file.size, {
        'Content-Type': file.mimetype
      })

      await this.mediaModel.create({
        type: file.mimetype.startsWith('video') ? MediaType.VIDEO : MediaType.IMAGE,
        url: `${filename}`,
        postId: post._id,
        userId: post.userId
      })
    }

    return post
  }

  async getAll(userId: string) {
    const posts = await this.postModel.find({ userId, isDeleted: false }).populate('kidsId').populate('userId').lean()

    const postIds = posts.map(post => post._id)
    const mediaMap = await this.mediaModel.find({ postId: { $in: postIds }, isDeleted: false }).lean()
    const mediaMapByPostId = mediaMap.reduce((acc, media: any) => {
      if (!acc[media.postId]) {
        acc[media.postId] = []
      }
      acc[media.postId].push(media)
      return acc
    }, {})
    const postsWithMedia = posts.map((post: any) => {
      const media = mediaMapByPostId[post._id] || []
      return {
        ...post,
        media
      }
    })
    return postsWithMedia
  }

  async getById(id: string) {
    const post = await this.postModel.findById(id).populate('kidsId').populate('userId').lean()
    if (!post) {
      throw new NotFoundException('Post not found')
    }
    const media = await this.mediaModel.find({ postId: id, isDeleted: false }).lean()
    return {
      ...post,
      media
    }
  }
  async update(id: string, postDto: updatePostDto & { file?: Express.Multer.File }): Promise<Post> {
    const { file, ...postData } = postDto

    const post = await this.postModel.findByIdAndUpdate(id, postData, { new: true })
    if (!post) {
      throw new NotFoundException('Post not found')
    }

    if (file) {
      const existingMedia = await this.mediaModel.find({ postId: id, isDeleted: false })

      await Promise.all(
        existingMedia.map(async (media: Media) => {
          await minioClient.removeObject(bucketName, media.url)
          await this.mediaModel.findByIdAndUpdate(media._id, { isDeleted: true })
        })
      )

      const ext = mime.extension(file.mimetype) || 'bin'
      const filename = `${uuid()}.${ext}`

      await minioClient.putObject(bucketName, filename, Readable.from(file.buffer), file.size, {
        'Content-Type': file.mimetype
      })

      await this.mediaModel.create({
        type: file.mimetype.startsWith('video') ? MediaType.VIDEO : MediaType.IMAGE,
        url: filename,
        postId: post._id,
        userId: post.userId
      })
    }

    return post
  }

  async delete(id: string): Promise<deleteResponseDto> {
    const deleted = await this.postModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
    if (!deleted) {
      throw new NotFoundException('Post not found')
    }
    const media = await this.mediaModel.find({ postId: id, isDeleted: false }).lean()
    await Promise.all(
      media.map(async (media: any) => {
        await minioClient.removeObject(bucketName, media.url)
        await this.mediaModel.findByIdAndUpdate(media._id, { isDeleted: true })
      })
    )
    return {
      message: 'Post deleted successfully'
    }
  }
}
