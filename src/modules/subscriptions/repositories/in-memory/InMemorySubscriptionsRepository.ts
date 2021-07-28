import { Subscription } from '@modules/subscriptions/domain/contact/subscription'
import { Subscriptions } from '@modules/subscriptions/domain/contact/subscriptions'

import {
  FindByContactAndTagParams,
  FindByContactAndTagsParams,
  ISubscriptionsRepository,
} from '../ISubscriptionsRepository'

export class InMemorySubscriptionsRepository
  implements ISubscriptionsRepository
{
  public items: Subscription[] = []

  constructor() {}

  async findByContactAndTag({
    contactId,
    tagId,
  }: FindByContactAndTagParams): Promise<Subscription> {
    const subscription = this.items.find(item => {
      return item.contactId === contactId && item.tagId === tagId
    })

    return subscription
  }

  async findByContactAndTags({
    contactId,
    tagIds,
  }: FindByContactAndTagsParams): Promise<Subscription[]> {
    const subscriptions = this.items.filter(item => {
      return item.contactId === contactId && tagIds.includes(item.tagId)
    })

    return subscriptions
  }

  async save(subscriptions: Subscriptions): Promise<void> {
    this.items.push(...subscriptions.getNewItems())

    subscriptions.getRemovedItems().forEach(subscription => {
      const subscriptionIndex = this.items.findIndex(subscriptionItem => {
        return subscriptionItem.id === subscription.id
      })

      this.items.splice(subscriptionIndex, 1)
    })
  }

  async create(subscriptions: Subscriptions): Promise<void> {
    this.items.push(...subscriptions.getItems())
  }
}
