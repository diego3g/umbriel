import { Event } from './event'
import { Type } from './type'

describe('Event model', () => {
  it('should be able to create new event', () => {
    const type = Type.create('DELIVER').value as Type

    const eventOrError = Event.create({
      type,
      recipientId: 'fake-recipient-id',
    })

    expect(eventOrError.isRight()).toBeTruthy()
  })
})
