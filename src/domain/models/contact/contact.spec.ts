import { Contact } from './contact'

describe('Contact model', () => {
  it('should be able to create new contact', () => {
    const contactOrError = Contact.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    })

    expect(contactOrError.isRight()).toBeTruthy()
  })

  it('should not be able to create new contact with invalid name', () => {
    const contactOrError = Contact.create({
      name: 'J',
      email: 'johndoe@example.com',
    })

    expect(contactOrError.isLeft()).toBeTruthy()
  })

  it('should not be able to create new contact with invalid email', () => {
    const contactOrError = Contact.create({
      name: 'John Doe',
      email: 'johndoe.com',
    })

    expect(contactOrError.isLeft()).toBeTruthy()
  })
})
