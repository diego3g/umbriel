import { ContactWithDetails } from '@modules/subscriptions/dtos/ContactWithDetails'

import { Contact } from '../../domain/contact/contact'
import {
  ContactsSearchParams,
  ContactsSearchResult,
  IContactsRepository,
} from '../IContactsRepository'
import { ISubscriptionsRepository } from '../ISubscriptionsRepository'

export class InMemoryContactsRepository implements IContactsRepository {
  public items: Contact[] = []

  constructor(private subscriptionsRepository: ISubscriptionsRepository) {}

  async exists(email: string): Promise<boolean> {
    return this.items.some(contact => contact.email.value === email)
  }

  async findById(id: string): Promise<Contact> {
    return this.items.find(contact => contact.id === id)
  }

  async findByIntegrationId(integrationId: string): Promise<Contact> {
    return this.items.find(contact => contact.integrationId === integrationId)
  }

  async findByIdWithDetails(id: string): Promise<ContactWithDetails> {
    const contact = this.items.find(contact => contact.id === id)

    return {
      id: contact.id,
      name: contact.name.value,
      email: contact.email.value,
      is_unsubscribed: contact.isUnsubscribed,
      is_blocked: contact.isBlocked,
      subscriptions: [],
      messages: [],
    }
  }

  async findByEmail(email: string): Promise<Contact> {
    return this.items.find(contact => contact.email.value === email)
  }

  async countSubscribersByTags(tagsIds: string[]): Promise<number> {
    return this.items.filter(contact => {
      return (
        contact.subscriptions.currentItems.some(subscription =>
          tagsIds.includes(subscription.tagId)
        ) &&
        contact.isUnsubscribed === false &&
        contact.isBlocked === false
      )
    }).length
  }

  async findSubscribedByTags(tagIds: string[]): Promise<Contact[]> {
    return this.items.filter(contact => {
      return (
        contact.subscriptions.currentItems.some(subscription =>
          tagIds.includes(subscription.tagId)
        ) &&
        contact.isUnsubscribed === false &&
        contact.isBlocked === false &&
        contact.isBounced === false
      )
    })
  }

  async search({
    query,
    page,
    perPage,
  }: ContactsSearchParams): Promise<ContactsSearchResult> {
    let contactList = this.items

    if (query) {
      contactList = this.items.filter(contact => {
        const search = new RegExp(query, 'i')
        return (
          search.test(contact.name.value) || search.test(contact.email.value)
        )
      })
    }

    return {
      data: contactList.slice((page - 1) * perPage, page * perPage),
      totalCount: contactList.length,
    }
  }

  async save(contact: Contact): Promise<void> {
    const contactIndex = this.items.findIndex(
      findContact => findContact.id === contact.id
    )

    this.items[contactIndex] = contact

    this.subscriptionsRepository.save(contact.subscriptions)
  }

  async create(contact: Contact): Promise<void> {
    this.items.push(contact)

    this.subscriptionsRepository.create(contact.subscriptions)
  }

  async delete(contact: Contact): Promise<void> {
    const contactIndex = this.items.findIndex(contactItem => {
      return contactItem.id === contact.id
    })

    this.items.splice(contactIndex, 1)
  }
}
