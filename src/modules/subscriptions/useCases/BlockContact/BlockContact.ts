import { Either, left, right } from '@core/logic/Either'
import { IContactsRepository } from '@modules/subscriptions/repositories/IContactsRepository'

import { ContactNotFoundError } from './errors/ContactNotFoundError'

type BlockContactRequest = {
  contactId: string
}

type BlockContactResponse = Either<ContactNotFoundError, null>

export class BlockContact {
  constructor(private contactsRepository: IContactsRepository) {}

  async execute({
    contactId,
  }: BlockContactRequest): Promise<BlockContactResponse> {
    const contact = await this.contactsRepository.findById(contactId)

    if (!contact) {
      return left(new ContactNotFoundError())
    }

    contact.block()

    await this.contactsRepository.save(contact)

    return right(null)
  }
}
