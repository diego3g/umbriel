import { v4 as uuid } from 'uuid'

import { Email } from '@modules/subscriptions/domain/contact/email'
import { Name } from '@modules/subscriptions/domain/contact/name'
import { Subscription } from '@modules/subscriptions/domain/contact/subscription'
import { Subscriptions } from '@modules/subscriptions/domain/contact/subscriptions'
import { Title } from '@modules/subscriptions/domain/tag/title'
import { InMemorySubscriptionsRepository } from '@modules/subscriptions/repositories/in-memory/InMemorySubscriptionsRepository'

import { Contact } from '../../domain/contact/contact'
import { Tag } from '../../domain/tag/tag'
import { InMemoryContactsRepository } from '../../repositories/in-memory/InMemoryContactsRepository'
import { InMemoryTagsRepository } from '../../repositories/in-memory/InMemoryTagsRepository'
import { InvalidContactError } from './errors/InvalidContactError'
import { InvalidTagError } from './errors/InvalidTagError'
import { UnsubscribeContactFromTag } from './UnsubscribeContactFromTag'

let subscriptionsRepository: InMemorySubscriptionsRepository
let contactsRepository: InMemoryContactsRepository
let tagsRepository: InMemoryTagsRepository
let unsubscribeContactFromTag: UnsubscribeContactFromTag

describe('Send Message', () => {
  beforeEach(() => {
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    contactsRepository = new InMemoryContactsRepository(subscriptionsRepository)
    tagsRepository = new InMemoryTagsRepository()
    unsubscribeContactFromTag = new UnsubscribeContactFromTag(
      subscriptionsRepository,
      contactsRepository,
      tagsRepository
    )
  })

  it('should be able to unsubscribe contact from tag', async () => {
    const contactId = uuid()
    const tagId = uuid()

    const subscription = Subscription.create({
      contactId,
      tagId,
    })

    const subscriptions = Subscriptions.create([subscription])

    const contact = Contact.create(
      {
        name: Name.create('John Doe').value as Name,
        email: Email.create('john@doe.com').value as Email,
        subscriptions,
      },
      contactId
    ).value as Contact

    await contactsRepository.create(contact)

    const tag = Tag.create(
      {
        title: Title.create('Tag 01').value as Title,
      },
      tagId
    ).value as Tag

    await tagsRepository.create(tag)

    const response = await unsubscribeContactFromTag.execute({
      contactId: contact.id,
      tagId: tag.id,
    })

    const updatedContact = await contactsRepository.findById(contact.id)

    expect(response.isRight()).toBeTruthy()
    expect(updatedContact.subscriptions.currentItems).toEqual([])
    expect(subscriptionsRepository.items).toEqual([])
  })

  it('should not be able to subscribe contact that does not exists to tag', async () => {
    const response = await unsubscribeContactFromTag.execute({
      contactId: 'invalid-contact-id',
      tagId: 'invalid-tag-id',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toEqual(new InvalidContactError())
  })

  it('should not be able to subscribe contact with non existing tag', async () => {
    const name = Name.create('John Doe').value as Name
    const email = Email.create('john@doe.com').value as Email

    const contactOrError = Contact.create({
      name,
      email,
    })
    const contact = contactOrError.value as Contact

    await contactsRepository.create(contact)

    const response = await unsubscribeContactFromTag.execute({
      contactId: contact.id,
      tagId: 'invalid-tag-id',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toEqual(new InvalidTagError())
  })
})
