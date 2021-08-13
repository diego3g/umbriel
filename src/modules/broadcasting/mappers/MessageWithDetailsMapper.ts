import { Message, MessageTag, Sender, Tag } from '@prisma/client'

import { MessageWithDetails } from '../dtos/MessageWithDetails'

type PersistenceRaw = Message & {
  tags: (MessageTag & {
    tag: Tag
  })[]
  sender: Sender
}

export class MessageWithDetailsMapper {
  static toDto(raw: PersistenceRaw): MessageWithDetails {
    return {
      id: raw.id,
      subject: raw.subject,
      body: raw.body,
      sentAt: raw.sent_at,
      sender: {
        name: raw.sender.name,
        email: raw.sender.email,
      },
      tags: raw.tags.map(messageTag => {
        return {
          id: messageTag.tag.id,
          title: messageTag.tag.title,
        }
      }),
    }
  }
}
