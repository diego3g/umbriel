import { Validator } from '@core/infra/Validator'
import { Either, left } from '@core/logic/Either'

import type { ValidationError as YupError } from 'yup'

export const adaptYupValidation = (validator: Validator): Validator => {
  return {
    validate(data: any): Either<Error, null> {
      const validationResult = validator.validate(data)
      if (validationResult.isRight()) return validationResult

      const yupError = validationResult.value
      const { params, path, type } = yupError as YupError

      const error = new Error()
      error.name = 'ValidationError'

      switch (type) {
        case 'required':
          error.message = `Missing value for field "${path}"`
          break

        case 'typeError':
          error.message = `Invalid value for field "${path}"`
          break

        case 'min':
          error.message = `Expected at least of ${params.min} characters for field "${path}"`
          break

        case 'max':
          error.message = `Expected a maximum of ${params.max} characters for field "${path}"`
          break

        case 'email':
          error.message = `Value for field "${path}" is not a valid email format`
          break

        case 'invalid_password_comparison':
          error.message = `Password and password confirmation must have the same value`
          break

        default:
          error.message = yupError.message
          break
      }

      return left(error)
    },
  }
}
