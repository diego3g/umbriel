import { Validator } from '@core/infra/Validator'
import { Either, left, right } from '@core/logic/Either'

import { InvalidParamError } from './errors/InvalidParamError'

export class CompareFieldsValidator<T = any> implements Validator<T> {
  constructor(
    private readonly field: string,
    private readonly filedToCompare: string
  ) {}

  public validate(data: T): Either<InvalidParamError, null> {
    if (data[this.field] !== data[this.filedToCompare]) {
      return left(new InvalidParamError(data[this.filedToCompare]))
    }

    return right(null)
  }
}
