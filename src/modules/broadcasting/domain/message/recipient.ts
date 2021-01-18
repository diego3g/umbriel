import { v4 as uuid } from 'uuid'
import { Event } from '../event/event'

interface IRecipientData {
  messageId: string
  contactId: string
}

export interface IRecipientCreateData {
  messageId: string
  contactId: string
}

export class Recipient {
  public readonly id: string
  public readonly messageId: string
  public readonly contactId: string

  public events: Event[]

  private constructor({ messageId, contactId }: IRecipientData, id?: string) {
    this.messageId = messageId
    this.contactId = contactId
    this.events = []

    this.id = id ?? uuid()
  }

  public addEvent(event: Event) {
    this.events.push(event)
  }

  static create(recipientData: IRecipientCreateData, id?: string): Recipient {
    const recipient = new Recipient(
      {
        messageId: recipientData.messageId,
        contactId: recipientData.contactId,
      },
      id
    )

    return recipient
  }
}
