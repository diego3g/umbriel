import { Entity } from '@core/domain/Entity'

import { Event } from '../event/event'

interface IRecipientProps {
  messageId: string
  contactId: string
  events?: Event[]
}

export class Recipient extends Entity<IRecipientProps> {
  get messageId() {
    return this.props.messageId
  }

  get contactId() {
    return this.props.contactId
  }

  get events() {
    return this.props.events
  }

  private constructor(props: IRecipientProps, id?: string) {
    super(props, id)
  }

  public addEvent(event: Event) {
    this.props.events.push(event)
  }

  static create(props: IRecipientProps, id?: string): Recipient {
    const recipient = new Recipient(
      {
        ...props,
        events: props.events ?? [],
      },
      id
    )

    return recipient
  }
}
