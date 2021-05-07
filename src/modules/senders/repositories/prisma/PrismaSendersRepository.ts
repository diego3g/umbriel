import { prisma } from '@infra/prisma/client'
import { Sender } from '@modules/senders/domain/sender/sender'
import { SenderMapper } from '@modules/senders/mappers/SenderMapper'

import { ISendersRepository } from '../ISendersRepository'

export class PrismaSendersRepository implements ISendersRepository {
  async findById(id: string): Promise<Sender> {
    const sender = await prisma.sender.findUnique({ where: { id } })

    return SenderMapper.toDomain(sender)
  }

  async create(sender: Sender): Promise<void> {
    const data = SenderMapper.toPersistence(sender)

    await prisma.sender.create({ data })
  }
}
