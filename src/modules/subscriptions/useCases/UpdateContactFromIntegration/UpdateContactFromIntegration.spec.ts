import { Contact } from '@modules/subscriptions/domain/contact/contact'
import { Email } from '@modules/subscriptions/domain/contact/email'
import { Name } from '@modules/subscriptions/domain/contact/name'
import { InMemoryContactsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryContactsRepository'
import { InMemorySubscriptionsRepository } from '@modules/subscriptions/repositories/in-memory/InMemorySubscriptionsRepository'

import { UpdateContactFromIntegration } from './UpdateContactFromIntegration'

let subscriptionsRepository: InMemorySubscriptionsRepository
let contactsRepository: InMemoryContactsRepository
let updateContactFromIntegration: UpdateContactFromIntegration

describe('Update Contact', () => {
  beforeEach(() => {
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    contactsRepository = new InMemoryContactsRepository(subscriptionsRepository)
    updateContactFromIntegration = new UpdateContactFromIntegration(
      contactsRepository
    )
  })

  it('should be able to update contact', async () => {
    const contact = Contact.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
      integrationId: 'contact-01',
    }).value as Contact

    contactsRepository.create(contact)

    const response = await updateContactFromIntegration.execute({
      contactIntegrationId: contact.integrationId,
      data: {
        name: 'John Doe 2',
        email: 'johndoe2@example.com',
      },
    })

    expect(response.isRight()).toBeTruthy()
    expect(contactsRepository.items[0].name.value).toEqual('John Doe 2')
    expect(contactsRepository.items[0].email.value).toEqual(
      'johndoe2@example.com'
    )
  })

  it('should create the contact if it does not exist', async () => {
    const response = await updateContactFromIntegration.execute({
      contactIntegrationId: 'non-existing-contact',
      data: {
        name: 'John Doe 2',
        email: 'johndoe2@example.com',
      },
    })

    expect(response.isRight()).toBeTruthy()
    expect(contactsRepository.items[0].integrationId).toEqual(
      'non-existing-contact'
    )
    expect(contactsRepository.items[0].name.value).toEqual('John Doe 2')
    expect(contactsRepository.items[0].email.value).toEqual(
      'johndoe2@example.com'
    )
  })
})
