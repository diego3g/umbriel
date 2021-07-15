import { Sender } from '@modules/senders/domain/sender/sender'

import { ISendersRepository } from '../ISendersRepository'

export class InMemorySendersRepository implements ISendersRepository {
  constructor(public items: Sender[] = []) {}

  async findById(id: string): Promise<Sender> {
    return this.items.find(sender => sender.id === id)
  }

  async findDefaultSender(): Promise<Sender> {
    return this.items.find(sender => sender.isDefault === true)
  }

  async create(sender: Sender): Promise<void> {
    this.items.push(sender)
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(item => item.id !== id)
  }

  async save(sender: Sender): Promise<void> {
    const senderIndex = this.items.findIndex(
      findSender => findSender.id === sender.id
    )

    this.items[senderIndex] = sender
  }
}
