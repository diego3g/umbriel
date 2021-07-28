import { Contact } from '@modules/subscriptions/domain/contact/contact'
import { Email } from '@modules/subscriptions/domain/contact/email'
import { Name } from '@modules/subscriptions/domain/contact/name'

type ContactOverrides = {
  name?: string
  email?: string
  isBlocked?: boolean
  isUnsubscribed?: boolean
  integrationId?: string
}

export function createContact(overrides?: ContactOverrides) {
  const name = Name.create(overrides.name ?? 'John Doe').value as Name
  const email = Email.create(overrides.email ?? 'johndoe@example')
    .value as Email

  const contact = Contact.create({
    name,
    email,
    isBlocked: overrides.isBlocked,
    isUnsubscribed: overrides.isUnsubscribed,
    integrationId: overrides.integrationId,
  }).value as Contact

  return contact
}
