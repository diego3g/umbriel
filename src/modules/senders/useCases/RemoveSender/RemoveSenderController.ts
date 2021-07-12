import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok, clientError } from '@core/infra/HttpResponse'

import { RemoveSender } from './RemoveSender'

type RemoveSenderControllerRequest = {
  id: string
}

export class RemoveSenderController implements Controller {
  constructor(private removeSender: RemoveSender) {}

  async handle(params: RemoveSenderControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.removeSender.execute({
        senderId: params.id,
      })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          default:
            return clientError(error)
        }
      } else {
        return ok()
      }
    } catch (err) {
      return fail(err)
    }
  }
}
