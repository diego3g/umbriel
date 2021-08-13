import { prisma } from '@infra/prisma/client'
import { Sender } from '@modules/senders/domain/sender/sender'
import { SenderMapper } from '@modules/senders/mappers/SenderMapper'

import {
  ISendersRepository,
  SendersSearchParams,
  SendersSearchResult,
} from '../ISendersRepository'

export class PrismaSendersRepository implements ISendersRepository {
  async findAll(): Promise<Sender[]> {
    const senders = await prisma.sender.findMany()

    return senders.map(sender => SenderMapper.toDomain(sender))
  }

  async findById(id: string): Promise<Sender> {
    const sender = await prisma.sender.findUnique({ where: { id } })

    return SenderMapper.toDomain(sender)
  }

  async findDefaultSender(): Promise<Sender> {
    const sender = await prisma.sender.findFirst({
      where: { is_default: true },
    })

    return sender ? SenderMapper.toDomain(sender) : null
  }

  async search({
    query,
    page,
    perPage,
  }: SendersSearchParams): Promise<SendersSearchResult> {
    const queryPayload = {
      take: perPage,
      skip: (page - 1) * perPage,
      where: {},
    }

    if (query) {
      queryPayload.where = {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      }
    }

    const senders = await prisma.sender.findMany({
      ...queryPayload,
      orderBy: {
        name: 'asc',
      },
    })

    const sendersCount = await prisma.sender.aggregate({
      _count: true,
      where: queryPayload.where,
    })

    return {
      data: senders.map(sender => SenderMapper.toDomain(sender)),
      totalCount: sendersCount._count,
    }
  }

  async create(sender: Sender): Promise<void> {
    const data = SenderMapper.toPersistence(sender)

    await prisma.sender.create({ data })
  }

  async save(sender: Sender): Promise<void> {
    const data = SenderMapper.toPersistence(sender)

    await prisma.sender.update({
      where: {
        id: sender.id,
      },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.sender.delete({
      where: { id },
    })
  }
}
