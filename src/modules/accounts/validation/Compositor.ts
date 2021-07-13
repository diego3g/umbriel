import { RegisterUserControllerRequest } from '../useCases/RegisterUser/RegisterUserController'
import { Validator } from './Validator'

export class ValidatorCompositor implements Validator {
  constructor(private readonly validators: Validator[]) {}

  validate(input: RegisterUserControllerRequest): Error {
    for (const validator of this.validators) {
      return validator.validate(input)
    }
  }
}
