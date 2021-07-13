import { Controller } from '@core/infra/Controller'
import {
  HttpResponse,
  fail,
  clientError,
  created,
} from '@core/infra/HttpResponse'

import { CreateContact } from './CreateContact'

type CreateContactControllerRequest = {
  name: string
  email: string
}

export class CreateContactController implements Controller {
  constructor(private createContact: CreateContact) {}

  async handle({
    name,
    email,
  }: CreateContactControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.createContact.execute({
        name,
        email,
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
