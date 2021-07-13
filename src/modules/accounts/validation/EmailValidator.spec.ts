import { RegisterUserControllerRequest } from '../useCases/RegisterUser/RegisterUserController'
import { EmailValidator } from './EmailValidator'

describe('Email Validator Tests', () => {
  const validator = new EmailValidator()

  const fakeUser: RegisterUserControllerRequest = {
    name: 'John Doe',
    email: 'john@doe.com',
    password: '123456',
    password_confirmation: '123456',
  }

  it('Should validate a correct email', () => {
    const err = validator.validate(fakeUser)
    expect(err).toBeNull()
  })

  it('Should validate if user email contains @ and .', () => {
    let err = validator.validate({ ...fakeUser, email: 'johndoe.com' })
    expect(err).toBeInstanceOf(Error)

    err = validator.validate({ ...fakeUser, email: 'john@doecom' })
    expect(err).toBeInstanceOf(Error)
  })

  it('Should validate if user email is existent', () => {
    let err = validator.validate({ ...fakeUser, email: null })
    expect(err).toBeInstanceOf(Error)

    err = validator.validate({ ...fakeUser, email: '' })
    expect(err).toBeInstanceOf(Error)
  })

  it('Should validate the email length', () => {
    const invalidEmail =
      'johnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohnjohn@doedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoedoe.com' // total length 275

    const err = validator.validate({ ...fakeUser, email: invalidEmail })
    expect(err).toBeInstanceOf(Error)
  })
})
