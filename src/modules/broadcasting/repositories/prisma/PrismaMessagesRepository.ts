import { prisma } from '@infra/prisma/client'
import { MessageStats } from '@modules/broadcasting/dtos/MessageStats'
import { MessageWithDetails } from '@modules/broadcasting/dtos/MessageWithDetails'
import {
  MessageStatsMapper,
  MessageStatsRaw,
} from '@modules/broadcasting/mappers/MessageStatsMapper'
import { MessageWithDetailsMapper } from '@modules/broadcasting/mappers/MessageWithDetailsMapper'

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

  async findByIdWithDetails(id: string): Promise<MessageWithDetails> {
    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        sender: true,
      },
    })

    if (!message) {
      return null
    }

    return MessageWithDetailsMapper.toDto(message)
  }

  async getMessageStats(messageId: string): Promise<MessageStats> {
    const stats = await prisma.$queryRaw<
      Array<{
        type: keyof MessageStatsRaw
        count: number
      }>
    >`
      SELECT type, count(distinct events.recipient_id) FROM events
      INNER JOIN recipients ON recipients.id = events.recipient_id
      WHERE recipients.message_id = ${messageId}
      GROUP BY events.type;
    `

    const statsParsed = stats.reduce((acc, item) => {
      acc[item.type] = item.count

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
