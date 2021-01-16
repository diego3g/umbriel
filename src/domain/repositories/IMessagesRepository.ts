import { Message } from '../models/message/message'

export interface IMessagesRepository {
  items: Message[]
  findById(id: string): Promise<Message>
  save(message: Message): Promise<void>
  create(message: Message): Promise<void>
}
