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

  async saveOrCreateWithEvents(recipient: Recipient): Promise<void> {
    const data = RecipientMapper.toPersistence(recipient)

    const eventsData = recipient.events.map(event => {
      const rawEvent = EventMapper.toPersistence(event)

      return {
        id: rawEvent.id,
        type: rawEvent.type,
        meta: rawEvent.meta,
      }
    })

    await prisma.recipient.upsert({
      where: {
        message_id_contact_id: {
          contact_id: recipient.contactId,
          message_id: recipient.messageId,
        },
      },
      create: {
        id: data.id,
        message_id: data.message_id,
        contact_id: data.contact_id,
        events: {
          createMany: {
            data: eventsData,
            skipDuplicates: true,
          },
        },
      },
      update: {
        events: {
          createMany: {
            data: eventsData,
            skipDuplicates: true,
          },
        },
      },
    })
  }
}
