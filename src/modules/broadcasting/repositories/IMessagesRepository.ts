import { Message } from '../domain/message/message'

export interface IMessagesRepository {
  findById(id: string): Promise<Message>
  save(message: Message): Promise<void>
  create(message: Message): Promise<void>
}
