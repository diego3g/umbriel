import { RegisterUserControllerRequest } from '../useCases/RegisterUser/RegisterUserController'
import { NameValidator } from './NameValidator'

describe('Name Validator Tests', () => {
  const validator = new NameValidator()

  const fakeUser: RegisterUserControllerRequest = {
    name: 'John Doe',
    email: 'john@doe.com',
    password: '123456',
    password_confirmation: '123456',
  }

  it('Should validate a correct name', () => {
    const err = validator.validate(fakeUser)
    expect(err).toBeNull()
  })

  it('Should validate if user name contains a minimum of 4 characters', () => {
    const err = validator.validate({ ...fakeUser, name: 'Joh' })
    expect(err).toBeInstanceOf(Error)
  })

  it('Should validate if user name is existent', () => {
    let err = validator.validate({ ...fakeUser, name: null })
    expect(err).toBeInstanceOf(Error)

    err = validator.validate({ ...fakeUser, name: null })
    expect(err).toBeInstanceOf(Error)
  })
})
