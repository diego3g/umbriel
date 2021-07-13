import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, clientError, ok } from '@core/infra/HttpResponse'

import { UnsubscribeContactFromTag } from './UnsubscribeContactFromTag'

type UnsubscribeContactFromTagControllerRequest = {
  contactId: string
  tagId: string
}

export class UnsubscribeContactFromTagController implements Controller {
  constructor(private unsubscribeContactFromTag: UnsubscribeContactFromTag) {}

  async handle({
    contactId,
    tagId,
  }: UnsubscribeContactFromTagControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.unsubscribeContactFromTag.execute({
        contactId,
        tagId,
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
