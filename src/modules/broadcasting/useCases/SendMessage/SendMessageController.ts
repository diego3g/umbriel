import { Controller } from '@core/infra/Controller'
import { HttpResponse, clientError, fail, ok } from '@core/infra/HttpResponse'

import { SendMessage } from './SendMessage'

type SendMessageControllerRequest = {
  id: string
}

export class SendMessageController implements Controller {
  constructor(private sendMessage: SendMessage) {}

  async handle({ id }: SendMessageControllerRequest): Promise<HttpResponse> {
    try {
      // TODO: Add validation

      const result = await this.sendMessage.execute(id)

      if (result.isLeft()) {
        const error = result.value

        return clientError(error)
      } else {
        return ok()
      }
    } catch (err) {
      return fail(err)
    }
  }
}
