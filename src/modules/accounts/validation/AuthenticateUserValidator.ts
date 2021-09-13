import { Validator } from '@core/infra/Validator'
import { Either, left, right } from '@core/logic/Either'
import { AuthenticateUserControllerRequest } from '../useCases/AuthenticateUser/AuthenticateUserController'

import type { SchemaOf } from 'yup'
import * as yup from 'yup'

type Params = AuthenticateUserControllerRequest

export class AuthenticateUserValidator implements Validator<Params> {
  public validate(data: Params): Either<Error, null> {
    try {
      const schema: SchemaOf<Params> = yup.object({
        email: yup.string().required().trim().email(),
        password: yup.string().required().trim().min(6).max(255),
      })

      schema.validateSync(data) // throws an error

      return right(null)
    } catch (error) {
      if (yup.ValidationError.isError(error)) {
        return left(error)
      }

      throw error
    }
  }
}
