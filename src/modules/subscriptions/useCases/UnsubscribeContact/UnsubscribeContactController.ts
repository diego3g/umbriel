import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok, clientError } from '@core/infra/HttpResponse'

import { UnsubscribeContact } from './UnsubscribeContact'

type UnsubscribeContactControllerRequest = {
  contactId: string
}

export class UnsubscribeContactController implements Controller {
  constructor(private unsubscribeContact: UnsubscribeContact) {}

  async handle({
    contactId,
  }: UnsubscribeContactControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.unsubscribeContact.execute({
        contactId,
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
