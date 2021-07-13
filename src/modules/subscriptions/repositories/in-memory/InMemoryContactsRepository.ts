import { ContactWithDetails } from '@modules/subscriptions/dtos/ContactWithDetails'

import { Contact } from '../../domain/contact/contact'
import {
  ContactsSearchParams,
  IContactsRepository,
} from '../IContactsRepository'

export class InMemoryContactsRepository implements IContactsRepository {
  constructor(public items: Contact[] = []) {}

  async exists(email: string): Promise<boolean> {
    return this.items.some(contact => contact.email.value === email)
  }

  async findById(id: string): Promise<Contact> {
    return this.items.find(contact => contact.id === id)
  }

  async findByIdWithDetails(id: string): Promise<ContactWithDetails> {
    const contact = this.items.find(contact => contact.id === id)

    return {
      id: contact.id,
      name: contact.name.value,
      email: contact.email.value,
      subscriptions: contact.tags.map(tag => {
        return {
          id: tag.id,
          tag: tag.title.value,
        }
      }),
      messages: [],
    }
  }

  async findByEmail(email: string): Promise<Contact> {
    return this.items.find(contact => contact.email.value === email)
  }

  async findByTagsIds(tagIds: string[]): Promise<Contact[]> {
    return this.items.filter(contact =>
      contact.tags.some(contactTag => tagIds.includes(contactTag.id))
    )
  }

  async search({
    query,
    page,
    perPage,
  }: ContactsSearchParams): Promise<Contact[]> {
    let contactList = this.items

    if (query) {
      contactList = this.items.filter(
        contact =>
          contact.name.value.includes(query) ||
          contact.email.value.includes(query)
      )
    }

    return contactList.slice((page - 1) * perPage, page * perPage)
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
