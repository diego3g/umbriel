import { Event } from '../event/event'
import { Type } from '../event/type'
import { Recipient } from './recipient'

describe('Recipient model', () => {
  it('should be able to create new recipient', () => {
    const recipient = Recipient.create({
      messageId: 'fake-message-id',
      contactId: 'fake-contact-id',
    })

    expect(recipient).toBeTruthy()
  })

  it('should be able to add new event to recipient', () => {
    const recipient = Recipient.create({
      messageId: 'fake-message-id',
      contactId: 'fake-contact-id',
    })

    const type = Type.create('DELIVER').value as Type

    const eventOrError = Event.create({
      type,
      recipientId: 'fake-recipient-id',
    })
    const event = eventOrError.value as Event

    recipient.addEvent(event)

    expect(recipient.events.length).toEqual(1)
  })
})
