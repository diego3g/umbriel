import { Validator } from '@core/infra/Validator'
import { Either } from '@core/logic/Either'

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
