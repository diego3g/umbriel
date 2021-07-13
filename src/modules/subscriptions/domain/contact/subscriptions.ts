import { WatchedList } from '@core/domain/WatchedList'

import { Subscription } from './subscription'

export class Subscriptions extends WatchedList<Subscription> {
  private constructor(subscriptions: Subscription[]) {
    super(subscriptions)
  }

  public compareItems(a: Subscription, b: Subscription): boolean {
    return a.equals(b)
  }

  public static create(subscriptions?: Subscription[]): Subscriptions {
    return new Subscriptions(subscriptions || [])
  }
}
