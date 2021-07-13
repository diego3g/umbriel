import { Subscription as PersistenceSubscription } from '@prisma/client'

import { Subscription } from '../domain/contact/subscription'

export class SubscriptionMapper {
  static toDomain(raw: PersistenceSubscription): Subscription {
    const subscription = Subscription.create(
      {
        contactId: raw.contact_id,
        tagId: raw.tag_id,
      },
      raw.id
    )

    return subscription
  }

  static toPersistence(subscription: Subscription) {
    return {
      id: subscription.id,
      contact_id: subscription.contactId,
      tag_id: subscription.tagId,
    }
  }
}
