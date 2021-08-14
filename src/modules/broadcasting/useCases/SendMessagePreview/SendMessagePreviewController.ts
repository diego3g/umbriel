import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok, clientError } from '@core/infra/HttpResponse'

import { SendMessagePreview } from './SendMessagePreview'

type SendMessagePreviewControllerRequest = {
  messageId: string
  email: string
}

export class SendMessagePreviewController implements Controller {
  constructor(private sendMessagePreview: SendMessagePreview) {}

  async handle({
    messageId,
    email,
  }: SendMessagePreviewControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.sendMessagePreview.execute({
        messageId,
        email,
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
