import { BaseController } from '@core/infra/BaseController'
import { Controller } from '@core/infra/Controller'
import { HttpResponse } from '@core/infra/HttpResponse'

import { AuthenticateUser } from './AuthenticateUser'

type AuthenticateUserControllerRequest = {
  email: string
  password: string
}

export class AuthenticateUserController
  extends BaseController
  implements Controller {
  constructor(private authenticateUser: AuthenticateUser) {
    super()
  }

  async handle({
    email,
    password,
  }: AuthenticateUserControllerRequest): Promise<HttpResponse> {
    try {
      // TODO: Add validation

      const result = await this.authenticateUser.execute({
        email,
        password,
      })

      if (result.isLeft()) {
        const error = result.value

        return this.fail(error.message)
      } else {
        const { token } = result.value

        return this.ok({ token })
      }
    } catch (err) {
      return this.fail(err)
    }
  }
}
