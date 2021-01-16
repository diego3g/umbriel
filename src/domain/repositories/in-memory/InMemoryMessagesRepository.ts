import { Message } from '../../models/message/message'
import { IMessagesRepository } from '../IMessagesRepository'

export class InMemoryMessagesRepository implements IMessagesRepository {
  constructor(public items: Message[] = []) {}

  async findById(id: string): Promise<Message> {
    return this.items.find(message => message.id === id)
  }

  async save(message: Message): Promise<void> {
    if (message.id) {
      const messageIndex = this.items.findIndex(
        findMessage => findMessage.id === message.id
      )

      this.items[messageIndex] = message
    } else {
      this.items.push(message)
    }
  }
}
