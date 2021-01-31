import { MessageTag } from '../domain/message/messageTag'
import { MessageTags } from '../domain/message/messageTags'

export interface IMessageTagsRepository {
  findManyByMessageId(messageId: string): Promise<MessageTag[]>
  save(messageTags: MessageTags): Promise<void>
  create(messageTags: MessageTags): Promise<void>
}
