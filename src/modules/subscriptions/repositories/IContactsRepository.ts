import { Contact } from '../domain/contact/contact'

export type ContactsSearchParams = {
  query?: string
  page: number
  perPage: number
}

export interface IContactsRepository {
  exists(email: string): Promise<boolean>
  findById(id: string): Promise<Contact>
  findByEmail(email: string): Promise<Contact>
  search(params: ContactsSearchParams): Promise<Contact[]>
  findByTagsIds(tagIds: string[]): Promise<Contact[]>
  save(contact: Contact): Promise<void>
  create(contact: Contact): Promise<void>
}
