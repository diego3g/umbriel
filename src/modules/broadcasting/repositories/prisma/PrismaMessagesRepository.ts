import { prisma } from '@infra/prisma/client'

import { Message } from '../../domain/message/message'
import { MessageMapper } from '../../mappers/MessageMapper'
import { IMessagesRepository } from '../IMessagesRepository'

export class PrismaMessagesRepository implements IMessagesRepository {
  async findById(id: string): Promise<Message> {
    const message = await prisma.message.findUnique({ where: { id } })

    if (!message) {
      return null
    }

    return MessageMapper.toDomain(message)
  }

  async save(message: Message): Promise<void> {
    const data = MessageMapper.toPersistence(message)

    await prisma.message.update({
      where: {
        id: message.id,
      },
      data,
    })
  }

  async create(message: Message): Promise<void> {
    const data = MessageMapper.toPersistence(message)

    await prisma.message.create({ data })
  }
}
