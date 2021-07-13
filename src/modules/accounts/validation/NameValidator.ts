import { RegisterUserControllerRequest } from '../useCases/RegisterUser/RegisterUserController'
import { Validator } from './Validator'

export class NameValidator implements Validator {
  validate(data: RegisterUserControllerRequest): Error {
    const { name } = data

    // review minimum name length (business rules)
    // add a maximum name length if any
    if (typeof name !== 'string' || name.trim().length < 4) {
      return new Error('User name must contain more than 4 characters')
    }

    return null
  }
}
