import { Controller } from '@core/infra/Controller'
import {
  HttpResponse,
  fail,
  clientError,
  created,
} from '@core/infra/HttpResponse'

import { SubscribeContactToTag } from './SubscribeContactToTag'

type SubscribeContactToTagControllerRequest = {
  contactId: string
  tagId: string
}

export class SubscribeContactToTagController implements Controller {
  constructor(private subscribeContactToTag: SubscribeContactToTag) {}

  async handle({
    contactId,
    tagId,
  }: SubscribeContactToTagControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.subscribeContactToTag.execute({
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
        return created()
      }
    } catch (err) {
      return fail(err)
    }
  }
}
