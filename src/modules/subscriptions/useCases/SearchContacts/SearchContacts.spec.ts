import { Email } from '@modules/subscriptions/domain/contact/email'
import { Name } from '@modules/subscriptions/domain/contact/name'
import { InMemorySubscriptionsRepository } from '@modules/subscriptions/repositories/in-memory/InMemorySubscriptionsRepository'

import { Contact } from '../../domain/contact/contact'
import { InMemoryContactsRepository } from '../../repositories/in-memory/InMemoryContactsRepository'
import { SearchContacts } from './SearchContacts'

let subscriptionsRepository: InMemorySubscriptionsRepository
let contactsRepository: InMemoryContactsRepository
let searchContacts: SearchContacts

describe('Search Contacts', () => {
  beforeEach(async () => {
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    contactsRepository = new InMemoryContactsRepository(subscriptionsRepository)
    searchContacts = new SearchContacts(contactsRepository)

    for (let i = 0; i < 20; i++) {
      const contact = Contact.create({
        name: Name.create(`John Doe${i}`).value as Name,
        email: Email.create('john@doe.com').value as Email,
      }).value as Contact

      await contactsRepository.create(contact)
    }
  })

  it('should be able to list contacts without search', async () => {
    const response = await searchContacts.execute({ query: '' })

    expect(response.data.length).toEqual(20)
    expect(response.totalCount).toEqual(20)
  })

  it('should be able to search through contacts', async () => {
    const response = await searchContacts.execute({ query: 'Doe5' })

    expect(response.data.length).toEqual(1)
    expect(response.totalCount).toEqual(1)
    expect(response.data[0].name.value).toEqual('John Doe5')
  })
  it('should be able to search through contacts with case-insensitive', async () => {
    const response = await searchContacts.execute({ query: 'DOE5' })

    expect(response.data.length).toEqual(1)
    expect(response.totalCount).toEqual(1)
    expect(response.data[0].name.value).toEqual('John Doe5')
  })

  it('should be able to paginate through contacts', async () => {
    let response = await searchContacts.execute({ perPage: 10 })

    expect(response.data.length).toEqual(10)
    expect(response.totalCount).toEqual(20)
    expect(response.data[0].name.value).toEqual('John Doe0')

    response = await searchContacts.execute({ perPage: 10, page: 2 })

    expect(response.data.length).toEqual(10)
    expect(response.totalCount).toEqual(20)
    expect(response.data[0].name.value).toEqual('John Doe10')
  })
})
