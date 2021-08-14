import { Message, MessageTag, Sender, Template, Tag } from '@prisma/client'

import { MessageWithDetails } from '../dtos/MessageWithDetails'

type PersistenceRaw = Message & {
  tags: (MessageTag & {
    tag: Tag
  })[]
  sender: Sender
  template: Template
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
      template: raw.template
        ? {
            title: raw.template.title,
            content: raw.template.content,
          }
        : null,
      tags: raw.tags.map(messageTag => {
        return {
          id: messageTag.tag.id,
          title: messageTag.tag.title,
        }
      }),
    }
  }
}
