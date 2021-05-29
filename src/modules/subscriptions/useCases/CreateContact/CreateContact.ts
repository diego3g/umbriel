import { Either, left, right } from '@core/logic/Either'
import { Email } from '@modules/subscriptions/domain/contact/email'
import { InvalidEmailError } from '@modules/subscriptions/domain/contact/errors/InvalidEmailError'
import { InvalidNameError } from '@modules/subscriptions/domain/contact/errors/InvalidNameError'
import { Name } from '@modules/subscriptions/domain/contact/name'

import { Contact } from '../../domain/contact/contact'
import { IContactsRepository } from '../../repositories/IContactsRepository'

type CreateContactRequest = {
  name: string
  email: string
}

type CreateContactResponse = Either<
  InvalidNameError | InvalidEmailError,
  Contact
>

export class CreateContact {
  constructor(private contactsRepository: IContactsRepository) {}

  async execute({
    name,
    email,
  }: CreateContactRequest): Promise<CreateContactResponse> {
    const nameOrError = Name.create(name)
    const emailOrError = Email.create(email)

    if (nameOrError.isLeft()) {
      return left(nameOrError.value)
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value)
    }

    const contactOrError = Contact.create({
      name: nameOrError.value,
      email: emailOrError.value,
    })

    if (contactOrError.isLeft()) {
      return left(contactOrError.value)
    }

    const contact = contactOrError.value

    await this.contactsRepository.create(contact)

    return right(contact)
  }
}
