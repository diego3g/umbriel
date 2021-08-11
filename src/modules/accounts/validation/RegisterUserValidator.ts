import { Validator } from '@core/infra/Validator'
import { Either, left, right } from '@core/logic/Either'
import { RegisterUserControllerRequest } from '../useCases/RegisterUser/RegisterUserController'

import * as yup from 'yup'

type Params = RegisterUserControllerRequest

export class RegisterUserValidator implements Validator<Params> {
  public validate(data: Params): Either<Error, null> {
    try {
      const schema: yup.SchemaOf<Params> = yup.object({
        name: yup.string().required().trim().min(2).max(255),
        email: yup.string().required().trim().email(),
        password: yup.string().required().trim().min(6).max(255),
        password_confirmation: yup
          .string()
          .required()
          .trim()
          .test('invalid_password_comparison', p => p === data.password),
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
