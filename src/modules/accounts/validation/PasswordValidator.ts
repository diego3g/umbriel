import { RegisterUserControllerRequest } from '../useCases/RegisterUser/RegisterUserController'
import { Validator } from './Validator'

export class PasswordValidator implements Validator {
  validate(data: RegisterUserControllerRequest): Error {
    const { password, password_confirmation } = data
    if (!password) return new Error('Missing param: password')

    // review minimum password length (business rules)
    // add a maximum password length if any
    if (typeof password !== 'string' || password.trim().length < 4) {
      return new Error('Passwords must contain more than 4 characters')
    }

    if (password !== password_confirmation) {
      return new Error('Password and password confirmation does not match')
    }

    return null
  }
}
