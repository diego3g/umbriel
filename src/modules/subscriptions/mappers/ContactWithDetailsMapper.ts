import {
  Contact,
  Message,
  Recipient,
  Subscription,
  Tag,
  Event,
} from '@prisma/client'

import { ContactWithDetails } from '../dtos/ContactWithDetails'

type PersistenceRaw = Contact & {
  subscriptions: (Subscription & {
    tag: Tag
  })[]
  recipients: (Recipient & {
    message: Message
    events: Event[]
  })[]
}

export class ContactWithDetailsMapper {
  static toDto(raw: PersistenceRaw): ContactWithDetails {
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      is_unsubscribed: raw.is_unsubscribed,
      is_blocked: raw.is_blocked,
      subscriptions: raw.subscriptions.map(subscription => {
        return {
          id: subscription.id,
          tag: {
            id: subscription.tag.id,
            title: subscription.tag.title,
          },
        }
      }),
      messages: raw.recipients.map(recipient => {
        return {
          id: recipient.message.id,
          subject: recipient.message.subject,
          sentAt: recipient.message.sent_at,
          events: recipient.events.map(event => {
            return {
              id: event.id,
              type: event.type,
              createdAt: event.created_at,
            }
          }),
        }
      }),
    }
  }
}
