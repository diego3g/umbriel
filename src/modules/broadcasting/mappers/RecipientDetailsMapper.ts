import {
  Recipient as PersistenceRecipient,
  Message as PersistenceMessage,
  Event as PersistenceEvent,
} from '@prisma/client'

import { Recipient } from '../domain/recipient/recipient'
// import { EventMapper } from './EventMapper'
// import { MessageMapper } from './MessageMapper'
import { RecipientMapper } from './RecipientMapper'

type PersistenceRaw = PersistenceRecipient & {
  message: PersistenceMessage
  events: PersistenceEvent[]
}

export class RecipientDetailsMapper {
  static toDomain(raw: PersistenceRaw): Recipient {
    const recipient = RecipientMapper.toDomain(raw)
    // const message = MessageMapper.toDomain(raw.message)
    // const events = raw.events.map(event => EventMapper.toDomain(event))

    return recipient
  }
}
