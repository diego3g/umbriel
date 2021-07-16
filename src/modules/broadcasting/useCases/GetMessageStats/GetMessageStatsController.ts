import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok } from '@core/infra/HttpResponse'

import { GetMessageStats } from './GetMessageStats'

type GetMessageStatsControllerRequest = {
  messageId: string
}

export class GetMessageStatsController implements Controller {
  constructor(private getMessageStats: GetMessageStats) {}

  async handle({
    messageId,
  }: GetMessageStatsControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.getMessageStats.execute({
        messageId,
      })

      return ok(result)
    } catch (err) {
      return fail(err)
    }
  }
}
