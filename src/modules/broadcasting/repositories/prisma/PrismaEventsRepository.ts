import { prisma } from '@infra/prisma/client'
import { Event } from '@modules/broadcasting/domain/event/event'
import { EventMapper } from '@modules/broadcasting/mappers/EventMapper'

import { IEventsRepository } from '../IEventsRepository'

export class PrismaEventsRepository implements IEventsRepository {
  async create(event: Event): Promise<void> {
    const data = EventMapper.toPersistence(event)

    await prisma.event.create({
      data,
    })
  }
}
