import { prisma } from '@infra/prisma/client'
import { MessageTag } from '@modules/broadcasting/domain/message/messageTag'
import { MessageTags } from '@modules/broadcasting/domain/message/messageTags'
import { MessageTagMapper } from '@modules/broadcasting/mappers/MessageTagMapper'

import { IMessageTagsRepository } from '../IMessageTagsRepository'

export class PrismaMessageTagsRepository implements IMessageTagsRepository {
  async findManyByMessageId(messageId: string): Promise<MessageTag[]> {
    const messageTags = await prisma.messageTag.findMany({
      where: { message_id: messageId },
    })

    return messageTags.map(messageTag => MessageTagMapper.toDomain(messageTag))
  }

  async save(messageTags: MessageTags): Promise<void> {
    if (messageTags.getNewItems().length > 0) {
      const data = messageTags
        .getNewItems()
        .map(messageTag => MessageTagMapper.toPersistence(messageTag))

      await prisma.messageTag.createMany({
        data,
      })
    }

    if (messageTags.getRemovedItems().length > 0) {
      const removedIds = messageTags
        .getRemovedItems()
        .map(messageTag => messageTag.id)

      await prisma.messageTag.deleteMany({
        where: {
          id: {
            in: removedIds,
          },
        },
      })
    }
  }

  async create(messageTags: MessageTags): Promise<void> {
    const data = messageTags
      .getItems()
      .map(messageTag => MessageTagMapper.toPersistence(messageTag))

    await prisma.messageTag.createMany({
      data,
    })
  }
}
