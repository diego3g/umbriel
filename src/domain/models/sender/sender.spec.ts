import { Sender } from './sender'

describe('Sender model', () => {
  it('should be able to create new sender', () => {
    const senderOrError = Sender.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
    })

    expect(senderOrError.isRight()).toBeTruthy()
  })

  it('should not be able to create new sender with invalid name', () => {
    const senderOrError = Sender.create({
      name: 'J',
      email: 'johndoe@example.com',
    })

    expect(senderOrError.isLeft()).toBeTruthy()
  })

  it('should not be able to create new sender with invalid email', () => {
    const senderOrError = Sender.create({
      name: 'John Doe',
      email: 'johndoe.com',
    })

    expect(senderOrError.isLeft()).toBeTruthy()
  })
})
