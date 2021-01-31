import { Contact } from './contact'
import { Email } from './email'
import { Name } from './name'

describe('Contact model', () => {
  it('should be able to create new contact', () => {
    const name = Name.create('John Doe').value as Name
    const email = Email.create('johndoe@example').value as Email

    const contactOrError = Contact.create({
      name,
      email,
    })

    expect(contactOrError.isRight()).toBeTruthy()
  })
})
