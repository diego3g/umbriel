import { Either, left, right } from '../../../core/logic/Either'
import { MissingParamError } from './errors/MissingParamError'
import { Validator } from './Validator'

export class RequiredFieldsValidator<T = any> implements Validator<T> {
  public validate(data: T): Either<MissingParamError, null> {
    const fields = Object.getOwnPropertyNames(data)
    for (const field of fields) {
      if (
        data[field] === null ||
        data[field] === undefined ||
        (typeof data[field] === 'string' && data[field].trim() === '')
      ) {
        return left(new MissingParamError(field))
      }
    }

    return right(null)
  }
}
