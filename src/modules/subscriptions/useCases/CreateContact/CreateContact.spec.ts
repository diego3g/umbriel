import { InMemorySubscriptionsRepository } from '@modules/subscriptions/repositories/in-memory/InMemorySubscriptionsRepository'

import { InMemoryContactsRepository } from '../../repositories/in-memory/InMemoryContactsRepository'
import { CreateContact } from './CreateContact'

let subscriptionsRepository: InMemorySubscriptionsRepository
let contactsRepository: InMemoryContactsRepository
let createContact: CreateContact

describe('Create Contact', () => {
  beforeEach(async () => {
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    contactsRepository = new InMemoryContactsRepository(subscriptionsRepository)
    createContact = new CreateContact(contactsRepository)
  })

  it('should be able to create a new contact', async () => {
    const response = await createContact.execute({
      name: 'John Doe',
      email: 'john@doe.com',
    })

    expect(response.isRight()).toBe(true)
    expect(contactsRepository.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      })
    )
  })

  it('should not be able to create a contact with invalid name', async () => {
    const response = await createContact.execute({
      name: '',
      email: 'john@doe.com',
    })

    expect(response.isLeft()).toBe(true)
    expect(contactsRepository.items.length).toBe(0)
  })

  it('should not be able to create a contact with invalid e-mail', async () => {
    const response = await createContact.execute({
      name: 'John Doe',
      email: 'invalid',
    })

    expect(response.isLeft()).toBe(true)
    expect(contactsRepository.items.length).toBe(0)
  })
})
