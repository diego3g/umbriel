import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok, clientError } from '@core/infra/HttpResponse'

import { BlockContact } from './BlockContact'

type BlockContactControllerRequest = {
  contactId: string
}

export class BlockContactController implements Controller {
  constructor(private blockContact: BlockContact) {}

  async handle({
    contactId,
  }: BlockContactControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.blockContact.execute({
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
