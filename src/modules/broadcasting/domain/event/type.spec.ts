import { Type } from './type'

describe('Event type value object', () => {
  it('should accept valid event type', () => {
    const typeOrError = Type.create('deliver')

    expect(typeOrError.isRight()).toBeTruthy()
  })

  it('should reject invalid event type', () => {
    // @ts-expect-error
    const typeOrError = Type.create('invalid')

    expect(typeOrError.isLeft()).toBeTruthy()
  })
})
