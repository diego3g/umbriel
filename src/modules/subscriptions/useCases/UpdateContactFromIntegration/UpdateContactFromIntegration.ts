import { Either, left, right } from '@core/logic/Either'
import { Contact } from '@modules/subscriptions/domain/contact/contact'
import { Email } from '@modules/subscriptions/domain/contact/email'
import { InvalidEmailError } from '@modules/subscriptions/domain/contact/errors/InvalidEmailError'
import { InvalidNameError } from '@modules/subscriptions/domain/contact/errors/InvalidNameError'
import { Name } from '@modules/subscriptions/domain/contact/name'

import { IContactsRepository } from '../../repositories/IContactsRepository'

type UpdateContactFromIntegrationRequest = {
  contactIntegrationId: string
  data: {
    name: string
    email: string
  }
}

type UpdateContactFromIntegrationResponse = Either<
  InvalidNameError | InvalidEmailError,
  null
>

export class UpdateContactFromIntegration {
  constructor(private contactsRepository: IContactsRepository) {}

  async execute({
    contactIntegrationId,
    data,
  }: UpdateContactFromIntegrationRequest): Promise<UpdateContactFromIntegrationResponse> {
    let contact = await this.contactsRepository.findByIntegrationId(
      contactIntegrationId
    )

    const nameOrError = Name.create(data.name)

    if (nameOrError.isLeft()) {
      return left(new InvalidNameError(data.name))
    }

    const emailOrError = Email.create(data.email)

    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError(data.email))
    }

    if (!contact) {
      const contactOrError = Contact.create({
        name: nameOrError.value,
        email: emailOrError.value,
        integrationId: contactIntegrationId,
      })

      if (contactOrError.isLeft()) {
        return left(contactOrError.value)
      }

      contact = contactOrError.value

      await this.contactsRepository.create(contact)
    } else {
      contact.name = nameOrError.value
      contact.email = emailOrError.value

      await this.contactsRepository.save(contact)
    }

    return right(null)
  }
}
