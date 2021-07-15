import { Sender } from '@modules/senders/domain/sender/sender'

import {
  ISendersRepository,
  SendersSearchParams,
  SendersSearchResult,
} from '../ISendersRepository'

export class InMemorySendersRepository implements ISendersRepository {
  constructor(public items: Sender[] = []) {}

  async findById(id: string): Promise<Sender> {
    return this.items.find(sender => sender.id === id)
  }

  async findDefaultSender(): Promise<Sender> {
    return this.items.find(sender => sender.isDefault === true)
  }

  async search({
    query,
    page,
    perPage,
  }: SendersSearchParams): Promise<SendersSearchResult> {
    let senderList = this.items

    if (query) {
      senderList = this.items.filter(
        sender =>
          sender.name.value.includes(query) ||
          sender.email.value.includes(query)
      )
    }

    return {
      data: senderList.slice((page - 1) * perPage, page * perPage),
      totalCount: senderList.length,
    }
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
