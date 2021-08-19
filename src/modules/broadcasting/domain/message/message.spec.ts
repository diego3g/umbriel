import { Body } from './body'
import { Message } from './message'
import { Subject } from './subject'

const subject = Subject.create('A new message').value as Subject
const body = Body.create('The long enough message body').value as Body

describe('Message model', () => {
  it('should be able to create new message', () => {
    const messageOrError = Message.create({
      subject,
      body,
      senderId: 'sender-id',
    })

    expect(messageOrError.isRight()).toBeTruthy()
  })

  it('should be able to deliver the message', () => {
    const messageOrError = Message.create({
      subject,
      body,
      senderId: 'sender-id',
    })

    const message = messageOrError.value as Message
    const newMessageBody = Body.create('New message body long enough')
      .value as Body

    message.deliver(0, newMessageBody)

    expect(message.sentAt).toBeTruthy()
    expect(message.body.value).toBe('New message body long enough')
  })
})
