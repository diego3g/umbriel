import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok } from '@core/infra/HttpResponse'

import { SearchMessages } from './SearchMessages'

type SearchMessagesControllerRequest = {
  query?: string
  page?: string
  per_page?: string
}

export class SearchMessagesController implements Controller {
  constructor(private searchMessages: SearchMessages) {}

  async handle({
    query,
    page,
    per_page,
  }: SearchMessagesControllerRequest): Promise<HttpResponse> {
    try {
      const { data, totalCount } = await this.searchMessages.execute({
        query,
        page: page ? Number(page) : undefined,
        perPage: per_page ? Number(per_page) : undefined,
      })

      const messages = data.map(message => {
        return {
          id: message.id,
          subject: message.subject.value,
          body: message.body.value,
          sentAt: message.sentAt,
        }
      })

      return ok({
        data: messages,
        totalCount,
      })
    } catch (err) {
      return fail(err)
    }
  }
}
