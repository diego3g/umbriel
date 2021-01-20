import { Entity } from '../../../../core/domain/Entity'
import { Event } from '../event/event'

interface IRecipientProps {
  messageId: string
  contactId: string
}

export class Recipient extends Entity<IRecipientProps> {
  get messageId() {
    return this.props.messageId
  }

  get contactId() {
    return this.props.contactId
  }

  public events: Event[]

  private constructor(props: IRecipientProps, id?: string) {
    super(props, id)
  }

  public addEvent(event: Event) {
    this.events.push(event)
  }

  static create(props: IRecipientProps, id?: string): Recipient {
    const recipient = new Recipient(props, id)

    return recipient
  }
}
