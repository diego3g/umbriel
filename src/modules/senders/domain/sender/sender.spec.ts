import { Email } from './email'
import { Name } from './name'
import { Sender } from './sender'

describe('Sender model', () => {
  it('should be able to create new sender', () => {
    const name = Name.create('John Doe').value as Name
    const email = Email.create('johndoe@example').value as Email

    const senderOrError = Sender.create({
      name,
      email,
    })

    expect(senderOrError.isRight()).toBeTruthy()
  })
})
