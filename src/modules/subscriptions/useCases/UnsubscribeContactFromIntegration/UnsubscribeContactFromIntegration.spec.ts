import { v4 as uuid } from 'uuid'

import { Contact } from '@modules/subscriptions/domain/contact/contact'
import { Email } from '@modules/subscriptions/domain/contact/email'
import { Name } from '@modules/subscriptions/domain/contact/name'
import { Subscription } from '@modules/subscriptions/domain/contact/subscription'
import { Subscriptions } from '@modules/subscriptions/domain/contact/subscriptions'
import { Tag } from '@modules/subscriptions/domain/tag/tag'
import { Title } from '@modules/subscriptions/domain/tag/title'
import { InMemoryContactsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryContactsRepository'
import { InMemorySubscriptionsRepository } from '@modules/subscriptions/repositories/in-memory/InMemorySubscriptionsRepository'
import { InMemoryTagsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryTagsRepository'

import { UnsubscribeContactFromIntegration } from './UnsubscribeContactFromIntegration'

let subscriptionsRepository: InMemorySubscriptionsRepository
let tagsRepository: InMemoryTagsRepository
let contactsRepository: InMemoryContactsRepository
let unsubscribeContactFromIntegration: UnsubscribeContactFromIntegration

describe('Unsubscribe Contact From Integration', () => {
  beforeEach(() => {
    tagsRepository = new InMemoryTagsRepository()
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    contactsRepository = new InMemoryContactsRepository(subscriptionsRepository)

    unsubscribeContactFromIntegration = new UnsubscribeContactFromIntegration(
      tagsRepository,
      subscriptionsRepository,
      contactsRepository
    )
  })

  it('should be able to unsubscribe contact', async () => {
    const tag01 = Tag.create({
      title: Title.create('Tag 01').value as Title,
      integrationId: 'tag-01',
    }).value as Tag

    const tag02 = Tag.create({
      title: Title.create('Tag 02').value as Title,
      integrationId: 'tag-02',
    }).value as Tag

    const contactId = uuid()

    const subscription01 = Subscription.create({
      contactId,
      tagId: tag01.id,
    })

    const subscription02 = Subscription.create({
      contactId,
      tagId: tag02.id,
    })

    const subscriptions = Subscriptions.create([subscription01, subscription02])

    const contact = Contact.create(
      {
        name: Name.create('John Doe').value as Name,
        email: Email.create('john@doe.com').value as Email,
        subscriptions,
        integrationId: 'contact-01',
      },
      contactId
    ).value as Contact

    contactsRepository.create(contact)
    tagsRepository.create(tag01)
    tagsRepository.create(tag02)

    const response = await unsubscribeContactFromIntegration.execute({
      contactIntegrationId: 'contact-01',
      tagIntegrationIds: ['tag-01', 'tag-02'],
    })

    expect(response.isRight()).toBeTruthy()
    expect(subscriptionsRepository.items.length).toEqual(0)
  })

  it('should not be able to unsubscribe non-existing contact', async () => {
    const response = await unsubscribeContactFromIntegration.execute({
      contactIntegrationId: 'non-existing-contact',
      tagIntegrationIds: ['tag-01', 'tag-02'],
    })

    expect(response.isLeft()).toBeTruthy()
  })
})
