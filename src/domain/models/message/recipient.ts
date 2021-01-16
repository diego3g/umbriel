import { Event } from '../event/event'

export interface IRecipientCreateData {
  messageId: string
  contactId: string
}

export class Recipient {
  public readonly messageId: string
  public readonly contactId: string

  public events: Event[]

  private constructor(messageId: string, contactId: string) {
    this.messageId = messageId
    this.contactId = contactId
    this.events = []
  }

  public addEvent(event: Event) {
    this.events.push(event)
  }

  static create(recipientData: IRecipientCreateData): Recipient {
    const recipient = new Recipient(
      recipientData.messageId,
      recipientData.contactId
    )

    return recipient
  }
}
