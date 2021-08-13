import { InMemoryContactsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryContactsRepository'
import { InMemorySubscriptionsRepository } from '@modules/subscriptions/repositories/in-memory/InMemorySubscriptionsRepository'
import { createContact } from '@test/factories/ContactFactory'
import { createSubscription } from '@test/factories/SubscriptionFactory'

import { CountRecipientsFromTags } from './CountRecipientsFromTags'

let subscriptionsRepository: InMemorySubscriptionsRepository
let contactsRepository: InMemoryContactsRepository
let countRecipientsFromTags: CountRecipientsFromTags

describe('Count Recipients From Tags', () => {
  beforeEach(() => {
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    contactsRepository = new InMemoryContactsRepository(subscriptionsRepository)
    countRecipientsFromTags = new CountRecipientsFromTags(contactsRepository)
  })

  it('should be able to count recipients from tags', async () => {
    const contact1 = createContact({
      email: 'johndoe1@example.com',
    })

    const contact2 = createContact({
      email: 'johndoe2@example.com',
    })

    const subscription1 = createSubscription({
      contactId: contact1.id,
      tagId: 'fake-tag-id',
    })

    const subscription2 = createSubscription({
      contactId: contact2.id,
      tagId: 'fake-tag-id',
    })

    const subscription3 = createSubscription({
      contactId: contact2.id,
      tagId: 'another-tag-id',
    })

    contact1.subscribeToTag(subscription1)
    contact2.subscribeToTag(subscription2)
    contact2.subscribeToTag(subscription3)

    await contactsRepository.create(contact1)
    await contactsRepository.create(contact2)

    const response = await countRecipientsFromTags.execute({
      tagIds: ['fake-tag-id', 'another-tag-id'],
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toEqual({ count: 2 })
  })
})
