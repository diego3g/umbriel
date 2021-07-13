import { Entity } from '@core/domain/Entity'

interface ISubscriptionProps {
  contactId: string
  tagId: string
}

export class Subscription extends Entity<ISubscriptionProps> {
  get contactId() {
    return this.props.contactId
  }

  get tagId() {
    return this.props.tagId
  }

  private constructor(props: ISubscriptionProps, id?: string) {
    super(props, id)
  }

  static create(props: ISubscriptionProps, id?: string): Subscription {
    const subscription = new Subscription(props, id)

    return subscription
  }
}
