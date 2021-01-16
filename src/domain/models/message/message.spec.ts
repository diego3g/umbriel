import { Message } from './message'

describe('Message model', () => {
  it('should be able to create new message', () => {
    const messageOrError = Message.create({
      subject: 'A new message',
      body: 'The long enough message body',
    })

    expect(messageOrError.isRight()).toBeTruthy()
  })

  it('should not be able to create new message with invalid subject', () => {
    const messageOrError = Message.create({
      subject: 'a',
      body: 'The long enough message body',
    })

    expect(messageOrError.isLeft()).toBeTruthy()
  })

  it('should not be able to create new message with invalid body', () => {
    const messageOrError = Message.create({
      subject: 'A new message',
      body: 'Too short',
    })

    expect(messageOrError.isLeft()).toBeTruthy()
  })

  it('should be able to deliver the message', () => {
    const messageOrError = Message.create({
      subject: 'A new message',
      body: 'The long enough message body',
    })

    const message = messageOrError.value as Message

    message.deliver()

    expect(message.sentAt).toBeTruthy()
  })
})
