import { Email } from '@modules/subscriptions/domain/contact/email'
import { Name } from '@modules/subscriptions/domain/contact/name'

import { Contact } from '../../domain/contact/contact'
import { IContactsRepository } from '../../repositories/IContactsRepository'
import { InMemoryContactsRepository } from '../../repositories/in-memory/InMemoryContactsRepository'
import { SearchContacts } from './SearchContacts'

let contactsRepository: IContactsRepository
let searchContacts: SearchContacts

describe('Search Contacts', () => {
  beforeEach(async () => {
    contactsRepository = new InMemoryContactsRepository()
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

    expect(response.length).toEqual(20)
  })

  it('should be able to search through contacts', async () => {
    const response = await searchContacts.execute({ query: 'Doe5' })

    expect(response.length).toEqual(1)
    expect(response[0].name.value).toEqual('John Doe5')
  })

  it('should be able to paginate through contacts', async () => {
    let response = await searchContacts.execute({ perPage: 10 })

    expect(response.length).toEqual(10)
    expect(response[0].name.value).toEqual('John Doe0')

    response = await searchContacts.execute({ perPage: 10, page: 2 })

    expect(response.length).toEqual(10)
    expect(response[0].name.value).toEqual('John Doe10')
  })
})
