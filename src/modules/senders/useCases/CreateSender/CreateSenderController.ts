import { Controller } from '@core/infra/Controller'
import {
  HttpResponse,
  fail,
  clientError,
  created,
} from '@core/infra/HttpResponse'

import { CreateSender } from './CreateSender'

type CreateSenderControllerRequest = {
  name: string
  email: string
}

export class CreateSenderController implements Controller {
  constructor(private createSender: CreateSender) {}

  async handle({
    name,
    email,
  }: CreateSenderControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.createSender.execute({
        name,
        email,
      })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
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
