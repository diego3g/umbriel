import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok, clientError } from '@core/infra/HttpResponse'

import { GetMessageDetails } from './GetMessageDetails'

type GetMessageDetailsControllerRequest = {
  id: string
}

export class GetMessageDetailsController implements Controller {
  constructor(private getMessageDetails: GetMessageDetails) {}

  async handle(
    params: GetMessageDetailsControllerRequest
  ): Promise<HttpResponse> {
    try {
      const result = await this.getMessageDetails.execute({
        messageId: params.id,
      })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          default:
            return clientError(error)
        }
      } else {
        const message = result.value

        return ok(message)
      }
    } catch (err) {
      return fail(err)
    }
  }
}
