import { Either, left, right } from '@core/logic/Either'

import { IContactsRepository } from '../../repositories/IContactsRepository'
import { ContactNotFoundError } from './errors/ContactNotFoundError'

type DeleteContactFromIntegrationRequest = {
  contactIntegrationId: string
}

type DeleteContactFromIntegrationResponse = Either<Error, null>

export class DeleteContactFromIntegration {
  constructor(private contactsRepository: IContactsRepository) {}

  async execute({
    contactIntegrationId,
  }: DeleteContactFromIntegrationRequest): Promise<DeleteContactFromIntegrationResponse> {
    const contact = await this.contactsRepository.findByIntegrationId(
      contactIntegrationId
    )

    if (!contact) {
      return left(new ContactNotFoundError())
    }

    await this.contactsRepository.delete(contact)

    return right(null)
  }
}
