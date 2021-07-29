import { Contact } from '@modules/subscriptions/domain/contact/contact'
import { Email } from '@modules/subscriptions/domain/contact/email'
import { Name } from '@modules/subscriptions/domain/contact/name'
import { InMemoryContactsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryContactsRepository'
import { InMemorySubscriptionsRepository } from '@modules/subscriptions/repositories/in-memory/InMemorySubscriptionsRepository'

import { DeleteContactFromIntegration } from './DeleteContactFromIntegration'

let subscriptionsRepository: InMemorySubscriptionsRepository
let contactsRepository: InMemoryContactsRepository
let deleteContactFromIntegration: DeleteContactFromIntegration

describe('Delete Contact', () => {
  beforeEach(() => {
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    contactsRepository = new InMemoryContactsRepository(subscriptionsRepository)
    deleteContactFromIntegration = new DeleteContactFromIntegration(
      contactsRepository
    )
  })

  it('should be able to delete contact', async () => {
    const contact = Contact.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
      integrationId: 'contact-01',
    }).value as Contact

    contactsRepository.create(contact)

    const response = await deleteContactFromIntegration.execute({
      contactIntegrationId: contact.integrationId,
    })

    expect(response.isRight()).toBeTruthy()
    expect(contactsRepository.items.length).toEqual(0)
  })

  it('should not be able to delete a non existing contact', async () => {
    const response = await deleteContactFromIntegration.execute({
      contactIntegrationId: 'non-existing-contact',
    })

    expect(response.isLeft()).toBeTruthy()
  })
})
