import { RegisterUserControllerRequest } from '../useCases/RegisterUser/RegisterUserController'
import { Validator } from './Validator'

export class EmailValidator implements Validator {
  validate(data: RegisterUserControllerRequest): Error {
    const email = data.email
    const pattern =
      /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

    if (typeof email === 'string' && pattern.test(email)) {
      if (
        email.trim().length <= 256 &&
        email.includes('@') &&
        email.includes('.')
      ) {
        return null
      }
    }

    return new Error('Emails must be in valid format')
  }
}
