import { Contact } from '../domain/contact/contact'
import { ContactWithDetails } from '../dtos/ContactWithDetails'

export type ContactsSearchParams = {
  query?: string
  page: number
  perPage: number
}

export type ContactsSearchResult = {
  data: Contact[]
  totalCount: number
}

export interface IContactsRepository {
  exists(email: string): Promise<boolean>
  findById(id: string): Promise<Contact>
  findByIntegrationId(integrationId: string): Promise<Contact>
  findByIdWithDetails(id: string): Promise<ContactWithDetails>
  findByEmail(email: string): Promise<Contact>
  search(params: ContactsSearchParams): Promise<ContactsSearchResult>
  countSubscribersByTags(tags: string[]): Promise<number>
  findSubscribedByTags(tagIds: string[]): Promise<Contact[]>
  save(contact: Contact): Promise<void>
  create(contact: Contact): Promise<void>
  delete(contact: Contact): Promise<void>
}
