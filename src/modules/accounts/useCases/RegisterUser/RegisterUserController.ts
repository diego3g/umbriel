import { Controller } from '@core/infra/Controller'
import {
  clientError,
  conflict,
  created,
  fail,
  HttpResponse,
} from '@core/infra/HttpResponse'
import { Validator } from '../../../../infra/http/validation/Validator'
import { AccountAlreadyExistsError } from './errors/AccountAlreadyExistsError'
import { RegisterUser } from './RegisterUser'

type RegisterUserControllerRequest = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export class RegisterUserController implements Controller {
  constructor(
    private readonly validator: Validator<RegisterUserControllerRequest>,
    private registerUser: RegisterUser
  ) {}

  async handle({
    name,
    email,
    password,
    password_confirmation,
  }: RegisterUserControllerRequest): Promise<HttpResponse> {
    try {
      const validation = this.validator.validate({
        name,
        email,
        password,
        password_confirmation,
      })

      if (validation.isLeft()) return clientError(validation.value)

      const result = await this.registerUser.execute({
        name,
        email,
        password,
      })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case AccountAlreadyExistsError:
            return conflict(error)
          default:
            return clientError(error)
        }
      } else {
        return created()
      }
    } catch (err) {
      return fail(err)
    }
  }
}
