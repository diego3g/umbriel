import { Contact } from '@modules/subscriptions/domain/contact/contact'
import { Email } from '@modules/subscriptions/domain/contact/email'
import { Name } from '@modules/subscriptions/domain/contact/name'
import { InMemoryContactsRepository } from '@modules/subscriptions/repositories/in-memory/InMemoryContactsRepository'

import { GetContactDetails } from './GetContactDetails'

let getContactDetails: GetContactDetails
let contactsRepository: InMemoryContactsRepository

describe('Get Contact Details', () => {
  beforeEach(() => {
    contactsRepository = new InMemoryContactsRepository()
    getContactDetails = new GetContactDetails(contactsRepository)
  })

  it('should be able to get contact details', async () => {
    const contact = Contact.create({
      name: Name.create('John Doe').value as Name,
      email: Email.create('johndoe@example.com').value as Email,
    }).value as Contact

    contactsRepository.create(contact)

    const response = await getContactDetails.execute({
      contactId: contact.id,
    })

    expect(response.isRight()).toBeTruthy()
  })
})
