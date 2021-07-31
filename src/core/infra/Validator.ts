import { Either } from '@core/logic/Either'

export interface Validator<T = any> {
  validate(data: T): Either<Error, null>
}
