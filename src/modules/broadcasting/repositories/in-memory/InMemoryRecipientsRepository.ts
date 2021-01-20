import { Recipient } from '../../domain/recipient/recipient'
import { IRecipientsRepository } from '../IRecipientsRepository'

export class InMemoryRecipientsRepository implements IRecipientsRepository {
  constructor(public items: Recipient[] = []) {}

  async createMany(recipients: Recipient[]): Promise<void> {
    this.items.push(...recipients)
  }
}
