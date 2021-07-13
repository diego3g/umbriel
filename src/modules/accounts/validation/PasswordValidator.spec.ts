import { RegisterUserControllerRequest } from '../useCases/RegisterUser/RegisterUserController'
import { PasswordValidator } from './PasswordValidator'

describe('Password Validator Tests', () => {
  const validator = new PasswordValidator()

  const fakeUser: RegisterUserControllerRequest = {
    name: 'John Doe',
    email: 'john@doe.com',
    password: '123456',
    password_confirmation: '123456',
  }

  it('Should validate a correct password', () => {
    const err = validator.validate(fakeUser)
    expect(err).toBeNull()
  })

  it('Should validate if user password contains a minimum of 4 characters', () => {
    const err = validator.validate({
      ...fakeUser,
      password: '123',
      password_confirmation: '123',
    })
    expect(err).toBeInstanceOf(Error)
  })

  it('Should validate if user password is existent', () => {
    let err = validator.validate({ ...fakeUser, password: null })
    expect(err).toBeInstanceOf(Error)

    err = validator.validate({ ...fakeUser, password_confirmation: null })
    expect(err).toBeInstanceOf(Error)
  })

  it('Should validate password and password_confirmation comparison', () => {
    const err = validator.validate({
      ...fakeUser,
      password: '12345',
      password_confirmation: '123456',
    })
    expect(err).toBeInstanceOf(Error)
  })
})
