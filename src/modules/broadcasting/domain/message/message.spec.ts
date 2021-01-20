import { Message } from './message'
import { Subject } from './subject'
import { Body } from './body'

const subject = Subject.create('A new message').value as Subject
const body = Body.create('The long enough message body').value as Body

describe('Message model', () => {
  it('should be able to create new message', () => {
    const messageOrError = Message.create({
      subject,
      body,
    })

    expect(messageOrError.isRight()).toBeTruthy()
  })

  // it('should not be able to create new message with invalid subject', () => {
  //   const invalidSubject = Subject.create('a').value as Subject;

  //   const messageOrError = Message.create({
  //     subject: 'a',
  //     body: 'The long enough message body',
  //     tags: [],
  //   })

  //   expect(messageOrError.isLeft()).toBeTruthy()
  // })

  // it('should not be able to create new message with invalid body', () => {
  //   const messageOrError = Message.create({
  //     subject: 'A new message',
  //     body: 'Too short',
  //     tags: [],
  //   })

  //   expect(messageOrError.isLeft()).toBeTruthy()
  // })

  it('should be able to deliver the message', () => {
    const messageOrError = Message.create({
      subject,
      body,
    })

    const message = messageOrError.value as Message
    const newMessageBody = Body.create('New message body long enough')
      .value as Body

    message.deliver([], newMessageBody)

    expect(message.sentAt).toBeTruthy()
    expect(message.body.value).toBe('New message body long enough')
  })
})
