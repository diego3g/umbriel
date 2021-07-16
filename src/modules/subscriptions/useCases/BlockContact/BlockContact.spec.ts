import { Contact } from '@modules/subscriptions/domain/contact/contact'
import { Email } from '@modules/subscriptions/domain/contact/email'
import { Name } from '@modules/subscriptions/domain/contact/name'
import { InMemoryContactsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryContactsRepository'
import { InMemorySubscriptionsRepository } from '@modules/subscriptions/repositories/in-memory/InMemorySubscriptionsRepository'

import { BlockContact } from './BlockContact'

let subscriptionsRepository: InMemorySubscriptionsRepository
let contactsRepository: InMemoryContactsRepository
let blockContact: BlockContact

describe('Block Contact', () => {
  beforeEach(() => {
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    contactsRepository = new InMemoryContactsRepository(subscriptionsRepository)
    blockContact = new BlockContact(contactsRepository)
  })

  it('should be able to block contact', async () => {
    const contact = Contact.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('john@doe.com').value as Email,
      isBlocked: false,
    }).value as Contact

    await contactsRepository.create(contact)

    const response = await blockContact.execute({
      contactId: contact.id,
    })

    const updatedContact = await contactsRepository.findById(contact.id)

    expect(response.isRight()).toBeTruthy()
    expect(updatedContact.isBlocked).toBe(true)
  })
})
