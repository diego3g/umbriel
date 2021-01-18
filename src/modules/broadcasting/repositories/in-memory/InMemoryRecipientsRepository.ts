import { Recipient } from '../../domain/message/recipient'
import { IRecipientsRepository } from '../IRecipientsRepository'

export class InMemoryRecipientsRepository implements IRecipientsRepository {
  constructor(public items: Recipient[] = []) {}

  async createMany(recipients: Recipient[]): Promise<void> {
    this.items.push(...recipients)
  }
}
