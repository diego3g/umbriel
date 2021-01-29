import { Controller } from '@core/infra/Controller'
import {
  HttpResponse,
  clientError,
  conflict,
  created,
  fail,
} from '@core/infra/HttpResponse'

import { AccountAlreadyExistsError } from './errors/AccountAlreadyExistsError'
import { RegisterUser } from './RegisterUser'

type RegisterUserControllerRequest = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export class RegisterUserController implements Controller {
  constructor(private registerUser: RegisterUser) {}

  async handle({
    name,
    email,
    password,
    password_confirmation,
  }: RegisterUserControllerRequest): Promise<HttpResponse> {
    try {
      // TODO: Add validation

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
