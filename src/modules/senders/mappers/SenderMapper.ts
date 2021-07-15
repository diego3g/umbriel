import { Sender as PersistenceSender } from '@prisma/client'

import { Email } from '../domain/sender/email'
import { Name } from '../domain/sender/name'
import { Sender } from '../domain/sender/sender'

export class SenderMapper {
  static toDomain(raw: PersistenceSender): Sender {
    const nameOrError = Name.create(raw.name)
    const emailOrError = Email.create(raw.email)

    if (nameOrError.isLeft()) {
      throw new Error('Name value is invalid.')
    }

    if (emailOrError.isLeft()) {
      throw new Error('E-mail value is invalid.')
    }

    const senderOrError = Sender.create(
      {
        name: nameOrError.value,
        email: emailOrError.value,
        isValidated: raw.is_validated,
        isDefault: raw.is_default,
      },
      raw.id
    )

    if (senderOrError.isRight()) {
      return senderOrError.value
    }

    return null
  }

  static toPersistence(sender: Sender) {
    return {
      id: sender.id,
      name: sender.name.value,
      email: sender.email.value,
      is_validated: sender.isValidated,
      is_default: sender.isDefault,
    }
  }
}
