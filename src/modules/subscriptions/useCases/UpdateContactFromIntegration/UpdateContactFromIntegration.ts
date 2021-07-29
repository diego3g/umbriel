import { Either, left, right } from '@core/logic/Either'
import { Email } from '@modules/subscriptions/domain/contact/email'
import { InvalidEmailError } from '@modules/subscriptions/domain/contact/errors/InvalidEmailError'
import { InvalidNameError } from '@modules/subscriptions/domain/contact/errors/InvalidNameError'
import { Name } from '@modules/subscriptions/domain/contact/name'

import { IContactsRepository } from '../../repositories/IContactsRepository'
import { ContactNotFoundError } from './errors/ContactNotFoundError'

type UpdateContactFromIntegrationRequest = {
  contactIntegrationId: string
  data: {
    name: string
    email: string
  }
}

type UpdateContactFromIntegrationResponse = Either<
  ContactNotFoundError | InvalidNameError | InvalidEmailError,
  null
>

export class UpdateContactFromIntegration {
  constructor(private contactsRepository: IContactsRepository) {}

  async execute({
    contactIntegrationId,
    data,
  }: UpdateContactFromIntegrationRequest): Promise<UpdateContactFromIntegrationResponse> {
    const contact = await this.contactsRepository.findByIntegrationId(
      contactIntegrationId
    )

    if (!contact) {
      return left(new ContactNotFoundError())
    }

    const nameOrError = Name.create(data.name)

    if (nameOrError.isLeft()) {
      return left(new InvalidNameError(data.name))
    }

    const emailOrError = Email.create(data.email)

    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError(data.email))
    }

    contact.name = nameOrError.value
    contact.email = emailOrError.value

    await this.contactsRepository.save(contact)

    return right(null)
  }
}
