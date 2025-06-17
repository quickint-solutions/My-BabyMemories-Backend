import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Bookmark } from 'src/schema/bookmark.schema'
import { CreateBookmarkDto, DeleteBookmarkDto, UpdateBookmarkDto } from './dto/create-bookmark.dto'

@Injectable()
export class BookmarkService {
  constructor(@InjectModel(Bookmark.name) private readonly bookmarkModel: Model<Bookmark>) {}

  async create(createBookmarkDto: CreateBookmarkDto) {
    const bookmark = await this.bookmarkModel.create(createBookmarkDto)
    return bookmark
  }

  async findAll(userId: string) {
    const bookmarks = await this.bookmarkModel
      .find({ userId, isDeleted: false })
      .populate('postId')
      .populate('userId')
      .lean()

    return bookmarks
  }

  async delete(id: string): Promise<{ message: string }> {
    const deleted = await this.bookmarkModel
      .findOne({ postId: id, isDeleted: false })
      .populate('postId')
      .populate('userId')
      .lean()

    if (!deleted) {
      throw new NotFoundException(`Bookmark with id ${id} not found`)
    }

    await this.bookmarkModel.findByIdAndUpdate(deleted._id, { isDeleted: true })

    return { message: 'Bookmark deleted successfully' }
  }
}
