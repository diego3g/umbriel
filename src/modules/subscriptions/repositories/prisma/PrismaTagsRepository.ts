import { prisma } from '@infra/prisma/client'
import { TagMapper } from '@modules/subscriptions/mappers/TagMapper'

import { Tag } from '../../domain/tag/tag'
import { ITagsRepository } from '../ITagsRepository'

export class PrismaTagsRepository implements ITagsRepository {
  async exists(title: string): Promise<boolean> {
    const tag = await prisma.tag.findUnique({ where: { title } })

    return !!tag
  }

  async findById(id: string): Promise<Tag> {
    const tag = await prisma.tag.findUnique({ where: { id } })

    if (!tag) {
      return null
    }

    return TagMapper.toDomain(tag)
  }

  async findManyByIds(ids: string[]): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return tags.map(tag => TagMapper.toDomain(tag))
  }

  async findByTitle(title: string): Promise<Tag> {
    const tag = await prisma.tag.findUnique({ where: { title } })

    if (!tag) {
      return null
    }

    return TagMapper.toDomain(tag)
  }

  async save(tag: Tag): Promise<void> {
    const data = TagMapper.toPersistence(tag)

    await prisma.tag.update({
      where: {
        id: tag.id,
      },
      data,
    })
  }

  async create(tag: Tag): Promise<void> {
    const data = TagMapper.toPersistence(tag)

    await prisma.tag.create({ data })
  }
}
