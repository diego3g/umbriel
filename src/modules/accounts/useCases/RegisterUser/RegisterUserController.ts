import { BaseController } from '@core/infra/BaseController'
import { Controller } from '@core/infra/Controller'
import { HttpResponse } from '@core/infra/HttpResponse'

import { AccountAlreadyExistsError } from './errors/AccountAlreadyExistsError'
import { RegisterUser } from './RegisterUser'

type RegisterUserControllerRequest = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export class RegisterUserController
  extends BaseController
  implements Controller {
  constructor(private registerUser: RegisterUser) {
    super()
  }

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
            return this.conflict(error.message)
          default:
            return this.fail(error.message)
        }
      } else {
        return this.created()
      }
    } catch (err) {
      return this.fail(err)
    }
  }
}
