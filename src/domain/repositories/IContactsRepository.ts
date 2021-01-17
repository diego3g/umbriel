import { Contact } from '../models/contact/contact'

export interface IContactsRepository {
  items: Contact[]
  exists(email: string): Promise<boolean>
  findById(id: string): Promise<Contact>
  findByEmail(email: string): Promise<Contact>
  save(contact: Contact): Promise<void>
  create(contact: Contact): Promise<void>
}
