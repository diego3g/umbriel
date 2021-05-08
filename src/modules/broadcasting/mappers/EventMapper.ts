import { Event as PersistenceEvent } from '@prisma/client'

import { Event } from '../domain/event/event'
import { Type } from '../domain/event/type'

export class EventMapper {
  static toDomain(raw: PersistenceEvent): Event {
    const typeOrError = Type.create(raw.type)

    if (typeOrError.isLeft()) {
      throw new Error('Event type value is invalid.')
    }

    const eventOrError = Event.create(
      {
        type: typeOrError.value,
        recipientId: raw.recipient_id,
        meta: raw.meta,
      },
      raw.id
    )

    if (eventOrError.isRight()) {
      return eventOrError.value
    }

    return null
  }

  static toPersistence(event: Event) {
    return {
      id: event.id,
      type: event.type.value,
      recipient_id: event.recipientId,
      meta: event.meta,
    }
  }
}
