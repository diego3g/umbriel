import { Event } from './event'
import { Type } from './type'

describe('Event model', () => {
  it('should be able to create new event', () => {
    const type = Type.create('deliver').value as Type

    const eventOrError = Event.create({
      type,
    })

    expect(eventOrError.isRight()).toBeTruthy()
  })
})
