import { Either, left, right } from '@core/logic/Either'
import { ContactWithDetails } from '@modules/subscriptions/dtos/ContactWithDetails'
import { IContactsRepository } from '@modules/subscriptions/repositories/IContactsRepository'

import { ContactNotFoundError } from './errors/ContactNotFoundError'

type GetContactDetailsRequest = {
  contactId: string
}

type GetContactDetailsResponse = Either<Error, ContactWithDetails>

export class GetContactDetails {
  constructor(private contactsRepository: IContactsRepository) {}

  async execute({
    contactId,
  }: GetContactDetailsRequest): Promise<GetContactDetailsResponse> {
    const contactWithDetails =
      await this.contactsRepository.findByIdWithDetails(contactId)

    if (!contactWithDetails) {
      return left(new ContactNotFoundError())
    }

    return right(contactWithDetails)
  }
}
