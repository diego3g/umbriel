import { Event } from './event'

describe('Event model', () => {
  it('should be able to create new event', () => {
    const eventOrError = Event.create({
      type: 'deliver',
    })

    expect(eventOrError.isRight()).toBeTruthy()
  })

  it('should not be able to create new event with invalid type', () => {
    const eventOrError = Event.create({
      // @ts-expect-error
      type: 'invalid-type',
    })

    expect(eventOrError.isLeft()).toBeTruthy()
  })
})
