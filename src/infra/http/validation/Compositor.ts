import { Either } from '@core/logic/Either'
import { Validator } from './Validator'

export class ValidatorCompositor<T = any> implements Validator<T> {
  constructor(private readonly validators: Validator<T>[]) {}

  validate(input: T): Either<Error, null> {
    for (const validator of this.validators) {
      const error = validator.validate(input)
      if (error !== null) return error
    }

    return null
  }
}
