import { prisma } from '@infra/prisma/client'
import { Recipient } from '@modules/broadcasting/domain/recipient/recipient'
import { EventMapper } from '@modules/broadcasting/mappers/EventMapper'
import { RecipientMapper } from '@modules/broadcasting/mappers/RecipientMapper'

import {
  FindByMessageAndContactIdParams,
  IRecipientsRepository,
} from '../IRecipientsRepository'

export class PrismaRecipientsRepository implements IRecipientsRepository {
  async findByMessageAndContactId({
    messageId,
    contactId,
  }: FindByMessageAndContactIdParams): Promise<Recipient> {
    const recipient = await prisma.recipient.findUnique({
      where: {
        message_id_contact_id: {
          contact_id: contactId,
          message_id: messageId,
        },
      },
    })

    if (recipient) {
      return RecipientMapper.toDomain(recipient)
    }

    return null
  }

  async saveWithEvents(recipient: Recipient): Promise<void> {
    const data = RecipientMapper.toPersistence(recipient)

    const eventsData = recipient.events.map(event => {
      return EventMapper.toPersistence(event)
    })

    await prisma.recipient.upsert({
      where: {
        id: recipient.id,
      },
      create: {
        id: data.id,
        message_id: data.message_id,
        contact_id: data.contact_id,
        events: {
          connectOrCreate: eventsData.map(event => {
            return {
              where: {
                id: event.id,
              },
              create: event,
            }
          }),
        },
      },
      update: {
        events: {
          connectOrCreate: eventsData.map(event => {
            return {
              where: {
                id: event.id,
              },
              create: event,
            }
          }),
        },
      },
    })
  }
}
