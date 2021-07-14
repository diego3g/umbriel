import { Contact } from '@modules/subscriptions/domain/contact/contact'
import { Email } from '@modules/subscriptions/domain/contact/email'
import { Name } from '@modules/subscriptions/domain/contact/name'
import { InMemoryContactsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryContactsRepository'
import { InMemorySubscriptionsRepository } from '@modules/subscriptions/repositories/in-memory/InMemorySubscriptionsRepository'

import { UnsubscribeContact } from './UnsubscribeContact'

let subscriptionsRepository: InMemorySubscriptionsRepository
let contactsRepository: InMemoryContactsRepository
let unsubscribeContact: UnsubscribeContact

describe('Unsubscribe Contact', () => {
  beforeEach(() => {
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    contactsRepository = new InMemoryContactsRepository(subscriptionsRepository)
    unsubscribeContact = new UnsubscribeContact(contactsRepository)
  })

  it('should be able to unsubscribe contact', async () => {
    const contact = Contact.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('john@doe.com').value as Email,
      isUnsubscribed: false,
    }).value as Contact

    await contactsRepository.create(contact)

    const response = await unsubscribeContact.execute({
      contactId: contact.id,
    })

    const updatedContact = await contactsRepository.findById(contact.id)

    expect(response.isRight()).toBeTruthy()
    expect(updatedContact.isUnsubscribed).toBe(true)
  })
})
