import { Either, left, right } from '@core/logic/Either'
import { Contact } from '@modules/subscriptions/domain/contact/contact'
import { InvalidEmailError } from '@modules/subscriptions/domain/contact/errors/InvalidEmailError'
import { InvalidNameError } from '@modules/subscriptions/domain/contact/errors/InvalidNameError'
import { createContact } from '@modules/subscriptions/domain/contact/services/createContact'

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
    const contactOrError = createContact({
      name,
      email,
    })

    if (contactOrError.isLeft()) {
      return left(contactOrError.value)
    }

    const contact = contactOrError.value

    await this.contactsRepository.create(contact)

    return right(contact)
  }
}
