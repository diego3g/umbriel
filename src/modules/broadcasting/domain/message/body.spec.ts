import { Body } from './body'

describe('Message body value object', () => {
  it('should accept valid email address', () => {
    const bodyOrError = Body.create('An example message body')

    expect(bodyOrError.isRight()).toBeTruthy()
  })

  it('should reject bodies with less than 20 characters', () => {
    const bodyOrError = Body.create('Too short')

    expect(bodyOrError.isLeft()).toBeTruthy()
  })
})
