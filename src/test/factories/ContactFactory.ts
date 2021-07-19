import { Contact } from '@modules/subscriptions/domain/contact/contact'
import { Email } from '@modules/subscriptions/domain/contact/email'
import { Name } from '@modules/subscriptions/domain/contact/name'

type ContactOverrides = {
  name?: string
  email?: string
  isBlocked?: boolean
  isUnsubscribed?: boolean
}

export function createContact(overrides?: ContactOverrides) {
  const name = Name.create('John Doe').value as Name
  const email = Email.create('johndoe@example').value as Email

  const contact = Contact.create({
    name,
    email,
    isBlocked: overrides.isBlocked,
    isUnsubscribed: overrides.isUnsubscribed,
  }).value as Contact

  return contact
}
