import { Controller } from '@core/infra/Controller'
import { HttpResponse, fail, ok } from '@core/infra/HttpResponse'

import { SearchSenders } from './SearchSenders'

type SearchSendersControllerRequest = {
  query?: string
  page?: string
  per_page?: string
}

export class SearchSendersController implements Controller {
  constructor(private searchSenders: SearchSenders) {}

  async handle({
    query,
    page,
    per_page,
  }: SearchSendersControllerRequest): Promise<HttpResponse> {
    try {
      const { data, totalCount } = await this.searchSenders.execute({
        query,
        page: page ? Number(page) : undefined,
        perPage: per_page ? Number(per_page) : undefined,
      })

      const senders = data.map(sender => {
        return {
          id: sender.id,
          name: sender.name.value,
          email: sender.email.value,
          isValidated: sender.isValidated,
          isDefault: sender.isDefault,
        }
      })

      return ok({
        data: senders,
        totalCount,
      })
    } catch (err) {
      return fail(err)
    }
  }
}
