import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok, clientError } from '@core/infra/HttpResponse'

import { SetDefaultSender } from './SetDefaultSender'

type SetDefaultSenderControllerRequest = {
  senderId: string
}

export class SetDefaultSenderController implements Controller {
  constructor(private setDefaultSender: SetDefaultSender) {}

  async handle({
    senderId,
  }: SetDefaultSenderControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.setDefaultSender.execute({
        senderId,
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
