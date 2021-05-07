import { Recipient as PersistenceRecipient } from '@prisma/client'

import { Recipient } from '../domain/recipient/recipient'

export class RecipientMapper {
  static toDomain(raw: PersistenceRecipient): Recipient {
    const recipient = Recipient.create(
      {
        contactId: raw.contact_id,
        messageId: raw.message_id,
      },
      raw.id
    )

    return recipient
  }

  static toPersistence(recipient: Recipient) {
    return {
      id: recipient.id,
      contact_id: recipient.contactId,
      message_id: recipient.messageId,
    }
  }
}
