import { Subscription } from '@modules/subscriptions/domain/contact/subscription'

type SubscriptionOverrides = {
  contactId?: string
  tagId?: string
}

export function createSubscription(overrides?: SubscriptionOverrides) {
  const subscription = Subscription.create({
    contactId: overrides.contactId,
    tagId: overrides.tagId,
  })

  return subscription
}
