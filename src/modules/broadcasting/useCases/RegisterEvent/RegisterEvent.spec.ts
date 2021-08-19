import { Recipient } from '@modules/broadcasting/domain/recipient/recipient'
import { InMemoryRecipientsRepository } from '@modules/broadcasting/repositories/in-memory/InMemoryRecipientsRepository'
import { Contact } from '@modules/subscriptions/domain/contact/contact'
import { Email } from '@modules/subscriptions/domain/contact/email'
import { Name } from '@modules/subscriptions/domain/contact/name'
import { InMemoryContactsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryContactsRepository'
import { InMemorySubscriptionsRepository } from '@modules/subscriptions/repositories/in-memory/InMemorySubscriptionsRepository'

import { RegisterEvent } from './RegisterEvent'

let subscriptionsRepository: InMemorySubscriptionsRepository
let contactsRepository: InMemoryContactsRepository
let recipientsRepository: InMemoryRecipientsRepository
let registerEvent: RegisterEvent

describe('Send Message', () => {
  beforeEach(() => {
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    contactsRepository = new InMemoryContactsRepository(subscriptionsRepository)
    recipientsRepository = new InMemoryRecipientsRepository()

    registerEvent = new RegisterEvent(recipientsRepository, contactsRepository)
  })

  it('should be able to register an event with new recipient', async () => {
    const response = await registerEvent.execute({
      contactId: 'contact-id',
      messageId: 'message-id',
      event: {
        type: 'DELIVER',
      },
    })

    expect(response.isRight()).toBeTruthy()
  })

  it('should be able to register an event with existing recipient', async () => {
    const recipient = Recipient.create({
      contactId: 'contact-id',
      messageId: 'message-id',
    })

    await recipientsRepository.saveOrCreateWithEvents(recipient)

    const response = await registerEvent.execute({
      contactId: 'contact-id',
      messageId: 'message-id',
      event: {
        type: 'DELIVER',
      },
    })

    expect(response.isRight()).toBeTruthy()
  })

  it('should bounce contact if event contains a hard bounce', async () => {
    const contact = Contact.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
    }).value as Contact

    await contactsRepository.create(contact)

    const recipient = Recipient.create({
      contactId: contact.id,
      messageId: 'message-id',
    })

    await recipientsRepository.saveOrCreateWithEvents(recipient)

    const response = await registerEvent.execute({
      contactId: contact.id,
      messageId: 'message-id',
      event: {
        type: 'BOUNCE',
        meta: {
          bounceType: 'Permanent',
        },
      },
    })

    expect(response.isRight()).toBeTruthy()
    expect(contactsRepository.items[0].isBounced).toBe(true)
  })
})
