import { RegisterUserControllerRequest } from '../useCases/RegisterUser/RegisterUserController'
import { ValidatorCompositor } from './Compositor'
import { EmailValidator } from './EmailValidator'
import { NameValidator } from './NameValidator'
import { PasswordValidator } from './PasswordValidator'

describe('Validator Compositor Tests', () => {
  const emailValidator = new EmailValidator()
  const passwordValidator = new PasswordValidator()
  const nameValidator = new NameValidator()

  const validator = new ValidatorCompositor([
    nameValidator,
    emailValidator,
    passwordValidator,
  ])

  const fakeUser: RegisterUserControllerRequest = {
    name: 'John Doe',
    email: 'john@doe.com',
    password: '123456',
    password_confirmation: '123456',
  }

  it('Should return no errors if no validators returns one', () => {
    const err = validator.validate(fakeUser)
    expect(err).toBeNull()
  })

  it('Should return an error if any validator returns one', () => {
    const err = validator.validate({ ...fakeUser, name: null }) // NameValidator will fail
    expect(err).toBeInstanceOf(Error)
  })
})
