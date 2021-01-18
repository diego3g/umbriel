import { Email } from './email'

describe('User email value object', () => {
  it('should accept valid email address', () => {
    const emailOrError = Email.create('johndoe@example.com')

    expect(emailOrError.isRight()).toBeTruthy()
  })

  it('should reject invalid email address', () => {
    const emailOrError1 = Email.create('johndoe')
    const emailOrError2 = Email.create('johndoe@example')
    const emailOrError3 = Email.create('@example.com')
    const emailOrError4 = Email.create('johndoe@example.')

    expect(emailOrError1.isLeft()).toBeTruthy()
    expect(emailOrError2.isLeft()).toBeTruthy()
    expect(emailOrError3.isLeft()).toBeTruthy()
    expect(emailOrError4.isLeft()).toBeTruthy()
  })

  it('should reject emails with more than 255 characters', () => {
    const domain = 'c'.repeat(260)
    const emailOrError = Email.create(`johndoe@${domain}.com`)

    expect(emailOrError.isLeft()).toBeTruthy()
  })
})
