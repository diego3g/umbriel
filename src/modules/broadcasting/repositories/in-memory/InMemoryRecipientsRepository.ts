import { Recipient } from '../../domain/recipient/recipient'
import {
  FindByMessageAndContactIdParams,
  IRecipientsRepository,
} from '../IRecipientsRepository'

export class InMemoryRecipientsRepository implements IRecipientsRepository {
  constructor(public items: Recipient[] = []) {}

  async findByMessageAndContactId({
    messageId,
    contactId,
  }: FindByMessageAndContactIdParams): Promise<Recipient> {
    return this.items.find(
      recipient =>
        recipient.contactId === contactId && recipient.messageId === messageId
    )
  }

  async saveOrCreateWithEvents(recipient: Recipient): Promise<void> {
    const recipientIndex = this.items.findIndex(
      findRecipient => findRecipient.id === recipient.id
    )

    if (recipientIndex > 0) {
      this.items[recipientIndex] = recipient
    } else {
      this.items.push(recipient)
    }
  }
}
