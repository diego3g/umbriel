import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok } from '@core/infra/HttpResponse'

import { GetAllSenders } from './GetAllSenders'

export class GetAllSendersController implements Controller {
  constructor(private getAllSenders: GetAllSenders) {}

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.getAllSenders.execute()

      const senders = result.map(sender => {
        return {
          id: sender.id,
          name: sender.name.value,
          email: sender.email.value,
        }
      })

      return ok({ data: senders })
    } catch (err) {
      return fail(err)
    }
  }
}
