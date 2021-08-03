import { Tag } from '@modules/subscriptions/domain/tag/tag'
import { Title } from '@modules/subscriptions/domain/tag/title'
import { InMemoryContactsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryContactsRepository'
import { InMemorySubscriptionsRepository } from '@modules/subscriptions/repositories/in-memory/InMemorySubscriptionsRepository'
import { InMemoryTagsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryTagsRepository'
import { createContact } from '@test/factories/ContactFactory'

import { SubscribeContactFromIntegration } from './SubscribeContactFromIntegration'

let subscriptionsRepository: InMemorySubscriptionsRepository
let tagsRepository: InMemoryTagsRepository
let contactsRepository: InMemoryContactsRepository
let subscribeContactFromIntegration: SubscribeContactFromIntegration

describe('Subscribe Contact From Integration', () => {
  beforeEach(() => {
    tagsRepository = new InMemoryTagsRepository()
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    contactsRepository = new InMemoryContactsRepository(subscriptionsRepository)

    subscribeContactFromIntegration = new SubscribeContactFromIntegration(
      tagsRepository,
      contactsRepository,
      subscriptionsRepository
    )
  })

  it('should subscribe contact to tag', async () => {
    const contact = createContact({
      integrationId: 'contact-01',
    })

    const tag = Tag.create({
      title: Title.create('Tag 01').value as Title,
      integrationId: 'tag-01',
    }).value as Tag

    contactsRepository.create(contact)
    tagsRepository.create(tag)

    const response = await subscribeContactFromIntegration.execute({
      contact: {
        integrationId: contact.integrationId,
        name: contact.name.value,
        email: contact.email.value,
      },
      tag: {
        integrationId: tag.integrationId,
        title: tag.title.value,
      },
    })

    expect(response.isRight()).toBeTruthy()
    expect(subscriptionsRepository.items[0].contactId).toEqual(contact.id)
    expect(subscriptionsRepository.items[0].tagId).toEqual(tag.id)
  })

  it('should create contact and tag if it does not exists', async () => {
    const response = await subscribeContactFromIntegration.execute({
      contact: {
        integrationId: 'contact-integration-id',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      tag: {
        integrationId: 'tag-integration-id',
        title: 'Tag 01',
      },
    })

    expect(response.isRight()).toBeTruthy()
    expect(contactsRepository.items[0]).toBeTruthy()
    expect(tagsRepository.items[0]).toBeTruthy()
  })

  it('should subscribe contact based on integration id', async () => {
    const contact = createContact({
      integrationId: 'contact-01',
    })

    contactsRepository.create(contact)

    const response = await subscribeContactFromIntegration.execute({
      contact: {
        integrationId: 'contact-01',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      tag: {
        integrationId: 'tag-integration-id',
        title: 'Tag 01',
      },
    })

    expect(response.isRight()).toBeTruthy()
    expect(subscriptionsRepository.items[0].contactId).toEqual(contact.id)
  })

  it('should subscribe contact based on email', async () => {
    const contact = createContact({
      email: 'johndoe@example.com',
    })

    contactsRepository.create(contact)

    const response = await subscribeContactFromIntegration.execute({
      contact: {
        integrationId: 'contact-01',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      tag: {
        integrationId: 'tag-integration-id',
        title: 'Tag 01',
      },
    })

    expect(response.isRight()).toBeTruthy()
    expect(subscriptionsRepository.items[0].contactId).toEqual(contact.id)
  })

  it('should attach integration id to tag if not already attached', async () => {
    const response = await subscribeContactFromIntegration.execute({
      contact: {
        integrationId: 'contact-01',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      tag: {
        integrationId: 'tag-integration-id',
        title: 'Tag 01',
      },
    })

    expect(response.isRight()).toBeTruthy()
    expect(tagsRepository.items[0].integrationId).toEqual('tag-integration-id')
  })

  it('should attach integration id to contact if not already attached', async () => {
    const response = await subscribeContactFromIntegration.execute({
      contact: {
        integrationId: 'contact-integration-id',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      tag: {
        integrationId: 'tag-integration-id',
        title: 'Tag 01',
      },
    })

    expect(response.isRight()).toBeTruthy()
    expect(contactsRepository.items[0].integrationId).toEqual(
      'contact-integration-id'
    )
  })
})
