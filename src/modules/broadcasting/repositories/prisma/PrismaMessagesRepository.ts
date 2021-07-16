import { prisma } from '@infra/prisma/client'
import { MessageStats } from '@modules/broadcasting/dtos/MessageStats'
import {
  MessageStatsMapper,
  MessageStatsRaw,
} from '@modules/broadcasting/mappers/MessageStatsMapper'

import { Message } from '../../domain/message/message'
import { MessageMapper } from '../../mappers/MessageMapper'
import {
  IMessagesRepository,
  MessagesSearchParams,
  MessagesSearchResult,
} from '../IMessagesRepository'
import { IMessageTagsRepository } from '../IMessageTagsRepository'

export class PrismaMessagesRepository implements IMessagesRepository {
  constructor(private messageTagsRepository: IMessageTagsRepository) {}

  async findById(id: string): Promise<Message> {
    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    })

    if (!message) {
      return null
    }

    return MessageMapper.toDomain(message)
  }

  async getMessageStats(messageId: string): Promise<MessageStats> {
    const stats = await prisma.event.groupBy({
      by: ['type'],
      _count: true,
      where: {
        type: {
          in: ['OPEN', 'CLICK', 'DELIVER'],
        },
        recipient: {
          message_id: messageId,
        },
      },
    })

    const statsParsed = stats.reduce((acc, item) => {
      acc[item.type] = item._count

      return acc
    }, {}) as MessageStatsRaw

    return MessageStatsMapper.toDto(statsParsed)
  }

  async search({
    query,
    page,
    perPage,
  }: MessagesSearchParams): Promise<MessagesSearchResult> {
    const queryPayload = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: {},
    }

    if (query) {
      queryPayload.where = {
        subject: { contains: query },
      }
    }

    const messages = await prisma.message.findMany({
      ...queryPayload,
    })

    const messagesCount = await prisma.message.aggregate({
      _count: true,
      where: queryPayload.where,
    })

    return {
      data: messages.map(message => MessageMapper.toDomain(message)),
      totalCount: messagesCount._count,
    }
  }

  async save(message: Message): Promise<void> {
    const data = MessageMapper.toPersistence(message)

    await prisma.message.update({
      where: {
        id: message.id,
      },
      data,
    })

    await this.messageTagsRepository.save(message.tags)
  }

  async create(message: Message): Promise<void> {
    const data = MessageMapper.toPersistence(message)

    await prisma.message.create({
      data,
    })

    await this.messageTagsRepository.create(message.tags)
  }
}
