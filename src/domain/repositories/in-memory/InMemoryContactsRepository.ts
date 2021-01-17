import { Contact } from '../../models/contact/contact'
import { IContactsRepository } from '../IContactsRepository'

export class InMemoryContactRepository implements IContactsRepository {
  constructor(public items: Contact[] = []) {}

  async exists(email: string): Promise<boolean> {
    return this.items.some(contact => contact.email.value === email)
  }

  async findById(id: string): Promise<Contact> {
    return this.items.find(contact => contact.id === id)
  }

  async findByEmail(email: string): Promise<Contact> {
    return this.items.find(contact => contact.email.value === email)
  }

  async save(contact: Contact): Promise<void> {
    const contactIndex = this.items.findIndex(
      findContact => findContact.id === contact.id
    )

    this.items[contactIndex] = contact
  }

  async create(contact: Contact): Promise<void> {
    this.items.push(contact)
  }
}
