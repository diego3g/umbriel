import { prisma } from '@infra/prisma/client'
import { TagMapper } from '@modules/subscriptions/mappers/TagMapper'
import { TagWithSubscribersMapper } from '@modules/subscriptions/mappers/TagWithSubscribersMapper'

import { Tag } from '../../domain/tag/tag'
import {
  ITagsRepository,
  TagsSearchParams,
  TagsSearchResult,
} from '../ITagsRepository'

export class PrismaTagsRepository implements ITagsRepository {
  async exists(title: string): Promise<boolean> {
    const tag = await prisma.tag.findUnique({ where: { title } })

    return !!tag
  }

  async findAll(): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      orderBy: {
        title: 'asc',
      },
    })

    return tags.map(tag => TagMapper.toDomain(tag))
  }

  async findById(id: string): Promise<Tag> {
    const tag = await prisma.tag.findUnique({ where: { id } })

    if (!tag) {
      return null
    }

    return TagMapper.toDomain(tag)
  }

  async findByIntegrationId(integration_id: string): Promise<Tag> {
    const tag = await prisma.tag.findUnique({
      where: {
        integration_id,
      },
    })

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

  async findManyByIntegrationIds(integrationIds: string[]): Promise<Tag[]> {
    const tags = await prisma.tag.findMany({
      where: {
        integration_id: {
          in: integrationIds,
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

  async search({
    query,
    page,
    perPage,
  }: TagsSearchParams): Promise<TagsSearchResult> {
    const queryPayload = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: {},
    }

    if (query) {
      queryPayload.where = {
        title: { contains: query, mode: 'insensitive' },
      }
    }

    const tags = await prisma.tag.findMany({
      ...queryPayload,
      orderBy: {
        title: 'asc',
      },
      include: {
        _count: {
          select: {
            subscribers: true,
          },
        },
      },
    })

    const tagsCount = await prisma.tag.aggregate({
      _count: true,
      where: queryPayload.where,
    })

    return {
      data: tags.map(tag => TagWithSubscribersMapper.toDto(tag)),
      totalCount: tagsCount._count,
    }
  }
}
