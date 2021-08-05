import { Controller } from '@core/infra/Controller'
import { HttpResponse, ok, fail, clientError } from '@core/infra/HttpResponse'
import { Validator } from '@core/infra/Validator'

import { AuthenticateUser } from './AuthenticateUser'

export type AuthenticateUserControllerRequest = {
  email: string
  password: string
}

export class AuthenticateUserController implements Controller {
  constructor(
    private readonly validator: Validator<AuthenticateUserControllerRequest>,
    private authenticateUser: AuthenticateUser
  ) {}

  async handle(
    request: AuthenticateUserControllerRequest
  ): Promise<HttpResponse> {
    try {
      const validationResult = this.validator.validate(request)

      if (validationResult.isLeft()) {
        return clientError(validationResult.value)
      }

      const { email, password } = request

      const result = await this.authenticateUser.execute({
        email,
        password,
      })

      if (result.isLeft()) {
        const error = result.value

        return clientError(error)
      } else {
        const { token } = result.value

        return ok({ token })
      }
    } catch (err) {
      return fail(err)
    }
  }
}
