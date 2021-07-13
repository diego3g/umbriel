import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok, clientError } from '@core/infra/HttpResponse'

import { GetContactDetails } from './GetContactDetails'

type GetContactDetailsControllerRequest = {
  id: string
}

export class GetContactDetailsController implements Controller {
  constructor(private getContactDetails: GetContactDetails) {}

  async handle(
    params: GetContactDetailsControllerRequest
  ): Promise<HttpResponse> {
    try {
      const result = await this.getContactDetails.execute({
        contactId: params.id,
      })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          default:
            return clientError(error)
        }
      } else {
        const contact = result.value

        return ok(contact)
      }
    } catch (err) {
      return fail(err)
    }
  }
}
