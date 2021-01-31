import { MessageTag } from '@modules/broadcasting/domain/message/messageTag'
import { MessageTags } from '@modules/broadcasting/domain/message/messageTags'

import { IMessageTagsRepository } from '../IMessageTagsRepository'

export class InMemoryMessageTagsRepository implements IMessageTagsRepository {
  public items: MessageTag[] = []

  constructor() {}

  async findManyByMessageId(messageId: string): Promise<MessageTag[]> {
    return this.items.filter(messageTag => messageTag.messageId === messageId)
  }

  async save(messageTags: MessageTags): Promise<void> {
    this.items.push(...messageTags.getNewItems())

    messageTags.getRemovedItems().forEach(messageTag => {
      const messageTagIndex = this.items.findIndex(
        messageTagItem => messageTagItem.messageId === messageTag.id
      )

      this.items.splice(messageTagIndex, 1)
    })
  }

  async create(messageTags: MessageTags): Promise<void> {
    this.items.push(...messageTags.getItems())
  }
}
