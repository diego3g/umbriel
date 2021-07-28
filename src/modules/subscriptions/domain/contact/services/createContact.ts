import { Either, left } from '@core/logic/Either'

import { Contact } from '../contact'
import { Email } from '../email'
import { InvalidEmailError } from '../errors/InvalidEmailError'
import { InvalidNameError } from '../errors/InvalidNameError'
import { Name } from '../name'

type CreateContactRequest = {
  name: string
  email: string
}

type CreateContactResponse = Either<
  InvalidNameError | InvalidEmailError,
  Contact
>

export function createContact({
  name,
  email,
}: CreateContactRequest): CreateContactResponse {
  const nameOrError = Name.create(name)
  const emailOrError = Email.create(email)

  if (nameOrError.isLeft()) {
    return left(nameOrError.value)
  }

  if (emailOrError.isLeft()) {
    return left(emailOrError.value)
  }

  return Contact.create({
    name: nameOrError.value,
    email: emailOrError.value,
  })
}
