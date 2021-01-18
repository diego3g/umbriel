import { Message } from '../domain/message/message'
import { Message as PersistenceMessage } from '@prisma/client'

export class MessageMapper {
  static toDomain(raw: PersistenceMessage) {
    // return {
    //   id: raw.id,
    //   subject: raw.subject,
    //   body: raw.body,
    //   templateId: raw.template_id,
    // }
  }

  static toPersistence(message: Message) {
    return {}
  }
}
