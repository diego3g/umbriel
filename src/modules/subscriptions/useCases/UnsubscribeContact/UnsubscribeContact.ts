import { Either, left, right } from '@core/logic/Either'
import { IContactsRepository } from '@modules/subscriptions/repositories/IContactsRepository'

import { ContactNotFoundError } from './errors/ContactNotFoundError'

type UnsubscribeContactRequest = {
  contactId: string
}

type UnsubscribeContactResponse = Either<ContactNotFoundError, null>

export class UnsubscribeContact {
  constructor(private contactsRepository: IContactsRepository) {}

  async execute({
    contactId,
  }: UnsubscribeContactRequest): Promise<UnsubscribeContactResponse> {
    const contact = await this.contactsRepository.findById(contactId)

    if (!contact) {
      return left(new ContactNotFoundError())
    }

    contact.unsubscribe()

    await this.contactsRepository.save(contact)

    return right(null)
  }
}
