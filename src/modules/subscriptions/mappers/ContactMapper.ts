import { Contact as PersistenceContact } from '@prisma/client'

import { Contact } from '../domain/contact/contact'
import { Email } from '../domain/contact/email'
import { Name } from '../domain/contact/name'

export class ContactMapper {
  static toDomain(raw: PersistenceContact): Contact {
    const nameOrError = Name.create(raw.name)
    const emailOrError = Email.create(raw.email)

    if (nameOrError.isLeft()) {
      throw new Error('Name value is invalid.')
    }

    if (emailOrError.isLeft()) {
      throw new Error('E-mail value is invalid.')
    }

    const contactOrError = Contact.create(
      {
        name: nameOrError.value,
        email: emailOrError.value,
        isUnsubscribed: raw.is_unsubscribed,
        isBlocked: raw.is_blocked,
        isBounced: raw.is_bounced,
        integrationId: raw.integration_id,
        createdAt: raw.created_at,
      },
      raw.id
    )

    if (contactOrError.isRight()) {
      return contactOrError.value
    }

    return null
  }

  static toPersistence(contact: Contact) {
    return {
      id: contact.id,
      name: contact.name.value,
      email: contact.email.value,
      is_unsubscribed: contact.isUnsubscribed,
      is_blocked: contact.isBlocked,
      is_bounced: contact.isBounced,
      integration_id: contact.integrationId,
      created_at: contact.createdAt,
    }
  }
}
