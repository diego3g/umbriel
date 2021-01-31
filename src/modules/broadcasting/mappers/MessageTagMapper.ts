import { MessageTag as PersistenceMessageTag } from '@prisma/client'

import { MessageTag } from '../domain/message/messageTag'

export class MessageTagMapper {
  static toDomain(raw: PersistenceMessageTag): MessageTag {
    const messageTag = MessageTag.create(
      {
        messageId: raw.message_id,
        tagId: raw.tag_id,
      },
      raw.id
    )

    return messageTag
  }

  static toPersistence(messageTag: MessageTag) {
    return {
      id: messageTag.id,
      message_id: messageTag.messageId,
      tag_id: messageTag.tagId,
    }
  }
}
